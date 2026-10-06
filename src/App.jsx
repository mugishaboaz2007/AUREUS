import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { getAllScreenshots, addScreenshot, deleteScreenshot, updateScreenshot } from './db/db.js';
import Navbar from './components/Navbar.jsx';
import BottomNavigation, { NavIcon } from './components/BottomNavigation.jsx';
import SearchBar from './components/SearchBar.jsx';
import CategoryFilter from './components/CategoryFilter.jsx';
import ScreenshotGrid from './components/ScreenshotGrid.jsx';
import ScreenshotDetail from './components/ScreenshotDetail.jsx';
import AddScreenshotModal from './components/AddScreenshotModal.jsx';
import EmptyState from './components/EmptyState.jsx';
import Breadcrumbs from './components/Breadcrumbs.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import { matchesSearch, searchScore } from './search.js';
import './App.css';
import './enhancements.css';

const DEFAULT_CATEGORIES = ['All', 'Recent', 'Apps', 'Notes', 'School', 'Work', 'Personal', 'Important'];
const RECENT_SEARCHES_KEY = 'aureus.recentSearches';
const SEARCH_DEBOUNCE_MS = 250;

export default function App() {
  const [screenshots, setScreenshots] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [recentSearches, setRecentSearches] = useState(readRecentSearches);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedId, setSelectedId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [undoEdit, setUndoEdit] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [customCategories, setCustomCategories] = useState([]);
  const searchInputRef = useRef(null);

  const allCategories = useMemo(
    () => [...DEFAULT_CATEGORIES, ...customCategories.filter((category) => !DEFAULT_CATEGORIES.includes(category))],
    [customCategories],
  );

  const loadScreenshots = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await getAllScreenshots();
      data.sort((a, b) => b.createdAt - a.createdAt);
      setScreenshots(data);
      setCustomCategories([...new Set(data.map((shot) => shot.category).filter((category) => category && !DEFAULT_CATEGORIES.includes(category)))]);
    } catch (error) {
      console.error('Failed to load screenshots:', error);
      setLoadError('Your library could not be opened. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadScreenshots(); }, [loadScreenshots]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && !selectedId && !pendingDelete && !showAddModal) {
        event.preventDefault();
        transitionPage(() => setActiveTab('Home'));
        window.requestAnimationFrame(() => searchInputRef.current?.focus());
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [pendingDelete, selectedId, showAddModal]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab, activeCategory]);

  useEffect(() => {
    if (!undoEdit) return undefined;
    const timer = window.setTimeout(() => setUndoEdit(null), 8000);
    return () => window.clearTimeout(timer);
  }, [undoEdit]);

  const filtered = useMemo(() => {
    const query = debouncedSearch.toLowerCase();
    const matches = screenshots.filter((shot) => {
      const isImportant = activeCategory === 'Important' || activeCategory === 'Favorites';
      const matchesCategory = activeCategory === 'All'
        || (activeCategory === 'Recent' && Date.now() - shot.createdAt < 7 * 86400000)
        || (isImportant ? shot.favorite || shot.category === 'Important' : shot.category === activeCategory);
      return matchesCategory && (!query || matchesSearch(shot, query));
    });
    if (!query) return matches;
    return matches.sort((a, b) => searchScore(a, query) - searchScore(b, query) || b.createdAt - a.createdAt);
  }, [screenshots, activeCategory, debouncedSearch]);

  const recordSearch = useCallback((value) => {
    const query = value.trim();
    if (!query) return;
    setRecentSearches((current) => {
      const next = [query, ...current.filter((item) => item.toLowerCase() !== query.toLowerCase())].slice(0, 6);
      try {
        window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch (error) {
        console.error('Failed to save recent searches:', error);
      }
      return next;
    });
  }, []);

  const handleAdd = async (files, category, note) => {
    for (const file of files) {
      await addScreenshot({ name: file.name, dataUrl: await readFileAsDataURL(file), category: category || 'Personal', note: note || '', size: file.size, type: file.type });
    }
    await loadScreenshots();
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    const screenshot = screenshots.find((item) => item.id === id);
    if (screenshot) setPendingDelete(screenshot);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteScreenshot(pendingDelete.id);
    if (selectedId === pendingDelete.id) setSelectedId(null);
    if (undoEdit?.id === pendingDelete.id) setUndoEdit(null);
    setPendingDelete(null);
    await loadScreenshots();
  };

  const handleSaveScreenshot = async (id, updates) => {
    const existing = screenshots.find((item) => item.id === id);
    if (!existing) return;
    await updateScreenshot(id, updates);
    setUndoEdit({
      id,
      name: existing.name,
      category: existing.category,
      note: existing.note,
    });
    await loadScreenshots();
  };

  const handleUndoEdit = async () => {
    if (!undoEdit) return;
    const previous = undoEdit;
    await updateScreenshot(previous.id, { category: previous.category, note: previous.note });
    setUndoEdit(null);
    await loadScreenshots();
  };

  const handleToggleFavorite = async (id) => {
    const shot = screenshots.find((item) => item.id === id);
    if (!shot) return;
    await updateScreenshot(id, { favorite: !shot.favorite });
    await loadScreenshots();
  };

  const selectCategory = (category) => {
    transitionPage(() => {
      setActiveCategory(category);
      setActiveTab('Home');
    });
  };

  const selectTab = (tab) => {
    transitionPage(() => {
      setActiveTab(tab);
      if (tab === 'Important') setActiveCategory('Important');
      if (tab === 'Home' && activeCategory === 'Important') setActiveCategory('All');
    });
  };

  const selectedScreenshot = screenshots.find((shot) => shot.id === selectedId) || null;
  const pageKey = `${activeTab}:${activeTab === 'Home' || activeTab === 'Important' ? activeCategory : ''}`;

  return (
    <div className="app">
      <Navbar onAddClick={() => setShowAddModal(true)} />
      <div className="app__shell">
        <aside className="app__sidebar">
          <CategoryFilter
            categories={['All', 'Recent', 'Apps', 'Notes', 'Important', ...allCategories.filter((item) => !['All', 'Recent', 'Apps', 'Notes', 'Important'].includes(item))]}
            active={activeCategory}
            onChange={selectCategory}
            counts={getCategoryCounts(screenshots)}
          />
        </aside>
        <main className="app__main">
          <div className="page-transition" key={pageKey}>
            {activeTab === 'Categories' ? (
              <CategoriesPage
                categories={allCategories.filter((item) => !['All', 'Recent'].includes(item))}
                screenshots={screenshots}
                onChoose={selectCategory}
              />
            ) : activeTab === 'Settings' ? (
              <SettingsPage />
            ) : (
              <LibraryPage
                activeTab={activeTab}
                screenshots={screenshots}
                filtered={filtered}
                loading={loading || search.trim() !== debouncedSearch}
                loadError={loadError}
                search={search}
                setSearch={setSearch}
                debouncedSearch={debouncedSearch}
                recentSearches={recentSearches}
                onRecordSearch={recordSearch}
                searchInputRef={searchInputRef}
                activeCategory={activeCategory}
                onSelectCategory={selectCategory}
                allCategories={allCategories}
                onRetry={loadScreenshots}
                onAdd={() => setShowAddModal(true)}
                onSelect={setSelectedId}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </div>
        </main>
      </div>
      <BottomNavigation active={activeTab} onChange={selectTab} />
      {selectedScreenshot && (
        <ScreenshotDetail
          screenshot={selectedScreenshot}
          categories={allCategories.filter((item) => item !== 'All' && item !== 'Recent')}
          onClose={() => setSelectedId(null)}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onSave={handleSaveScreenshot}
          onNavigateToLibrary={() => { setSelectedId(null); selectCategory('All'); }}
          onNavigateToCategory={(category) => { setSelectedId(null); selectCategory(category); }}
        />
      )}
      {showAddModal && (
        <AddScreenshotModal
          categories={allCategories.filter((item) => item !== 'All' && item !== 'Recent')}
          onAdd={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
      {pendingDelete && <DeleteConfirmation screenshot={pendingDelete} onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} />}
      {undoEdit && (
        <div className="undo-toast" role="status" aria-live="polite">
          <span>Changes to “{undoEdit.name}” saved.</span>
          <button type="button" onClick={handleUndoEdit}>Undo changes</button>
        </div>
      )}
    </div>
  );
}

function LibraryPage({
  activeTab, screenshots, filtered, loading, loadError, search, setSearch, debouncedSearch,
  recentSearches, onRecordSearch, searchInputRef, activeCategory, onSelectCategory, allCategories,
  onRetry, onAdd, onSelect, onDelete, onToggleFavorite,
}) {
  const title = activeTab === 'Important' ? 'Important captures' : activeCategory === 'All' ? 'Screenshots' : activeCategory;
  const suggestions = [
    ...recentSearches.map((item) => ({ label: `Search “${item}”`, onClick: () => setSearch(item) })),
    ...allCategories.filter((item) => !['All', 'Recent', 'Important', activeCategory].includes(item)).slice(0, 3)
      .map((item) => ({ label: `Browse ${item}`, onClick: () => onSelectCategory(item) })),
  ];
  const searchResults = search.trim() === debouncedSearch ? filtered : [];

  return (
    <>
      {activeCategory !== 'All' && activeCategory !== 'Recent' && (
        <Breadcrumbs items={[{ label: 'Library', onClick: () => onSelectCategory('All') }]} current={title} />
      )}
      <section className="library-hero">
        <div>
          <p className="section-kicker">{activeTab === 'Important' ? 'Keep what matters close' : 'Everything, in its place'}</p>
          <h2>{title}</h2>
          <p>{screenshots.length ? `${filtered.length} capture${filtered.length === 1 ? '' : 's'} in view` : 'A calm home for every capture.'}</p>
        </div>
        <button className="hero-import" onClick={onAdd}><span>+</span> Import</button>
      </section>
      <SearchBar
        value={search}
        onChange={setSearch}
        onSubmit={onRecordSearch}
        onSelectRecent={(query) => { setSearch(query); onRecordSearch(query); }}
        onSelectResult={(screenshot) => { onRecordSearch(search); onSelect(screenshot.id); }}
        recentSearches={recentSearches}
        results={searchResults}
        isSearching={search.trim() !== debouncedSearch}
        inputRef={searchInputRef}
      />
      <CategoryFilter compact categories={['All', 'Recent', 'Apps', 'Notes', 'Important']} active={activeCategory} onChange={onSelectCategory} counts={{}} />
      {loadError ? (
        <div className="library-error" role="alert">
          <p>{loadError}</p>
          <button className="btn btn--ghost" onClick={onRetry}>Retry</button>
        </div>
      ) : loading ? (
        <ScreenshotSkeletons />
      ) : filtered.length === 0 ? (
        search.trim()
          ? <EmptyState hasScreenshots onAdd={onAdd} query={search} suggestions={suggestions} />
          : <EmptyState hasScreenshots={screenshots.length > 0} onAdd={onAdd} />
      ) : (
        <ScreenshotGrid screenshots={filtered} query={debouncedSearch} onSelect={onSelect} onDelete={onDelete} onToggleFavorite={onToggleFavorite} />
      )}
    </>
  );
}

function ScreenshotSkeletons() {
  return (
    <div className="screenshot-grid screenshot-grid--skeleton" aria-label="Loading screenshots" aria-busy="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="screenshot-skeleton" key={index} aria-hidden="true">
          <div className="screenshot-skeleton__image" />
          <div className="screenshot-skeleton__line" />
          <div className="screenshot-skeleton__line screenshot-skeleton__line--short" />
        </div>
      ))}
    </div>
  );
}

function CategoriesPage({ categories, screenshots, onChoose }) {
  return (
    <section className="categories-page">
      <p className="section-kicker">Organize with intent</p>
      <h2>Categories</h2>
      <p className="page-intro">Your captures stay local, private, and easy to find.</p>
      <div className="category-cards">
        {categories.map((category, index) => {
          const count = category === 'Important'
            ? screenshots.filter((shot) => shot.favorite || shot.category === 'Important').length
            : screenshots.filter((shot) => shot.category === category).length;
          return (
            <button className="category-card" key={category} onClick={() => onChoose(category)}>
              <span className={`category-card__orb category-card__orb--${index % 4}`}><NavIcon name="categories" /></span>
              <span><b>{category}</b><small>{count} capture{count === 1 ? '' : 's'}</small></span>
              <i>›</i>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SettingsPage() {
  return (
    <section className="settings-page">
      <p className="section-kicker">Make it yours</p>
      <h2>Settings</h2>
      <div className="settings-card">
        {[['Appearance', 'Dark', '◐'], ['Storage', 'Stored on this device', '▣'], ['Categories', 'Manage your organization', '◇'], ['About AUREUS', 'Version 1.0', 'A']].map(([name, description, icon]) => (
          <button key={name}><span className="settings-card__icon">{icon}</span><span><b>{name}</b><small>{description}</small></span><i>›</i></button>
        ))}
      </div>
    </section>
  );
}

function transitionPage(update) {
  if (typeof document.startViewTransition === 'function') {
    document.startViewTransition(() => flushSync(update));
    return;
  }
  update();
}

function readRecentSearches() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
    return Array.isArray(stored) ? stored.filter((item) => typeof item === 'string').slice(0, 6) : [];
  } catch (error) {
    console.error('Failed to read recent searches:', error);
    return [];
  }
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getCategoryCounts(screenshots) {
  const counts = {
    All: screenshots.length,
    Recent: screenshots.filter((shot) => Date.now() - shot.createdAt < 7 * 86400000).length,
    Apps: 0,
    Notes: 0,
    Important: 0,
  };
  screenshots.forEach((shot) => {
    if (shot.favorite || shot.category === 'Important') counts.Important += 1;
    if (shot.category) counts[shot.category] = (counts[shot.category] || 0) + 1;
  });
  return counts;
}
