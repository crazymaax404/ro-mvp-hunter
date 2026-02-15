import type {
  CompetitivenessScore,
  FindabilityScore,
  MvpData,
  MvpInfoStatus,
} from "@/interfaces";

import { useMemo } from "react";

const COMPETITIVENESS_CONFIG: Record<
  CompetitivenessScore,
  { message: string; colorClass: string }
> = {
  0: {
    message: "A galera esquece que existe",
    colorClass: "bg-green-500",
  },
  1: {
    message: "As vezes encontra vivo",
    colorClass: "bg-yellow-500",
  },
  2: {
    message: "Toda hora ta morto",
    colorClass: "bg-red-500",
  },
};

const FINDABILITY_CONFIG: Record<
  FindabilityScore,
  { message: string; colorClass: string }
> = {
  0: {
    message: "Muito fácil",
    colorClass: "bg-green-500",
  },
  1: {
    message: "É chato de achar",
    colorClass: "bg-orange-500",
  },
  2: {
    message: "É horrível encontra-lo",
    colorClass: "bg-red-500",
  },
};

export const useMvpInfoStatus = (
  mvp: Pick<MvpData, "competitiveness" | "findability" | "hasTeleport">,
): MvpInfoStatus => {
  return useMemo(() => {
    const comp = COMPETITIVENESS_CONFIG[mvp.competitiveness];
    const enc = FINDABILITY_CONFIG[mvp.findability];

    return {
      competitiveness: {
        ...comp,
        level: mvp.competitiveness,
      },
      findability: {
        ...enc,
        level: mvp.findability,
      },
      hasTeleport: {
        hasTeleport: mvp.hasTeleport,
        colorClass: mvp.hasTeleport ? "bg-blue-500" : "bg-amber-700",
        label: mvp.hasTeleport ? "Tem teleporte" : "Sem teleporte",
      },
    };
  }, [mvp.competitiveness, mvp.findability, mvp.hasTeleport]);
};
