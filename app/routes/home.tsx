import type { Route } from "./+types/home";
import { HomePage, action, loader } from "../home/home";
import { useActionData } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Home to React Router!" },
  ];
}

export { action, loader };

export default function Home() {
  const actionData = useActionData<{ error?: string }>() || {};
  return <HomePage actionData={actionData} />;
}
