export interface MvpData {
  id: string;
  name: string;
  level: number;
  respawnMin: number;
  respawnMax: number;
  map: string;
  imageUrl: string;
}

export type RespawnStatus =
  | "far"
  | "half"
  | "near"
  | "window-active"
  | "respawned";

export type RespawnChipConfig = Record<
  RespawnStatus,
  {
    className: string;
    label: string;
  }
>;
