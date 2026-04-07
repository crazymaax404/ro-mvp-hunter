import type { SharedSelection } from "@heroui/system";
import type { HeaderProps, MvpSortMode } from "./header.interfaces";

import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { useNavigate } from "react-router-dom";

import { TrashIcon } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";

const SORT_LABELS: Record<MvpSortMode, string> = {
  level: "Level",
  points: "Pontos",
  respawnMin: "Tempo de Respawn",
  competitiveness: "Competitividade",
  findability: "Localizabilidade",
};

const SORT_MODES = Object.keys(SORT_LABELS) as MvpSortMode[];

const isMvpSortMode = (key: string): key is MvpSortMode => {
  return SORT_MODES.includes(key as MvpSortMode);
};

export const Header = ({
  onOpenClearAllModal,
  onlyGivePoints,
  onOnlyGivePointsChange,
  sortMode,
  onSortModeChange,
}: HeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  const handleSortSelection = (keys: SharedSelection) => {
    if (keys === "all") return;
    const selected = [...keys][0];

    if (typeof selected === "string" && isMvpSortMode(selected)) {
      onSortModeChange(selected);
    }
  };

  return (
    <Navbar
      isBordered
      className="p-4"
      position="sticky"
      style={{ ["--navbar-height"]: "unset" } as React.CSSProperties}
    >
      <NavbarContent className="flex-row items-center justify-between w-full">
        <NavbarBrand className="flex-col items-start gap-1">
          <Link color="foreground" href="/">
            <p className="font-bold">⚔️ MVP Tracker</p>
          </Link>
          <p className="text-sm text-default-500">
            Acompanhe seus MVPs e receba notificações quando eles estiverem
            prontos.
          </p>
        </NavbarBrand>
        <div className="flex flex-row items-center gap-4">
          <NavbarItem className="flex flex-col items-start gap-2">
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <Button
                  className="min-w-[12rem] justify-between"
                  endContent={
                    <span aria-hidden className="opacity-60">
                      ▾
                    </span>
                  }
                  size="sm"
                  variant="bordered"
                >
                  Ordenar: {SORT_LABELS[sortMode]}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Ordenar MVPs vivos"
                selectedKeys={new Set([sortMode])}
                selectionMode="single"
                onSelectionChange={handleSortSelection}
              >
                {SORT_MODES.map((mode) => (
                  <DropdownItem key={mode}>{SORT_LABELS[mode]}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-default-600 select-none">
              <input
                checked={onlyGivePoints}
                className="h-4 w-4 shrink-0 rounded border-default-400 bg-default-100 text-primary accent-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                type="checkbox"
                onChange={(e) => onOnlyGivePointsChange(e.target.checked)}
              />
              Mostrar somente Mvps que dão pontos
            </label>
          </NavbarItem>
          <NavbarItem className="flex flex-row items-center gap-2">
            <Tooltip closeDelay={0} content="Apagar todos os registros">
              <Button
                isIconOnly
                className="text-danger min-w-unit-10 min-h-unit-10"
                color="danger"
                variant="flat"
                onPress={onOpenClearAllModal}
              >
                <TrashIcon size={20} />
              </Button>
            </Tooltip>
            <Button
              color="default"
              size="sm"
              variant="flat"
              onPress={handleSignOut}
            >
              Sair
            </Button>
          </NavbarItem>
        </div>
      </NavbarContent>
    </Navbar>
  );
};
