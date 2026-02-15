import { useState, useCallback, useMemo } from "react";

import DefaultLayout from "@/layouts/default";
import { MvpCard } from "@/components/MvpCard/MvpCard";
import { mvpList } from "@/data/mvps";
import { RegisterDeathModal } from "@/components/RegisterDeathModal/RegisterDeathModal";
import { LocationModal } from "@/components/LocationModal/LocationModal";
import { MvpData } from "@/interfaces";
import { getStoredMapPosition } from "@/utils";
import { useMvpDeathStorage } from "@/hooks/useMvpDeathStorage";
import { ClearAllDataModal } from "@/components/ClearAllDataModal";

export default function IndexPage() {
  const { deathTimes, setDeathTime } = useMvpDeathStorage();

  const { aliveList, deadList } = useMemo(() => {
    const alive: MvpData[] = [];
    const dead: MvpData[] = [];

    mvpList.forEach((mvp) => {
      if (deathTimes[mvp.id]) {
        dead.push(mvp);
      } else {
        alive.push(mvp);
      }
    });
    alive.sort((a, b) => a.level - b.level);
    dead.sort((a, b) => {
      const deathA = deathTimes[a.id]!.getTime();
      const deathB = deathTimes[b.id]!.getTime();
      const respawnAtA = deathA + a.respawnMin * 60000;
      const respawnAtB = deathB + b.respawnMin * 60000;

      return respawnAtA - respawnAtB;
    });

    return { aliveList: alive, deadList: dead };
  }, [deathTimes]);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedMvp, setSelectedMvp] = useState<MvpData>({} as MvpData);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  const handleRegisteredDeath = useCallback(
    (mvpId: string, deathTime: Date) => {
      setDeathTime(mvpId, deathTime);
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

  return (
    <DefaultLayout onOpenClearAllModal={handleOpenClearAllModal}>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
          {deadList.map((mvp) => (
            <MvpCard
              key={mvp.id}
              lastDeathTime={deathTimes[mvp.id]}
              mvp={mvp}
              onOpenLocationModal={() => handleOpenLocationModal(mvp)}
              onOpenRegisterModal={() => handleOpenRegisterModal(mvp)}
            />
          ))}
        </div>
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
        onRegistered={(deathTime) => {
          if (selectedMvp?.id) {
            handleRegisteredDeath(selectedMvp.id, deathTime);
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
