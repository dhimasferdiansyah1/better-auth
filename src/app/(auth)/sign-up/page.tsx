"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";
import { redirect } from "next/navigation";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const { data: session } = authClient.useSession();

  if (session) {
    return redirect("/dashboard");
  }

  const onSubmit = async (formData: SignUpFormData) => {
    const { email, password, name } = formData;

    try {
      await authClient.signUp.email(
        {
          email,
          password,
          name,
        },
        {
          onSuccess: () => {
            toast.success("Signed up successfully");
            redirect("/dashboard");
          },
          onError: (ctx) => {
            // Handle error response from Arcjet
            toast.error(ctx.error.message || "An unknown error occurred.");
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
        <h1 className="text-3xl font-bold text-center text-white">Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="mb-4">
            <label className="block text-zinc-50 text-sm font-bold mb-2">
              Name
            </label>
            <input
              className={`bg-zinc-700 appearance-none rounded w-full py-2 px-3 text-zinc-50 leading-tight focus:outline-none focus:shadow-outline ${
                errors.name ? "border-red-500 border" : ""
              }`}
              {...register("name")}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-zinc-50 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              className={`bg-zinc-700 appearance-none rounded w-full py-2 px-3 text-zinc-50 leading-tight focus:outline-none focus:shadow-outline ${
                errors.email ? "border-red-500 border" : ""
              }`}
              {...register("email")}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-zinc-50 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              className={`bg-zinc-700 appearance-none rounded w-full py-2 px-3 text-zinc-50 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password ? "border-red-500 border" : ""
              }`}
              {...register("password")}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>

          <p className="flex items-center gap-2 text-sm text-zinc-400 mt-8">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-zinc-50 hover:text-zinc-200">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
