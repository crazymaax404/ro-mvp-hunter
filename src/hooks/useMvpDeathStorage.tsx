import type { MvpDeathRecord } from "@/interfaces";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { MvpData } from "@/interfaces";
import { mvpList } from "@/data/mvps";
import {
  deleteAllDeaths,
  deleteDeath,
  fetchAllDeaths,
  upsertDeath,
} from "@/lib/mvpDeathsSupabase";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const EXTRA_TIME_IN_DEAD_LIST_MS = 60 * 60 * 1000; // 1 hour

const STORAGE_ERROR_MESSAGE =
  "Sessão expirada ou erro de rede. Tente novamente ou faça login.";

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
  lastError: string | null;
  clearError: () => void;
};

const isAuthError = (err: unknown): boolean => {
  if (!err || typeof err !== "object") return false;
  const e = err as { status?: number; message?: string };

  if (e.status === 401) return true;
  const msg = (e.message ?? "").toLowerCase();

  return (
    msg.includes("jwt") ||
    msg.includes("session") ||
    msg.includes("auth") ||
    msg.includes("token")
  );
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

type RealtimePayloadRow = {
  id?: string;
  mvp_id?: string;
  death_time?: string;
  map_position?: { x: number; y: number } | null;
};

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
  const [lastError, setLastError] = useState<string | null>(null);
  const idToMvpIdRef = useRef<Record<string, string>>({});

  const isAuthenticated = !!user?.id;

  useEffect(() => {
    if (!isAuthenticated) {
      setRecords({});
      idToMvpIdRef.current = {};
      setRecordsLoading(false);

      return;
    }
    setRecordsLoading(true);
    fetchAllDeaths()
      .then(({ records: r, idToMvpId }) => {
        setRecords(r);
        idToMvpIdRef.current = idToMvpId;
      })
      .catch(() => setRecords({}))
      .finally(() => setRecordsLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const channel = supabase
      .channel("mvp-deaths-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "mvp_deaths",
        },
        (payload: {
          eventType: "INSERT" | "UPDATE" | "DELETE";
          new?: RealtimePayloadRow;
          old?: RealtimePayloadRow;
        }) => {
          if (payload.eventType === "DELETE" && payload.old) {
            const rowId = payload.old.id ?? "";
            const mvpId = payload.old.mvp_id ?? idToMvpIdRef.current[rowId];

            if (mvpId) {
              const nextIdMap = { ...idToMvpIdRef.current };

              delete nextIdMap[rowId];
              idToMvpIdRef.current = nextIdMap;
              setRecords((prev) => {
                const next = { ...prev };

                delete next[mvpId];

                return next;
              });
            }

            return;
          }

          const row = payload.new;

          if (!row?.mvp_id || !row?.death_time) return;

          const mvpId = row.mvp_id as string;
          const deathTime = row.death_time as string;

          if (row.id) {
            idToMvpIdRef.current = {
              ...idToMvpIdRef.current,
              [row.id]: mvpId,
            };
          }
          setRecords((prev) => ({
            ...prev,
            [mvpId]: {
              deathTime,
              mapPosition:
                row.map_position && typeof row.map_position === "object"
                  ? row.map_position
                  : undefined,
            },
          }));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  const deathTimes = useMemo(
    () => buildDeathTimesFromRecords(records, list),
    [records, list],
  );

  const runWithAuthRetry = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | null> => {
      await supabase.auth.getSession();
      try {
        return await fn();
      } catch (err) {
        if (isAuthError(err)) {
          const { error: refreshErr } = await supabase.auth.refreshSession();

          if (refreshErr) {
            setLastError(STORAGE_ERROR_MESSAGE);

            return null;
          }
          try {
            return await fn();
          } catch (retryErr) {
            setLastError(STORAGE_ERROR_MESSAGE);

            return null;
          }
        }
        setLastError(STORAGE_ERROR_MESSAGE);

        return null;
      }
    },
    [],
  );

  const setDeathTime = useCallback(
    async (
      mvpId: string,
      date: Date,
      mapPosition?: { x: number; y: number } | null,
    ) => {
      if (!isAuthenticated) return;
      setLastError(null);
      const ok = await runWithAuthRetry(() =>
        upsertDeath(mvpId, date, mapPosition ?? undefined),
      );

      if (ok !== null) {
        setRecords((prev) => ({
          ...prev,
          [mvpId]: {
            deathTime: date.toISOString(),
            mapPosition: mapPosition ?? undefined,
          },
        }));
      }
    },
    [isAuthenticated, runWithAuthRetry],
  );

  const clearMvpRegister = useCallback(
    async (mvpId: string) => {
      if (!isAuthenticated) return;
      setLastError(null);
      const ok = await runWithAuthRetry(() => deleteDeath(mvpId));

      if (ok !== null) {
        setRecords((prev) => {
          const next = { ...prev };

          delete next[mvpId];

          return next;
        });
      }
    },
    [isAuthenticated, runWithAuthRetry],
  );

  const clearAllRegisters = useCallback(async () => {
    if (!isAuthenticated) return;
    setLastError(null);
    const ok = await runWithAuthRetry(() => deleteAllDeaths());

    if (ok !== null) {
      setRecords({});
      idToMvpIdRef.current = {};
    }
  }, [isAuthenticated, runWithAuthRetry]);

  const getStoredMapPosition = useCallback(
    (mvpId: string): { x: number; y: number } | null => {
      return records[mvpId]?.mapPosition ?? null;
    },
    [records],
  );

  const clearError = useCallback(() => setLastError(null), []);

  const value = useMemo<MvpStorageContextValue>(
    () => ({
      deathTimes,
      setDeathTime,
      clearMvpRegister,
      clearAllRegisters,
      getStoredMapPosition,
      recordsLoading,
      lastError,
      clearError,
    }),
    [
      deathTimes,
      setDeathTime,
      clearMvpRegister,
      clearAllRegisters,
      getStoredMapPosition,
      recordsLoading,
      lastError,
      clearError,
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
