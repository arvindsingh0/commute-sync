import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/dashboard"
          className="text-xl font-bold"
        >
          CommuteSync
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/inbox">Inbox</Link>
          <Link href="/profile">Profile</Link>
        </div>
      </div>
    </nav>
  );
}