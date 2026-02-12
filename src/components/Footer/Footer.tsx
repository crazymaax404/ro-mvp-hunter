import { Link } from "@heroui/link";
import { Navbar, NavbarContent, NavbarItem } from "@heroui/navbar";

import { GithubIcon } from "../icons";

import { mvpList } from "@/data/mvps";
import { siteConfig } from "@/config/site";

export const Footer = () => {
  const mvpCount = mvpList.length;

  return (
    <footer className="w-full flex items-center justify-center py-3">
      <Navbar maxWidth="xl">
        <p className="text-sm text-default-500">
          {mvpCount} MVPs cadastrados · Dados salvos localmente
        </p>
        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        >
          <NavbarItem className="hidden sm:flex gap-2">
            <Link isExternal href={siteConfig.links.github} title="GitHub">
              <GithubIcon className="text-default-500" />
            </Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </footer>
  );
};
