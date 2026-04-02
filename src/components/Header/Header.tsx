import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { useNavigate } from "react-router-dom";

import { HeaderProps } from "./header.interfaces";

import { TrashIcon } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";

export const Header = ({ onOpenClearAllModal }: HeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/login", { replace: true });
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
      </NavbarContent>
    </Navbar>
  );
};
