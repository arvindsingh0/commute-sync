"use client";

import { ArrowRightLeft, CalendarDays, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";

function getJourneyDateOptions() {
  const today = new Date();

  return Array.from({ length: 4 }, (_, offset) => {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    const value = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    const day = String(date.getDate());
    const label =
      offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : date.toLocaleDateString(undefined, { weekday: "short" });

    return { value, day, label };
  });
}

export default function SearchBar() {
  const dateOptions = useMemo(() => getJourneyDateOptions(), []);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [journeyDate, setJourneyDate] = useState(dateOptions[0]?.value ?? "");

  const swapRoute = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="landing-search-container">
      <form className="landing-search-card" onSubmit={(event) => event.preventDefault()}>
        <div className="landing-search-grid">
          <label className="landing-search-field">
            <MapPin className="landing-search-icon text-blue-600" />
            <span className="landing-search-field-body">
              <span className="landing-search-label">
                From
              </span>
              <input
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                className="landing-search-input"
                placeholder="Starting Point"
              />
            </span>
          </label>

          <div className="landing-swap-wrap">
            <button
              type="button"
              aria-label="Swap route"
              className="landing-swap-button"
              onClick={swapRoute}
            >
              <ArrowRightLeft className="landing-search-icon" />
            </button>
          </div>

          <label className="landing-search-field">
            <MapPin className="landing-search-icon text-slate-600" />
            <span className="landing-search-field-body">
              <span className="landing-search-label">
                To
              </span>
              <input
                value={to}
                onChange={(event) => setTo(event.target.value)}
                className="landing-search-input"
                placeholder="Ending Point"
              />
            </span>
          </label>

          <label className="landing-search-field">
            <CalendarDays className="landing-search-icon text-slate-600" />
            <span className="landing-search-field-body">
              <span className="landing-search-label">
                Date of Journey
              </span>
              <select
                value={journeyDate}
                onChange={(event) => setJourneyDate(event.target.value)}
                className="landing-date-select"
              >
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.day} - {option.label}
                  </option>
                ))}
              </select>
            </span>
          </label>

          <button type="submit" className="landing-search-button">
            <Search className="landing-search-icon" />
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
