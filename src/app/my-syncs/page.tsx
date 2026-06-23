"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { MapPin, Calendar, Clock, Users, ArrowRight } from "lucide-react";

type Sync = {
  id: string;
  fromLocation: string;
  toLocation: string;
  syncDate: string;
  departureTime: string;
  seatsRequired: number;
  acceptedSeats: number;
  status: string;
  requests?: {
    id: string;
    status: string;
  }[];
};

type SentRequest = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  sync: {
    id: string;
    fromLocation: string;
    toLocation: string;
    syncDate: string;
    departureTime: string;
    creator: {
      id: string;
      name: string;
      isVerified: boolean;
    };
  };
};

export default function MySyncsPage() {
  const [syncs, setSyncs] = useState<Sync[]>([]);
  const [myRequests, setMyRequests] = useState<SentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"created" | "requested">("created");

  useEffect(() => {
    async function loadData() {
      try {
        const [syncsRes, requestsRes] = await Promise.all([
          fetch("/api/syncs/my"),
          fetch("/api/requests/my"),
        ]);

        const syncsData = await syncsRes.json();
        const requestsData = await requestsRes.json();

        if (syncsData.success) {
          setSyncs(syncsData.syncs);
        }
        if (requestsData.success) {
          setMyRequests(requestsData.requests);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter both syncs and requests so that they are hidden if the departure time has passed
  const upcomingSyncs = syncs.filter(
    (sync) => new Date(sync.departureTime) >= new Date()
  );

  const upcomingRequests = myRequests.filter(
    (req) => new Date(req.sync.departureTime) >= new Date()
  );

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Title Section */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              My Commutes
            </h1>
            <p className="mt-2 text-lg text-slate-500">
              Manage your created routes and requests sent to other syncs.
            </p>
          </div>
          <Link
            href="/create-sync"
            className="self-start rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            Create Sync
          </Link>
        </div>

        {/* Section Tabs */}
        <div className="mb-8 flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("created")}
            className={`pb-4 px-6 font-semibold text-sm transition-all border-b-2 outline-none cursor-pointer ${
              activeTab === "created"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Created
          </button>
          <button
            onClick={() => setActiveTab("requested")}
            className={`pb-4 px-6 font-semibold text-sm transition-all border-b-2 outline-none cursor-pointer ${
              activeTab === "requested"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Requested
          </button>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : activeTab === "created" ? (
          /* CREATED TAB */
          upcomingSyncs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
              <p className="text-lg font-medium text-slate-600">
                You haven't created any syncs yet.
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Share your commute route by creating a new sync.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {upcomingSyncs.map((sync) => {
                const pendingRequestsCount = sync.requests
                  ? sync.requests.filter((r) => r.status === "PENDING").length
                  : 0;

                return (
                  <div
                    key={sync.id}
                    className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
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
                              {sync.acceptedSeats} / {sync.seatsRequired} seats filled
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              sync.status === "OPEN"
                                ? "bg-blue-50 text-blue-700 border border-blue-100"
                                : sync.status === "FULL"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}
                          >
                            {sync.status}
                          </span>
                        </div>
                      </div>

                      {/* Action Panel */}
                      <div className="flex items-center sm:self-center">
                        <div className="relative inline-block">
                          {/* Red counter badge positioned at the top left corner of the requests button */}
                          <span className="absolute -top-2.5 -left-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-extrabold text-white shadow-sm ring-2 ring-white">
                            {pendingRequestsCount}
                          </span>

                          <Link
                            href={`/my-syncs/${sync.id}/requests`}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 active:scale-[0.98]"
                          >
                            requests
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* REQUESTED TAB */
          upcomingRequests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
              <p className="text-lg font-medium text-slate-600">
                You haven't requested to join any syncs yet.
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Search and send requests to join active rides.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {upcomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="space-y-4">
                      {/* Route Header */}
                      <div className="flex items-center flex-wrap gap-2 text-xl font-bold text-slate-900">
                        <span className="flex items-center gap-1.5 text-blue-600">
                          <MapPin className="h-5 w-5" />
                          {req.sync.fromLocation}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                        <span className="flex items-center gap-1.5 text-indigo-600">
                          <MapPin className="h-5 w-5" />
                          {req.sync.toLocation}
                        </span>
                      </div>

                      {/* Creator Info */}
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                          {req.sync.creator.name[0]?.toUpperCase() || "C"}
                        </div>
                        <p className="text-sm text-slate-600">
                          Created by <span className="font-semibold text-slate-700">{req.sync.creator.name}</span>
                        </p>
                      </div>

                      {/* Details Grid */}
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>
                            {new Date(req.sync.syncDate).toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span>
                            {new Date(req.sync.departureTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Panel */}
                    <div className="flex items-center sm:self-center">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold border ${
                          req.status === "PENDING"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : req.status === "ACCEPTED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}
                      >
                        {req.status.charAt(0) + req.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </>
  );
}