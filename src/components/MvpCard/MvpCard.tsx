import { useState, useEffect, useCallback } from "react";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";

import { ClockIcon, LocationPinIcon, SkullIcon, TrashIcon } from "../icons";

import { MvpCardProps } from "./mvpCard.interfaces";

import { RespawnChipConfig, RespawnStatus } from "@/interfaces";
import { formatCountdown, formatTime, getStoredMapPosition } from "@/utils";
import { useMvpDeathStorage } from "@/hooks/useMvpDeathStorage";

export const MvpCard = ({
  mvp,
  lastDeathTime,
  onOpenLocationModal,
  onOpenRegisterModal,
}: MvpCardProps) => {
  const { clearMvpRegister } = useMvpDeathStorage();
  const { id, name, level, respawnMin, respawnMax, map, imageUrl } = mvp;

  const [now, setNow] = useState(() => new Date());

  const chipConfig: RespawnChipConfig = {
    far: {
      label: "Longe",
      className: "bg-[hsl(var(--respawn-red))] text-white border-transparent",
    },
    half: {
      label: "Metade",
      className:
        "bg-[hsl(var(--respawn-yellow))] text-black border-transparent",
    },
    near: {
      label: "Perto",
      className: "bg-[hsl(var(--respawn-green))] text-white border-transparent",
    },
    "window-active": {
      label: "Janela Ativa",
      className:
        "border-2 border-[hsl(var(--respawn-window))] text-white animate-pulse-badge",
    },
    respawned: {
      label: "RENASCEU!",
      className:
        "bg-[hsl(var(--respawn-green))] text-white border-transparent animate-pulse-badge",
    },
  };

  useEffect(() => {
    if (!lastDeathTime) return;

    const interval = setInterval(() => setNow(new Date()), 1000);

    return () => clearInterval(interval);
  }, [lastDeathTime]);

  const storedMapPosition = lastDeathTime ? getStoredMapPosition(id) : null;

  const elapsedMinutes = lastDeathTime
    ? (now.getTime() - lastDeathTime.getTime()) / 60000
    : 0;

  const windowStart = lastDeathTime
    ? new Date(lastDeathTime.getTime() + respawnMin * 60000)
    : null;
  const windowEnd = lastDeathTime
    ? new Date(lastDeathTime.getTime() + respawnMax * 60000)
    : null;

  let countdownSeconds = 0;

  if (lastDeathTime) {
    if (elapsedMinutes < respawnMin) {
      const remainingMinutes = respawnMin - elapsedMinutes;

      countdownSeconds = Math.max(0, Math.floor(remainingMinutes * 60));
    } else if (elapsedMinutes < respawnMax) {
      countdownSeconds = Math.max(
        0,
        Math.floor((respawnMax - elapsedMinutes) * 60),
      );
    }
  }

  const getRespawnStatus = useCallback(
    (
      elapsedMinutes: number,
      respawnMin: number,
      respawnMax: number,
    ): RespawnStatus => {
      if (elapsedMinutes >= respawnMax) return "respawned";
      if (elapsedMinutes >= respawnMin) return "window-active";

      const remaining = respawnMin - elapsedMinutes;
      const percentRemaining = remaining / respawnMin;

      if (percentRemaining > 0.5) return "far";
      if (percentRemaining > 0.1) return "half";

      return "near";
    },
    [],
  );

  const status: RespawnStatus | null =
    lastDeathTime && elapsedMinutes <= respawnMax
      ? getRespawnStatus(elapsedMinutes, respawnMin, respawnMax)
      : lastDeathTime && elapsedMinutes > respawnMax
        ? "respawned"
        : null;

  return (
    <Card>
      <CardBody className="flex flex-row gap-4">
        <div className="flex flex-col gap-2">
          <Image
            alt={name}
            className="bg-default-100 p-3 h-30 w-30 object-contain"
            src={imageUrl}
          />
          {lastDeathTime && storedMapPosition && (
            <Button
              size="sm"
              startContent={<LocationPinIcon size={14} />}
              variant="flat"
              onPress={onOpenLocationModal}
            >
              Ver localização
            </Button>
          )}
          {lastDeathTime && (
            <Tooltip
              closeDelay={0}
              content="Remover registro deste MVP"
              placement="right"
            >
              <Button
                isIconOnly
                className="text-danger min-w-unit-8 min-h-unit-8"
                color="danger"
                size="sm"
                variant="flat"
                onPress={() => clearMvpRegister(id)}
              >
                <TrashIcon size={16} />
              </Button>
            </Tooltip>
          )}
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h1 className="text-lg font-bold">{name}</h1>
          <div>
            <p className="text-sm text-default-500">
              Lv. {level} · {map}
            </p>
            <div className="flex items-center gap-2">
              <ClockIcon size={16} />
              <p className="text-sm text-default-500">
                {respawnMin}~{respawnMax} min
              </p>
            </div>
          </div>

          {lastDeathTime && (
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2 flex-wrap">
                {status && (
                  <Chip
                    classNames={{ base: chipConfig[status].className }}
                    size="sm"
                  >
                    {chipConfig[status].label}
                  </Chip>
                )}
                {status !== "respawned" && (
                  <span className="text-lg font-bold tabular-nums">
                    {formatCountdown(countdownSeconds)}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-0.5 text-sm text-default-500">
                {windowStart && windowEnd && (
                  <p>
                    Janela: {formatTime(windowStart)} - {formatTime(windowEnd)}
                  </p>
                )}
                <p>Última morte: {formatTime(lastDeathTime)}</p>
              </div>
            </div>
          )}

          <Button
            color="danger"
            startContent={<SkullIcon size={16} />}
            onPress={onOpenRegisterModal}
          >
            Registrar Morte
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
