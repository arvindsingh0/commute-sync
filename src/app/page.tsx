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


    </main>
  );
}
