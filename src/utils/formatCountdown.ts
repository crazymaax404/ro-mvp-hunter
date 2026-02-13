export function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return "00:00:00";

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);

  return [h, m, s].map((n) => n.toString().padStart(2, "0")).join(":");
}
