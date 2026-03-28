import { CATEGORIES } from '../constants/categories'

export default function AddExpenseForm({
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
}) {
  return (
    <div className="section">
      <h2>Add expense</h2>

      <div className="form-grid">
        <div className="form-group form-full">
          <label>Description</label>
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="e.g. Grocery run"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Amount ($)</label>
          <input
            type="number"
            value={newAmt}
            onChange={(e) => setNewAmt(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select value={newCat} onChange={(e) => setNewCat(e.target.value)} disabled={loading}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} disabled={loading} />
        </div>
      </div>

      <button className="btn-add" onClick={onAddExpense} disabled={loading}>
        {loading ? 'Loading...' : 'Add expense'}
      </button>
    </div>
  )
}