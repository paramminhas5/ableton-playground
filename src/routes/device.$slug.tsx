import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { deviceBySlug, DEVICES } from "@/content/devices";
import { DeviceLab } from "@/components/DeviceLab";
import { DeviceExplainers } from "@/components/DeviceExplainers";
import { getDeviceExplainer } from "@/content/device-explainers";

export const Route = createFileRoute("/device/$slug")({
  head: ({ params }) => {
    const d = deviceBySlug(params.slug);
    return { meta: [
      { title: `${d?.name ?? "Device"} — Device Lab` },
      { name: "description", content: d?.tagline ?? "" },
    ]};
  },
  component: DevicePage,
  notFoundComponent: () => <div className="p-12 font-mono">Device not found.</div>,
});

function DevicePage() {
  const { slug } = Route.useParams();
  const d = deviceBySlug(slug);
  if (!d) throw notFound();
  const idx = DEVICES.findIndex((x) => x.slug === slug);
  const prev = DEVICES[idx - 1];
  const next = DEVICES[idx + 1];
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-6">
      <Link to="/devices" className="font-mono text-xs uppercase underline">← all devices</Link>

      <header className="brutal-border bg-acid p-6 brutal-shadow">
        <div className="font-mono text-xs uppercase">{d.category} · DEVICE LAB</div>
        <h1 className="text-5xl md:text-7xl mt-2">{d.name}</h1>
        <p className="font-mono mt-2 text-lg">{d.tagline}</p>
      </header>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="brutal-border bg-card p-4 brutal-shadow-sm">
          <div className="font-mono text-xs uppercase mb-2">WHAT IT DOES</div>
          <p className="font-mono text-sm">{d.what}</p>
        </div>
        <div className="brutal-border bg-card p-4 brutal-shadow-sm">
          <div className="font-mono text-xs uppercase mb-2">HOW IT WORKS</div>
          <p className="font-mono text-sm">{d.how}</p>
        </div>
      </section>

      <DeviceLab
        title={d.name}
        subtitle={d.tagline}
        deviceLabel={d.name.toUpperCase()}
        factory={d.factory}
        params={d.params}
        presets={d.presets}
        listenFor={d.listenFor}
        signalFlow={d.signalFlow}
      />

      {/* Deep Explanations */}
      <div className="brutal-border bg-card p-6 space-y-4">
        <DeviceExplainers blocks={getDeviceExplainer(slug)} />
      </div>

      <div className="flex justify-between gap-3">
        {prev ? (
          <Link to="/device/$slug" params={{ slug: prev.slug }} className="brutal-border bg-bone px-4 py-3 font-mono uppercase brutal-press">← {prev.name}</Link>
        ) : <span />}
        {next ? (
          <Link to="/device/$slug" params={{ slug: next.slug }} className="brutal-border bg-acid px-4 py-3 font-mono uppercase brutal-press">{next.name} →</Link>
        ) : <span />}
      </div>
    </div>
  );
}
