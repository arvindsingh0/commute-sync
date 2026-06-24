"use client";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { CheckCircle2, MapPin, Calendar, Clock, Users, ArrowRight } from "lucide-react";

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
  requests?: {
    status: string;
  }[];
};

function SearchPageInner() {
  const searchParams = useSearchParams();
  const [syncs, setSyncs] = useState<Sync[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSyncs() {
      const from = searchParams.get("from");
      const to = searchParams.get("to");
      const date = searchParams.get("date");

      const response = await fetch(
        `/api/syncs/search?from=${encodeURIComponent(
          from ?? ""
        )}&to=${encodeURIComponent(
          to ?? ""
        )}&date=${date}`
      );

      const data = await response.json();

      if (data.success) {
        setSyncs(data.syncs);
      }

      setLoading(false);
    }

    loadSyncs();
  }, [searchParams]);

  async function sendRequest(syncId: string) {
    try {
      const response = await fetch(`/api/syncs/${syncId}/request`, {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setSyncs((prevSyncs) =>
          prevSyncs.map((sync) =>
            sync.id === syncId
              ? { ...sync, requests: [{ status: "PENDING" }] }
              : sync
          )
        );
      } else {
        alert(data.message || "Failed to send request");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Available Syncs
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            Find and join fellow commuters matching your route.
          </p>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : syncs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-600">
              No syncs found for this route.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Try searching for a different date or location.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {syncs.map((sync) => {
              const hasRequested = sync.requests && sync.requests.length > 0;
              const remainingSeats = sync.seatsRequired - sync.acceptedSeats;

              return (
                <div
                  key={sync.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="space-y-4">
                      {/* Route Header */}
                      <div className="flex items-center flex-wrap gap-2 text-xl font-bold text-slate-900">
                        <span className="flex items-center gap-1.5 text-blue-600">
                          <MapPin className="h-5 w-5" />
                          {sync.fromLocation}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                        <span className="flex items-center gap-1.5 text-indigo-600">
                          <MapPin className="h-5 w-5" />
                          {sync.toLocation}
                        </span>
                      </div>

                      {/* Creator Info */}
                        <Link
                          href={`/users/${sync.creator.id}`}
                          className="inline-flex items-center gap-2.5 rounded-lg transition hover:bg-slate-50 p-1"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                            {sync.creator.name[0]?.toUpperCase() || "C"}
                          </div>

                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {sync.creator.name}

                              {sync.creator.isVerified && (
                                <span className="ml-1 text-xs font-semibold text-blue-500">
                                  ✓ Verified
                                </span>
                              )}
                            </p>
                            
                          </div>
                        </Link>

                      {/* Details Grid */}
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>
                            {new Date(sync.syncDate).toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span>
                            {new Date(sync.departureTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span>
                            {remainingSeats} {remainingSeats === 1 ? "seat" : "seats"} left
                          </span>
                        </div>
                      </div>

                      {/* Notes */}
                      {sync.notes ? (
                        <div className="rounded-xl bg-slate-50 p-3.5 text-sm text-slate-600 border border-slate-100">
                          <span className="font-semibold text-slate-700">Note: </span>
                          {sync.notes}
                        </div>
                      ) : null}
                    </div>

                    {/* Action Side */}
                    <div className="flex items-center sm:self-center">
                      {hasRequested ? (
                        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-emerald-700 font-semibold border border-emerald-100 shadow-sm animate-fade-in">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                          <span>Req Sent</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => sendRequest(sync.id)}
                          className="w-full sm:w-auto rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-250 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
                        >
                          Request to Join
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}