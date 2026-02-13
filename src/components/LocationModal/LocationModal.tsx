import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

import { LocationModalProps } from "./locationModal.interfaces";

const TOMB_IMAGE_URL = "https://browiki.org/images/2/26/MvP2.gif";

export const LocationModal = ({
  mvp,
  position,
  isOpen,
  onClose,
}: LocationModalProps) => {
  return (
    <Modal
      classNames={{
        base: "bg-background dark text-foreground p-3",
      }}
      isOpen={isOpen}
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader>Localização da morte — {mvp.name}</ModalHeader>
        <ModalBody>
          <p className="text-sm text-default-500">
            Mapa {mvp.map} — posição registrada da última morte.
          </p>
          <div className="relative w-full overflow-hidden rounded-lg bg-default-100">
            <img
              alt={`Mapa ${mvp.map}`}
              className="block max-h-96 w-full object-contain"
              draggable={false}
              src={mvp.mapUrl}
            />
            <img
              alt="Tumba"
              className="pointer-events-none absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 object-contain"
              src={TOMB_IMAGE_URL}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
            />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
