import BrandMark from './BrandMark.jsx';

const items = [['Home', 'home'], ['Categories', 'categories'], ['Important', 'important'], ['Settings', 'settings']];

export function NavIcon({ name }) {
  const icons = {
    home: <><path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9Z" /><path d="M9 21v-7h6v7" /></>,
    categories: <><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h3l2 2h6A2.5 2.5 0 0 1 20 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z" /><path d="M4 9h16" /></>,
    important: <path d="m12 3 2.78 5.63L21 9.54l-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.93 1.06-6.2L3 9.54l6.22-.91L12 3Z" />,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.4 2.4-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.55v.09h-3.4v-.09A1.7 1.7 0 0 0 10 18.94a1.7 1.7 0 0 0-1.88.34l-.06.06-2.4-2.4.06-.06A1.7 1.7 0 0 0 6.06 15 1.7 1.7 0 0 0 4.5 14H4.4v-3.4h.1A1.7 1.7 0 0 0 6.06 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.4-2.4.06.06A1.7 1.7 0 0 0 10 5.06a1.7 1.7 0 0 0 1.03-1.55v-.1h3.4v.1a1.7 1.7 0 0 0 1.03 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.4 2.4-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1.03h.1v3.4h-.1A1.7 1.7 0 0 0 19.4 15Z" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
}

export default function BottomNavigation({ active, onChange }) {
  return <nav className="bottom-navigation" aria-label="Main navigation">
    {items.map(([label, icon]) => <button key={label} className={`bottom-navigation__item ${active === label ? 'bottom-navigation__item--active' : ''}`} onClick={() => onChange(label)} aria-current={active === label ? 'page' : undefined}>
      {active === label && <span className="bottom-navigation__indicator" />}
      {label === 'Home' ? <BrandMark size="nav" /> : <NavIcon name={icon} />}
      <span>{label}</span>
    </button>)}
  </nav>;
}
