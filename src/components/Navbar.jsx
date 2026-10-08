import BrandMark from './BrandMark.jsx';
import PwaInstallButton from './PwaInstallButton.jsx';

export default function Navbar({ onAddClick }) {
  return <header className="navbar">
    <div className="navbar__brand"><BrandMark size="sm" /><div><p className="navbar__eyebrow">Your library</p><h1 className="navbar__title">AUREUS</h1></div></div>
    <div className="navbar__actions">
      <PwaInstallButton />
      <button className="add-button" onClick={onAddClick} aria-label="Import screenshots"><span>+</span><b>Import</b></button>
    </div>
  </header>;
}
