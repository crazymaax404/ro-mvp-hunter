import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";

export default function DefaultLayout({
  children,
  onOpenClearAllModal,
}: {
  children: React.ReactNode;
  onOpenClearAllModal?: () => void;
}) {
  return (
    <div className="relative flex flex-col dark text-foreground bg-background">
      <Header onOpenClearAllModal={onOpenClearAllModal} />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
