"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";

type Sync = {
  id: string;
  fromLocation: string;
  toLocation: string;
  syncDate: string;
  departureTime: string;
  seatsRequired: number;
  acceptedSeats: number;
  status: string;
};

export default function MySyncsPage() {
  const [syncs, setSyncs] = useState<Sync[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSyncs() {
      const response = await fetch(
        "/api/syncs/my"
      );

      const data =
        await response.json();

      if (data.success) {
        setSyncs(data.syncs);
      }

      setLoading(false);
    }

    loadSyncs();
  }, []);

  const upcomingSyncs =
    syncs.filter(
      (sync) =>
        new Date(sync.syncDate) >=
        new Date(
          new Date().setHours(
            0,
            0,
            0,
            0
          )
        )
    );

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-8 text-4xl font-bold">
          My Syncs
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : upcomingSyncs.length === 0 ? (
          <p>
            You haven't created any syncs
            yet.
          </p>
        ) : (
          <div className="grid gap-6">
            {upcomingSyncs.map(
              (sync) => (
                <div
                  key={sync.id}
                  className="rounded-2xl border p-6 shadow-sm"
                >
                  <h2 className="text-xl font-semibold">
                    {sync.fromLocation}
                    {" → "}
                    {sync.toLocation}
                  </h2>

                  <p className="mt-2">
                    Date:{" "}
                    {new Date(
                      sync.syncDate
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    Time:{" "}
                    {new Date(
                      sync.departureTime
                    ).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute:
                          "2-digit",
                      }
                    )}
                  </p>

                  <p>
                    Seats:{" "}
                    {sync.acceptedSeats}
                    /
                    {sync.seatsRequired}
                  </p>

                  <p>
                    Status:{" "}
                    {sync.status}
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </main>
    </>
  );
}