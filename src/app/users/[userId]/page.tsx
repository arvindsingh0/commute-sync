export default async function UserProfilePage({
  params,
}: {
  params: Promise<{
    userId: string;
  }>;
}) {
  const { userId } =
    await params;

  const response =
    await fetch(
      `http://localhost:3000/api/users/${userId}`,
      {
        cache: "no-store",
      }
    );

  const data =
    await response.json();

  const user = data.user;

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="rounded-2xl border p-8">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
          {user.name[0]}
        </div>

        <h1 className="text-3xl font-bold">
          {user.name}
        </h1>

        {user.isVerified && (
          <p className="text-green-600">
            ✓ Verified
          </p>
        )}

        <div className="mt-6 space-y-2">
          <p>
            Company:{" "}
            {user.company ??
              "Not provided"}
          </p>

          <p>
            Gender: {user.gender}
          </p>

          <p>
            Syncs Created:{" "}
            {user._count.syncs}
          </p>

          <p>
            Syncs Joined:{" "}
            {
              user._count.requests
            }
          </p>
        </div>
      </div>
    </main>
  );
}