import { createFileRoute, Link } from "@tanstack/react-router";
import { DEVICES } from "@/content/devices";

export const Route = createFileRoute("/devices/")({
  head: () => ({ meta: [
    { title: "Device Lab — ABLETON.SCHOOL" },
    { name: "description", content: "Real, working device emulations. Hear what every parameter does." },
  ]}),
  component: DevicesIndex,
});

function DevicesIndex() {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      <div className="brutal-border bg-volt text-bone p-6 brutal-shadow mb-6">
        <div className="font-mono text-xs uppercase">// DEVICE LAB</div>
        <h1 className="text-5xl md:text-7xl mt-2">EVERY KNOB, AUDIBLE.</h1>
        <p className="font-mono mt-2">Working DSP. Real source loops. A/B compare on every device. This is where you learn what each parameter actually does to sound.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEVICES.map((d) => (
          <Link key={d.slug} to="/devices/$slug" params={{ slug: d.slug }}
            className="brutal-border bg-card p-5 brutal-shadow-sm brutal-press block">
            <div className="font-mono text-xs uppercase">{d.category}</div>
            <div className="font-display text-2xl mt-1">{d.name}</div>
            <div className="font-mono text-sm mt-2">{d.tagline}</div>
            <div className="font-mono text-xs uppercase mt-4 brutal-border bg-acid inline-block px-2 py-1">OPEN LAB →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
