import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminManagementPortal } from "@/components/admin-management-portal";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Noorun Ala Noor · Meelad Fest 2026" },
      {
        name: "description",
        content:
          "Admin management portal for Noorun Ala Noor Meelad Fest 2026 | Guideon Learning Hub.",
      },
      { property: "og:title", content: "Admin Panel — Noorun Ala Noor" },
      {
        property: "og:description",
        content: "Festival results and competition management with live auto-syncing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <aside aria-label="Main Page Notification" className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold text-amber-700 dark:text-amber-400">
          💡 The Admin Panel is now also built into the bottom of the main page with slide-down controls!
        </span>
        <Button asChild size="sm" variant="outline" className="h-7 text-xs font-bold gap-1 border-amber-500/40 text-amber-600 dark:text-amber-300">
          <Link to="/" hash="admin-portal">
            <ArrowDown className="size-3" />
            <span>Open on Main Page Bottom</span>
          </Link>
        </Button>
      </aside>
      <AdminManagementPortal isEmbedded={false} />
    </div>
  );
}
