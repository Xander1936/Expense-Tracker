import AddExpenseForm from './AddExpenseForm'
import ExpensesList from './ExpensesList'

export default function ExpensesTab({
  loading,
  newDesc,
  setNewDesc,
  newAmt,
  setNewAmt,
  newCat,
  setNewCat,
  newDate,
  setNewDate,
  onAddExpense,
  filterCat,
  setFilterCat,
  filterMonth,
  setFilterMonth,
  filteredExpenses,
  onDelete,
  fmt,
}) {
  return (
    <div id="tab-expenses">
      <AddExpenseForm
        loading={loading}
        newDesc={newDesc}
        setNewDesc={setNewDesc}
        newAmt={newAmt}
        setNewAmt={setNewAmt}
        newCat={newCat}
        setNewCat={setNewCat}
        newDate={newDate}
        setNewDate={setNewDate}
        onAddExpense={onAddExpense}
      />

      <div className="section">
        <h2>All expenses</h2>

        <div className="filters">
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option value="">All categories</option>
            {['Food', 'Transport', 'Housing', 'Health', 'Entertainment', 'Shopping', 'Other'].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} />
        </div>

        <ExpensesList loading={loading} expenses={filteredExpenses} onDelete={onDelete} fmt={fmt} />
      </div>
    </div>
  )
}