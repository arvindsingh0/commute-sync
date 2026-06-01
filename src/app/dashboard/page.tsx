import AppShell from "@/components/layout/AppShell";

export default function DashboardPage() {
  return (
    <AppShell>
      <div>
        <h1 className="text-3xl font-bold">
          Find Your Commute Sync
        </h1>

        <p className="mt-2 text-gray-500">
          Connect with commuters heading the same way.
        </p>
      </div>
    </AppShell>
  );
}