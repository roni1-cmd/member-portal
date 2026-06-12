import { useState } from "react";
import { Pen, Video, DollarSign, ArrowRight } from "lucide-react";

interface TeamCardProps {
  onApply: (team: "editorial" | "production" | "finance") => void;
}

const tabs = [
  {
    id: "editorial" as const,
    label: "Editorial Board",
    icon: Pen,
    title: "Craft compelling stories that inform and inspire",
    description:
      "Join our editorial powerhouse and shape the narrative of student journalism. Write feature stories, editorials, local news, sports coverage, and more that resonate with our community.",
    positions: [
      "Feature News Writer",
      "Editorial Writer",
      "Local News Writer",
      "Sports News Writer",
      "Associate Editor",
      "Editor",
      "Editorial Cartoonist",
      "Layout Artist",
    ],
  },
  {
    id: "production" as const,
    label: "Production Team",
    icon: Video,
    title: "Bring stories to life through visual media",
    description:
      "Be the eyes and voice behind the lens. Capture powerful moments, produce engaging video content, and broadcast stories that connect our campus community through cutting-edge multimedia.",
    positions: [
      "Photojournalist",
      "Video Journalist",
      "Video Editor",
      "Broadcaster",
      "Assistant Production Head",
    ],
  },
  {
    id: "finance" as const,
    label: "Finance Team",
    icon: DollarSign,
    title: "Keep the organization financially sound",
    description:
      "Ensure transparency and accountability in all financial matters. Help manage resources and maintain the financial health of the organization.",
    positions: [
      "Auditor",
    ],
  },
];

export function TeamTabs({ onApply }: TeamCardProps) {
  const [activeTab, setActiveTab] = useState<"editorial" | "production" | "finance">("editorial");
  const activeData = tabs.find((t) => t.id === activeTab)!;
  const Icon = activeData.icon;

  return (
    <section id="positions" className="py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            That meets your unique voice
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Choose the team that best matches your skills and passion for student journalism.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-border mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm md:text-base font-medium transition-all relative active:scale-95 ${
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent rounded-full animate-[scaleX_0.3s_ease-out]" style={{ transformOrigin: 'left' }} />
              )}
            </button>
          ))}
        </div>

        {/* Content with animation */}
        <div key={activeTab} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in">
          {/* Visual Side */}
          <div className="relative rounded-3xl overflow-hidden bg-secondary min-h-[350px] md:min-h-[420px] flex items-center justify-center">
            <div className="relative transition-transform duration-500 hover:scale-105">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-accent/20 absolute -top-4 -left-4 rotate-12 transition-transform duration-700 hover:rotate-6" />
              <div className="w-44 h-44 md:w-52 md:h-52 rounded-3xl bg-primary/10 relative flex items-center justify-center">
                <Icon className="w-20 h-20 md:w-24 md:h-24 text-accent/60" />
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div>
            <h3 className="font-display text-2xl md:text-3xl text-foreground mb-4 leading-snug">
              {activeData.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {activeData.description}
            </p>

            {/* Positions */}
            <div className="flex flex-wrap gap-2 mb-8">
              {activeData.positions.map((position, i) => (
                <span
                  key={position}
                  className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1.5 rounded-full transition-all hover:bg-accent/10 hover:text-accent cursor-default animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {position}
                </span>
              ))}
            </div>

            <button
              onClick={() => onApply(activeTab)}
              className="inline-flex items-center gap-2 text-accent font-medium hover:underline transition-all group active:scale-95"
            >
              Apply for {activeData.label}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
