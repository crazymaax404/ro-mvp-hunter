import type { HeaderProps } from "@/components/Header/header.interfaces";

import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";

type DefaultLayoutProps = { children: React.ReactNode } & HeaderProps;

export default function DefaultLayout({
  children,
  onOpenClearAllModal,
  onlyGivePoints,
  onOnlyGivePointsChange,
  sortMode,
  onSortModeChange,
}: DefaultLayoutProps) {
  return (
    <div className="relative flex flex-col dark text-foreground bg-background">
      <Header
        onlyGivePoints={onlyGivePoints}
        sortMode={sortMode}
        onOnlyGivePointsChange={onOnlyGivePointsChange}
        onOpenClearAllModal={onOpenClearAllModal}
        onSortModeChange={onSortModeChange}
      />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
