import { useState } from 'react';

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  onSelectRecent,
  onSelectResult,
  recentSearches,
  results,
  isSearching,
  inputRef,
}) {
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const showResults = value.trim().length > 0;
  const waitingForResults = showResults && isSearching;
  const options = showResults
    ? (waitingForResults ? [] : results.slice(0, 6).map((screenshot) => ({ type: 'result', screenshot })))
    : recentSearches.map((query) => ({ type: 'recent', query }));
  const showPopover = focused && (showResults || recentSearches.length > 0);

  const chooseOption = (option) => {
    if (option.type === 'result') {
      onSelectResult(option.screenshot);
      setFocused(false);
      inputRef.current?.blur();
      return;
    }
    onSelectRecent(option.query);
    setFocused(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' && options.length) {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % options.length);
    } else if (event.key === 'ArrowUp' && options.length) {
      event.preventDefault();
      setActiveIndex((current) => (current <= 0 ? options.length - 1 : current - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (activeIndex >= 0 && options[activeIndex]) chooseOption(options[activeIndex]);
      else onSubmit(value);
    } else if (event.key === 'Escape') {
    event.preventDefault();
    setFocused(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="search-container">
      <form className="search-bar" role="search" onSubmit={(event) => { event.preventDefault(); onSubmit(value); }}>
        <svg className="search-bar__icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="5.8" />
          <path d="m15.2 15.2 4 4" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="search-bar__input"
          placeholder="Search your screenshots"
          value={value}
          onChange={(event) => { onChange(event.target.value); setActiveIndex(-1); }}
          onFocus={() => { setFocused(true); setActiveIndex(-1); }}
          onBlur={() => window.setTimeout(() => setFocused(false), 120)}
          onKeyDown={handleKeyDown}
          aria-label="Search screenshots"
          aria-autocomplete="list"
          aria-expanded={showPopover}
          aria-controls="search-suggestions"
          aria-activedescendant={activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
        />
        {value && <button type="button" className="search-bar__clear" onClick={() => { onChange(''); inputRef.current?.focus(); }} aria-label="Clear search">×</button>}
        <kbd className="search-bar__shortcut" aria-hidden="true">Ctrl K</kbd>
      </form>
      {showPopover && (
        <div className="search-suggestions" id="search-suggestions" role="listbox" aria-label={showResults ? 'Search results' : 'Recent searches'}>
          {waitingForResults ? (
            <p className="search-suggestions__status" role="status">Searching…</p>
          ) : options.length ? (
            options.map((option, index) => (
              <button
                type="button"
                id={`search-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className={`search-suggestions__item ${index === activeIndex ? 'search-suggestions__item--active' : ''}`}
                key={option.type === 'result' ? `result-${option.screenshot.id}` : `recent-${option.query}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => chooseOption(option)}
              >
                <span className="search-suggestions__icon" aria-hidden="true">{option.type === 'result' ? '⌕' : '◷'}</span>
                <span className="search-suggestions__copy">
                  <b>{option.type === 'result' ? option.screenshot.name : option.query}</b>
                  <small>{option.type === 'result' ? option.screenshot.category : 'Recent search'}</small>
                </span>
                {option.type === 'result' && <span className="search-suggestions__enter" aria-hidden="true">↵</span>}
              </button>
            ))
          ) : (
            <p className="search-suggestions__status">No matching captures yet.</p>
          )}
          {showResults && !waitingForResults && results.length > options.length && (
            <p className="search-suggestions__footer">{results.length} results — press Enter to search</p>
          )}
        </div>
      )}
    </div>
  );
}
