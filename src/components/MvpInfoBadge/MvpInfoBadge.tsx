import { Tooltip } from "@heroui/tooltip";

import { MvpInfoBadgeProps } from "./mvpInfoBadge.interfaces";

export const MvpInfoBadge = ({
  icon,
  content,
  colorClass,
}: MvpInfoBadgeProps) => {
  return (
    <Tooltip
      className="bg-default-100"
      closeDelay={0}
      content={content}
      placement="top"
    >
      <span className={`${colorClass} p-1 rounded-full inline-flex  `}>
        {icon}
      </span>
    </Tooltip>
  );
};
