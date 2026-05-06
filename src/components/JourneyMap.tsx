import { Link } from "@tanstack/react-router";
import { MISSIONS } from "@/content/missions";
import { WORLDS } from "@/content/worlds";
import { useProgress } from "@/lib/progress";

export function JourneyMap({ currentSlug }: { currentSlug?: string }) {
  const { progress } = useProgress();
  return (
    <div className="brutal-border bg-card p-4 brutal-shadow-sm overflow-x-auto">
      <div className="font-mono text-xs uppercase mb-3">// JOURNEY MAP — {Object.keys(progress.completedMissions).length}/{MISSIONS.length} stops complete</div>
      <div className="space-y-2 min-w-max">
        {WORLDS.map((w) => {
          const ms = MISSIONS.filter((m) => m.world === w.slug);
          const colorClass = { acid: "bg-acid", hot: "bg-hot text-bone", volt: "bg-volt text-bone", sun: "bg-sun", bone: "bg-bone", ink: "bg-ink text-bone" }[w.color];
          return (
            <div key={w.slug} className="flex items-center gap-1">
              <div className={`${colorClass} brutal-border px-2 py-1 font-mono text-[10px] uppercase w-24 shrink-0`}>W{w.number} · {w.title.split(" ")[0]}</div>
              {ms.map((m) => {
                const done = !!progress.completedMissions[m.slug];
                const cur = m.slug === currentSlug;
                return (
                  <Link key={m.slug} to="/mission/$slug" params={{ slug: m.slug }} title={`#${m.number} ${m.title}`}
                    className={`brutal-border w-7 h-7 flex items-center justify-center font-mono text-[10px] ${cur ? "bg-hot text-bone animate-pulse" : done ? "bg-acid" : "bg-bone"}`}>
                    {done ? "✓" : m.number}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
