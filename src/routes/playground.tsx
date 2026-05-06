import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Simulator, SIM_LIST } from "@/components/sims/Simulator";
import type { SimType } from "@/content/types";

export const Route = createFileRoute("/playground")({
  head: () => ({ meta: [{ title: "Playground — ABLETON.SCHOOL" }, { name: "description", content: "Free play with all simulators." }]}),
  component: Playground,
});

function Playground() {
  const [sim, setSim] = useState<SimType>("drum-pad");
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-6">
      <h1 className="text-5xl md:text-7xl">// PLAYGROUND</h1>
      <div className="flex flex-wrap gap-2">
        {SIM_LIST.map((s) => (
          <button key={s.type} onClick={() => setSim(s.type)} className={`${s.color} brutal-border px-3 py-2 font-mono text-xs uppercase brutal-press ${sim === s.type ? "outline outline-4 outline-ink" : ""}`}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="brutal-border bg-card p-4 brutal-shadow"><Simulator type={sim} /></div>
    </div>
  );
}
