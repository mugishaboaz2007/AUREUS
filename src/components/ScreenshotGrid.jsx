import ScreenshotCard from './ScreenshotCard.jsx';

export default function ScreenshotGrid({ screenshots, query = '', onSelect, onDelete, onToggleFavorite }) {
  return (
    <div className="screenshot-grid">
      {screenshots.map((shot) => (
        <ScreenshotCard
          key={shot.id}
          screenshot={shot}
          query={query}
          onSelect={() => onSelect(shot.id)}
          onDelete={(e) => { e.stopPropagation(); onDelete(shot.id); }}
          onToggleFavorite={(e) => { e.stopPropagation(); onToggleFavorite(shot.id); }}
        />
      ))}
    </div>
  );
}
