/** Mono index tag + heading whose last word is an Instrument Serif italic accent. */
export default function SectionHead({
  index,
  label,
  title,
  accent,
  id,
  className = "",
}: {
  index: string;
  label: string;
  title: string;
  accent: string;
  id: string;
  className?: string;
}) {
  return (
    <header className={className}>
      <p className="tag rv">
        {index} — {label}
      </p>
      <h2 className="h2" id={id}>
        <span className="rv-mask">
          <span>
            {title} <span className="serif">{accent}</span>
          </span>
        </span>
      </h2>
    </header>
  );
}
