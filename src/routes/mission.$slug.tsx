import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { missionBySlug, nextMission } from "@/content/missions";
import { WORLDS } from "@/content/worlds";
import { Simulator } from "@/components/sims/Simulator";
import { Quiz } from "@/components/Quiz";
import { useProgress } from "@/lib/progress";
import { useState } from "react";

export const Route = createFileRoute("/mission/$slug")({
  head: ({ params }) => {
    const m = missionBySlug(params.slug);
    return { meta: [{ title: `${m?.title ?? "Mission"} — ABLETON.SCHOOL` }, { name: "description", content: m?.tagline ?? "" }]};
  },
  component: MissionPage,
  notFoundComponent: () => <div className="p-12 font-mono">Mission not found.</div>,
});

function MissionPage() {
  const { slug } = Route.useParams();
  const m = missionBySlug(slug);
  if (!m) throw notFound();
  const w = WORLDS.find((x) => x.slug === m.world)!;
  const { progress, completeMission } = useProgress();
  const [completed, setCompleted] = useState(!!progress.completedMissions[slug]);
  const next = nextMission(slug);
  const colorClass = { acid: "bg-acid", hot: "bg-hot text-bone", volt: "bg-volt text-bone", sun: "bg-sun", bone: "bg-bone", ink: "bg-ink text-bone" }[w.color];

  const onQuizDone = (score: number) => {
    completeMission(slug, m.xp, score, score >= 0.6 ? m.badge?.slug : undefined);
    setCompleted(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-8">
      <Link to="/world/$slug" params={{ slug: m.world }} className="font-mono text-xs uppercase underline">← {w.title}</Link>

      <header className={`${colorClass} brutal-border p-6 brutal-shadow`}>
        <div className="font-mono text-xs uppercase">Mission {String(m.number).padStart(2, "0")} · World {w.number}</div>
        <h1 className="text-5xl md:text-7xl mt-2">{m.title}</h1>
        <p className="font-mono mt-2 text-lg">{m.tagline}</p>
        <div className="flex flex-wrap gap-2 mt-4 font-mono text-xs uppercase">
          <span className="brutal-border bg-bone text-ink px-2 py-1">+{m.xp} XP</span>
          {m.badge && <span className="brutal-border bg-ink text-bone px-2 py-1">🏅 {m.badge.name}</span>}
          {completed && <span className="brutal-border bg-acid text-ink px-2 py-1">✓ COMPLETE</span>}
        </div>
      </header>

      <section>
        <h2 className="text-3xl mb-4">// LEARN</h2>
        <div className="space-y-3">
          {m.explainer.map((b, i) => {
            if (b.kind === "lead") return <p key={i} className="text-2xl font-display leading-tight">{b.text}</p>;
            if (b.kind === "para") return <p key={i} className="font-mono text-base">{b.text}</p>;
            if (b.kind === "list") return (
              <ul key={i} className="space-y-1">
                {b.items.map((it, j) => <li key={j} className="brutal-border bg-card px-3 py-2 font-mono text-sm">▸ {it}</li>)}
              </ul>
            );
            if (b.kind === "link") {
              const href = b.to === "mission" ? `/mission/${b.slug}` : b.to === "device" ? `/device/${b.slug}` : `/glossary#${b.slug}`;
              return <a key={i} href={href} className="brutal-border bg-volt text-bone inline-block px-3 py-2 font-mono text-xs uppercase brutal-press mr-2">→ {b.label}</a>;
            }
            if (b.kind === "callout") {
              const c = b.tone === "tip" ? "bg-acid" : b.tone === "warn" ? "bg-hot text-bone" : "bg-volt text-bone";
              const tag = b.tone === "tip" ? "TIP" : b.tone === "warn" ? "WARN" : "KEY";
              return (
                <div key={i} className={`${c} brutal-border p-4 brutal-shadow-sm`}>
                  <div className="font-mono text-xs uppercase">{tag}</div>
                  <div className="font-mono mt-1">{b.text}</div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </section>

      <section>
        <h2 className="text-3xl mb-4">// PLAY</h2>
        <Simulator type={m.sim.type} preset={m.sim.preset} />
      </section>

      <section>
        <h2 className="text-3xl mb-4">// QUIZ</h2>
        <Quiz qs={m.quiz} onComplete={onQuizDone} />
      </section>

      {completed && (
        <div className="brutal-border bg-ink text-bone p-6 brutal-shadow flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase">MISSION COMPLETE</div>
            <div className="font-display text-3xl">+{m.xp} XP {m.badge ? `· ${m.badge.name}` : ""}</div>
          </div>
          {next ? (
            <Link to="/mission/$slug" params={{ slug: next.slug }} className="brutal-border bg-acid text-ink px-5 py-3 font-display text-xl brutal-press">
              NEXT: {next.title} →
            </Link>
          ) : (
            <Link to="/profile" className="brutal-border bg-acid text-ink px-5 py-3 font-display text-xl brutal-press">VIEW PROFILE →</Link>
          )}
        </div>
      )}
    </div>
  );
}
