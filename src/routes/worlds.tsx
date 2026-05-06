import { createFileRoute, Link } from "@tanstack/react-router";
import { WORLDS } from "@/content/worlds";
import { MISSIONS } from "@/content/missions";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/worlds")({
  head: () => ({ meta: [{ title: "Worlds — ABLETON.SCHOOL" }, { name: "description", content: "Explore six worlds covering the full Ableton Live 12 manual." }]}),
  component: WorldsPage,
});

function WorldsPage() {
  const { progress } = useProgress();
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      <h1 className="text-5xl md:text-8xl mb-6">// WORLDS</h1>
      <div className="space-y-4">
        {WORLDS.map((w) => {
          const ms = MISSIONS.filter((m) => m.world === w.slug);
          const done = ms.filter((m) => progress.completedMissions[m.slug]).length;
          const colorClass = { acid: "bg-acid", hot: "bg-hot text-bone", volt: "bg-volt text-bone", sun: "bg-sun", bone: "bg-bone", ink: "bg-ink text-bone" }[w.color];
          return (
            <Link key={w.slug} to="/world/$slug" params={{ slug: w.slug }} className={`${colorClass} brutal-border p-5 brutal-shadow brutal-press flex flex-col md:flex-row items-start md:items-center gap-4`}>
              <div className="font-display text-7xl w-24">{String(w.number).padStart(2, "0")}</div>
              <div className="flex-1">
                <div className="font-display text-3xl">{w.title}</div>
                <div className="font-mono text-sm">{w.description}</div>
              </div>
              <div className="font-mono text-sm uppercase brutal-border bg-bone text-ink px-3 py-2">{done}/{ms.length}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
