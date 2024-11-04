import { auth } from "@/lib/auth";
import { Key } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className="fixed top-0 flex w-full bg-zinc-900 border-b border-zinc-700 shadow-sm shadow-zinc-950 p-4">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold text-zinc-50 flex items-center gap-2">
            <Key size={24} />
            Better Auth
          </h1>
          <div className="flex gap-4">
            {session ? (
              <form
                action={async () => {
                  "use server";
                  await auth.api.signOut({
                    headers: await headers(),
                  });
                  redirect("/");
                }}
              >
                <button type="submit" className="text-zinc-50">
                  Sign Out
                </button>
              </form>
            ) : (
              <Link href="/sign-in" className="text-zinc-50">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
