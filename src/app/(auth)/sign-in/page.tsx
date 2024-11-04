"use client";
import Link from "next/link";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const { data: session } = authClient.useSession();

  if (session) {
    return redirect("/dashboard");
  }

  const onSubmit = async (formData: SignInFormData) => {
    const { email, password } = formData;

    try {
      await authClient.signIn.email(
        {
          email,
          password,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {
            toast.success("Signed in successfully");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        }
      );
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-zinc-900">
      <div className="w-full max-w-sm p-8 border border-zinc-700 bg-zinc-800 rounded-md shadow-md shadow-zinc-950">
        <h1 className="text-3xl font-bold text-center">Sign In</h1>
        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-zinc-50 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={`bg-zinc-700 appearance-none rounded w-full py-2 px-3 text-zinc-50 leading-tight focus:outline-none focus:shadow-outline ${
                errors.email ? "border-red-500 border" : ""
              }`}
              id="email"
              {...register("email")}
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-zinc-50 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className={`bg-zinc-700 appearance-none rounded w-full py-2 px-3 text-zinc-50 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password ? "border-red" : ""
              }`}
              id="password"
              {...register("password")}
              placeholder="******************"
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </div>
          <p className="flex items-center gap-2 text-sm text-zinc-400 mt-8">
            Does not have an account?
            <Link href="/sign-up" className="text-zinc-50 hover:text-zinc-200">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
