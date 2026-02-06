import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, User, Briefcase, Mail, Phone, MapPin, FileText, Calendar, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

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

const ADMIN_PASSWORD = "silakbo2025"; // Simple password protection

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Ang Silakbo Logo" className="w-8 h-8 object-contain" />
            <span className="font-sans font-bold text-xl">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm bg-primary-foreground/10 hover:bg-primary-foreground/20 px-4 py-2 rounded-lg transition-colors"
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
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl text-foreground mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground">Applications will appear here once submitted.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedApplication(app)}
              >
                {/* Card Header */}
                <div className="bg-secondary/50 p-4 border-b border-border">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                    {app.position}
                  </span>
                  <h3 className="font-display text-xl text-foreground mt-1">{app.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{app.section}</p>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{app.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{app.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(app.created_at)}</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 pb-4">
                  <button className="text-accent text-sm font-medium hover:underline">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
            onClick={() => setSelectedApplication(null)}
          />
          <div className="relative bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                  {selectedApplication.position}
                </span>
                <h2 className="font-display text-2xl text-foreground mt-1">
                  {selectedApplication.full_name}
                </h2>
                <p className="text-muted-foreground">{selectedApplication.section}</p>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
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
