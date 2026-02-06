import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Mail, Phone, MapPin, Calendar, ExternalLink, ArrowLeft, Grid3X3, List, Briefcase, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Application {
  id: string;
  full_name: string;
  section: string;
  email: string;
  phone_number: string;
  complete_address: string;
  position: string;
  relevant_experience: string;
  portfolio_link: string | null;
  referral_source: string;
  additional_message: string | null;
  created_at: string;
}

const ADMIN_PASSWORD = "silakbo2025";

// Position-based gradient colors
const positionGradients: Record<string, string> = {
  "Feature News Writer": "from-sky-400 to-sky-600",
  "Editorial Writer": "from-teal-400 to-teal-600",
  "Local News Writer": "from-emerald-400 to-emerald-600",
  "Sports News Writer": "from-orange-400 to-orange-600",
  "Layout Artist": "from-purple-400 to-purple-600",
  "Photojournalist": "from-pink-400 to-pink-600",
  "Video Journalist": "from-rose-400 to-rose-600",
  "Video Editor": "from-indigo-400 to-indigo-600",
  "Broadcaster": "from-amber-400 to-amber-600",
};

const getGradient = (position: string) => {
  return positionGradients[position] || "from-accent to-accent/80";
};

// DiceBear avatar URL generator (using initials style)
const getAvatarUrl = (name: string) => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=ffffff&textColor=374151&fontSize=40`;
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
      localStorage.setItem("admin_auth", "true");
    } else {
      setError("Incorrect password");
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await supabase.functions.invoke("get-applications");
      if (response.error) throw response.error;
      setApplications(response.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    setPassword("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src={logo} alt="Ang Silakbo Logo" className="w-12 h-12 object-contain" />
              <span className="font-sans font-bold text-2xl text-foreground">ANG SILAKBO</span>
            </div>
            <h1 className="font-display text-3xl text-foreground mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">Enter the password to view applications</p>
          </div>

          <form onSubmit={handleLogin} className="bg-card rounded-2xl p-8 shadow-lg border border-border">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-editorial w-full pl-10"
                  placeholder="Enter admin password"
                />
              </div>
              {error && <p className="text-destructive text-sm mt-2">{error}</p>}
            </div>
            <button type="submit" className="btn-accent w-full">
              Access Panel
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/" className="text-muted-foreground hover:text-accent transition-colors text-sm">
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-card border-b border-border py-4 px-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Ang Silakbo Logo" className="w-8 h-8 object-contain" />
            <span className="font-sans font-bold text-xl text-foreground">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center bg-secondary rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid" 
                    ? "bg-card text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list" 
                    ? "bg-card text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Link to="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-8">
          <h1 className="font-display text-3xl text-foreground mb-2">Applications</h1>
          <p className="text-muted-foreground">
            {applications.length} total application{applications.length !== 1 ? "s" : ""} received
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl text-foreground mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground">Applications will appear here once submitted.</p>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-card rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group border border-border"
                onClick={() => setSelectedApplication(app)}
              >
                {/* Gradient Header */}
                <div className={`relative h-32 bg-gradient-to-br ${getGradient(app.position)} p-4`}>
                  <h3 className="font-semibold text-white text-lg leading-tight line-clamp-2">
                    {app.position}
                  </h3>
                  <p className="text-white/90 text-sm mt-1">{app.section}</p>
                  <p className="text-white/80 text-sm">{app.full_name}</p>
                  
                  {/* Avatar */}
                  <div className="absolute bottom-4 right-4">
                    <img
                      src={getAvatarUrl(app.full_name)}
                      alt={app.full_name}
                      className="w-16 h-16 rounded-full border-4 border-white/30 bg-white shadow-lg"
                    />
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatShortDate(app.created_at)}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <button className="p-1 hover:bg-secondary rounded-full transition-colors">
                        <MoreVertical className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedApplication(app)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(`mailto:${app.email}`)}>
                        Send Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 p-4 bg-secondary/50 border-b border-border text-sm font-medium text-muted-foreground">
              <span className="w-10"></span>
              <span>Applicant</span>
              <span>Position</span>
              <span>Section</span>
              <span>Date</span>
            </div>
            {applications.map((app) => (
              <div
                key={app.id}
                className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/30 cursor-pointer transition-colors items-center"
                onClick={() => setSelectedApplication(app)}
              >
                <img
                  src={getAvatarUrl(app.full_name)}
                  alt={app.full_name}
                  className="w-10 h-10 rounded-full bg-secondary"
                />
                <div>
                  <p className="font-medium text-foreground">{app.full_name}</p>
                  <p className="text-sm text-muted-foreground">{app.email}</p>
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded-full w-fit bg-gradient-to-r ${getGradient(app.position)} text-white`}>
                  {app.position}
                </span>
                <span className="text-sm text-muted-foreground">{app.section}</span>
                <span className="text-sm text-muted-foreground">{formatShortDate(app.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
            onClick={() => setSelectedApplication(null)}
          />
          <div className="relative bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header with Gradient */}
            <div className={`relative bg-gradient-to-br ${getGradient(selectedApplication.position)} p-6 text-white`}>
              <button
                onClick={() => setSelectedApplication(null)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-end gap-4">
                <img
                  src={getAvatarUrl(selectedApplication.full_name)}
                  alt={selectedApplication.full_name}
                  className="w-20 h-20 rounded-full border-4 border-white/30 bg-white shadow-lg"
                />
                <div>
                  <span className="text-sm font-medium text-white/80 uppercase tracking-wider">
                    {selectedApplication.position}
                  </span>
                  <h2 className="font-display text-2xl mt-1">
                    {selectedApplication.full_name}
                  </h2>
                  <p className="text-white/80">{selectedApplication.section}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-muted-foreground">{selectedApplication.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Phone</p>
                    <p className="text-muted-foreground">{selectedApplication.phone_number}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Address</p>
                  <p className="text-muted-foreground">{selectedApplication.complete_address}</p>
                </div>
              </div>

              {/* Experience */}
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-accent" />
                  Relevant Experience
                </h4>
                <p className="text-muted-foreground bg-secondary/50 p-4 rounded-lg whitespace-pre-wrap">
                  {selectedApplication.relevant_experience}
                </p>
              </div>

              {/* Portfolio */}
              {selectedApplication.portfolio_link && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-accent" />
                    Portfolio
                  </h4>
                  <a
                    href={selectedApplication.portfolio_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline break-all"
                  >
                    {selectedApplication.portfolio_link}
                  </a>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Referral Source</p>
                  <p className="text-muted-foreground">{selectedApplication.referral_source}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Submitted</p>
                  <p className="text-muted-foreground">{formatDate(selectedApplication.created_at)}</p>
                </div>
              </div>

              {/* Additional Message */}
              {selectedApplication.additional_message && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Additional Message</h4>
                  <p className="text-muted-foreground bg-secondary/50 p-4 rounded-lg whitespace-pre-wrap">
                    {selectedApplication.additional_message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
