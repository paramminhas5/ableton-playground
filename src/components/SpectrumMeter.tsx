import { useEffect, useRef } from "react";

export function SpectrumMeter({ analyser, height = 80, bars = 32 }: { analyser: AnalyserNode | null; height?: number; bars?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!analyser || !ref.current) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    let raf = 0;
    const draw = () => {
      analyser.getByteFrequencyData(data);
      const W = canvas.width, H = canvas.height;
      ctx.fillStyle = "#F5F1E8"; ctx.fillRect(0, 0, W, H);
      const step = Math.floor(data.length / bars);
      const bw = W / bars - 2;
      for (let i = 0; i < bars; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) sum += data[i * step + j];
        const v = sum / step / 255;
        const h = v * H;
        ctx.fillStyle = v > 0.85 ? "#FF2E88" : v > 0.5 ? "#C6FF00" : "#000";
        ctx.fillRect(i * (bw + 2) + 1, H - h, bw, h);
      }
      ctx.strokeStyle = "#000"; ctx.lineWidth = 3; ctx.strokeRect(1.5, 1.5, W - 3, H - 3);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [analyser, bars]);
  return <canvas ref={ref} width={480} height={height} className="w-full brutal-border bg-bone" style={{ height }} />;
}
