export default function SignupForm() {
  return (
    <form className="space-y-4">
      <input
        placeholder="Name"
        className="w-full rounded-xl border p-3"
      />

      <input
        placeholder="Phone Number"
        className="w-full rounded-xl border p-3"
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full rounded-xl border p-3"
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full rounded-xl border p-3"
      />

      <select
        className="w-full rounded-xl border p-3"
      >
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <button
        className="w-full rounded-xl bg-blue-600 p-3 font-medium text-white"
      >
        Create Account
      </button>
    </form>
  );
}