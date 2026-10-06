export default function BrandMark({ size = 'md', label = false }) {
  return (
    <div className={`brand-mark brand-mark--${size}`} aria-label="Aureus">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path className="brand-mark__white" d="M7 38 22.5 9.5c.7-1.3 2.6-1.3 3.3 0L41 38h-8.4L24.1 21 15.4 38H7Z" />
        <path className="brand-mark__neon" d="m24.1 21 4.2 7.7L34.1 38H41L25.8 9.5c-.4-.7-1-1-1.7-1v12.5Z" />
        <circle className="brand-mark__dot" cx="24" cy="33.5" r="3.3" />
      </svg>
      {label && <span className="brand-mark__label">AUREUS</span>}
    </div>
  );
}
