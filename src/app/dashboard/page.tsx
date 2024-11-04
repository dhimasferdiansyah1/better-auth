import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/sign-in");
  }

  const user = session?.user;

  return (
    <div className="flex min-h-screen justify-center items-center bg-zinc-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-white">Dashboard</h1>
        <div className="mt-4">
          <p className="text-zinc-50">Welcome to your dashboard</p>
        </div>
        {/* name and email */}
        <div className="mt-4">
          <h2 className="text-xl font-bold text-white">Profile</h2>
          <div className="mt-2">
            <p className="text-zinc-50">
              <span className="font-bold">Name:</span> {user.name}
            </p>
            <p className="text-zinc-50">
              <span className="font-bold">Email:</span> {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
