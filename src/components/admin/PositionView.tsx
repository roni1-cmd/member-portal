import { useState } from "react";
import { Application, getGradient, getAvatarUrl, formatShortDate } from "./types";
import { Users, MoreVertical, ClipboardList, Info } from "lucide-react";

interface PositionViewProps {
  position: string;
  applications: Application[];
  onSelectApplication: (app: Application) => void;
  activeTab: string;
}

export function PositionView({ position, applications, onSelectApplication, activeTab }: PositionViewProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background">
      <div className="flex-1">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {activeTab === "Stream" && (
            <>
              {/* Banner */}
              <div className={`relative h-60 rounded-xl bg-gradient-to-br ${getGradient(position)} p-8 flex flex-col justify-end text-white overflow-hidden shadow-sm ring-1 ring-inset ring-black/5`}>
                <div className="absolute top-0 right-0 p-4">
                   <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <Info className="w-6 h-6" />
                   </button>
                </div>
                <div className="relative z-10">
                  <h1 className="text-3xl font-bold mb-1 drop-shadow-sm">{position}</h1>
                  <p className="text-lg opacity-90 font-medium">ANG SILAKBO 2024</p>
                </div>
                {/* Decorative Pattern / Icon */}
                <div className="absolute -bottom-6 -right-6 opacity-20 transform -rotate-12">
                   <img src={getAvatarUrl(position, 'thumbs')} className="w-48 h-48" alt="" />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Upcoming - Left Column */}
                <div className="lg:w-48 shrink-0 space-y-4">
                  <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Upcoming</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      No work due soon
                    </p>
                    <div className="mt-4 flex justify-end">
                      <button className="text-xs text-accent font-semibold hover:bg-accent/5 px-2 py-1 rounded transition-colors">
                        View all
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Feed */}
                <div className="flex-1 space-y-4">
                  {/* Announcement Placeholder */}
                  <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-all border-l-4 border-l-accent">
                    <img
                      src={getAvatarUrl("Admin", 'notionists')}
                      className="w-10 h-10 rounded-full bg-secondary ring-1 ring-border"
                      alt=""
                    />
                    <span className="text-sm text-muted-foreground">Announce something to your class</span>
                  </div>

                  {/* Applicant Feed Items */}
                  {[...applications].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((app) => (
                    <div
                      key={app.id}
                      onClick={() => onSelectApplication(app)}
                      className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-start gap-4 cursor-pointer hover:shadow-md transition-all group border-l-4 border-l-transparent hover:border-l-accent"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                        <ClipboardList className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <h4 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                            {app.full_name} submitted a new application
                          </h4>
                          <span className="text-xs text-muted-foreground shrink-0 font-medium">{formatShortDate(app.created_at)}</span>
                        </div>
                        <div className="bg-secondary/30 rounded-lg p-3 mt-2">
                           <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed italic">
                            "{app.additional_message || "I am interested in joining Ang Silakbo. I believe my skills and experience would be a great fit for this position."}"
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                           <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 bg-secondary px-2 py-0.5 rounded">
                             {app.section}
                           </span>
                        </div>
                      </div>
                      <button
                        className="p-2 hover:bg-secondary rounded-full opacity-0 group-hover:opacity-100 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <MoreVertical className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                  ))}

                  {applications.length === 0 && (
                    <div className="text-center py-12 bg-card border border-border rounded-xl border-dashed">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                      <p className="text-muted-foreground">No applications for this position yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "People" && (
            <div className="space-y-10 py-4 max-w-3xl mx-auto">
              <section>
                <div className="flex items-center justify-between border-b border-accent/20 pb-3 mb-6">
                  <h2 className="text-3xl text-accent font-sans font-normal">Teachers</h2>
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div className="flex items-center gap-4 px-4">
                  <img src={getAvatarUrl("Admin", 'notionists')} className="w-10 h-10 rounded-full bg-secondary" alt="" />
                  <span className="font-medium text-foreground text-sm">Editorial Board</span>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between border-b border-accent/20 pb-3 mb-6">
                  <h2 className="text-3xl text-accent font-sans font-normal">Applicants</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-accent">{applications.length} applicants</span>
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between px-4 group py-3 hover:bg-secondary/30 transition-colors cursor-pointer"
                      onClick={() => onSelectApplication(app)}
                    >
                      <div className="flex items-center gap-4">
                        <img src={getAvatarUrl(app.full_name, 'notionists')} className="w-10 h-10 rounded-full bg-secondary" alt="" />
                        <span className="text-sm font-medium text-foreground">{app.full_name}</span>
                      </div>
                      <button className="p-2 hover:bg-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <p className="text-center py-8 text-muted-foreground">No applicants found.</p>
                  )}
                </div>
              </section>
            </div>
          )}

          {activeTab === "Classwork" && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ClipboardList className="w-20 h-20 text-accent/20 mb-6" />
              <h2 className="text-xl font-medium text-foreground mb-2">Assign work to your class here</h2>
              <p className="text-muted-foreground max-w-sm">
                Use Classwork to organize assignments and questions into topics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
