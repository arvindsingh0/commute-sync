"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Login failed"
        );
        return;
      }

      window.location.href =
        "/dashboard";
    } catch {
      setError(
        "Something went wrong"
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
        className="w-full rounded-xl border p-3"
      />

      <div className="relative">
        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full rounded-xl border p-3 pr-12"
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              !showPassword
            )
          }
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-blue-600 p-3 font-medium text-white hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  );
}