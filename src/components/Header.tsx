import { Link } from "@tanstack/react-router";
import { useProgress } from "@/lib/progress";

export function Header() {
  const { progress } = useProgress();
  return (
    <header className="brutal-border border-x-0 border-t-0 bg-bone sticky top-0 z-40">
      <div className="flex items-stretch">
        <Link to="/" className="brutal-border border-y-0 border-l-0 px-4 py-3 font-display text-2xl bg-acid hover-glitch">
          ABLETON.SCHOOL
        </Link>
        <nav className="flex-1 flex items-stretch font-mono uppercase text-sm">
          <Link to="/worlds" className="px-4 flex items-center brutal-border border-y-0 border-l-0 hover:bg-acid">Worlds</Link>
          <Link to="/devices" className="px-4 flex items-center brutal-border border-y-0 border-l-0 hover:bg-volt hover:text-bone">Devices</Link>
          <Link to="/playground" className="px-4 flex items-center brutal-border border-y-0 border-l-0 hover:bg-hot hover:text-bone">Playground</Link>
          <Link to="/glossary" className="px-4 flex items-center brutal-border border-y-0 border-l-0 hover:bg-sun">Glossary</Link>
          <Link to="/profile" className="px-4 flex items-center brutal-border border-y-0 border-l-0 hover:bg-acid">Profile</Link>
        </nav>
        <div className="flex items-center gap-2 px-4 font-mono text-sm">
          <span className="brutal-border bg-acid px-2 py-1">XP {progress.xp}</span>
          <span className="brutal-border bg-hot text-bone px-2 py-1">🔥 {progress.streakDays}</span>
        </div>
      </div>
      <Marquee />
    </header>
  );
}

function Marquee() {
  const items = [
    "LIVE 12", "WARP MARKERS", "MAX FOR LIVE", "SESSION VIEW", "SIDECHAIN", "PUSH 3",
    "MIDI TRANSFORMS", "MELD", "ROAR", "DRUM RACK", "ABLETON LINK", "CV TOOLS",
  ];
  const row = [...items, ...items];
  return (
    <div className="brutal-border border-x-0 border-b-0 bg-ink text-bone overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-1 font-mono text-xs uppercase tracking-widest">
        {row.map((t, i) => (
          <span key={i} className="px-6">★ {t}</span>
        ))}
      </div>
    </div>
  );
}
