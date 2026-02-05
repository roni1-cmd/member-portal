import { Pen, Video, ArrowRight } from "lucide-react";

interface TeamCardProps {
  type: "editorial" | "production";
  onApply: () => void;
}

const teamData = {
  editorial: {
    icon: Pen,
    title: "Editorial Board",
    description: "Join our editorial powerhouse and craft compelling stories that inform, inspire, and engage our community through powerful journalism.",
    positions: [
      "Feature News Writer",
      "Editorial Writer",
      "Local News Writer",
      "Sports News Writer",
      "Layout Artist",
    ],
    accentColor: "text-accent",
  },
  production: {
    icon: Video,
    title: "Production Team",
    description: "Bring stories to life through cutting-edge visual design, multimedia content, and innovative production techniques.",
    positions: [
      "Photojournalist",
      "Video Journalist",
      "Video Editor",
      "Broadcaster",
    ],
    accentColor: "text-accent",
  },
};

export function TeamCard({ type, onApply }: TeamCardProps) {
  const data = teamData[type];
  const Icon = data.icon;

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border">
      <div className="flex flex-col lg:flex-row">
        {/* Content Side */}
        <div className="flex-1 p-8 md:p-10">
          {/* Title */}
          <h3 className="font-display text-2xl md:text-3xl text-foreground mb-4">
            {data.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-6">
            {data.description}
          </p>

          {/* Author/Meta info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-accent font-semibold text-sm">{data.positions.length} Positions</p>
              <p className="text-muted-foreground text-xs">Open for A.Y. 2025-2026</p>
            </div>
          </div>

          {/* Positions List */}
          <div className="flex flex-wrap gap-2 mb-6">
            {data.positions.map((position) => (
              <span
                key={position}
                className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1.5 rounded-full"
              >
                {position}
              </span>
            ))}
          </div>

          {/* Arrow Button */}
          <button
            onClick={onApply}
            className="flex items-center gap-2 text-foreground font-medium hover:text-accent transition-colors group/btn"
          >
            Apply Now
            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Image Side */}
        <div className="lg:w-[350px] h-64 lg:h-auto relative bg-gradient-to-br from-secondary via-accent/10 to-secondary overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-accent/20 absolute -top-4 -left-4 rotate-12" />
              <div className="w-40 h-40 rounded-2xl bg-primary/10 relative flex items-center justify-center">
                <Icon className="w-16 h-16 text-accent/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
