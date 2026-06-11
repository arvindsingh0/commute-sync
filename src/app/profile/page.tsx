"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";

type User = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  gender: string;
  company: string | null;
  profileImage: string | null;
  isVerified: boolean;
};

export default function ProfilePage() {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadProfile() {
      const response =
        await fetch("/api/me");

      const data =
        await response.json();

      if (data.success) {
        setUser(data.user);
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-8 text-4xl font-bold">
          My Profile
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : !user ? (
          <p>Unable to load profile.</p>
        ) : (
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <div className="mb-8 flex flex-col items-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-200 text-3xl font-bold">
                {user.name[0]}
              </div>

              <h2 className="mt-4 text-2xl font-semibold">
                {user.name}
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="font-medium">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Phone Number
                </p>

                <p className="font-medium">
                  {user.phoneNumber ??
                    "Not Added"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Gender
                </p>

                <p className="font-medium">
                  {user.gender}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Company
                </p>

                <p className="font-medium">
                  {user.company ??
                    "Not Added"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Verification Status
                </p>

                <p
                  className={`font-medium ${
                    user.isVerified
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {user.isVerified
                    ? "Verified"
                    : "Not Verified"}
                </p>
              </div>
            </div>

            <button className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700">
              Edit Profile
            </button>
          </div>
        )}
      </main>
    </>
  );
}