import { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabaseClient'
import ExpensesTab from '../components/ExpensesTab.jsx'
import ChartsTab from '../components/ChartsTab.jsx'

import './App.css'

function App() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState('expenses')
  const [filterCat, setFilterCat] = useState('')
  const [filterMonth, setFilterMonth] = useState('')

  const [newDesc, setNewDesc] = useState('')
  const [newAmt, setNewAmt] = useState('')
  const [newCat, setNewCat] = useState('Food')
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10))

  const fmt = (n) => `$${Number(n || 0).toFixed(2)}`

  const loadExpenses = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('expenses')
      .select('id, description, amount, category, date')
      .order('date', { ascending: false })

    if (error) {
      console.error('Error loading expenses:', error)
      setExpenses([])
    } else {
      setExpenses(Array.isArray(data) ? data : [])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadExpenses();

    const channel = supabase
      .channel('expenses-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'expenses' },
        () => loadExpenses()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const totalSpent = useMemo(
    () => expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0),
    [expenses]
  )

  const currentMonthYM = useMemo(() => new Date().toISOString().slice(0, 7), [])
  const monthSpent = useMemo(() => {
    return expenses
      .filter((e) => typeof e.date === 'string' && e.date.startsWith(currentMonthYM))
      .reduce((s, e) => s + (parseFloat(e.amount) || 0), 0)
  }, [expenses, currentMonthYM])

  const entryCount = expenses.length

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(
        (e) =>
          (!filterCat || e.category === filterCat) &&
          (!filterMonth || (typeof e.date === 'string' && e.date.startsWith(filterMonth)))
      )
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
  }, [expenses, filterCat, filterMonth])

  const categoryTotals = useMemo(() => {
    const totals = {}
    expenses.forEach((e) => {
      const cat = e.category || 'Other'
      totals[cat] = (totals[cat] || 0) + (parseFloat(e.amount) || 0)
    })
    return totals
  }, [expenses])

  const sortedCategoryEntries = useMemo(() => {
    return Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])
  }, [categoryTotals])

  const maxCategoryAmount = sortedCategoryEntries[0]?.[1] || 1

  const addExpense = async () => {
    if (loading) return

    const desc = newDesc.trim()
    const amt = parseFloat(newAmt)

    if (!desc || !newDate || Number.isNaN(amt) || amt <= 0) {
      alert('Please fill all fields correctly (description, positive amount, and date).')
      return
    }

    const nextExpense = { description: desc, amount: amt, category: newCat, date: newDate }

    const { error } = await supabase.from('expenses').insert([nextExpense])
    if (error) {
      alert('Error adding expense: ' + error.message)
      return
    }

    setNewDesc('')
    setNewAmt('')
  }

  const deleteExpense = async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) alert('Error deleting expense: ' + error.message)
  }

  const exportCSV = () => {
    if (!expenses.length) {
      alert('No expenses to export.')
      return
    }

    const escapeCell = (cell) => {
      const s = String(cell ?? '')
      const needsQuotes = /[",\n]/.test(s)
      const escaped = s.replace(/"/g, '""')
      return needsQuotes ? `"${escaped}"` : escaped
    }

    const rows = [
      ['Date', 'Description', 'Category', 'Amount'],
      ...expenses.map((e) => [e.date, e.description, e.category, (parseFloat(e.amount) || 0).toFixed(2)]),
    ]

    const csv = rows.map((r) => r.map(escapeCell).join(',')).join('\n')

    const b = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(b)
    const a = document.createElement('a')
    a.href = url
    a.download = 'expenses.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>Expense tracker</h1>
        <button className="export-btn" onClick={exportCSV} disabled={loading}>
          Export CSV
        </button>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => setActiveTab('expenses')}>
          Expenses
        </button>
        <button className={`tab ${activeTab === 'charts' ? 'active' : ''}`} onClick={() => setActiveTab('charts')}>
          Charts
        </button>
      </div>

      <div className="metrics">
        <div className="metric">
          <div className="metric-label">Total spent</div>
          <div className="metric-value">{fmt(totalSpent)}</div>
        </div>
        <div className="metric">
          <div className="metric-label">This month</div>
          <div className="metric-value">{fmt(monthSpent)}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Entries</div>
          <div className="metric-value">{entryCount}</div>
        </div>
      </div>

      {activeTab === 'expenses' ? (
        <ExpensesTab
          loading={loading}
          newDesc={newDesc}
          setNewDesc={setNewDesc}
          newAmt={newAmt}
          setNewAmt={setNewAmt}
          newCat={newCat}
          setNewCat={setNewCat}
          newDate={newDate}
          setNewDate={setNewDate}
          onAddExpense={addExpense}
          filterCat={filterCat}
          setFilterCat={setFilterCat}
          filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
          filteredExpenses={filteredExpenses}
          onDelete={deleteExpense}
          fmt={fmt}
        />
      ) : (
        <ChartsTab sortedCategoryEntries={sortedCategoryEntries} maxCategoryAmount={maxCategoryAmount} fmt={fmt} />
      )}

      <p className="notice">Note: connected to Supabase for persistent storage.</p>
    </div>
  )
}

export default App