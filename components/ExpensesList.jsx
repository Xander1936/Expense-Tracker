import { CAT_COLORS } from '../constants/categories'

export default function ExpensesList({ loading, expenses, onDelete, fmt }) {
  if (loading) return <div className="empty">Loading expenses...</div>
  if (!expenses.length) return <div className="empty">No expenses match filters.</div>

  return (
    <div className="expense-list">
      {expenses.map((e) => {
        const c = CAT_COLORS[e.category] || '#888'
        return (
          <div className="expense-item" key={e.id}>
            <span className="cat-badge" style={{ background: `${c}22`, color: c }}>
              {e.category}
            </span>
            <span className="expense-desc">{e.description}</span>
            <span className="expense-date">{e.date}</span>
            <span className="expense-amount">{fmt(e.amount)}</span>

            <button className="btn-del" onClick={() => onDelete(e.id)} aria-label="Delete">
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}