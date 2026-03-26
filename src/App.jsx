import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

const CAT_COLORS = {
  Food: '#1D9E75', Transport: '#378ADD', Housing: '#7F77DD',
  Health: '#D4537E', Entertainment: '#EF9F27', Shopping: '#D85A30', Other: '#888780'
};

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Health', 'Entertainment', 'Shopping', 'Other'];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('expenses');
  const [filterCat, setFilterCat] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  
  const [newDesc, setNewDesc] = useState('');
  const [newAmt, setNewAmt] = useState('');
  const [newCat, setNewCat] = useState('Food');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  const pieCanvasRef = useRef(null);

  // Load expenses from Supabase
  const loadExpenses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error loading expenses:', error);
    } else {
      setExpenses(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // Metrics
  const totalSpent = expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
  const currentMonthYM = new Date().toISOString().slice(0, 7);
  const monthSpent = expenses.filter(e => e.date.startsWith(currentMonthYM)).reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
  const entryCount = expenses.length;

  const fmt = (n) => '$' + Number(n).toFixed(2);

  const addExpense = async () => {
    const amt = parseFloat(newAmt);
    if (!newDesc.trim() || isNaN(amt) || amt <= 0 || !newDate) {
      alert('Please fill all fields correctly.');
      return;
    }
    const nextExpense = {
      desc: newDesc.trim(),
      amount: amt,
      category: newCat,
      date: newDate
    };
    
    const { error } = await supabase.from('expenses').insert([nextExpense]);
    if (error) {
      alert('Error adding expense: ' + error.message);
    } else {
      setNewDesc('');
      setNewAmt('');
      await loadExpenses();
    }
  };

  const deleteExpense = async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) {
      alert('Error deleting expense: ' + error.message);
    } else {
      await loadExpenses();
    }
  };

  const exportCSV = () => {
    if (!expenses.length) { alert('No expenses to export.'); return; }
    const rows = [['Date','Description','Category','Amount'],...expenses.map(e=>[e.date,e.desc,e.category,e.amount.toFixed(2)])];
    const csv = rows.map(r=>r.join(',')).join('\n');
    const b = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(b);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const filteredExpenses = expenses
    .filter(e => (!filterCat || e.category === filterCat) && (!filterMonth || e.date.startsWith(filterMonth)))
    .sort((a, b) => b.date.localeCompare(a.date));

  const categoryTotals = {};
  expenses.forEach(e => { categoryTotals[e.category] = (categoryTotals[e.category] || 0) + (parseFloat(e.amount) || 0); });
  const sortedCategoryEntries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const maxCategoryAmount = sortedCategoryEntries[0]?.[1] || 1;

  useEffect(() => {
    if (activeTab === 'charts' && pieCanvasRef.current && sortedCategoryEntries.length > 0) {
      const canvas = pieCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const total = sortedCategoryEntries.reduce((s, [, v]) => s + v, 0);
      ctx.clearRect(0, 0, 160, 160);
      let angle = -Math.PI / 2;
      sortedCategoryEntries.forEach(([cat, val]) => {
        const slice = (val / total) * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(80, 80);
        ctx.arc(80, 80, 72, angle, angle + slice); ctx.closePath();
        ctx.fillStyle = CAT_COLORS[cat] || '#888'; ctx.fill();
        angle += slice;
      });
      ctx.beginPath(); ctx.arc(80, 80, 36, 0, Math.PI * 2); 
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-background-primary').trim() || '#ffffff';
      ctx.fill();
    }
  }, [activeTab, expenses, sortedCategoryEntries]);

  return (
    <div className="app-container">
      <div className="header">
        <h1>Expense tracker</h1>
        <button className="export-btn" onClick={exportCSV}>Export CSV</button>
      </div>
      <div className="tabs">
        <button className={`tab ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => setActiveTab('expenses')}>Expenses</button>
        <button className={`tab ${activeTab === 'charts' ? 'active' : ''}`} onClick={() => setActiveTab('charts')}>Charts</button>
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
        <div id="tab-expenses">
          <div className="section">
            <h2>Add expense</h2>
            <div className="form-grid">
              <div className="form-group form-full">
                <label>Description</label>
                <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="e.g. Grocery run" />
              </div>
              <div className="form-group">
                <label>Amount ($)</label>
                <input type="number" value={newAmt} onChange={(e) => setNewAmt(e.target.value)} placeholder="0.00" min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={newCat} onChange={(e) => setNewCat(e.target.value)}>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              </div>
            </div>
            <button className="btn-add" onClick={addExpense} disabled={loading}>{loading ? 'Loading...' : 'Add expense'}</button>
          </div>

          <div className="section">
            <h2>All expenses</h2>
            <div className="filters">
              <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
                <option value="">All categories</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} />
            </div>
            <div className="expense-list">
              {loading ? (
                <div className="empty">Loading expenses...</div>
              ) : filteredExpenses.length === 0 ? (
                <div className="empty">No expenses match filters.</div>
              ) : (
                filteredExpenses.map(e => {
                  const c = CAT_COLORS[e.category] || '#888';
                  return (
                    <div className="expense-item" key={e.id}>
                      <span className="cat-badge" style={{ background: `${c}22`, color: c }}>{e.category}</span>
                      <span className="expense-desc">{e.desc}</span>
                      <span className="expense-date">{e.date}</span>
                      <span className="expense-amount">{fmt(e.amount)}</span>
                      <button className="btn-del" onClick={() => deleteExpense(e.id)}>×</button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <p className="notice">Note: this app is connected to Supabase for persistent storage.</p>
        </div>
      ) : (
        <div id="tab-charts">
          <div className="section">
            <h2>Spending by category</h2>
            <div className="chart-bar-wrap">
              {sortedCategoryEntries.length === 0 ? (
                <div className="empty">No data yet.</div>
              ) : (
                sortedCategoryEntries.map(([cat, val]) => (
                  <div className="bar-row" key={cat}>
                    <div className="bar-label">{cat}</div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${(val / maxCategoryAmount * 100).toFixed(1)}%`, background: CAT_COLORS[cat] || '#888' }}></div>
                    </div>
                    <div className="bar-val">{fmt(val)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="section">
            <h2>Category breakdown</h2>
            <div className="pie-wrap">
              <canvas ref={pieCanvasRef} width="160" height="160"></canvas>
              <div className="legend">
                {sortedCategoryEntries.map(([cat, val]) => (
                  <div className="legend-item" key={cat}>
                    <div className="legend-dot" style={{ background: CAT_COLORS[cat] || '#888' }}></div>
                    <span>{cat} — {fmt(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
