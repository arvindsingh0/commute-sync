import Navbar from "./Navbar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl p-6">
        {children}
      </main>
    </>
  );
}
