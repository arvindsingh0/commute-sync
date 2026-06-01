export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <h1 className="text-xl font-bold">CommuteSync</h1>

        <div className="flex items-center gap-6">
          <button>Dashboard</button>
          <button>Inbox</button>
          <button>Profile</button>
        </div>
      </div>
    </nav>
  );
}