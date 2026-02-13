import DefaultLayout from "@/layouts/default";
import { MvpCard } from "@/components/MvpCard/MvpCard";
import { mvpList } from "@/data/mvps";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mvpList.map((mvp) => (
            <MvpCard key={mvp.id} mvp={mvp} />
          ))}
        </div>
      </section>
    </DefaultLayout>
  );
}
