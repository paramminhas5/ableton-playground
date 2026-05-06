import { useState } from "react";

// A/B button — hold to bypass (hear A), release to engage processing (hear B).
export function ABCompare({ onBypass }: { onBypass: (b: boolean) => void }) {
  const [bypassed, setBypassed] = useState(false);
  const set = (b: boolean) => { setBypassed(b); onBypass(b); };
  return (
    <button
      onMouseDown={() => set(true)} onMouseUp={() => set(false)} onMouseLeave={() => set(false)}
      onTouchStart={() => set(true)} onTouchEnd={() => set(false)}
      onClick={() => set(!bypassed)}
      className={`brutal-border px-4 py-3 font-display text-xl brutal-press select-none ${bypassed ? "bg-hot text-bone" : "bg-acid"}`}
      title="Hold to bypass (hear dry signal)"
    >
      {bypassed ? "A · DRY" : "B · WET"}
    </button>
  );
}
