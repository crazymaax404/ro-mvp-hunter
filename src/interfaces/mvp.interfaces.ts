export type CompetitivenessScore = 0 | 1 | 2;

export type FindabilityScore = 0 | 1 | 2;

export interface MvpData {
  id: string;
  name: string;
  level: number;
  respawnMin: number;
  respawnMax: number;
  map: string;
  imageUrl: string;
  mapUrl: string;
  competitiveness: CompetitivenessScore;
  findability: FindabilityScore;
  hasTeleport: boolean;
  teleportTip?: string;
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

export interface MvpDeathRecord {
  deathTime: string;
  mapPosition?: { x: number; y: number };
}

export interface MvpInfoStatus {
  competitiveness: {
    message: string;
    colorClass: string;
    level: CompetitivenessScore;
  };
  findability: {
    message: string;
    colorClass: string;
    level: FindabilityScore;
  };
  hasTeleport: {
    hasTeleport: boolean;
    colorClass: string;
    label: string;
  };
}
