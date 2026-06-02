import Navbar from "@/components/layout/Navbar";
import SyncCard from "@/components/sync/SyncCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl p-6">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Find commuters heading your way
          </h1>

          <p className="mt-2 text-muted-foreground">
            Save money by coordinating rides with professionals
            traveling on similar routes.
          </p>
        </div>

        {/* Search Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Input placeholder="Leaving From" />
              <Input placeholder="Going To" />
              <Input placeholder="Departure Time" />

              <div className="flex gap-2">
                <Button className="flex-1">
                  Search
                </Button>

                <Button variant="outline">
                  Create Sync
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Feed */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <SyncCard />
          <SyncCard />
          <SyncCard />
          <SyncCard />
          <SyncCard />
          <SyncCard />
        </div>
      </main>
    </>
  );
}