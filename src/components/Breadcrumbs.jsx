export default function Breadcrumbs({ items, current }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            <button type="button" onClick={item.onClick}>{item.label}</button>
          </li>
        ))}
        <li aria-current="page"><span>{current}</span></li>
      </ol>
    </nav>
  );
}
