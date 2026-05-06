import { createFileRoute, Link } from "@tanstack/react-router";
import { WORLDS } from "@/content/worlds";
import { MISSIONS } from "@/content/missions";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "ABLETON.SCHOOL — Learn Ableton Live 12, Brutally Interactive" },
    { name: "description", content: "Learn the entire Ableton Live 12 manual through gamified missions, simulators, and quizzes." },
  ]}),
  component: Home,
});

function Home() {
  const { progress } = useProgress();
  const done = Object.keys(progress.completedMissions).length;
  const pct = Math.round((done / MISSIONS.length) * 100);
  return (
    <div>
      <section className="brutal-border border-x-0 border-t-0 bg-acid">
        <div className="max-w-7xl mx-auto p-6 md:p-12 grid md:grid-cols-[1.5fr,1fr] gap-8 items-end">
          <div>
            <div className="font-mono text-xs uppercase mb-2">// learn ableton live 12 // 42 missions // 0 fluff</div>
            <h1 className="text-6xl md:text-9xl leading-none">LEARN<br/>ABLETON.<br/>BRUTALLY.</h1>
            <p className="font-mono mt-4 max-w-xl">An interactive, gamified, no-bullshit companion to the Live 12 manual. Six worlds, forty-two missions, thirteen simulators, infinite XP.</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/mission/$slug" params={{ slug: "what-is-live" }} className="brutal-border bg-ink text-bone px-5 py-3 font-display text-xl brutal-press brutal-shadow">▶ START MISSION 01</Link>
              <Link to="/worlds" className="brutal-border bg-bone px-5 py-3 font-display text-xl brutal-press">ALL WORLDS</Link>
              <Link to="/playground" className="brutal-border bg-hot text-bone px-5 py-3 font-display text-xl brutal-press">PLAYGROUND</Link>
            </div>
          </div>
          <div className="brutal-border bg-bone p-4 brutal-shadow-lg">
            <div className="font-mono text-xs uppercase mb-2">Your Progress</div>
            <div className="font-display text-5xl">{pct}%</div>
            <div className="h-3 brutal-border my-3 bg-card overflow-hidden">
              <div className="h-full bg-hot" style={{ width: `${pct}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs uppercase text-center">
              <div className="brutal-border bg-acid p-2"><div className="text-2xl font-display">{progress.xp}</div>XP</div>
              <div className="brutal-border bg-volt text-bone p-2"><div className="text-2xl font-display">{done}</div>Done</div>
              <div className="brutal-border bg-sun p-2"><div className="text-2xl font-display">{progress.streakDays}</div>Streak</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto p-6 md:p-12">
        <h2 className="text-4xl md:text-6xl mb-6">// SIX WORLDS</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORLDS.map((w) => {
            const total = MISSIONS.filter((m) => m.world === w.slug).length;
            const completed = MISSIONS.filter((m) => m.world === w.slug && progress.completedMissions[m.slug]).length;
            const colorClass = { acid: "bg-acid", hot: "bg-hot text-bone", volt: "bg-volt text-bone", sun: "bg-sun", bone: "bg-bone", ink: "bg-ink text-bone" }[w.color];
            return (
              <Link key={w.slug} to="/world/$slug" params={{ slug: w.slug }} className={`${colorClass} brutal-border p-5 brutal-shadow brutal-press block`}>
                <div className="font-mono text-xs uppercase">WORLD {w.number}</div>
                <div className="font-display text-3xl mt-1">{w.title}</div>
                <div className="font-mono text-sm mt-2">{w.tagline}</div>
                <div className="font-mono text-xs uppercase mt-4">{completed}/{total} missions · {Math.round(completed/total*100)}%</div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
