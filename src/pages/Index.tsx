import { useState } from "react";
import { ApplicationModal } from "@/components/ApplicationModal";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { TeamTabs } from "@/components/TeamCard";
import { ArrowDown, Facebook, Mail } from "lucide-react";
import logo from "@/assets/logo.png";

type TeamType = "editorial" | "production";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamType>("editorial");

  const openModal = (team: TeamType) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Ang Silakbo Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
              <span className="font-sans font-bold text-xl md:text-2xl text-foreground tracking-tight">
                ANG SILAKBO
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-sm font-medium text-foreground hover:text-accent transition-colors border-b-2 border-accent pb-1">Home</a>
              <a href="#positions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Positions</a>
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
            <button
              onClick={() => openModal("editorial")}
              className="bg-accent text-accent-foreground font-semibold text-sm py-2.5 px-6 rounded-full hover:bg-accent/90 transition-all active:scale-95"
            >
              Subscribe
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <div className="flex items-center justify-center gap-3 mb-10">
            <img src={logo} alt="Ang Silakbo Logo" className="w-8 h-8 object-contain" />
            <span className="font-sans font-bold text-lg text-foreground tracking-tight">
              ANG SILAKBO
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground leading-tight mb-6 animate-slide-up">
            Amplifying Voices.
            <br />
            Empowering Stories.
          </h1>

          <p className="text-muted-foreground text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: "100ms" }}>
            We provide students with a platform to develop their journalism skills, create meaningful stories, and make a lasting impact on our campus community.
          </p>

          <button
            onClick={() => document.getElementById('positions')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex flex-col items-center gap-2 text-accent font-medium hover:underline transition-all animate-slide-up active:scale-95"
            style={{ animationDelay: "200ms" }}
          >
            <span>Apply for A.Y. 2025-2026</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </section>

      {/* Positions Section */}
      <TeamTabs onApply={openModal} />

      {/* Testimonials Section */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>

      {/* Footer - Google-style minimal */}
      <footer id="contact" className="bg-background border-t border-border">
        {/* Follow Us Row */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-foreground">Follow Us</span>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-95"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="mailto:uclm@angsilakbo.edu.ph"
                className="text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-95"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px bg-border" />
        </div>

        {/* Bottom Bar */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Ang Silakbo Logo" className="w-6 h-6 object-contain" />
                <span className="font-sans font-bold text-sm text-foreground">ANG SILAKBO</span>
              </div>
              <a href="#home" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Home</a>
              <a href="#positions" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Positions</a>
              <a href="#testimonials" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <a href="#contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Ang Silakbo Publication
            </p>
          </div>
        </div>
      </footer>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        teamType={selectedTeam}
      />
    </div>
  );
};

export default Index;
