import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { WORLDS } from "@/content/worlds";
import { missionsByWorld } from "@/content/missions";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/world/$slug")({
  head: ({ params }) => {
    const w = WORLDS.find((x) => x.slug === params.slug);
    return { meta: [{ title: `${w?.title ?? "World"} — ABLETON.SCHOOL` }, { name: "description", content: w?.description ?? "" }]};
  },
  component: WorldPage,
  notFoundComponent: () => <div className="p-12 font-mono">World not found.</div>,
});

function WorldPage() {
  const { slug } = Route.useParams();
  const w = WORLDS.find((x) => x.slug === slug);
  if (!w) throw notFound();
  const ms = missionsByWorld(slug);
  const { progress } = useProgress();
  const colorClass = { acid: "bg-acid", hot: "bg-hot text-bone", volt: "bg-volt text-bone", sun: "bg-sun", bone: "bg-bone", ink: "bg-ink text-bone" }[w.color];

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      <Link to="/worlds" className="font-mono text-xs uppercase underline">← all worlds</Link>
      <header className={`${colorClass} brutal-border p-6 brutal-shadow my-4`}>
        <div className="font-mono text-xs uppercase">WORLD {w.number}</div>
        <h1 className="text-5xl md:text-7xl mt-2">{w.title}</h1>
        <p className="font-mono mt-2">{w.tagline}</p>
      </header>
      <div className="grid md:grid-cols-2 gap-4">
        {ms.map((m) => {
          const done = !!progress.completedMissions[m.slug];
          return (
            <Link key={m.slug} to="/mission/$slug" params={{ slug: m.slug }} className={`brutal-border p-4 brutal-shadow-sm brutal-press ${done ? "bg-acid" : "bg-card"}`}>
              <div className="flex items-baseline justify-between">
                <div className="font-mono text-xs uppercase">Mission {String(m.number).padStart(2, "0")}</div>
                <div className="font-mono text-xs uppercase">+{m.xp} XP {done ? "✓" : ""}</div>
              </div>
              <div className="font-display text-2xl mt-1">{m.title}</div>
              <div className="font-mono text-sm">{m.tagline}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
