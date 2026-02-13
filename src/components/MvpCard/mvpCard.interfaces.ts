import { MvpData } from "@/interfaces";

export interface MvpCardProps {
  mvp: MvpData;
  lastDeathTime: Date | null;
  onOpenLocationModal: () => void;
  onOpenRegisterModal: () => void;
}
