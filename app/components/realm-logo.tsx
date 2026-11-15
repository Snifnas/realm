export default function RealmLogo({ compact = false }: { compact?: boolean }) {
  return <span className={`realm-logo ${compact ? "compact" : ""}`} aria-label="REALM">
    <svg className="realm-mark" viewBox="0 0 40 40" role="img" aria-hidden="true">
      <path d="M20 2.8 35.5 11.7v16.6L20 37.2 4.5 28.3V11.7L20 2.8Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M20 8 29.8 13.7v11.1L20 30.5l-9.8-5.7V13.7L20 8Z" fill="currentColor" opacity=".13"/>
      <path d="M13 27V14h7.8c3.4 0 5.2 1.7 5.2 4.3 0 2-1.1 3.4-3 4l3.8 4.7h-4.6l-3.2-4.2h-2.1V27H13Zm3.9-7.4h3.5c1.2 0 1.8-.4 1.8-1.3s-.6-1.3-1.8-1.3h-3.5v2.6Z" fill="currentColor"/>
    </svg>
    {!compact && <span className="realm-word">REALM</span>}
  </span>;
}
