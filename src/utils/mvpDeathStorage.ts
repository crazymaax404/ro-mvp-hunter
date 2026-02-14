import { MvpDeathRecord } from "@/interfaces";

const STORAGE_PREFIX = "mvp-death-";

export const getMvpDeathStorageKey = (mvpId: string): string => {
  return `${STORAGE_PREFIX}${mvpId}`;
};

const parseRecord = (raw: string | null): MvpDeathRecord | null => {
  if (!raw) return null;

  try {
    const data = JSON.parse(raw) as unknown;

    if (
      !data ||
      typeof data !== "object" ||
      typeof (data as MvpDeathRecord).deathTime !== "string"
    ) {
      return null;
    }

    const record = data as MvpDeathRecord;
    const time = new Date(record.deathTime);

    if (Number.isNaN(time.getTime())) return null;

    return record;
  } catch {
    return null;
  }
};

export const getStoredDeathTime = (mvpId: string): Date | null => {
  if (typeof window === "undefined") return null;

  const record = parseRecord(
    localStorage.getItem(getMvpDeathStorageKey(mvpId)),
  );

  return record ? new Date(record.deathTime) : null;
};

export const getStoredMapPosition = (
  mvpId: string,
): {
  x: number;
  y: number;
} | null => {
  if (typeof window === "undefined") return null;

  const record = parseRecord(
    localStorage.getItem(getMvpDeathStorageKey(mvpId)),
  );

  return record?.mapPosition ?? null;
};

export const getStoredDeathRecord = (mvpId: string): MvpDeathRecord | null => {
  if (typeof window === "undefined") return null;

  return parseRecord(localStorage.getItem(getMvpDeathStorageKey(mvpId)));
};

export const setStoredDeathTime = (mvpId: string, date: Date): void => {
  try {
    const key = getMvpDeathStorageKey(mvpId);
    const existing = parseRecord(localStorage.getItem(key));
    const record: MvpDeathRecord = {
      deathTime: date.toISOString(),
      mapPosition: existing?.mapPosition,
    };

    localStorage.setItem(key, JSON.stringify(record));
  } catch {}
};

export const setStoredDeathRecord = (
  mvpId: string,
  record: MvpDeathRecord,
): void => {
  try {
    localStorage.setItem(getMvpDeathStorageKey(mvpId), JSON.stringify(record));
  } catch {}
};

export const setStoredMapPosition = (
  mvpId: string,
  position: { x: number; y: number },
): void => {
  try {
    const key = getMvpDeathStorageKey(mvpId);
    const existing = parseRecord(localStorage.getItem(key));

    if (!existing) return;

    const record: MvpDeathRecord = {
      ...existing,
      mapPosition: position,
    };

    localStorage.setItem(key, JSON.stringify(record));
  } catch {}
};

export const removeExpiredMvpRecords = (
  mvpIdToRespawnMax: Record<string, number>,
): void => {
  if (typeof window === "undefined") return;

  const now = Date.now();

  for (const mvpId of Object.keys(mvpIdToRespawnMax)) {
    const key = getMvpDeathStorageKey(mvpId);
    const record = parseRecord(localStorage.getItem(key));

    if (!record) continue;

    const deathTime = new Date(record.deathTime).getTime();
    const respawnMaxMs = mvpIdToRespawnMax[mvpId] * 60 * 1000;

    if (now > deathTime + respawnMaxMs) {
      localStorage.removeItem(key);
    }
  }
};

export const clearAllMvpRecords = (): void => {
  if (typeof window === "undefined") return;

  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key?.startsWith(STORAGE_PREFIX)) keysToRemove.push(key);
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
};
