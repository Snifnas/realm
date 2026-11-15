"use client";
const items = [{ label: "Home", tab: "Overview", icon: "⌂" }, { label: "Skills", tab: "Skills", icon: "✧" }, { label: "Quests", tab: "Quests", icon: "⚑" }, { label: "Guide", tab: "Game Master", icon: "☼" }];
export default function MobileNav({ active, onNavigate, activeQuests }: { active: string; onNavigate: (tab: string) => void; activeQuests: number }) {
  return <nav className="mobile-nav" aria-label="Main navigation">
    {items.map(item => <button key={item.tab} className={active === item.tab ? "mobile-nav-item active" : "mobile-nav-item"} onClick={() => onNavigate(item.tab)} aria-current={active === item.tab ? "page" : undefined}>
      <span className="mobile-nav-icon">{item.icon}{item.tab === "Quests" && activeQuests > 0 && <i>{activeQuests}</i>}</span><small>{item.label}</small>
    </button>)}
  </nav>;
}
