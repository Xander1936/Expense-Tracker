import { CAT_COLORS } from '../constants/categories'

export default function CategoryBars({ entries, totalMax, fmt }) {
  if (!entries.length) return <div className="empty">No data yet.</div>

  return (
    <div className="chart-bar-wrap">
      {entries.map(([cat, val]) => (
        <div className="bar-row" key={cat}>
          <div className="bar-label">{cat}</div>

          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: `${((val / totalMax) * 100).toFixed(1)}%`,
                background: CAT_COLORS[cat] || '#888',
              }}
            />
          </div>

          <div className="bar-val">{fmt(val)}</div>
        </div>
      ))}
    </div>
  )
}