import { useState, useCallback } from "react";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mvpList.map((mvp) => (
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
