import { createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
      },
    },
  });

  let basepath: string | undefined = undefined;
  if (typeof window !== "undefined") {
    const isGitHubPages = window.location.hostname.endsWith("github.io");
    if (isGitHubPages) {
      const p = window.location.pathname;
      const knownTopRoutes = ["admin", "check-results", "unlock", "assets"];
      const segments = p.split("/").filter(Boolean);

      if (segments.length > 0 && !knownTopRoutes.includes(segments[0].toLowerCase())) {
        if (segments.length > 1 && segments[1].toLowerCase() === "docs") {
          basepath = `/${segments[0]}/docs`;
        } else {
          basepath = `/${segments[0]}`;
        }
      }
    }
  }

  const router = createRouter({
    routeTree,
    basepath,
    context: {
      queryClient,
    },
    scrollRestoration: true,
    trailingSlash: "preserve",
  });

  return router;
}

export type AppRouter = ReturnType<typeof getRouter>;

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
