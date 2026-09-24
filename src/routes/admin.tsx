import { createFileRoute } from "@tanstack/react-router";
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
  return <AdminManagementPortal isEmbedded={false} />;
}
