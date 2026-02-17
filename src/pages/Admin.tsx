import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, MapPin, ExternalLink, ArrowLeft, Grid3X3, List, Briefcase, MoreVertical, Home, Users, Settings, Menu, Archive, CalendarDays, LayoutGrid, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminCalendar } from "@/components/admin/AdminCalendar";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { PositionView } from "@/components/admin/PositionView";
import {
  Application,
  AdminView,
  positionGradients,
  getGradient,
  getAvatarUrl,
  getInitialColor,
  formatDate,
  formatShortDate,
} from "@/components/admin/types";

export default function Admin() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "categories">("categories");
  const [activeView, setActiveView] = useState<AdminView>("applications");
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Stream");

  useEffect(() => {
    document.title = "ANG SILAKBO - Membership Portal";
    fetchApplications();
  }, []);

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

  // Group applications by position for sidebar
  const applicationsByPosition = applications.reduce((acc, app) => {
    if (!acc[app.position]) acc[app.position] = [];
    acc[app.position].push(app);
    return acc;
  }, {} as Record<string, Application[]>);

  const viewTitles: Record<AdminView, string> = {
    applications: "Applications",
    calendar: "Calendar",
    settings: "Settings",
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Google Classroom-style Sidebar */}
        <Sidebar collapsible="icon" className="border-r border-border bg-card">
          <SidebarContent className="py-2">
            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => {
                        setActiveView("applications");
                        setSelectedPosition(null);
                        setSelectedApplication(null);
                      }}
                      className={`h-12 px-6 rounded-r-full rounded-l-none group-data-[collapsible=icon]:rounded-md cursor-pointer ${
                        activeView === "applications" && !selectedPosition && !selectedApplication
                          ? "bg-accent/10 text-accent font-medium hover:bg-accent/15"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <LayoutGrid className="w-5 h-5 mr-4 group-data-[collapsible=icon]:mr-0" />
                      <span className="group-data-[collapsible=icon]:hidden">Classes</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => {
                        setActiveView("calendar");
                        setSelectedPosition(null);
                        setSelectedApplication(null);
                      }}
                      className={`h-12 px-6 rounded-r-full rounded-l-none group-data-[collapsible=icon]:rounded-md cursor-pointer ${
                        activeView === "calendar"
                          ? "bg-accent/10 text-accent font-medium hover:bg-accent/15"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <CalendarDays className="w-5 h-5 mr-4 group-data-[collapsible=icon]:mr-0" />
                      <span className="group-data-[collapsible=icon]:hidden">Calendar</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Divider */}
            <div className="mx-4 my-2 h-px bg-border" />

            {/* Applications Group */}
            <SidebarGroup>
              <SidebarGroupLabel
                className="px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-between cursor-pointer hover:text-foreground group"
                onClick={() => {
                  setActiveView("applications");
                  setSelectedPosition(null);
                  setSelectedApplication(null);
                }}
              >
                <span>Enrolled</span>
                <span className="text-accent text-xs">{applications.length}</span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {Object.entries(applicationsByPosition).map(([position, apps]) => (
                    <SidebarMenuItem key={position}>
                      <SidebarMenuButton
                        onClick={() => {
                          setActiveView("applications");
                          setSelectedPosition(position);
                        }}
                        className={`h-14 px-6 rounded-r-full rounded-l-none group-data-[collapsible=icon]:rounded-md text-foreground hover:bg-secondary group cursor-pointer ${
                          selectedPosition === position ? "bg-accent/10 text-accent font-medium hover:bg-accent/15" : ""
                        }`}
                      >
                        <img
                          src={getAvatarUrl(position, 'thumbs')}
                          alt={position}
                          className="w-8 h-8 rounded-full shrink-0 object-cover"
                        />
                        <div className="ml-3 min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                          <p className="text-sm font-medium truncate">{position}</p>
                          <p className="text-xs text-muted-foreground">{apps.length} applicant{apps.length !== 1 ? "s" : ""}</p>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Divider */}
            <div className="mx-4 my-2 h-px bg-border" />

            {/* Bottom Navigation */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="h-12 px-6 rounded-r-full rounded-l-none group-data-[collapsible=icon]:rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                      <Archive className="w-5 h-5 mr-4 group-data-[collapsible=icon]:mr-0" />
                      <span className="group-data-[collapsible=icon]:hidden">Archived</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => {
                        setActiveView("settings");
                        setSelectedPosition(null);
                      }}
                      className={`h-12 px-6 rounded-r-full rounded-l-none group-data-[collapsible=icon]:rounded-md cursor-pointer ${
                        activeView === "settings"
                          ? "bg-accent/10 text-accent font-medium hover:bg-accent/15"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Settings className="w-5 h-5 mr-4 group-data-[collapsible=icon]:mr-0" />
                      <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedApplication ? (
            <div className="relative flex-1 flex flex-col min-w-0 overflow-y-auto bg-background">
              {/* Top Bar */}
              <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center gap-4">
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{selectedApplication.position}</p>
                  <p className="text-xs text-muted-foreground truncate">{selectedApplication.section}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                      <MoreVertical className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => window.open(`mailto:${selectedApplication.email}`)}>
                      Send Email
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </header>

              {/* Content Area */}
              <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                {/* Left - Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Title Section */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getGradient(selectedApplication.position)} flex items-center justify-center shrink-0 overflow-hidden`}>
                      <img
                        src={getAvatarUrl(selectedApplication.position, 'thumbs')}
                        alt={selectedApplication.position}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h1 className="font-sans font-bold text-2xl text-foreground">
                        {selectedApplication.full_name}
                      </h1>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedApplication.section} • {formatDate(selectedApplication.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-border mb-6" />

                  {/* Application Details */}
                  <div className="space-y-6">
                    {/* Contact */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <a href={`mailto:${selectedApplication.email}`} className="text-accent hover:underline">
                          {selectedApplication.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">{selectedApplication.phone_number}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">{selectedApplication.complete_address}</span>
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Experience */}
                    <div>
                      <h3 className="font-sans font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        Relevant Experience
                      </h3>
                      <p className="text-muted-foreground whitespace-pre-wrap break-words leading-relaxed pl-7">
                        {selectedApplication.relevant_experience}
                      </p>
                    </div>

                    {/* Portfolio */}
                    {selectedApplication.portfolio_link && (
                      <>
                        <div className="h-px bg-border" />
                        <div>
                          <h3 className="font-sans font-semibold text-foreground mb-3 flex items-center gap-2">
                            <ExternalLink className="w-5 h-5 text-muted-foreground" />
                            Portfolio
                          </h3>
                          <a
                            href={selectedApplication.portfolio_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline break-all pl-7"
                          >
                            {selectedApplication.portfolio_link}
                          </a>
                        </div>
                      </>
                    )}

                    {/* Additional Message */}
                    {selectedApplication.additional_message && (
                      <>
                        <div className="h-px bg-border" />
                        <div>
                          <h3 className="font-sans font-semibold text-foreground mb-3">Additional Message</h3>
                          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {selectedApplication.additional_message}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right - Sidebar Card */}
                <div className="lg:w-72 shrink-0 space-y-4">
                  {/* Applicant Info Card */}
                  <div className="bg-card border border-border rounded-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-sans font-semibold text-foreground">Applicant Info</h3>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full bg-gradient-to-r ${getGradient(selectedApplication.position)} text-white flex items-center gap-1.5`}>
                        <img src={getAvatarUrl(selectedApplication.position, 'thumbs')} className="w-3.5 h-3.5 rounded-full bg-white/20" alt="" />
                        {selectedApplication.position}
                      </span>
                    </div>

                    {/* Avatar & Name */}
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={getAvatarUrl(selectedApplication.full_name, 'notionists')}
                        alt={selectedApplication.full_name}
                        className="w-10 h-10 rounded-full bg-secondary"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{selectedApplication.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{selectedApplication.email}</p>
                      </div>
                    </div>

                    <div className="h-px bg-border mb-4" />

                    {/* Details */}
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Section</p>
                        <p className="font-medium text-foreground">{selectedApplication.section}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Referral Source</p>
                        <p className="font-medium text-foreground">{selectedApplication.referral_source}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Submitted</p>
                        <p className="font-medium text-foreground">{formatShortDate(selectedApplication.created_at)}</p>
                      </div>
                    </div>

                    <div className="h-px bg-border my-4" />

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => window.open(`mailto:${selectedApplication.email}`)}
                        className="w-full py-2 px-4 border border-accent text-accent rounded-md text-sm font-medium hover:bg-accent/5 transition-colors"
                      >
                        Contact Applicant
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <header className="bg-card border-b border-border sticky top-0 z-40">
                <div className="flex items-center justify-between py-3 px-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <SidebarTrigger className="p-2 hover:bg-secondary rounded-lg shrink-0">
                      <Menu className="w-5 h-5" />
                    </SidebarTrigger>
                    {!selectedPosition ? (
                      <div className="flex items-center gap-3">
                        <img src={logo} alt="Ang Silakbo Logo" className="w-8 h-8 object-contain" />
                        <span className="font-sans font-bold text-xl text-foreground tracking-tight">ANG SILAKBO</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span
                          className="font-sans font-medium text-lg text-muted-foreground cursor-pointer hover:text-foreground transition-colors shrink-0"
                          onClick={() => {
                            setSelectedPosition(null);
                            setSelectedApplication(null);
                          }}
                        >
                          ANG SILAKBO
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="font-sans font-bold text-lg text-foreground truncate">
                          {selectedPosition}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Action buttons could go here */}
                  </div>
                </div>

                {/* Position View Tabs */}
                {selectedPosition && activeView === "applications" && (
                  <div className="flex justify-center border-t border-border/10">
                    <nav className="flex gap-4 sm:gap-8 px-4 h-12">
                      {["Stream", "Classwork", "People"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-4 h-full border-b-4 font-sans font-medium text-sm transition-all relative top-[2px] ${
                            activeTab === tab
                              ? "border-accent text-accent"
                              : "border-transparent text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </nav>
                  </div>
                )}
              </header>

              <main className="flex-1 p-6 overflow-auto">
                {/* Calendar View */}
                {activeView === "calendar" && (
                  <AdminCalendar
                    applications={applications}
                    onSelectApplication={setSelectedApplication}
                  />
                )}

                {/* Settings View */}
                {activeView === "settings" && (
                  <AdminSettings
                    applications={applications}
                    onRefresh={fetchApplications}
                  />
                )}

                {/* Applications View */}
                {activeView === "applications" && (
                  selectedPosition ? (
                    <PositionView
                      position={selectedPosition}
                      applications={applicationsByPosition[selectedPosition] || []}
                      onSelectApplication={setSelectedApplication}
                      activeTab={activeTab}
                    />
                  ) : (
                    <>
                      {/* Stats */}
                      <div className="mb-6">
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
                      ) : viewMode === "categories" ? (
                        /* Category View */
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {Array.from(new Set([...Object.keys(positionGradients), ...Object.keys(applicationsByPosition)])).map((position) => {
                            const apps = applicationsByPosition[position] || [];
                            return (
                              <div
                                key={position}
                                className="bg-card rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group border border-border flex flex-col h-full"
                                onClick={() => setSelectedPosition(position)}
                              >
                                {/* Gradient Header */}
                                <div className={`relative h-24 bg-gradient-to-br ${getGradient(position)} p-4 flex flex-col justify-between`}>
                                  <div className="flex items-start justify-between">
                                    <div className="min-w-0">
                                      <h3 className="font-bold text-white text-lg leading-tight group-hover:underline truncate">
                                        {position}
                                      </h3>
                                      <p className="text-white/80 text-xs mt-0.5">A.Y. 2025-2026</p>
                                    </div>
                                    <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors shrink-0">
                                      <MoreVertical className="w-4 h-4 text-white" />
                                    </button>
                                  </div>

                                  {/* Avatar positioned absolutely */}
                                  <div className="absolute -bottom-6 right-4">
                                    <img
                                      src={getAvatarUrl(position, 'thumbs')}
                                      alt={position}
                                      className="w-12 h-12 rounded-full border-4 border-card bg-secondary shadow-md object-cover"
                                    />
                                  </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-4 pt-8 flex-1 flex flex-col">
                                  <div className="flex-1">
                                     <p className="text-sm text-muted-foreground">
                                       {apps.length} applicant{apps.length !== 1 ? "s" : ""}
                                     </p>
                                  </div>
                                  <div className="mt-4 pt-3 border-t border-border flex justify-end gap-1">
                                      <button className="p-2 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors">
                                         <Users className="w-4 h-4" />
                                      </button>
                                      <button className="p-2 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors">
                                         <Archive className="w-4 h-4" />
                                      </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : viewMode === "grid" ? (
                        /* Grid View */
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {applications.map((app) => (
                            <div
                              key={app.id}
                              className="bg-card rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group border border-border"
                              onClick={() => setSelectedApplication(app)}
                            >
                              {/* Gradient Header */}
                              <div className={`relative h-32 bg-gradient-to-br ${getGradient(app.position)} p-4`}>
                                <h3 className="font-semibold text-white text-lg leading-tight line-clamp-2 flex items-center gap-2">
                                  <img src={getAvatarUrl(app.position, 'thumbs')} className="w-5 h-5 rounded-full bg-white/20 shrink-0" alt="" />
                                  {app.position}
                                </h3>
                                <p className="text-white/90 text-sm mt-1">{app.section}</p>
                                <p className="text-white/80 text-sm">{app.full_name}</p>

                                {/* Avatar */}
                                <div className="absolute bottom-4 right-4">
                                  <img
                                    src={getAvatarUrl(app.full_name, 'notionists')}
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
                                src={getAvatarUrl(app.full_name, 'notionists')}
                                alt={app.full_name}
                                className="w-10 h-10 rounded-full bg-secondary"
                              />
                              <div>
                                <p className="font-medium text-foreground">{app.full_name}</p>
                                <p className="text-sm text-muted-foreground">{app.email}</p>
                              </div>
                              <span className={`text-sm font-medium px-3 py-1 rounded-full w-fit bg-gradient-to-r ${getGradient(app.position)} text-white flex items-center gap-1.5`}>
                                <img src={getAvatarUrl(app.position, 'thumbs')} className="w-4 h-4 rounded-full bg-white/20" alt="" />
                                {app.position}
                              </span>
                              <span className="text-sm text-muted-foreground">{app.section}</span>
                              <span className="text-sm text-muted-foreground">{formatShortDate(app.created_at)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )
                )}
              </main>
            </>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}
