import { Form, type MetaFunction, useNavigation } from "react-router";
import { checkUser, login } from "~/services/auth";
import { redirect } from "react-router";
import { Route } from "../+types/root";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6),
});

export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  const user = await checkUser(request);
  if (user) {
    return redirect("/dashboard");
  }

  return { user: null, error: null };
}

export async function action({ request }: Route.ActionArgs) {
  try{
    const formData = await request.formData();3
    const result = LoginSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return { error: "Invalid form data" };
    }

    const loginResp = await login(request, result.data);
    if (!loginResp?.access_token || !loginResp?.expires_in) {
      return { error: loginResp };
    }

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": `__session=${
          loginResp?.access_token
        }; path=/; expires=${new Date(Date.now() + loginResp?.expires_in * 1000).toUTCString()}`,
      },
    });

  } catch (error) {
    console.error("login action error", error);
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An unknown error occurred" };
  }
}

export function HomePage({ actionData }: { actionData: { error?: string } }) {  
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#F8F3EA] dark:bg-[#121212]">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="flex items-center gap-3 mb-10 mt-8">
          <span className="text-2xl font-bold text-[#17423B] dark:text-white ml-2">House Numbers</span>
        </div>
        <div className="w-full bg-white dark:bg-[#232323] rounded-xl shadow-lg p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-[#17423B] dark:text-white mb-1">Welcome back</h2>
            <p className="text-[#17423B] dark:text-gray-300 text-sm">Sign in to your account</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-[#D1E7DD]" />
          </div>
          <Form className="flex flex-col gap-3" method="post">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#17423B] dark:text-gray-200 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-md border border-[#D1E7DD] bg-[#F8F3EA] text-[#17423B] dark:bg-[#232323] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#17423B]"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#17423B] dark:text-gray-200 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-md border border-[#D1E7DD] bg-[#F8F3EA] text-[#17423B] dark:bg-[#232323] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#17423B]"
                disabled={isLoading}
                required
              />
            </div>
            <button type="submit" className="w-full py-2 rounded-md bg-[#1A8C6D] text-white font-semibold hover:bg-[#17423B] transition disabled:opacity-60 mt-6" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
            {(actionData?.error) && (
              <div className="text-red-600 text-sm text-center mt-2">
                {actionData?.error}
              </div>
            )}
          </Form>
        </div>
      </div>
    </main>
  );
}