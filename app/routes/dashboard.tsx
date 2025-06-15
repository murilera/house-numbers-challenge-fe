import type { Route } from "./+types/home";
import { Dashboard, action, loader } from "~/dashboard/dashboard";
import { useActionData } from "react-router";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export { action, loader };

export default function Home() {
  const actionData = useActionData<{ error?: string }>() || {};
  return <Dashboard />;
}
