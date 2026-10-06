const CATEGORY_ICONS = { All: '◫', Recent: '◷', Apps: '◉', Notes: '▤', Important: '★', School: '◆', Work: '▣', Personal: '●', Favorites: '★' };

export default function CategoryFilter({ categories, active, onChange, counts, compact = false }) {
  return <nav className={`category-filter ${compact ? 'category-filter--compact' : ''}`} aria-label="Categories">
    {!compact && <h2 className="category-filter__heading">Library</h2>}
    <div className="category-filter__list">
      {categories.map((cat) => <button key={cat} className={`category-filter__item ${active === cat ? 'category-filter__item--active' : ''}`} onClick={() => onChange(cat)} aria-current={active === cat ? 'true' : undefined}>
        <span className="category-filter__icon">{CATEGORY_ICONS[cat] || '◇'}</span><span className="category-filter__label">{cat}</span>
        {!compact && counts[cat] !== undefined && <span className="category-filter__badge">{counts[cat]}</span>}
      </button>)}
    </div>
  </nav>;
}
