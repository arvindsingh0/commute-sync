"use client";

import { useEffect, useState, use } from "react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { ArrowLeft, Check, X, Mail, Phone, Building2, User } from "lucide-react";

type Sender = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  company?: string;
  gender: string;
};

type SyncRequest = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  sender: Sender;
  createdAt: string;
  message?: string;
};

type SyncDetails = {
  id: string;
  fromLocation: string;
  toLocation: string;
  syncDate: string;
  departureTime: string;
  seatsRequired: number;
  acceptedSeats: number;
  status: string;
  requests: SyncRequest[];
};

export default function RequestsPage({
  params,
}: {
  params: Promise<{
    syncId: string;
  }>;
}) {
  const { syncId } = use(params);
  const [sync, setSync] = useState<SyncDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadRequests() {
    try {
      const response = await fetch(`/api/syncs/${syncId}/requests`);
      const data = await response.json();

      if (data.success) {
        setSync(data.sync);
      } else {
        setError(data.message || "Failed to load requests");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, [syncId]);

  async function handleAccept(requestId: string) {
    try {
      const response = await fetch(`/api/requests/${requestId}/accept`, {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        loadRequests();
      } else {
        alert(data.message || "Failed to accept request");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }

  async function handleReject(requestId: string) {
    try {
      const response = await fetch(`/api/requests/${requestId}/reject`, {
        method: "POST",
      });
      const data = await response.json();

      if (data.success) {
        loadRequests();
      } else {
        alert(data.message || "Failed to reject request");
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
        <div className="mb-8">
          <Link
            href="/my-syncs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Syncs
          </Link>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-700 shadow-sm">
            <p className="font-medium">{error}</p>
          </div>
        ) : !sync ? (
          <p className="text-center text-slate-500">Sync details not found.</p>
        ) : (
          <div className="space-y-8">
            {/* Header info */}
            <div className="border-b border-slate-100 pb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Route Requests
              </span>
              <h1 className="mt-1 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                {sync.fromLocation} → {sync.toLocation}
              </h1>
              <p className="mt-2 text-slate-500">
                {new Date(sync.departureTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })} on {new Date(sync.syncDate).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="mt-4 flex gap-6 text-sm text-slate-600">
                <div>
                  Seats filled:{" "}
                  <span className="font-bold text-slate-900 font-mono">
                    {sync.requests.filter((r) => r.status === "ACCEPTED").length}/{sync.seatsRequired}
                  </span>
                </div>
                <div>
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      sync.status === "OPEN"
                        ? "text-blue-600"
                        : sync.status === "FULL"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {sync.status}
                  </span>
                </div>
              </div>
            </div>

            {/* List of requests */}
            <div>
              <h2 className="mb-6 text-xl font-bold text-slate-900">
                Requests ({sync.requests.length})
              </h2>

              {sync.requests.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
                  <p className="text-slate-500">No requests received for this sync yet.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {sync.requests.map((request) => (
                    <div
                      key={request.id}
                      className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      <div className="space-y-4">
                        {/* Profile Header */}
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-600 text-lg">
                            {request.sender.name[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">
                              {request.sender.name}
                            </h3>
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400 capitalize">
                              <User className="h-3 w-3" />
                              {request.sender.gender.toLowerCase()}
                            </span>
                          </div>
                        </div>

                          {request.message && (
                            <div className="rounded-xl bg-slate-50 p-3 text-sm border border-slate-100">
                              <p className="font-semibold text-slate-700 mb-1">
                                Message
                              </p>

                              <p className="text-slate-600">
                                {request.message}
                              </p>
                            </div>
                          )}

                        {/* Contact & Company Details */}
                        <div className="space-y-2 text-sm text-slate-600">
                          {request.sender.company && (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-slate-400" />
                              <span>{request.sender.company}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <a
                              href={`mailto:${request.sender.email}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {request.sender.email}
                            </a>
                          </div>
                          {request.sender.phoneNumber && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-slate-400" />
                              <a
                                href={`tel:${request.sender.phoneNumber}`}
                                className="hover:text-blue-600 transition-colors"
                              >
                                {request.sender.phoneNumber}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Request Action Buttons */}
                      <div className="mt-6 border-t border-slate-50 pt-4 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400">
                            Requested {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {request.status === "PENDING" ? (
                            <>
                              {/* Reject button (Cross) */}
                              <button
                                onClick={() => handleReject(request.id)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition-all hover:bg-rose-100 active:scale-95"
                                title="Reject Request"
                              >
                                <X className="h-5 w-5" />
                              </button>
                              
                              {/* Accept button (Tick) */}
                              <button
                                onClick={() => handleAccept(request.id)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 transition-all hover:bg-emerald-100 active:scale-95"
                                title="Accept Request"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                            </>
                          ) : (
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                request.status === "ACCEPTED"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : "bg-rose-50 text-rose-700 border border-rose-100"
                              }`}
                            >
                              {request.status.toLowerCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
