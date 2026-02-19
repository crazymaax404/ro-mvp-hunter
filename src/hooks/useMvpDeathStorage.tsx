import type { MvpDeathRecord } from "@/interfaces";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { MvpData } from "@/interfaces";
import { mvpList } from "@/data/mvps";
import {
  deleteAllDeaths,
  deleteDeath,
  fetchDeathsForUser,
  upsertDeath,
} from "@/lib/mvpDeathsSupabase";
import { useAuth } from "@/contexts/AuthContext";

const EXTRA_TIME_IN_DEAD_LIST_MS = 60 * 60 * 1000; // 1 hour

type DeathTimesState = Record<string, Date | null>;

type MvpStorageContextValue = {
  deathTimes: DeathTimesState;
  setDeathTime: (
    mvpId: string,
    date: Date,
    mapPosition?: { x: number; y: number } | null,
  ) => void;
  clearMvpRegister: (mvpId: string) => void;
  clearAllRegisters: () => void;
  getStoredMapPosition: (mvpId: string) => { x: number; y: number } | null;
  recordsLoading: boolean;
};

const MvpStorageContext = createContext<MvpStorageContextValue | null>(null);

function buildDeathTimesFromRecords(
  records: Record<string, MvpDeathRecord>,
  list: MvpData[],
): DeathTimesState {
  const now = Date.now();
  const idToRespawnMax = Object.fromEntries(
    list.map((m) => [m.id, m.respawnMax]),
  );
  const state: DeathTimesState = {};

  list.forEach((mvp) => {
    const record = records[mvp.id];

    if (!record) {
      state[mvp.id] = null;

      return;
    }
    const deathTime = new Date(record.deathTime).getTime();
    const respawnMaxMs = idToRespawnMax[mvp.id] * 60 * 1000;
    const removeAfterMs = respawnMaxMs + EXTRA_TIME_IN_DEAD_LIST_MS;

    if (now > deathTime + removeAfterMs) {
      state[mvp.id] = null;
    } else {
      state[mvp.id] = new Date(record.deathTime);
    }
  });

  return state;
}

export const MvpStorageProvider = ({
  children,
  list = mvpList,
}: {
  children: React.ReactNode;
  list?: MvpData[];
}) => {
  const { user } = useAuth();
  const [records, setRecords] = useState<Record<string, MvpDeathRecord>>({});
  const [recordsLoading, setRecordsLoading] = useState(true);

  const userId = user?.id ?? null;

  useEffect(() => {
    if (!userId) {
      setRecords({});
      setRecordsLoading(false);

      return;
    }
    setRecordsLoading(true);
    fetchDeathsForUser(userId)
      .then(setRecords)
      .catch(() => setRecords({}))
      .finally(() => setRecordsLoading(false));
  }, [userId]);

  const deathTimes = useMemo(
    () => buildDeathTimesFromRecords(records, list),
    [records, list],
  );

  const setDeathTime = useCallback(
    async (
      mvpId: string,
      date: Date,
      mapPosition?: { x: number; y: number } | null,
    ) => {
      if (!userId) return;
      try {
        await upsertDeath(userId, mvpId, date, mapPosition ?? undefined);
        setRecords((prev) => ({
          ...prev,
          [mvpId]: {
            deathTime: date.toISOString(),
            mapPosition: mapPosition ?? undefined,
          },
        }));
      } catch {
        // Optionally surface error to UI
      }
    },
    [userId],
  );

  const clearMvpRegister = useCallback(
    async (mvpId: string) => {
      if (!userId) return;
      try {
        await deleteDeath(userId, mvpId);
        setRecords((prev) => {
          const next = { ...prev };

          delete next[mvpId];

          return next;
        });
      } catch {
        // Optionally surface error to UI
      }
    },
    [userId],
  );

  const clearAllRegisters = useCallback(async () => {
    if (!userId) return;
    try {
      await deleteAllDeaths(userId);
      setRecords({});
    } catch {
      // Optionally surface error to UI
    }
  }, [userId]);

  const getStoredMapPosition = useCallback(
    (mvpId: string): { x: number; y: number } | null => {
      return records[mvpId]?.mapPosition ?? null;
    },
    [records],
  );

  const value = useMemo<MvpStorageContextValue>(
    () => ({
      deathTimes,
      setDeathTime,
      clearMvpRegister,
      clearAllRegisters,
      getStoredMapPosition,
      recordsLoading,
    }),
    [
      deathTimes,
      setDeathTime,
      clearMvpRegister,
      clearAllRegisters,
      getStoredMapPosition,
      recordsLoading,
    ],
  );

  return (
    <MvpStorageContext.Provider value={value}>
      {children}
    </MvpStorageContext.Provider>
  );
};

export const useMvpDeathStorage = (): MvpStorageContextValue => {
  const ctx = useContext(MvpStorageContext);

  if (!ctx) {
    throw new Error(
      "useMvpDeathStorage must be used within MvpStorageProvider",
    );
  }

  return ctx;
};
