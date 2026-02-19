import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";

import { ClearAllDataModalProps } from "./clearAllDataModal.interfaces";

import { useMvpDeathStorage } from "@/hooks";

export const ClearAllDataModal = ({
  isClearAllModalOpen,
  setIsClearAllModalOpen,
}: ClearAllDataModalProps) => {
  const { clearAllRegisters } = useMvpDeathStorage();

  const handleConfirmClearAll = async () => {
    await clearAllRegisters();
    setIsClearAllModalOpen(false);
  };

  return (
    <Modal
      isOpen={isClearAllModalOpen}
      placement="center"
      onOpenChange={setIsClearAllModalOpen}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Apagar todos os registros?
        </ModalHeader>
        <ModalBody>
          <p>
            Esta ação irá apagar o timer de morte de todos os MVPs. Você terá
            que registrar as mortes novamente. Deseja continuar?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={() => setIsClearAllModalOpen(false)}>
            Cancelar
          </Button>
          <Button color="danger" onPress={handleConfirmClearAll}>
            Apagar tudo
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
