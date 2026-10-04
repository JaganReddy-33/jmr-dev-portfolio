export default function SectionHead({ n, title, accent, sub, children }) {
  return (
    <div className="sechead rv">
      <div>
        <span className="num">{n} / {title.toUpperCase()}</span>
        <h2>{accent && <span className="grad">{accent} </span>}{title}</h2>
        <p className="sub">{sub}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}
