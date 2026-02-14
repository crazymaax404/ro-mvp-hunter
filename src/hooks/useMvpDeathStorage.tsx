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
  clearAllMvpRecords,
  getMvpDeathStorageKey,
  getStoredDeathTime,
  removeExpiredMvpRecords,
  setStoredDeathTime,
} from "@/utils/mvpDeathStorage";

type DeathTimesState = Record<string, Date | null>;

type MvpStorageContextValue = {
  deathTimes: DeathTimesState;
  setDeathTime: (mvpId: string, date: Date) => void;
  clearAllRegisters: () => void;
};

const MvpStorageContext = createContext<MvpStorageContextValue | null>(null);

const buildDeathTimes = (mvpList: MvpData[]): DeathTimesState => {
  const idToRespawnMax = Object.fromEntries(
    mvpList.map((m) => [m.id, m.respawnMax]),
  );

  removeExpiredMvpRecords(idToRespawnMax);

  const state: DeathTimesState = {};

  mvpList.forEach((mvp) => {
    state[mvp.id] = getStoredDeathTime(mvp.id);
  });

  return state;
};

export const MvpStorageProvider = ({
  children,
  list = mvpList,
}: {
  children: React.ReactNode;
  list?: MvpData[];
}) => {
  const [deathTimes, setDeathTimes] = useState<DeathTimesState>(() =>
    typeof window === "undefined" ? {} : buildDeathTimes(list),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const idToRespawnMax = Object.fromEntries(
      list.map((m) => [m.id, m.respawnMax]),
    );
    const interval = setInterval(() => {
      removeExpiredMvpRecords(idToRespawnMax);
      setDeathTimes((prev) => {
        const next = { ...prev };
        let changed = false;

        list.forEach((mvp) => {
          const key = getMvpDeathStorageKey(mvp.id);
          const stored =
            typeof window !== "undefined" ? localStorage.getItem(key) : null;
          const stillExists = stored !== null;

          if (prev[mvp.id] !== null && !stillExists) {
            next[mvp.id] = null;
            changed = true;
          } else if (stillExists) {
            const time = getStoredDeathTime(mvp.id);

            if (time !== prev[mvp.id]) {
              next[mvp.id] = time;
              changed = true;
            }
          }
        });

        return changed ? next : prev;
      });
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [list]);

  const setDeathTime = useCallback((mvpId: string, date: Date) => {
    setStoredDeathTime(mvpId, date);
    setDeathTimes((prev) => ({ ...prev, [mvpId]: date }));
  }, []);

  const clearAllRegisters = useCallback(() => {
    clearAllMvpRecords();
    setDeathTimes((prev) => {
      const next = { ...prev };

      Object.keys(next).forEach((id) => {
        next[id] = null;
      });

      return next;
    });
  }, []);

  const value = useMemo<MvpStorageContextValue>(
    () => ({ deathTimes, setDeathTime, clearAllRegisters }),
    [deathTimes, setDeathTime, clearAllRegisters],
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
