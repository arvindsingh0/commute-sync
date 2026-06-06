import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useState } from "react";


type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({
  isOpen,
  onClose,
}: AuthModalProps) {
    const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="mb-8 text-center text-3xl font-bold">
          CommuteSync
        </h2>

        <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
  <button
    onClick={() => setActiveTab("login")}
    className={`flex-1 rounded-lg py-2 font-medium ${
      activeTab === "login"
        ? "bg-white shadow"
        : ""
    }`}
  >
    Login
  </button>

  <button
    onClick={() => setActiveTab("signup")}
    className={`flex-1 rounded-lg py-2 font-medium ${
      activeTab === "signup"
        ? "bg-white shadow"
        : ""
    }`}
  >
    Signup
  </button>
</div>

{activeTab === "login" ? (
  <div><LoginForm /></div>
) : (
  <div><SignupForm /></div>
)}
      </div>
    </div>
  );
}