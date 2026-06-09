"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

type Sync = {
  id: string;
  fromLocation: string;
  toLocation: string;
  syncDate: string;
  departureTime: string;
  seatsRequired: number;
  acceptedSeats: number;
  notes?: string;
  creator: {
    id: string;
    name: string;
    isVerified: boolean;
  };
};

export default function SearchPage() {
  const searchParams =
    useSearchParams();

  const [syncs, setSyncs] =
    useState<Sync[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadSyncs() {
      const from =
        searchParams.get("from");

      const to =
        searchParams.get("to");

      const date =
        searchParams.get("date");

      const response =
        await fetch(
          `/api/syncs/search?from=${encodeURIComponent(
            from ?? ""
          )}&to=${encodeURIComponent(
            to ?? ""
          )}&date=${date}`
        );

      const data =
        await response.json();

      if (data.success) {
        setSyncs(data.syncs);
      }

      setLoading(false);
    }

    loadSyncs();
  }, [searchParams]);

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-8 text-4xl font-bold">
          Available Syncs
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : syncs.length === 0 ? (
          <p>
            No syncs found for this route.
          </p>
        ) : (
          <div className="grid gap-6">
            {syncs.map((sync) => (
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
                  Created by:{" "}
                  {sync.creator.name}
                </p>

                <p>
                  Departure:{" "}
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
                  Seats Filled:{" "}
                  {sync.acceptedSeats}
                  /
                  {sync.seatsRequired}
                </p>

                {sync.notes ? (
                  <p className="mt-2 text-sm text-slate-600">
                    {sync.notes}
                  </p>
                ) : null}

                <button
                  className="mt-4 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white"
                >
                  Request to Join
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}