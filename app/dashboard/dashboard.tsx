import React, { useEffect, useState } from "react";
import { summarizeText } from "../services/api";
import { checkUser, logout } from "../services/auth";
import { ActionFunctionArgs, Form, redirect, useActionData, useSubmit } from "react-router";
import { Route } from "../+types/root";
import { z } from "zod";

const EntrySchema = z.object({
  text: z.string().min(30).trim(),
});

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await checkUser(request);
  if (!user) {
    return redirect("/");
  }

  return { user };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "logout") {
    const logoutResp = await logout(request);
    if (!logoutResp?.ok) {
      return { error: logoutResp.statusText };
    }
    return redirect("/", {
      headers: {
        "Set-Cookie": "payload-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
      },
    });
  }

  const result = EntrySchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return { error: "Invalid form data" };
  }

  try {
    const summary = await summarizeText(request, result.data.text);
    return { summary };
  } catch (error) {
    return { error: "Failed to summarize text" };
  }
}

export function Dashboard() {
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<{ text: string; summary: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.summary && input) {
      setEntries(prev => [...prev, { text: input, summary: actionData.summary }]);
      setInput("");
      setLoading(false);
    } else if (actionData?.error) {
      setError(actionData.error);
      setLoading(false);
    }
  }, [actionData]);

  const submit = useSubmit();

  const handleLogout = () => {
    const formData = new FormData();
    formData.append('intent', 'logout');
    submit(formData, { method: "POST" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('text', input);
    submit(formData, { method: "POST" });
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-[#F8F3EA] dark:bg-[#121212] py-12">
      <div className="w-full max-w-2xl bg-white dark:bg-[#232323] rounded-xl shadow-lg p-8 flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#17423B] dark:text-white mb-2">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
        <Form className="flex flex-col gap-4" method="post" onSubmit={handleSubmit}>
          <label htmlFor="entry" className="text-[#17423B] dark:text-gray-200 font-medium">Enter your text</label>
          <textarea
            id="entry"
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-md border border-[#D1E7DD] bg-[#F8F3EA] text-[#17423B] dark:bg-[#232323] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#17423B] resize-none"
            placeholder="Type something to summarize..."
            disabled={loading}
          />
          <button
            type="submit"
            className="self-end px-6 py-2 rounded-md bg-[#1A8C6D] text-white font-semibold hover:bg-[#17423B] transition disabled:opacity-60"
            disabled={loading || !input.trim()}
          >
            {loading ? "Summarizing..." : "Submit"}
          </button>
          {error && <div className="text-red-600 text-sm text-center mt-2">{error}</div>}
        </Form>
        <div>
          <h2 className="text-lg font-semibold text-[#17423B] dark:text-white mb-4">Entries</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-[#D1E7DD] rounded-md">
              <thead className="bg-[#F8F3EA] dark:bg-[#232323]">
                <tr>
                  <th className="px-4 py-2 text-left text-[#17423B] dark:text-white font-medium border-b border-[#D1E7DD]">Text</th>
                  <th className="px-4 py-2 text-left text-[#17423B] dark:text-white font-medium border-b border-[#D1E7DD]">Summary</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-6 text-center text-[#17423B] dark:text-gray-300">No entries yet.</td>
                  </tr>
                ) : (
                  entries.map((entry, idx) => (
                    <tr key={idx} className="odd:bg-[#F8F3EA] dark:odd:bg-[#232323]">
                      <td className="px-4 py-2 align-top text-[#17423B] dark:text-white max-w-xs break-words">{entry.text}</td>
                      <td className="px-4 py-2 align-top text-[#17423B] dark:text-gray-200 max-w-xs break-words">{entry.summary}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
