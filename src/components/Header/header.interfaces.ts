export type MvpSortMode =
  | "level"
  | "points"
  | "respawnMin"
  | "competitiveness"
  | "findability";

export interface HeaderProps {
  onOpenClearAllModal?: () => void;
  onlyGivePoints: boolean;
  onOnlyGivePointsChange: (value: boolean) => void;
  sortMode: MvpSortMode;
  onSortModeChange: (mode: MvpSortMode) => void;
}
