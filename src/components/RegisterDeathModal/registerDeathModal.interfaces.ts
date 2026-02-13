import { MvpData } from "@/interfaces";

export interface RegisterDeathModalProps {
  mvp: MvpData;
  isOpen: boolean;
  onClose: () => void;
  onRegistered: (deathTime: Date) => void;
}
