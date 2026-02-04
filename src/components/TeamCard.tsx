import { Pen, Video, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamCardProps {
  type: "editorial" | "production";
  onApply: () => void;
}

const teamData = {
  editorial: {
    icon: Pen,
    title: "Editorial Board",
    description: "Join our editorial powerhouse and craft compelling stories that inform, inspire, and engage our community through powerful journalism and creative writing that makes a difference.",
    positions: [
      "Feature News Writer",
      "Editorial Writer",
      "Local News Writer",
      "Sports News Writer",
      "Layout Artist",
    ],
    gradient: "from-primary to-navy-light",
    buttonText: "Apply for Writers Team",
  },
  production: {
    icon: Video,
    title: "Production Team",
    description: "Bring stories to life through cutting-edge visual design, multimedia content, and innovative production techniques that captivate audiences and set new standards.",
    positions: [
      "Photojournalist",
      "Video Journalist",
      "Video Editor",
      "Broadcaster",
    ],
    gradient: "from-accent to-gold-light",
    buttonText: "Apply for Production Team",
  },
};

export function TeamCard({ type, onApply }: TeamCardProps) {
  const data = teamData[type];
  const Icon = data.icon;

  return (
    <div className="group relative bg-card rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
      {/* Background Gradient Orb */}
      <div className={cn(
        "absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl transition-all duration-500 group-hover:opacity-20 group-hover:scale-150",
        `bg-gradient-to-br ${data.gradient}`
      )} />

      {/* Icon */}
      <div className={cn(
        "relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg",
        `bg-gradient-to-br ${data.gradient}`
      )}>
        <Icon className="w-8 h-8 text-primary-foreground" />
      </div>

      {/* Title */}
      <h3 className="font-display text-2xl md:text-3xl text-foreground mb-4">
        {data.title}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground font-serif leading-relaxed mb-8">
        {data.description}
      </p>

      {/* Positions List */}
      <div className="space-y-3 mb-8">
        {data.positions.map((position) => (
          <div
            key={position}
            className="flex items-center gap-3 text-foreground/80"
          >
            <div className={cn(
              "w-2 h-2 rounded-full",
              type === "editorial" ? "bg-primary" : "bg-accent"
            )} />
            <span className="text-sm font-medium">{position}</span>
          </div>
        ))}
      </div>

      {/* Apply Button */}
      <button
        onClick={onApply}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-300 group/btn",
          type === "editorial" 
            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
            : "btn-accent"
        )}
      >
        <Icon className="w-5 h-5" />
        {data.buttonText}
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
      </button>
    </div>
  );
}
