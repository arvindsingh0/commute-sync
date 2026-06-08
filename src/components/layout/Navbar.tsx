"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp, CircleUserRound, Route, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

type CurrentUser = {
  id: string;
  name: string | null;
  email: string;
};

export default function Navbar() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); 

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/me");

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (isMounted && data.success) {
          setUser(data.user);
        }
      } catch {
        // Keep the landing page in the logged-out state if the session check fails.
      }
    }
    async function handleLogout() {
  await fetch("/api/auth/logout", {
    method: "POST",
  });

  window.location.href = "/";
}

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

async function handleLogout() {
  await fetch("/api/auth/logout", {
    method: "POST",
  });

  window.location.href = "/";
}

  return (
    <nav className="landing-navbar">
      <div className="landing-navbar-inner">
        <Link
          href="/"
          className="landing-brand"
        >
          CommuteSync
        </Link>

        {user ? (
          <div className="account-menu">
            <button
              type="button"
              className="account-trigger"
              aria-expanded={isAccountOpen}
              onClick={() => setIsAccountOpen((open) => !open)}
            >
              <span className="account-avatar">
                <CircleUserRound aria-hidden="true" />
              </span>
              <span>My Account</span>
              {isAccountOpen ? (
                <ChevronUp className="account-chevron" aria-hidden="true" />
              ) : (
                <ChevronDown className="account-chevron" aria-hidden="true" />
              )}
            </button>

            {isAccountOpen ? (
              <div className="account-dropdown">
                <Link href="/dashboard" className="account-dropdown-item">
                  <UserRound aria-hidden="true" />
                  <span>My Profile</span>
                </Link>
              <Link
              href="/my-syncs"
              className="account-dropdown-item"
            >
              <Route />
              <span>My Syncs</span>
            </Link>

                <button
                type="button"
                onClick={handleLogout}
                className="account-dropdown-item"
              >
                <span>Logout</span>
              </button>
              </div>
            ) : null}
          </div>
        ) : (
          <button
  onClick={() => setIsAuthModalOpen(true)}
  className="rounded-xl border border-slate-300 px-6 py-3 font-medium"
>
  Login / Signup
</button>

        )}
      </div>
      <AuthModal
  isOpen={isAuthModalOpen}
  onClose={() => setIsAuthModalOpen(false)}
/>
    </nav>
  );
}

