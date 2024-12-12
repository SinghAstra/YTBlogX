import { Features } from "@/components/home/features";
import { Hero } from "@/components/home/hero";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <section className="w-full py-20 bg-secondary/20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features for Content Creation
          </h2>
          <Features />
        </div>
      </section>
    </main>
  );
}
