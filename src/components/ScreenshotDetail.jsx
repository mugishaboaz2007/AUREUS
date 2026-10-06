import { useState } from 'react';
import Breadcrumbs from './Breadcrumbs.jsx';

function formatDate(value) { return new Date(value).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
function formatSize(bytes) { if (!bytes) return '—'; if (bytes < 1024) return `${bytes} B`; if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`; return `${(bytes / (1024 * 1024)).toFixed(1)} MB`; }

export default function ScreenshotDetail({ screenshot, categories, onClose, onDelete, onToggleFavorite, onSave, onNavigateToLibrary, onNavigateToCategory }) {
  const { id, name, dataUrl, category, favorite, createdAt, size, note } = screenshot;
  const [editNote, setEditNote] = useState(note || ''), [editCategory, setEditCategory] = useState(category || 'Personal'), [customCategory, setCustomCategory] = useState(''), [creatingCategory, setCreatingCategory] = useState(false), [saving, setSaving] = useState(false);
  const save = async () => { const finalCategory = creatingCategory && customCategory.trim() ? customCategory.trim() : editCategory; if (finalCategory === category && editNote === (note || '')) return; setSaving(true); await onSave(id, { category: finalCategory, note: editNote }); setSaving(false); };
  const download = () => { const link = document.createElement('a'); link.href = dataUrl; link.download = name; link.click(); };
  return <div className="detail-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Screenshot detail"><section className="detail-panel" onClick={(event) => event.stopPropagation()}>
    <header className="detail-panel__header"><h2 className="detail-panel__title" title={name}>{name}</h2><button className="detail-panel__close" onClick={onClose} aria-label="Close">×</button></header>
    <Breadcrumbs items={[{ label: 'Library', onClick: onNavigateToLibrary }, ...(category ? [{ label: category, onClick: () => onNavigateToCategory(category) }] : [])]} current={name} />
    <div className="detail-panel__img-wrap"><img className="detail-panel__img" src={dataUrl} alt={name} width="1200" height="750" /></div>
    <div className="detail-panel__actions"><button className={`btn ${favorite ? 'btn--fav-active' : 'btn--fav'}`} onClick={() => onToggleFavorite(id)}>{favorite ? '★ Important' : '☆ Mark important'}</button><button className="btn btn--download" onClick={download}>↓ Download</button><button className="btn btn--danger" onClick={() => onDelete(id)}>Delete “{name}”</button></div>
    <div className="detail-panel__meta"><div className="meta-row"><span className="meta-label">Captured</span><span className="meta-value">{formatDate(createdAt)}</span></div><div className="meta-row"><span className="meta-label">Size</span><span className="meta-value">{formatSize(size)}</span></div></div>
    <div className="detail-panel__field"><label className="field-label">Category</label><select className="field-select" value={creatingCategory ? '__new__' : editCategory} onChange={(event) => { if (event.target.value === '__new__') setCreatingCategory(true); else { setCreatingCategory(false); setEditCategory(event.target.value); } }}>{categories.map((item) => <option key={item} value={item}>{item}</option>)}<option value="__new__">New category…</option></select>{creatingCategory && <input className="field-input" placeholder="Name your category" value={customCategory} onChange={(event) => setCustomCategory(event.target.value)} />}</div>
    <div className="detail-panel__field"><label className="field-label">Note</label><textarea className="field-textarea" rows={3} placeholder="Add a note about this capture" value={editNote} onChange={(event) => setEditNote(event.target.value)} /></div>
    <button className="btn btn--primary detail-panel__save" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
  </section></div>;
}
