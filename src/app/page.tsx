import Navbar from "@/components/layout/Navbar";
import HomeHero from "@/components/HomeHero";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";

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

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Want to offer a ride instead?
        </h2>
        <p className="mt-4 text-lg text-slate-500">
          Create a sync route, share seats, and find great company for your daily commute.
        </p>
        <div className="mt-8">
          <Link
            href="/create-sync"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            Create Sync
          </Link>
        </div>
      </section>
    </main>
  );
}
