import type { MvpSortMode } from "@/components/Header/header.interfaces";

import { useState, useCallback, useMemo } from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";

import DefaultLayout from "@/layouts/default";
import { MvpCard } from "@/components/MvpCard/MvpCard";
import { mvpList } from "@/data/mvps";
import { RegisterDeathModal } from "@/components/RegisterDeathModal/RegisterDeathModal";
import { LocationModal } from "@/components/LocationModal/LocationModal";
import { MvpData } from "@/interfaces";
import { useMvpDeathStorage } from "@/hooks/useMvpDeathStorage";
import { ClearAllDataModal } from "@/components/ClearAllDataModal";

const mvpIndexById = new Map(
  mvpList.map((mvp, index) => [mvp.id, index] as const),
);

function compareAliveMvps(a: MvpData, b: MvpData, mode: MvpSortMode): number {
  const tie = () =>
    (mvpIndexById.get(a.id) ?? 0) - (mvpIndexById.get(b.id) ?? 0);

  switch (mode) {
    case "level":
      return tie();
    case "points": {
      const c = a.points - b.points;

      return c !== 0 ? c : tie();
    }
    case "respawnMin": {
      const c = a.respawnMin - b.respawnMin;

      return c !== 0 ? c : tie();
    }
    case "competitiveness": {
      const c = a.competitiveness - b.competitiveness;

      return c !== 0 ? c : tie();
    }
    case "findability": {
      const c = a.findability - b.findability;

      return c !== 0 ? c : tie();
    }
  }
}

export default function IndexPage() {
  const {
    deathTimes,
    setDeathTime,
    getStoredMapPosition,
    recordsLoading,
    lastError,
    clearError,
  } = useMvpDeathStorage();

  const [onlyGivePoints, setOnlyGivePoints] = useState(false);
  const [sortMode, setSortMode] = useState<MvpSortMode>("level");

  const { aliveList, deadList } = useMemo(() => {
    const alive: MvpData[] = [];
    const dead: MvpData[] = [];

    const source = onlyGivePoints
      ? mvpList.filter((mvp) => mvp.givePoints !== false)
      : mvpList;

    source.forEach((mvp) => {
      if (deathTimes[mvp.id]) {
        dead.push(mvp);
      } else {
        alive.push(mvp);
      }
    });
    alive.sort((a, b) => compareAliveMvps(a, b, sortMode));
    dead.sort((a, b) => {
      const deathA = deathTimes[a.id]!.getTime();
      const deathB = deathTimes[b.id]!.getTime();
      const respawnAtA = deathA + a.respawnMin * 60000;
      const respawnAtB = deathB + b.respawnMin * 60000;

      return respawnAtA - respawnAtB;
    });

    return { aliveList: alive, deadList: dead };
  }, [deathTimes, onlyGivePoints, sortMode]);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedMvp, setSelectedMvp] = useState<MvpData>({} as MvpData);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  const handleRegisteredDeath = useCallback(
    (
      mvpId: string,
      deathTime: Date,
      mapPosition?: { x: number; y: number },
    ) => {
      setDeathTime(mvpId, deathTime, mapPosition);
    },
    [setDeathTime],
  );

  const handleOpenRegisterModal = useCallback((mvp: MvpData) => {
    setSelectedMvp(mvp);
    setIsRegisterModalOpen(true);
  }, []);

  const handleOpenLocationModal = useCallback((mvp: MvpData) => {
    setSelectedMvp(mvp);
    setIsLocationModalOpen(true);
  }, []);

  const handleCloseRegisterModal = useCallback(() => {
    setIsRegisterModalOpen(false);
  }, []);

  const handleCloseLocationModal = useCallback(() => {
    setIsLocationModalOpen(false);
  }, []);

  const handleOpenClearAllModal = useCallback(() => {
    setIsClearAllModalOpen(true);
  }, []);

  const storedMapPosition = selectedMvp
    ? getStoredMapPosition(selectedMvp.id)
    : null;

  const layoutHeaderProps = {
    onOpenClearAllModal: handleOpenClearAllModal,
    onlyGivePoints,
    onOnlyGivePointsChange: setOnlyGivePoints,
    sortMode,
    onSortModeChange: setSortMode,
  };

  if (recordsLoading) {
    return (
      <DefaultLayout {...layoutHeaderProps}>
        <div className="flex flex-1 items-center justify-center py-12">
          <p className="text-default-500">Carregando registros...</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout {...layoutHeaderProps}>
      {lastError && (
        <div
          className="mx-auto mt-4 flex max-w-6xl items-center justify-between gap-2 rounded-lg border border-danger-500/50 bg-danger-500/10 px-4 py-3 text-danger"
          role="alert"
        >
          <p className="flex-1 text-sm">{lastError}</p>
          <button
            aria-label="Fechar"
            className="shrink-0 rounded px-2 py-1 text-sm underline hover:no-underline"
            type="button"
            onClick={clearError}
          >
            Fechar
          </button>
        </div>
      )}
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Accordion variant="bordered">
          <AccordionItem
            key="dead"
            classNames={{
              title: "text-lg font-bold",
              content:
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl p-6",
            }}
            title="Mortos"
          >
            {deadList.map((mvp) => (
              <MvpCard
                key={mvp.id}
                lastDeathTime={deathTimes[mvp.id]}
                mvp={mvp}
                onOpenLocationModal={() => handleOpenLocationModal(mvp)}
                onOpenRegisterModal={() => handleOpenRegisterModal(mvp)}
              />
            ))}
          </AccordionItem>
        </Accordion>
        <div className="w-full max-w-6xl border-b border-neutral-500/60 border-dashed my-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
          {aliveList.map((mvp) => (
            <MvpCard
              key={mvp.id}
              lastDeathTime={deathTimes[mvp.id]}
              mvp={mvp}
              onOpenLocationModal={() => handleOpenLocationModal(mvp)}
              onOpenRegisterModal={() => handleOpenRegisterModal(mvp)}
            />
          ))}
        </div>
      </section>

      <RegisterDeathModal
        isOpen={isRegisterModalOpen}
        mvp={selectedMvp}
        onClose={handleCloseRegisterModal}
        onRegistered={(deathTime, mapPosition) => {
          if (selectedMvp?.id) {
            handleRegisteredDeath(selectedMvp.id, deathTime, mapPosition);
          }
        }}
      />

      {storedMapPosition && selectedMvp && (
        <LocationModal
          isOpen={isLocationModalOpen}
          mvp={selectedMvp}
          position={storedMapPosition}
          onClose={handleCloseLocationModal}
        />
      )}

      <ClearAllDataModal
        isClearAllModalOpen={isClearAllModalOpen}
        setIsClearAllModalOpen={setIsClearAllModalOpen}
      />
    </DefaultLayout>
  );
}
