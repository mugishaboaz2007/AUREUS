import BrandMark from './BrandMark.jsx';

export default function EmptyState({ hasScreenshots, onAdd, query = '', suggestions = [] }) {
  const isSearch = Boolean(query.trim());
  return (
    <section className="empty-state" aria-live="polite">
      <div className="empty-state__icon">{hasScreenshots ? '⌕' : <BrandMark size="lg" />}</div>
      <h2>{isSearch ? 'No captures found' : hasScreenshots ? 'Nothing in this view' : 'Your library is ready'}</h2>
      <p>
        {isSearch
          ? `No matches for “${query.trim()}”. Try a different phrase or browse a suggestion.`
          : hasScreenshots
            ? 'Try another search or filter.'
            : 'Import screenshots to give every capture a home.'}
      </p>
      {isSearch && suggestions.length > 0 && (
        <div className="empty-state__suggestions" aria-label="Search suggestions">
          {suggestions.map((suggestion) => (
            <button type="button" className="btn btn--ghost" key={suggestion.label} onClick={suggestion.onClick}>
              {suggestion.label}
            </button>
          ))}
        </div>
      )}
      {!hasScreenshots && !isSearch && <button className="btn btn--primary" onClick={onAdd}><span>+</span> Import screenshots</button>}
    </section>
  );
}
