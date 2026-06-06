export default function LoginForm() {
  return (
    <form className="space-y-4">
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

      <button
        className="w-full rounded-xl bg-blue-600 p-3 font-medium text-white"
      >
        Login
      </button>
    </form>
  );
}