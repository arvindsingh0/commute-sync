"use client";

import { useState } from "react";

export default function SignupForm() {
  const [name, setName] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [gender, setGender] =
    useState("MALE");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);
 
  const [showPassword, setShowPassword] =
  useState(true);  

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            phoneNumber,
            email,
            password,
            gender,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Signup failed"
        );

        return;
      }

      setSuccess(
        "Account created successfully"
      );

      setName("");
      setPhoneNumber("");
      setEmail("");
      setPassword("");
      setGender("MALE");
    } catch {
      setError(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        placeholder="Name"
        className="w-full rounded-xl border p-3"
      />

      <input
        value={phoneNumber}
        onChange={(e) =>
          setPhoneNumber(
            e.target.value
          )
        }
        placeholder="Phone Number"
        className="w-full rounded-xl border p-3"
      />

      <input
        type="email"
        value={email}
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
        placeholder="Email"
        className="w-full rounded-xl border p-3"
      />

     <div className="relative">
  <input
    type={
      showPassword
        ? "text"
        : "password"
    }
    value={password}
    onChange={(e) =>
      setPassword(e.target.value)
    }
    placeholder="Password"
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
    {showPassword
      ? "🙈"
      : "👁️"}
  </button>
</div>

      <select
        value={gender}
        onChange={(e) =>
          setGender(
            e.target.value
          )
        }
        className="w-full rounded-xl border p-3"
      >
        <option value="MALE">
          Male
        </option>

        <option value="FEMALE">
          Female
        </option>

        <option value="OTHER">
          Other
        </option>
      </select>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-green-600">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 p-3 font-medium text-white"
      >
        {loading
          ? "Creating..."
          : "Create Account"}
      </button>
    </form>
  );
}