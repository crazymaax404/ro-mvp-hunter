import { useState, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { TimeInput } from "@heroui/date-input";
import { Time } from "@internationalized/date";

import { ClockIcon, LocationPinIcon, SkullIcon } from "../icons";

import { RegisterDeathModalProps } from "./registerDeathModal.interfaces";

const TOMB_IMAGE_URL = "https://browiki.org/images/2/26/MvP2.gif";

export const RegisterDeathModal = ({
  mvp,
  isOpen,
  onClose,
  onRegistered,
}: RegisterDeathModalProps) => {
  const { id, name, map, mapUrl } = mvp;
  const [timeValue, setTimeValue] = useState<Time | null>(null);
  const [pendingPosition, setPendingPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleMapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPendingPosition({ x, y });
  }, []);

  const handleNow = useCallback(() => {
    const now = new Date();

    setTimeValue(new Time(now.getHours(), now.getMinutes()));
  }, []);

  const handleDeath = useCallback(() => {
    const now = new Date();
    let deathTime: Date;

    if (timeValue) {
      deathTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        timeValue.hour,
        timeValue.minute,
      );

      // If the chosen time is in the future, assume the death occurred the previous day.
      if (deathTime.getTime() > now.getTime()) {
        deathTime = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1,
          timeValue.hour,
          timeValue.minute,
        );
      }
    } else {
      deathTime = now;
    }

    onRegistered(deathTime, pendingPosition ?? undefined);
    onClose();
    setTimeValue(null);
    setPendingPosition(null);
  }, [id, timeValue, pendingPosition, onRegistered, onClose]);

  return (
    <Modal
      classNames={{
        base: "bg-background dark text-foreground",
      }}
      isOpen={isOpen}
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Registrar Morte — {name}
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-default-500">
            Informe o horário da morte e clique no mapa para marcar a posição.
            Sem horário, será usado o momento atual.
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ClockIcon size={16} />
              <span className="text-sm font-medium">Horário da morte</span>
            </div>
            <div className="flex gap-2">
              <TimeInput
                aria-label="Horário da morte"
                classNames={{ base: "flex-1" }}
                hourCycle={24}
                labelPlacement="outside"
                placeholderValue={new Time(0, 0)}
                value={timeValue ?? undefined}
                onChange={(v) => setTimeValue(v)}
              />
              <Button size="sm" variant="flat" onPress={handleNow}>
                Agora
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <LocationPinIcon size={16} />
              <span className="text-sm font-medium">
                Posição no mapa — {map}
              </span>
            </div>
            <div
              className="relative w-full cursor-crosshair overflow-hidden rounded-lg bg-default-100"
              role="button"
              tabIndex={0}
              onClick={handleMapClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                }
              }}
            >
              <img
                alt={`Mapa ${map}`}
                className="block max-h-80 w-full object-contain"
                draggable={false}
                src={mapUrl}
              />
              {pendingPosition && (
                <img
                  alt="Tumba"
                  className="pointer-events-none absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 object-contain"
                  src={TOMB_IMAGE_URL}
                  style={{
                    left: `${pendingPosition.x}%`,
                    top: `${pendingPosition.y}%`,
                  }}
                />
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            startContent={<SkullIcon size={16} />}
            onPress={handleDeath}
          >
            Morreu!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
