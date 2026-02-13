export const getMvpDeathStorageKey = (mvpId: string): string => {
  return `mvp-death-${mvpId}`;
};

export const getStoredDeathTime = (mvpId: string): Date | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(getMvpDeathStorageKey(mvpId));

    if (!raw) return null;

    const time = new Date(raw);

    return Number.isNaN(time.getTime()) ? null : time;
  } catch {
    return null;
  }
};

export const setStoredDeathTime = (mvpId: string, date: Date): void => {
  try {
    localStorage.setItem(getMvpDeathStorageKey(mvpId), date.toISOString());
  } catch {}
};
