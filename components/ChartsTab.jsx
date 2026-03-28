import CategoryBars from './CategoryBars'
import PieChart from './PieChart'
import { CAT_COLORS } from '../constants/categories'

export default function ChartsTab({ sortedCategoryEntries, maxCategoryAmount, fmt }) {
  return (
    <div id="tab-charts">
      <div className="section">
        <h2>Spending by category</h2>
        <CategoryBars entries={sortedCategoryEntries} totalMax={maxCategoryAmount} fmt={fmt} />
      </div>

      <div className="section">
        <h2>Category breakdown</h2>

        <div className="pie-wrap">
          <PieChart active={true} entries={sortedCategoryEntries} />

          <div className="legend">
            {sortedCategoryEntries.map(([cat, val]) => (
              <div className="legend-item" key={cat}>
                <div className="legend-dot" style={{ background: CAT_COLORS[cat] || '#888' }}></div>
                <span>
                  {cat} — {fmt(val)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}