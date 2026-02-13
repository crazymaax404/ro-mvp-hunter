import { MvpData } from "@/interfaces";

export interface LocationModalProps {
  mvp: MvpData;
  position: { x: number; y: number };
  isOpen: boolean;
  onClose: () => void;
}
