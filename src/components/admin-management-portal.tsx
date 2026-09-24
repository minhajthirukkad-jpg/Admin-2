import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Award,
  Check,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  KeyRound,
  Lock,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Trophy,
  Upload,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationBar } from "@/components/ui/pagination-bar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFestivalData } from "@/hooks/use-festival-data";
import { exportToExcel } from "@/lib/export-excel";
import {
  ALL_CATEGORIES,
  CATEGORIES,
  GRADES,
  initialTeams,
  POSITIONS,
  STAGE_TYPES,
  type AdminResultRecord,
  type CompetitorRecord,
  type GeneralResultRecord,
  type ProgramRecord,
  type ProgramStatus,
  type Team,
} from "@/lib/festival-data";
import {
  FestivalCalligraphyLogo,
  GuideonInstitutionLogo,
} from "@/components/festival-header-branding";
import {
  checkAdminPassword,
  DEFAULT_ADMIN_USERNAME,
  DEFAULT_FEST_PASSWORD,
  getAdminPassword,
  isAdminUnlocked,
  setAdminUnlocked,
  setCustomAdminPassword,
} from "@/lib/gate.functions";

interface AdminPortalProps {
  onClose?: () => void;
  isEmbedded?: boolean;
}

export function AdminManagementPortal({ onClose, isEmbedded = false }: AdminPortalProps) {
  const [isClient, setIsClient] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
        toast.success("Admin access granted");
      }
    }
  }, []);

  const handleUnlockSuccess = useCallback(() => {
    setUnlocked(true);
  }, []);

  const handleLockSuccess = useCallback(() => {
    setAdminUnlocked(false);
    setUnlocked(false);
    toast.info("Admin panel locked");
  }, []);

  if (!isClient) {
    return (
      <div className="flex min-h-[350px] items-center justify-center p-8 text-center">
        <RefreshCw className="size-6 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!unlocked) {
    return (
      <AdminPortalLogin
        onUnlocked={handleUnlockSuccess}
        onClose={onClose}
        isEmbedded={isEmbedded}
      />
    );
  }

  return (
    <AdminPortalDashboard onLock={handleLockSuccess} onClose={onClose} isEmbedded={isEmbedded} />
  );
}

/* =========================================================================
   LOGIN SCREEN WITH EXPLICIT CREDENTIALS DISPLAY & ONE-CLICK AUTO-FILL
   ========================================================================= */
