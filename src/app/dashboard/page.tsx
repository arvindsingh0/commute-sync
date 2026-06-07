import Navbar from "@/components/layout/Navbar";
import HomeHero from "@/components/HomeHero";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <HomeHero />

      <SearchBar />

      <section className="bg-blue-50 py-4">
        <h2 className="text-center text-lg font-semibold text-blue-900">
          One Sync, Endless Possibilities
        </h2>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-4xl font-bold text-slate-900">
            Recent Routes
          </h2>

                  <Link
          href="/create-sync"
          className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          Create Sync
        </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <button className="rounded-2xl bg-white p-6 text-left shadow-md hover:shadow-lg">
            IT Park → Clement Town
          </button>

          <button className="rounded-2xl bg-white p-6 text-left shadow-md hover:shadow-lg">
            GMS Road → Doon University
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <button className="rounded-2xl bg-white p-6 text-left shadow-md hover:shadow-lg">
            IT Park → Clement Town
          </button>

          <button className="rounded-2xl bg-white p-6 text-left shadow-md hover:shadow-lg">
            GMS Road → Doon University
          </button>

          <button className="rounded-2xl bg-white p-6 text-left shadow-md hover:shadow-lg">
            Rajpur Road → IT Park
          </button>
        </div>
      </section>
    </main>
  );
}