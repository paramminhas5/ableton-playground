import { createFileRoute, Link } from "@tanstack/react-router";
import { useProgress } from "@/lib/progress";
import { MISSIONS } from "@/content/missions";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — ABLETON.SCHOOL" }, { name: "description", content: "Your XP, badges, streak and completed missions." }]}),
  component: Profile,
});

function Profile() {
  const { progress, reset } = useProgress();
  const completed = MISSIONS.filter((m) => progress.completedMissions[m.slug]);
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-6">
      <h1 className="text-5xl md:text-7xl">// PROFILE</h1>
      <div className="grid grid-cols-3 gap-3 font-mono uppercase text-center">
        <div className="brutal-border bg-acid p-4 brutal-shadow-sm"><div className="font-display text-5xl">{progress.xp}</div>XP</div>
        <div className="brutal-border bg-hot text-bone p-4 brutal-shadow-sm"><div className="font-display text-5xl">{progress.streakDays}</div>Streak</div>
        <div className="brutal-border bg-volt text-bone p-4 brutal-shadow-sm"><div className="font-display text-5xl">{completed.length}</div>Missions</div>
      </div>
      <div>
        <h2 className="text-3xl mb-3">// BADGES</h2>
        <div className="flex flex-wrap gap-2">
          {progress.badges.length === 0 && <span className="font-mono text-sm opacity-60">No badges yet — complete missions to earn them.</span>}
          {progress.badges.map((b) => (
            <span key={b} className="brutal-border bg-sun px-3 py-2 font-mono text-xs uppercase brutal-shadow-sm">🏅 {b}</span>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-3xl mb-3">// COMPLETED</h2>
        <div className="grid md:grid-cols-2 gap-2">
          {completed.length === 0 && <Link to="/mission/$slug" params={{ slug: "what-is-live" }} className="brutal-border bg-acid p-3 font-mono uppercase brutal-press">▶ Start Mission 01</Link>}
          {completed.map((m) => (
            <Link key={m.slug} to="/mission/$slug" params={{ slug: m.slug }} className="brutal-border bg-card p-3 font-mono text-sm brutal-press">
              ✓ {String(m.number).padStart(2, "0")} · {m.title}
            </Link>
          ))}
        </div>
      </div>
      <button onClick={reset} className="brutal-border bg-bone px-3 py-2 font-mono text-xs uppercase brutal-press">Reset progress</button>
    </div>
  );
}
