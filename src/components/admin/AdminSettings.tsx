import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, Trash2, RefreshCw, Moon, Sun, Monitor } from "lucide-react";
import { Application } from "./types";
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

interface AdminSettingsProps {
  applications: Application[];
  onRefresh: () => void;
}

export function AdminSettings({ applications, onRefresh }: AdminSettingsProps) {
  const [isClearing, setIsClearing] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("admin-theme");
      if (stored === "dark" || stored === "light") return stored;
    }
    return "system";
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (applications.length === 0) {
      toast.error("No applications to export");
      return;
    }

    const headers = [
      "Full Name", "Section", "Email", "Phone Number", "Complete Address",
      "Position", "Relevant Experience", "Portfolio Link", "Referral Source",
      "Additional Message", "Submitted At"
    ];

    const csvRows = [
      headers.join(","),
      ...applications.map((app) =>
        [
          `"${app.full_name}"`,
          `"${app.section}"`,
          `"${app.email}"`,
          `"${app.phone_number}"`,
          `"${app.complete_address.replace(/"/g, '""')}"`,
          `"${app.position}"`,
          `"${app.relevant_experience.replace(/"/g, '""')}"`,
          `"${app.portfolio_link || ""}"`,
          `"${app.referral_source}"`,
          `"${(app.additional_message || "").replace(/"/g, '""')}"`,
          `"${new Date(app.created_at).toLocaleString()}"`,
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ang-silakbo-applications-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${applications.length} applications to CSV`);
  };

  // Export to JSON
  const handleExportJSON = () => {
    if (applications.length === 0) {
      toast.error("No applications to export");
      return;
    }

    const jsonContent = JSON.stringify(applications, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ang-silakbo-applications-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${applications.length} applications to JSON`);
  };

  // Clear all applications
  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      const response = await supabase.functions.invoke("clear-applications");
      if (response.error) throw response.error;
      toast.success("All applications cleared successfully");
      onRefresh();
    } catch (err) {
      console.error("Error clearing applications:", err);
      toast.error("Failed to clear applications");
    } finally {
      setIsClearing(false);
    }
  };

  // Theme toggle
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("admin-theme", newTheme);

    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
    } else {
      // System preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
    toast.success(`Theme set to ${newTheme}`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="font-sans text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your admin panel preferences</p>
      </div>

      {/* Theme */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-1">Appearance</h3>
        <p className="text-sm text-muted-foreground mb-4">Choose your preferred theme</p>
        <div className="flex gap-3">
          {[
            { value: "light" as const, icon: Sun, label: "Light" },
            { value: "dark" as const, icon: Moon, label: "Dark" },
            { value: "system" as const, icon: Monitor, label: "System" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleThemeChange(opt.value)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                theme === opt.value
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
              }`}
            >
              <opt.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-1">Export Data</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Download all {applications.length} application{applications.length !== 1 ? "s" : ""} in your preferred format
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export as CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-border text-foreground font-medium hover:bg-secondary transition-colors"
          >
            <Download className="w-4 h-4" />
            Export as JSON
          </button>
        </div>
      </div>

      {/* Refresh Data */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-1">Refresh Data</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Reload all applications from the database
        </p>
        <button
          onClick={() => {
            onRefresh();
            toast.success("Applications refreshed");
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-border text-foreground font-medium hover:bg-secondary transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Applications
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-card rounded-2xl border-2 border-destructive/30 p-6">
        <h3 className="font-semibold text-destructive mb-1">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete all application data. This action cannot be undone.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors">
              <Trash2 className="w-4 h-4" />
              Clear All Applications
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all {applications.length} applications from the database.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearAll}
                disabled={isClearing}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isClearing ? "Clearing..." : "Yes, delete all"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
