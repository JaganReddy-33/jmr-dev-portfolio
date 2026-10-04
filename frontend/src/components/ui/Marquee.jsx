export default function Marquee({ items }) {
  const list = items.concat(items);
  return (
    <div className="mq" aria-hidden="true">
      <div>{list.map((s, i) => <span key={i}>{s}</span>)}</div>
    </div>
  );
}
