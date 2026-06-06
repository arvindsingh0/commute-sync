import Navbar from "@/components/layout/Navbar";
import HomeHero from "@/components/HomeHero";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="relative">
        <HomeHero />

        <div className="landing-search-overlap">
          <SearchBar />
        </div>
      </div>

      <section className="possibility-strip">
        <h2 className="possibility-strip-title">
          One Sync, Endless Possibilities
        </h2>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Recent Routes
          </h2>

          <button className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700">
            Create Sync
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <button className="rounded-lg bg-white p-6 text-left shadow-md transition hover:shadow-lg">
            IT Park → Clement Town
          </button>

          <button className="rounded-lg bg-white p-6 text-left shadow-md transition hover:shadow-lg">
            GMS Road → Doon University
          </button>

          <button className="rounded-lg bg-white p-6 text-left shadow-md transition hover:shadow-lg">
            Rajpur Road → IT Park
          </button>
        </div>
      </section>
    </main>
  );
}
