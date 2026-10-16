import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/travel-services")({
  beforeLoad: () => {
    throw redirect({ to: "/travel" });
  },
  component: () => null,
});
