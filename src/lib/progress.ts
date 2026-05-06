// Local progress store, no auth required. Sync hook ready for cloud later.
import { useEffect, useState, useCallback } from "react";

const KEY = "ableton.school.progress.v1";

export type Progress = {
  xp: number;
  streakDays: number;
  lastDay: string | null;
  completedMissions: Record<string, { score: number; at: number }>;
  badges: string[];
};

const empty = (): Progress => ({
  xp: 0, streakDays: 0, lastDay: null, completedMissions: {}, badges: [],
});

const read = (): Progress => {
  if (typeof localStorage === "undefined") return empty();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) };
  } catch { return empty(); }
};

const write = (p: Progress) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("progress:update"));
};

export const useProgress = () => {
  const [p, setP] = useState<Progress>(empty());
  useEffect(() => {
    setP(read());
    const h = () => setP(read());
    window.addEventListener("progress:update", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("progress:update", h);
      window.removeEventListener("storage", h);
    };
  }, []);

  const completeMission = useCallback((slug: string, xp: number, score: number, badge?: string) => {
    const cur = read();
    const today = new Date().toISOString().slice(0, 10);
    let streak = cur.streakDays;
    if (cur.lastDay !== today) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      const yKey = y.toISOString().slice(0, 10);
      streak = cur.lastDay === yKey ? streak + 1 : 1;
    }
    const already = cur.completedMissions[slug];
    const next: Progress = {
      ...cur,
      xp: cur.xp + (already ? 0 : xp),
      lastDay: today,
      streakDays: streak,
      completedMissions: { ...cur.completedMissions, [slug]: { score, at: Date.now() } },
      badges: badge && !cur.badges.includes(badge) ? [...cur.badges, badge] : cur.badges,
    };
    write(next);
  }, []);

  const reset = useCallback(() => write(empty()), []);

  return { progress: p, completeMission, reset };
};
