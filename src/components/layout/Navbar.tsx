import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-4xl font-bold text-slate-900"
        >
          CommuteSync
        </Link>

        <button className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-100">
          Login / Signup
        </button>
      </div>
    </nav>
  );
}