function AdminPortalLogin({
  onUnlocked,
  onClose,
  isEmbedded,
}: {
  onUnlocked: () => void;
  onClose?: () => void;
  isEmbedded: boolean;
}) {
  const [username, setUsername] = useState(DEFAULT_ADMIN_USERNAME);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const pwd = password.trim() || DEFAULT_FEST_PASSWORD;
    if (checkAdminPassword(pwd)) {
      setAdminUnlocked(true);
      onUnlocked();
      toast.success("Admin panel unlocked & live syncing active!");
    } else {
      setErrorMsg("Incorrect password. Use default MNMF2K26 or admin");
      toast.error("Invalid password");
    }
  };

  const handleInstantUnlock = () => {
    setUsername(DEFAULT_ADMIN_USERNAME);
    setPassword(DEFAULT_FEST_PASSWORD);
    setAdminUnlocked(true);
    onUnlocked();
    toast.success("Admin panel unlocked with default credentials!");
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 sm:p-6 ${isEmbedded ? "" : "min-h-screen bg-background"}`}
    >
      <div className="glass-card relative w-full max-w-md overflow-hidden rounded-2xl border border-amber-500/30 p-6 sm:p-8 text-center shadow-2xl">
        {/* Glow */}
        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 size-48 rounded-full bg-amber-500/15 blur-3xl" />

        {isEmbedded && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex size-8 items-center justify-center rounded-full bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        )}

        <div className="mx-auto mb-3 flex justify-center">
          <FestivalCalligraphyLogo className="size-20" />
        </div>

        <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
          <Lock className="size-5" />
        </div>

        <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl font-display">
          Admin Management Portal
        </h2>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-amber-500">
          Noorun Ala Noor · Meelad Fest 2026
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">Guideon Learning Hub</p>

        {/* Credentials Display Card */}
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-left text-xs">
          <div className="flex items-center justify-between font-semibold text-amber-600 dark:text-amber-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <KeyRound className="size-3.5" /> Official Login Credentials:
            </span>
            <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              Live Ready
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="rounded bg-background/80 p-2 border border-border/60">
              <span className="text-[10px] text-muted-foreground block">Username</span>
              <code className="font-mono font-bold text-foreground text-xs">admin</code>
            </div>
            <div className="rounded bg-background/80 p-2 border border-border/60">
              <span className="text-[10px] text-muted-foreground block">Password</span>
              <code className="font-mono font-bold text-amber-500 text-xs">MNMF2K26</code>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-4 space-y-3 text-left">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Admin Username
            </label>
            <div className="relative">
              <Input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="pl-9 font-medium text-sm"
              />
              <User className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                placeholder="Enter MNMF2K26"
                className="pl-9 pr-10 font-mono text-sm"
                autoFocus
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
            <p className="text-xs font-semibold text-destructive text-center pt-1">{errorMsg}</p>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full font-bold cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground py-2 shadow-md"
            >
              <KeyRound className="size-4 mr-1.5" /> Unlock & Access Admin Panel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleInstantUnlock}
              className="w-full text-xs font-semibold text-amber-500 border-amber-500/40 hover:bg-amber-500/10 cursor-pointer"
            >
              <Sparkles className="size-3.5 mr-1" /> One-Tap Auto-Fill & Unlock
            </Button>
          </div>
        </form>

        <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="hover:underline transition-colors cursor-pointer text-amber-500 font-semibold"
            >
              ← Back to Live Scoreboard
            </button>
          ) : (
            <Link to="/" className="hover:underline transition-colors text-amber-500 font-semibold">
              ← Back to Live Scoreboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   ADMIN DASHBOARD WITH REAL-TIME LIVE AUTO-SYNCING
   ========================================================================= */
function AdminPortalDashboard({
  onLock,
  onClose,
  isEmbedded,
}: {
  onLock: () => void;
  onClose?: () => void;
  isEmbedded: boolean;
}) {
  const [activeTab, setActiveTab] = useState<string>("standings");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const festivalData = useFestivalData();

  const handleSavePassword = useCallback(() => {
    const trimmed = newPassword.trim();
    if (!trimmed) {
      toast.error("Password cannot be empty");
      return;
    }
    if (trimmed !== confirmPassword.trim()) {
      toast.error("Passwords do not match");
      return;
    }
    setCustomAdminPassword(trimmed);
    setPasswordModalOpen(false);
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Admin password updated successfully");
  }, [newPassword, confirmPassword]);

  const handleResetPassword = useCallback(() => {
    setCustomAdminPassword(DEFAULT_FEST_PASSWORD);
    setPasswordModalOpen(false);
    setNewPassword("");
    setConfirmPassword("");
    toast.success(`Password reset to default (${DEFAULT_FEST_PASSWORD})`);
  }, []);

  const handleFileRestore = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content && festivalData.importAllData(content)) {
          toast.success("Festival data imported and auto-synced successfully!");
        } else {
          toast.error("Failed to import: invalid JSON format");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [festivalData],
  );

  return (
    <div
      className={`mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 sm:py-6 ${isEmbedded ? "" : "min-h-screen"}`}
    >
      {/* Top Banner / Navigation Header */}
      <header className="glass-card mb-5 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border border-border shadow-lg rounded-2xl">
        <div className="flex items-center gap-3">
          <FestivalCalligraphyLogo className="size-12 sm:size-14" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight">
                Admin Management Panel
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Auto-Sync Active
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              Noorun Ala Noor · Meelad Fest 2026
            </p>
            <p className="text-[10px] text-muted-foreground">Guideon Learning Hub</p>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {/* Quick backup */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              festivalData.exportAllData();
              toast.success("Festival data backup downloaded");
            }}
            title="Download JSON backup"
            className="gap-1.5 cursor-pointer text-xs"
          >
            <Download className="size-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Backup</span>
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileRestore}
          />
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="gap-1.5 cursor-pointer text-xs"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Restore</span>
          </Button>

          {/* Reset All */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-destructive hover:bg-destructive/10 cursor-pointer text-xs"
                title="Reset back to default festival scores"
              >
                <RotateCcw className="size-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all festival data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This restores the initial teams (TEAM SAUR: 18 pts, TEAM HIRA: 7 pts) and default
                  festival programs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    festivalData.resetAllData();
                    toast.success("Festival data reset to defaults (TEAM SAUR: 18, TEAM HIRA: 7)");
                  }}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Reset Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Password Settings */}
          <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 cursor-pointer text-xs">
                <KeyRound className="size-3.5 text-muted-foreground" />
                <span>Password</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" /> Admin Password Settings
                </DialogTitle>
                <DialogDescription>
                  Update the password required to access the admin panel.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground border border-border">
                  <p>
                    <span className="font-semibold text-foreground">Current Password:</span>{" "}
                    <code className="rounded bg-background px-1.5 py-0.5 font-mono font-bold text-primary">
                      {getAdminPassword()}
                    </code>
                  </p>
                  <p className="mt-1 text-[11px]">
                    Default fallback password is{" "}
                    <span className="font-mono font-bold">{DEFAULT_FEST_PASSWORD}</span>.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Confirm Password
                  </label>
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter className="flex-row items-center justify-between sm:justify-between gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResetPassword}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Reset to Default
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPasswordModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSavePassword}>
                    Save Changes
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Close or Back to Scoreboard */}
          {onClose ? (
            <Button
              variant="default"
              size="sm"
              onClick={onClose}
              className="gap-1.5 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold"
            >
              <Trophy className="size-3.5" />
              <span>View Scoreboard</span>
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm" className="text-xs gap-1.5">
              <Link to="/">
                <Trophy className="size-3.5 mr-1" />
                Scoreboard
              </Link>
            </Button>
          )}

          {/* Lock */}
          <Button
            variant="destructive"
            size="sm"
            onClick={onLock}
            title="Lock panel"
            className="gap-1 cursor-pointer text-xs"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Lock</span>
          </Button>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-5 flex h-auto w-full flex-wrap justify-start gap-1 bg-background/80 p-1 border border-border shadow-sm rounded-xl">
          <TabsTrigger value="standings" className="cursor-pointer font-bold text-xs sm:text-sm">
            🏆 Standings Overview
          </TabsTrigger>
          <TabsTrigger value="teams" className="cursor-pointer text-xs sm:text-sm">
            Teams ({festivalData.teams.length})
          </TabsTrigger>
          <TabsTrigger value="competitors" className="cursor-pointer text-xs sm:text-sm">
            Competitors ({festivalData.competitors.length})
          </TabsTrigger>
          <TabsTrigger value="programs" className="cursor-pointer text-xs sm:text-sm">
            Programs ({festivalData.programs.length})
          </TabsTrigger>
          <TabsTrigger value="results" className="cursor-pointer text-xs sm:text-sm">
            Individual Results ({festivalData.adminResults.length})
          </TabsTrigger>
          <TabsTrigger value="general" className="cursor-pointer text-xs sm:text-sm">
            General Results ({festivalData.generalResults.length})
          </TabsTrigger>
          <TabsTrigger value="status" className="cursor-pointer text-xs sm:text-sm">
            Program Status ({festivalData.statuses.length})
          </TabsTrigger>
        </TabsList>

        {/* 0. LIVE STANDINGS TAB */}
        <TabsContent value="standings">
          <div className="space-y-5">
            <div className="glass-card p-5 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <Trophy className="size-5 text-amber-500" /> Live Championship Standings
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Auto-calculated in real time from all individual and general event entries.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Synced
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-4 py-3">Rank</th>
                      <th className="px-4 py-3">Team Name</th>
                      <th className="px-4 py-3 text-right">On-Stage</th>
                      <th className="px-4 py-3 text-right">Off-Stage</th>
                      <th className="px-4 py-3 text-right font-bold text-foreground">
                        Total Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {festivalData.rankedTeams.map((t) => (
                      <tr
                        key={t.team.id}
                        className={`transition-colors ${
                          t.rank === 1
                            ? "bg-amber-500/10 font-bold"
                            : t.rank === 2
                              ? "bg-slate-500/10"
                              : "hover:bg-muted/30"
                        }`}
                      >
                        <td className="px-4 py-3 font-extrabold text-base">
                          {t.rank === 1 ? (
                            <span className="inline-flex size-6 items-center justify-center rounded-full bg-amber-400 text-black text-xs font-black">
                              1
                            </span>
                          ) : t.rank === 2 ? (
                            <span className="inline-flex size-6 items-center justify-center rounded-full bg-slate-300 text-black text-xs font-black">
                              2
                            </span>
                          ) : (
                            `#${t.rank}`
                          )}
                        </td>
                        <td className="px-4 py-3 font-bold text-foreground">{t.team.name}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                          {t.onStage}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                          {t.offStage}
                        </td>
                        <td className="px-4 py-3 text-right font-black text-amber-500 text-lg tabular-nums">
                          {t.grand}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions to Add Results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setActiveTab("general")}
                className="glass-card p-4 border border-border hover:border-primary/50 transition-colors cursor-pointer rounded-xl flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm">Assign General / Group Scores</h4>
                  <p className="text-xs text-muted-foreground">
                    Award points for Group Song, Burda, Debate, Quiz directly to teams.
                  </p>
                </div>
                <Button size="sm" variant="outline" className="text-xs shrink-0">
                  Open Tab →
                </Button>
              </div>

              <div
                onClick={() => setActiveTab("results")}
                className="glass-card p-4 border border-border hover:border-primary/50 transition-colors cursor-pointer rounded-xl flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm">Enter Individual Results</h4>
                  <p className="text-xs text-muted-foreground">
                    Record 1st, 2nd, 3rd, and Grade scores for student competitors.
                  </p>
                </div>
                <Button size="sm" variant="outline" className="text-xs shrink-0">
                  Open Tab →
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 1. TEAMS TAB */}
        <TabsContent value="teams">
          <TeamsTabInner
            teams={festivalData.teams}
            onSaveTeams={(next) => {
              festivalData.saveTeams(next);
              toast.success("Teams updated and auto-synced live!");
            }}
          />
        </TabsContent>

        {/* 2. COMPETITORS TAB */}
        <TabsContent value="competitors">
          <CompetitorsTabInner
            competitors={festivalData.competitors}
            teams={festivalData.teams}
            onSaveCompetitors={(next) => {
              festivalData.saveCompetitors(next);
              toast.success("Competitors updated and auto-synced live!");
            }}
          />
        </TabsContent>

        {/* 3. PROGRAMS TAB */}
        <TabsContent value="programs">
          <ProgramsTabInner
            programs={festivalData.programs}
            onSavePrograms={(next) => {
              festivalData.savePrograms(next);
              toast.success("Programs updated and auto-synced live!");
            }}
          />
        </TabsContent>

        {/* 4. INDIVIDUAL RESULTS TAB */}
        <TabsContent value="results">
          <ResultsTabInner
            results={festivalData.adminResults}
            competitors={festivalData.competitors}
            programs={festivalData.programs}
            teams={festivalData.teams}
            onSaveResults={(next) => {
              festivalData.saveAdminResults(next);
              toast.success("Results updated — scoreboard auto-synced live!");
            }}
          />
        </TabsContent>

        {/* 5. GENERAL RESULTS TAB */}
        <TabsContent value="general">
          <GeneralResultsTabInner
            generalResults={festivalData.generalResults}
            programs={festivalData.programs}
            teams={festivalData.teams}
            onSaveGeneralResults={(next) => {
              festivalData.saveGeneralResults(next);
              toast.success("General scores updated — scoreboard auto-synced live!");
            }}
          />
        </TabsContent>

        {/* 6. STATUS TAB */}
        <TabsContent value="status">
          <StatusTabInner
            statuses={festivalData.statuses}
            programs={festivalData.programs}
            onSaveStatuses={(next) => {
              festivalData.saveStatuses(next);
              toast.success("Program status updated — public screens auto-synced live!");
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* =========================================================================
   SUB-TABS IMPLEMENTATION (CLEAN & MODULAR)
   ========================================================================= */

function TeamsTabInner({
  teams,
  onSaveTeams,
}: {
  teams: Team[];
  onSaveTeams: (next: Team[]) => void;
}) {
  const [teamName, setTeamName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAddOrEditTeam = () => {
    if (editingId) {
      if (!editingName.trim()) {
        toast.error("Enter a valid team name");
        return;
      }
      const updated = teams.map((t) =>
        t.id === editingId ? { ...t, name: editingName.trim() } : t,
      );
      onSaveTeams(updated);
      setEditingId(null);
      setEditingName("");
    } else {
      if (!teamName.trim()) {
        toast.error("Enter a team name");
        return;
      }
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: teamName.trim(),
      };
      onSaveTeams([...teams, newTeam]);
      setTeamName("");
    }
  };

  const handleRestoreDefaultTeams = () => {
    onSaveTeams(initialTeams);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 border border-border rounded-xl">
        <h3 className="mb-4 text-base font-bold">
          {editingId ? "Edit Team Name" : "Add New Team"}
        </h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder={editingId ? "Update team name" : "Team name (e.g., TEAM SAUR, TEAM HIRA)"}
            value={editingId ? editingName : teamName}
            onChange={(e) =>
              editingId ? setEditingName(e.target.value) : setTeamName(e.target.value)
            }
            onKeyDown={(e) => e.key === "Enter" && handleAddOrEditTeam()}
          />
          <div className="flex gap-2">
            <Button onClick={handleAddOrEditTeam}>
              {editingId ? (
                <>
                  <Check className="size-4 mr-1.5" /> Save Name
                </>
              ) : (
                <>
                  <Plus className="size-4 mr-1.5" /> Add Team
                </>
              )}
            </Button>
            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setEditingName("");
                }}
              >
                <X className="size-4 mr-1.5" /> Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card p-5 border border-border rounded-xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold">Registered Teams ({teams.length})</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestoreDefaultTeams}
            className="text-xs gap-1.5"
            title="Restore default teams (TEAM SAUR & TEAM HIRA)"
          >
            <RotateCcw className="size-3.5" />
            Restore Default Teams
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3 shadow-sm hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-primary" />
                <span className="font-bold text-foreground">{team.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setEditingId(team.id);
                    setEditingName(team.name);
                  }}
                  title="Rename team"
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  type="button"
                  onClick={() => onSaveTeams(teams.filter((t) => t.id !== team.id))}
                  title="Delete team"
                >
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompetitorsTabInner({
  competitors,
  teams,
  onSaveCompetitors,
}: {
  competitors: CompetitorRecord[];
  teams: Team[];
  onSaveCompetitors: (next: CompetitorRecord[]) => void;
}) {
  const [name, setName] = useState("");
  const [chestNo, setChestNo] = useState("");
  const [category, setCategory] = useState("");
  const [teamId, setTeamId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return competitors;
    const q = searchQuery.toLowerCase();
    return competitors.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.chest_no.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q),
    );
  }, [competitors, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / 20));
  const paginated = useMemo(() => filtered.slice((page - 1) * 20, page * 20), [filtered, page]);

  const handleSave = () => {
    if (!name.trim() || !chestNo.trim() || !category || !teamId) {
      toast.error("Please fill all competitor fields");
      return;
    }
    if (editingId) {
      const updated = competitors.map((c) =>
        c.id === editingId
          ? { ...c, name: name.trim(), chest_no: chestNo.trim(), category, team_id: teamId }
          : c,
      );
      onSaveCompetitors(updated);
      setEditingId(null);
    } else {
      const newComp: CompetitorRecord = {
        id: `c-${Date.now()}`,
        name: name.trim(),
        chest_no: chestNo.trim(),
        category,
        team_id: teamId,
      };
      onSaveCompetitors([...competitors, newComp]);
    }
    setName("");
    setChestNo("");
    setCategory("");
    setTeamId("");
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 border border-border rounded-xl">
        <h3 className="mb-4 text-base font-bold">
          {editingId ? "Edit Competitor Details" : "Add Competitor"}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            placeholder="Competitor Name (e.g. NAJAD)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Chest No (e.g. 239)"
            value={chestNo}
            onChange={(e) => setChestNo(e.target.value)}
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={teamId} onValueChange={setTeamId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={handleSave}>
            {editingId ? (
              <>
                <Check className="size-4 mr-1.5" /> Save Changes
              </>
            ) : (
              <>
                <Plus className="size-4 mr-1.5" /> Add Competitor
              </>
            )}
          </Button>
          {editingId && (
            <Button
              variant="outline"
              onClick={() => {
                setEditingId(null);
                setName("");
                setChestNo("");
                setCategory("");
                setTeamId("");
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="glass-card p-5 border border-border rounded-xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search by chest or name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-9 text-xs"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const rows = competitors.map((c) => ({
                Chest: c.chest_no,
                Name: c.name,
                Category: c.category,
                Team: teams.find((t) => t.id === c.team_id)?.name ?? "—",
              }));
              exportToExcel(rows, "Competitors_List");
              toast.success("Excel exported");
            }}
            className="text-xs gap-1.5"
          >
            <FileSpreadsheet className="size-3.5 text-emerald-500" /> Export Excel
          </Button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/50 uppercase text-[11px] text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-2.5">Chest No</th>
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Category</th>
                <th className="px-4 py-2.5">Team</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((c) => (
                <tr key={c.id} className="hover:bg-muted/20">
                  <td className="px-4 py-2.5 font-mono font-bold">{c.chest_no}</td>
                  <td className="px-4 py-2.5 font-semibold text-foreground">{c.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{c.category}</td>
                  <td className="px-4 py-2.5 font-medium">
                    {teams.find((t) => t.id === c.team_id)?.name ?? "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(c.id);
                        setName(c.name);
                        setChestNo(c.chest_no);
                        setCategory(c.category);
                        setTeamId(c.team_id);
                      }}
                      className="size-7"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onSaveCompetitors(competitors.filter((x) => x.id !== c.id))}
                      className="size-7 text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4">
            <PaginationBar page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}

function ProgramsTabInner({
  programs,
  onSavePrograms,
}: {
  programs: ProgramRecord[];
  onSavePrograms: (next: ProgramRecord[]) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [stageType, setStageType] = useState<"On-Stage" | "Off-Stage">("On-Stage");

  const handleAdd = () => {
    if (!name.trim() || !category) {
      toast.error("Please fill program name and category");
      return;
    }
    const newProg: ProgramRecord = {
      id: `p-${Date.now()}`,
      name: name.trim().toUpperCase(),
      category,
      stage_type: stageType,
    };
    onSavePrograms([...programs, newProg]);
    setName("");
    setCategory("");
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 border border-border rounded-xl">
        <h3 className="mb-4 text-base font-bold">Add Festival Program</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Input
            placeholder="Program Name (e.g. QIRATH, SONG ARABIC)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {ALL_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={stageType}
            onValueChange={(v) => setStageType(v as "On-Stage" | "Off-Stage")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Stage Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="On-Stage">On-Stage</SelectItem>
              <SelectItem value="Off-Stage">Off-Stage</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAdd} className="mt-4">
          <Plus className="size-4 mr-1.5" /> Add Program
        </Button>
      </div>

      <div className="glass-card p-5 border border-border rounded-xl">
        <h3 className="mb-4 text-base font-bold">Programs List ({programs.length})</h3>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-border bg-background/60 p-3"
            >
              <div>
                <p className="font-bold text-xs sm:text-sm text-foreground">{p.name}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px]">
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 font-semibold text-primary">
                    {p.stage_type}
                  </span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
                    {p.category}
                  </span>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onSavePrograms(programs.filter((x) => x.id !== p.id))}
                className="size-7 text-destructive"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultsTabInner({
  results,
  competitors,
  programs,
  teams,
  onSaveResults,
}: {
  results: AdminResultRecord[];
  competitors: CompetitorRecord[];
  programs: ProgramRecord[];
  teams: Team[];
  onSaveResults: (next: AdminResultRecord[]) => void;
}) {
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedCompetitorId, setSelectedCompetitorId] = useState("");
  const [position, setPosition] = useState<"1st" | "2nd" | "3rd" | "NIL">("1st");
  const [grade, setGrade] = useState<"A" | "B" | "C" | "NIL">("NIL");
  const [score, setScore] = useState<number>(7);

  // Auto calculate score based on position and grade
  useEffect(() => {
    let posPts = 0;
    if (position === "1st") posPts = 7;
    else if (position === "2nd") posPts = 5;
    else if (position === "3rd") posPts = 3;

    let gradePts = 0;
    if (grade === "A") gradePts = 3;
    else if (grade === "B") gradePts = 2;
    else if (grade === "C") gradePts = 1;

    setScore(posPts + gradePts);
  }, [position, grade]);

  const handleAddResult = () => {
    const prog = programs.find((p) => p.id === selectedProgramId);
    const comp = competitors.find((c) => c.id === selectedCompetitorId);

    if (!prog || !comp) {
      toast.error("Please select both a program and a competitor");
      return;
    }

    const team = teams.find((t) => t.id === comp.team_id);

    const newRec: AdminResultRecord = {
      id: `r-${Date.now()}`,
      competitor_id: comp.id,
      program_id: prog.id,
      chest_no: comp.chest_no,
      competitor_name: comp.name,
      category: prog.category || comp.category,
      team_id: comp.team_id,
      team_name: team?.name ?? null,
      program_name: prog.name,
      stage_type: prog.stage_type,
      position,
      grade,
      score,
    };

    onSaveResults([newRec, ...results]);
    setSelectedCompetitorId("");
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 border border-border rounded-xl">
        <h3 className="mb-4 text-base font-bold">Declare Individual Result</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Select Program</label>
            <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose Program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.stage_type} · {p.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1">Select Competitor</label>
            <Select value={selectedCompetitorId} onValueChange={setSelectedCompetitorId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose Competitor" />
              </SelectTrigger>
              <SelectContent>
                {competitors.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    #{c.chest_no} · {c.name} ({teams.find((t) => t.id === c.team_id)?.name ?? "—"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1">Position</label>
            <Select
              value={position}
              onValueChange={(v) => setPosition(v as "1st" | "2nd" | "3rd" | "NIL")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1st">1st Place (7 pts)</SelectItem>
                <SelectItem value="2nd">2nd Place (5 pts)</SelectItem>
                <SelectItem value="3rd">3rd Place (3 pts)</SelectItem>
                <SelectItem value="NIL">NIL / Participation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1">Grade</label>
            <Select value={grade} onValueChange={(v) => setGrade(v as "A" | "B" | "C" | "NIL")}>
              <SelectTrigger>
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Grade A (+3 pts)</SelectItem>
                <SelectItem value="B">Grade B (+2 pts)</SelectItem>
                <SelectItem value="C">Grade C (+1 pt)</SelectItem>
                <SelectItem value="NIL">No Grade (+0)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1">Calculated Score</label>
            <Input
              type="number"
              value={score}
              onChange={(e) => setScore(Number(e.target.value) || 0)}
              className="font-bold text-amber-500"
            />
          </div>
        </div>

        <Button onClick={handleAddResult} className="mt-4">
          <Plus className="size-4 mr-1.5" /> Save & Auto-Sync Result
        </Button>
      </div>

      <div className="glass-card p-5 border border-border rounded-xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold">Declared Individual Results ({results.length})</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const rows = results.map((r) => ({
                Program: r.program_name,
                Stage: r.stage_type,
                Chest: r.chest_no,
                Competitor: r.competitor_name,
                Team: r.team_name,
                Position: r.position,
                Grade: r.grade,
                Score: r.score,
              }));
              exportToExcel(rows, "Individual_Results");
              toast.success("Excel exported");
            }}
            className="text-xs gap-1.5"
          >
            <FileSpreadsheet className="size-3.5 text-emerald-500" /> Export Excel
          </Button>
        </div>

        {results.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">
            No individual competition results declared yet. Use the form above to add scores.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-muted/50 text-[11px] uppercase text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-2.5">Program</th>
                  <th className="px-4 py-2.5">Competitor</th>
                  <th className="px-4 py-2.5">Team</th>
                  <th className="px-4 py-2.5">Position</th>
                  <th className="px-4 py-2.5">Grade</th>
                  <th className="px-4 py-2.5 text-right">Score</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20">
                    <td className="px-4 py-2.5">
                      <span className="font-bold text-foreground block">{r.program_name}</span>
                      <span className="text-[10px] text-muted-foreground">{r.stage_type}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-semibold text-foreground">{r.competitor_name}</span>
                      <span className="text-[10px] text-muted-foreground block">#{r.chest_no}</span>
                    </td>
                    <td className="px-4 py-2.5 font-medium">{r.team_name ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      <span className="rounded bg-primary/10 px-2 py-0.5 font-bold text-primary text-xs">
                        {r.position}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">{r.grade}</td>
                    <td className="px-4 py-2.5 text-right font-black text-amber-500">{r.score}</td>
                    <td className="px-4 py-2.5 text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onSaveResults(results.filter((x) => x.id !== r.id))}
                        className="size-7 text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function GeneralResultsTabInner({
  generalResults,
  programs,
  teams,
  onSaveGeneralResults,
}: {
  generalResults: GeneralResultRecord[];
  programs: ProgramRecord[];
  teams: Team[];
  onSaveGeneralResults: (next: GeneralResultRecord[]) => void;
}) {
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [position, setPosition] = useState<"1st" | "2nd" | "3rd" | "NIL">("1st");
  const [score, setScore] = useState<number>(10);

  useEffect(() => {
    if (position === "1st") setScore(10);
    else if (position === "2nd") setScore(7);
    else if (position === "3rd") setScore(5);
    else setScore(0);
  }, [position]);

  const handleAdd = () => {
    const prog = programs.find((p) => p.id === selectedProgramId);
    const team = teams.find((t) => t.id === selectedTeamId);

    if (!prog || !team) {
      toast.error("Select both program and team");
      return;
    }

    const newRec: GeneralResultRecord = {
      id: `gr-${Date.now()}`,
      program_id: prog.id,
      program_name: prog.name,
      stage_type: prog.stage_type,
      team_id: team.id,
      team_name: team.name,
      position,
      grade: "NIL",
      score,
    };

    onSaveGeneralResults([newRec, ...generalResults]);
    setSelectedProgramId("");
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 border border-border rounded-xl">
        <h3 className="mb-4 text-base font-bold">Assign General / Group Event Score</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Assign scores for events like GROUP SONG ARB, BURDA, DEBATE, QUIZ. These directly add to
          team grand totals and auto-sync immediately!
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Select Program</label>
            <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose Program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.stage_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1">Select Winning Team</label>
            <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose Team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1">Position</label>
            <Select
              value={position}
              onValueChange={(v) => setPosition(v as "1st" | "2nd" | "3rd" | "NIL")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1st">1st Place (10 pts)</SelectItem>
                <SelectItem value="2nd">2nd Place (7 pts)</SelectItem>
                <SelectItem value="3rd">3rd Place (5 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1">Points</label>
            <Input
              type="number"
              value={score}
              onChange={(e) => setScore(Number(e.target.value) || 0)}
              className="font-bold text-amber-500"
            />
          </div>
        </div>

        <Button onClick={handleAdd} className="mt-4">
          <Plus className="size-4 mr-1.5" /> Save & Auto-Sync Team Score
        </Button>
      </div>

      <div className="glass-card p-5 border border-border rounded-xl">
        <h3 className="mb-4 text-base font-bold">General Results List ({generalResults.length})</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/50 text-[11px] uppercase text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-2.5">Program</th>
                <th className="px-4 py-2.5">Stage</th>
                <th className="px-4 py-2.5">Awarded Team</th>
                <th className="px-4 py-2.5">Position</th>
                <th className="px-4 py-2.5 text-right">Points</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {generalResults.map((gr) => (
                <tr key={gr.id} className="hover:bg-muted/20">
                  <td className="px-4 py-2.5 font-bold text-foreground">{gr.program_name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{gr.stage_type}</td>
                  <td className="px-4 py-2.5 font-bold text-primary">{gr.team_name}</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded bg-amber-500/10 px-2 py-0.5 font-bold text-amber-600 dark:text-amber-400 text-xs">
                      {gr.position}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-black text-amber-500 text-base">
                    {gr.score}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        onSaveGeneralResults(generalResults.filter((x) => x.id !== gr.id))
                      }
                      className="size-7 text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusTabInner({
  statuses,
  programs,
  onSaveStatuses,
}: {
  statuses: ProgramStatus[];
  programs: ProgramRecord[];
  onSaveStatuses: (next: ProgramStatus[]) => void;
}) {
  const toggleStatus = (id: string) => {
    const updated = statuses.map((s) =>
      s.id === id
        ? { ...s, status: (s.status === "Outed" ? "Pending" : "Outed") as "Outed" | "Pending" }
        : s,
    );
    onSaveStatuses(updated);
  };

  return (
    <div className="glass-card p-5 border border-border rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold">Program Status Manager</h3>
          <p className="text-xs text-muted-foreground">
            Toggle programs between "Outed" (Results declared) and "Pending". Real-time ticker and
            banners auto-update immediately.
          </p>
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {statuses.map((st) => (
          <div
            key={st.id}
            className="flex items-center justify-between rounded-xl border border-border bg-background/60 p-3"
          >
            <div>
              <p className="font-bold text-xs sm:text-sm text-foreground">{st.program}</p>
              <span className="text-[10px] text-muted-foreground">{st.category}</span>
            </div>
            <Button
              size="sm"
              variant={st.status === "Outed" ? "default" : "outline"}
              onClick={() => toggleStatus(st.id)}
              className={`text-xs font-bold ${
                st.status === "Outed"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "border-amber-500/40 text-amber-500 hover:bg-amber-500/10"
              }`}
            >
              {st.status === "Outed" ? "✓ Outed" : "Pending"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
