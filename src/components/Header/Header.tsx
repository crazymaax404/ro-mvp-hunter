import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";

import { HeaderProps } from "./header.interfaces";

import { SearchIcon, TrashIcon } from "@/components/icons";

export const Header = ({ onOpenClearAllModal }: HeaderProps) => {
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <Navbar
      isBordered
      className="p-4"
      position="sticky"
      style={{ ["--navbar-height"]: "unset" } as React.CSSProperties}
    >
      <NavbarContent className="flex-col items-start gap-4">
        <NavbarBrand className="max-w-fit flex-col items-start gap-1">
          <Link color="foreground" href="/">
            <p className="font-bold">⚔️ MVP Tracker</p>
          </Link>
          <p className="text-sm text-default-500">
            Acompanhe seus MVPs e receba notificações quando eles estiverem
            prontos.
          </p>
        </NavbarBrand>
        <NavbarItem className="w-full flex flex-row items-center gap-2">
          {searchInput}
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
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
