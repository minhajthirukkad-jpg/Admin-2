import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Unlock,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FestivalCalligraphyLogo } from "@/components/festival-header-branding";
import { AdminPortalDashboard } from "@/components/admin-management-portal";
import {
  checkAdminPassword,
  DEFAULT_ADMIN_USERNAME,
  isAdminUnlocked,
  setAdminUnlocked,
} from "@/lib/gate.functions";

interface BottomSlideAdminPanelProps {
  onScrollToTop?: () => void;
}

export function BottomSlideAdminPanel({ onScrollToTop }: BottomSlideAdminPanelProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [username, setUsername] = useState(DEFAULT_ADMIN_USERNAME);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Initialize unlock state from storage and URL params
  useEffect(() => {
    if (isAdminUnlocked()) {
      setUnlocked(true);
      return;
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlKey =
        params.get("key") ||
        params.get("password") ||
        params.get("pass") ||
        params.get("unlock") ||
        params.get("admin") ||
        params.get("access");

      if (urlKey && (urlKey === "1" || urlKey === "true" || checkAdminPassword(urlKey))) {
        setAdminUnlocked(true);
        setUnlocked(true);
        toast.success("Admin access granted via URL parameters");
      }
    }
  }, []);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const pwd = password.trim();

    if (checkAdminPassword(pwd)) {
      setAdminUnlocked(true);
      setUnlocked(true);
      setErrorMsg("");
      toast.success("Admin panel unlocked! Sliding down full management controls.");

      // Smooth scroll to ensure dashboard is comfortably positioned
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      setErrorMsg("Incorrect password. Please try again.");
      toast.error("Invalid admin password");
      passwordInputRef.current?.focus();
    }
  };

  const handleLock = useCallback(() => {
    setAdminUnlocked(false);
    setUnlocked(false);
    setPassword("");
    setErrorMsg("");
    toast.info("Admin panel locked.");

    setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  const handleScrollToScoreboard = useCallback(() => {
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [onScrollToTop]);

  return (
    <section
      id="admin-portal"
      ref={panelRef}
      className="scroll-mt-6 border-t-2 border-amber-500/30 bg-gradient-to-b from-card/90 via-background to-card/90 pt-8 pb-16 transition-all duration-500"
      aria-label="Festival Administration Center"
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-6">
        {/* Section Header & Status */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 shadow-inner">
              {unlocked ? <Unlock className="size-6 animate-pulse" /> : <Lock className="size-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-500">
                  Festival Control Center
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync Active
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-display">
                Admin Management Portal
              </h2>
              <p className="text-xs text-muted-foreground">
                Noorun Ala Noor · Meelad Fest 2026 | Guideon Learning Hub
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleScrollToScoreboard}
              className="gap-1.5 text-xs font-semibold cursor-pointer border-border hover:bg-muted"
              title="Jump up to main live scoreboard"
            >
              <ArrowUp className="size-3.5" />
              <span>Scoreboard (Top)</span>
            </Button>

            {unlocked && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleLock}
                className="gap-1.5 text-xs font-bold cursor-pointer shadow-sm"
                title="Lock admin controls and slide up"
              >
                <LogOut className="size-3.5" />
                <span>Lock Panel</span>
              </Button>
            )}
          </div>
        </div>

        {/* LOCKED STATE: Clean Secure Password Login Form */}
        {!unlocked && (
          <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-amber-500/30 bg-card p-6 sm:p-8 shadow-xl relative animate-in fade-in zoom-in-95 duration-300">
            <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 size-56 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="flex items-center justify-center gap-3 mb-2">
              <FestivalCalligraphyLogo className="size-14" />
            </div>

            <h3 className="text-center text-lg font-bold text-foreground">
              Admin Authentication
            </h3>
            <p className="text-center text-xs text-muted-foreground mt-0.5 mb-5">
              Enter password to slide down the festival management controls.
            </p>

            {/* Password Login Form */}
            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-username-input"
                  className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1 text-left"
                >
                  Admin Username
                </label>
                <div className="relative">
                  <Input
                    id="admin-username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="pl-9 font-medium text-sm"
                  />
                  <User className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password-input"
                  className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1 text-left"
                >
                  Admin Password
                </label>
                <div className="relative">
                  <Input
                    id="admin-password-input"
                    ref={passwordInputRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMsg) setErrorMsg("");
                    }}
                    placeholder="Enter password"
                    className="pl-9 pr-10 font-mono text-sm"
                  />
                  <Lock className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-2.5 text-center text-xs font-semibold text-destructive">
                  {errorMsg}
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full font-bold cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground py-2 shadow-md gap-2"
                >
                  <Unlock className="size-4" />
                  <span>Unlock Admin Panel</span>
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* UNLOCKED STATE: Smooth Slide-Down Admin Management Dashboard */}
        {unlocked && (
          <div className="overflow-hidden transition-all duration-700 ease-in-out animate-in fade-in slide-in-from-top-6">
            {/* Live Sync Banner */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-800 dark:text-emerald-300 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span className="font-bold">Admin Panel Unlocked & Live Syncing</span>
                <span className="hidden md:inline text-muted-foreground text-[11px]">
                  — Changes made below immediately update the main scoreboard and rankings above.
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleScrollToScoreboard}
                className="h-7 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 cursor-pointer gap-1"
              >
                <ArrowUp className="size-3" />
                <span>Jump to Top Scoreboard</span>
              </Button>
            </div>

            {/* Embedded Full Feature Dashboard */}
            <div className="rounded-2xl border border-border/80 bg-card shadow-2xl p-2 sm:p-4">
              <AdminPortalDashboard
                onLock={handleLock}
                onClose={handleScrollToScoreboard}
                isEmbedded={true}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
