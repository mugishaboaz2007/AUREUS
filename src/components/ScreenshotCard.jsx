import { getHighlightRanges } from '../search.js';

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function HighlightedText({ value, query }) {
  const ranges = getHighlightRanges(value, query);
  if (!ranges.length) return value;
  const parts = [];
  let cursor = 0;
  ranges.forEach(({ start, end }, index) => {
    if (start > cursor) parts.push(value.slice(cursor, start));
    parts.push(<mark key={`${start}-${index}`}>{value.slice(start, end)}</mark>);
    cursor = end;
  });
  if (cursor < value.length) parts.push(value.slice(cursor));
  return parts;
}

export default function ScreenshotCard({ screenshot, query = '', onSelect, onDelete, onToggleFavorite }) {
  const { id, name, dataUrl, category, favorite, createdAt, note, pending } = screenshot;
  return (
    <article className="screenshot-card">
      <button type="button" className="screenshot-card__open" onClick={onSelect} aria-label={`Open ${name}`}>
        <span className="screenshot-card__img-wrap">
          <img className="screenshot-card__img" src={dataUrl} alt="" width="640" height="400" loading="lazy" />
          <span className="screenshot-card__shade" />
          <span className="screenshot-card__category"><HighlightedText value={category || 'Uncategorized'} query={query} /></span>
        </span>
        <span className="screenshot-card__info">
          <span className="screenshot-card__text">
            <span className="screenshot-card__name" title={name}><HighlightedText value={name} query={query} /></span>
            {query && note && <span className="screenshot-card__note"><HighlightedText value={note} query={query} /></span>}
          </span>
          <span className="screenshot-card__date">{pending ? 'Saving…' : formatDate(createdAt)}</span>
        </span>
      </button>
      <div className="screenshot-card__actions">
        <button
          className={`screenshot-card__favorite ${favorite ? 'screenshot-card__favorite--active' : ''}`}
          onClick={onToggleFavorite}
          aria-label={favorite ? `Remove ${name} from important` : `Mark ${name} as important`}
        >{favorite ? '★' : '☆'}</button>
        <button className="screenshot-card__delete" onClick={onDelete} aria-label={`Delete ${name}`}>×</button>
      </div>
    </article>
  );
}
