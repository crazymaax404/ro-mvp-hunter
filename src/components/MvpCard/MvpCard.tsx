import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";

import { ClockIcon, SkullIcon } from "../icons";

import { MvpCardProps } from "./mvpCard.interfaces";

export const MvpCard = ({ mvp }: MvpCardProps) => {
  const { name, level, respawnMin, respawnMax, map, imageUrl } = mvp;

  return (
    <Card>
      <CardBody className="flex flex-row gap-4">
        <Image
          alt={name}
          className="bg-default-100 p-3 h-30 w-30 object-contain"
          src={imageUrl}
        />
        <div className="flex flex-col gap-1">
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
          <Button color="danger" startContent={<SkullIcon size={16} />}>
            Registrar Morte
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
