import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, KeyRound, LockKeyhole, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkAdminPassword, DEFAULT_FEST_PASSWORD, setAdminUnlocked } from "@/lib/gate.functions";

export const Route = createFileRoute("/unlock")({
  head: () => ({
    meta: [
      { title: "Admin Access — Noorun Ala Noor" },
      { name: "description", content: "Secure administration access for Noorun Ala Noor." },
      { property: "og:title", content: "Admin Access — Noorun Ala Noor" },
      { property: "og:description", content: "Secure festival administration access." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Unlock,
});

function Unlock() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function performUnlock(pwdToUse?: string) {
    const p = (pwdToUse ?? password).trim();
    setError(false);
    if (checkAdminPassword(p)) {
      setAdminUnlocked(true);
      void router.navigate({ to: "/admin" });
    } else {
      setError(true);
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    performUnlock();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background p-5">
      <div className="festival-panel w-full max-w-md p-7 text-center shadow-lg">
        <span className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-secondary text-primary">
          <LockKeyhole className="size-6" />
        </span>
        <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
        <p className="mb-5 mt-1 text-sm text-muted-foreground">
          Enter the password to access Noorun Ala Noor festival administration.
        </p>

        <form onSubmit={submit} className="space-y-3">
          <Input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter password"
            aria-label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(false);
            }}
            required
            autoFocus
          />
          {error && (
            <p className="text-xs font-semibold text-destructive">
              Incorrect password. Please try again.
            </p>
          )}
          <Button className="w-full cursor-pointer" type="submit">
            Unlock Admin Panel
          </Button>
        </form>

        <div className="mt-4 flex flex-col items-center gap-2">
          <Button asChild variant="link" className="text-xs text-muted-foreground">
            <Link to="/">
              <ArrowLeft className="mr-1 size-3.5" />
              Back to Scoreboard
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
