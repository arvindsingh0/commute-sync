"use client";
import Navbar from "@/components/layout/Navbar";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
  
export default function CreateSyncPage() 
{
  const [womenOnly, setWomenOnly] = useState(false);
  const [fromLocation, setFromLocation] =
    useState("");

  const [userGender, setUserGender] =
  useState("");
  
  const [toLocation, setToLocation] =
    useState("");

   const [syncDate, setSyncDate] =
  useState(new Date().toISOString());

  const [departureTime, setDepartureTime] =
    useState("");

  const [seatsRequired, setSeatsRequired] =
    useState(1);

  const [notes, setNotes] =
    useState("");

  const [error, setError] =
    useState("");
    

  const [loading, setLoading] =
    useState(false);

    const router = useRouter();

    useEffect(() => {
     async function loadUser() {
     const response =
      await fetch("/api/me");

    const data =
      await response.json();

    if (data.success) {
      setUserGender(
        data.user.gender
      );
    }
   }
  loadUser();
}, []);


  const upcomingDays = Array.from(

  { length: 4 },

  (_, index) => {

    const date = new Date();

    date.setDate(

      date.getDate() + index

    );

    const label =

      index === 0

        ? "Today"

        : index === 1

        ? "Tomorrow"

        : date.toLocaleDateString(

            "en-US",

            {

              weekday: "short",

            }

          );
    
          
          

    return {

      value: date.toISOString().split("T")[0],

      label: `${date.getDate()} - ${label}`,

    };

  }

);

async function handleSubmit(
  e: React.FormEvent
) {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    const selectedDate =
      new Date(syncDate);

    const [hours, minutes] =
      departureTime.split(":");

    selectedDate.setHours(
      Number(hours),
      Number(minutes)
    );
      console.log(
  JSON.stringify({
    fromLocation,
    toLocation,
    syncDate,
    departureTime:
      selectedDate.toISOString(),
    seatsRequired,
    womenOnly,
    notes,
  }, null, 2)
);
    const response = await fetch(
      "/api/syncs",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          fromLocation,
          toLocation,

          syncDate,

          departureTime:
            selectedDate.toISOString(),

          seatsRequired,

          womenOnly,

          notes,
        }),
      }
    );

    const data =
      await response.json();
      console.log(data);

    if (!response.ok) {
      setError(
        data.message ??
          "Failed to create sync"
      );

      return;
    }

    router.push("/my-syncs");
  } catch {
    setError(
      "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
}
  
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Create a Sync
          </h1>

          <p className="mt-2 text-slate-600">
            Find commuters travelling on the same route.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lg">
                <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
            <div>
              <label className="mb-2 block font-medium">
                From
              </label>

                          <input
              type="text"
              value={fromLocation}
              onChange={(e) =>
                setFromLocation(e.target.value)
              }
              placeholder="Landmark, city, or address"
              className="w-full rounded-xl border p-4"
            />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                To
              </label>

              <input
                type="text"
                value={toLocation}
                onChange={(e) =>
                  setToLocation(e.target.value)
                }
                placeholder="Landmark, city, or address"
                className="w-full rounded-xl border p-4"
              />
            </div>
            

            <div className="grid gap-6 md:grid-cols-2">
                      <div>
          <label className="mb-2 block font-medium">
            Date
          </label>

          <select
            value={syncDate}
            onChange={(e) =>
              setSyncDate(e.target.value)
            }
            className="w-full rounded-xl border p-4"
          >
            {upcomingDays.map((day) => (
              <option
                key={day.value}
                value={day.value}
              >
                {day.label}
              </option>
            ))}
          </select>
        </div>

              <div>
                <label className="mb-2 block font-medium">
                  Departure Time
                </label>

                          <input
              type="time"
              value={departureTime}
              onChange={(e) =>
                setDepartureTime(e.target.value)
              }
              className="w-full rounded-xl border p-4"
            />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Available Seats
              </label>

                        <input
              type="number"
              min="1"
              max="6"
              value={seatsRequired}
              onChange={(e) =>
                setSeatsRequired(
                  Number(e.target.value)
                )
              }
              className="w-full rounded-xl border p-4"
            />
            </div>

 {userGender === "FEMALE" && (
  <div className="flex items-center justify-between rounded-xl border p-4">
    <span className="font-medium">
      Women Only
    </span>

    <button
      type="button"
      onClick={() =>
        setWomenOnly(
          !womenOnly
        )
      }
      className={`relative h-7 w-14 rounded-full transition ${
        womenOnly
          ? "bg-blue-600"
          : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
          womenOnly
            ? "left-8"
            : "left-1"
        }`}
      />
    </button>
  </div>
)}

            <div>
              <label className="mb-2 block font-medium">
                Notes
              </label>

             <textarea
  rows={4}
  value={notes}
  onChange={(e) =>
    setNotes(e.target.value)
  }
  className="w-full rounded-xl border p-4"
/>
            </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

                    <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 p-4 font-semibold text-white hover:bg-blue-700"
        >
          {loading
            ? "Creating..."
            : "Create Sync"}
        </button>

          </form>
        </div>
      </main>
    </>
  );
}