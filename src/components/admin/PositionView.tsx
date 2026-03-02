import { Application, getGradient, getAvatarUrl, formatShortDate } from "./types";
import { Users, MoreVertical, ClipboardList, Info } from "lucide-react";

interface PositionViewProps {
  position: string;
  applications: Application[];
  onSelectApplication: (app: Application) => void;
}

export function PositionView({ position, applications, onSelectApplication }: PositionViewProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background">
      <div className="flex-1">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {/* Banner */}
          <div className={`relative h-60 rounded-xl bg-gradient-to-br ${getGradient(position)} p-8 flex flex-col justify-end text-white overflow-hidden shadow-sm ring-1 ring-inset ring-black/5`}>
            <div className="absolute top-0 right-0 p-4">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Info className="w-6 h-6" />
              </button>
            </div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-1 drop-shadow-sm">{position}</h1>
              <p className="text-lg opacity-90 font-medium">ANG SILAKBO</p>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-20 transform -rotate-12">
              <img src={getAvatarUrl(position, 'thumbs')} className="w-48 h-48" alt="" />
            </div>
          </div>

          {/* Applicant Feed */}
          <div className="space-y-4">
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
                  onClick={(e) => e.stopPropagation()}
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
      </div>
    </div>
  );
}
