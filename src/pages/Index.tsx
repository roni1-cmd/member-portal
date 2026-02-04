import { useState } from "react";
import { ApplicationModal } from "@/components/ApplicationModal";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { TeamCard } from "@/components/TeamCard";
import { Newspaper, ChevronRight, Facebook, Mail, MapPin } from "lucide-react";

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
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <Newspaper className="w-8 h-8 text-accent" />
              <span className="font-display text-xl md:text-2xl text-foreground tracking-tight">
                ANG SILAKBO
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</a>
              <a href="#positions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Positions</a>
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
            <button
              onClick={() => openModal("editorial")}
              className="btn-accent text-sm py-2.5 px-5"
            >
              Join Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-20">
          <span className="inline-block px-5 py-2 bg-accent/10 text-accent font-semibold text-sm rounded-full mb-8 animate-fade-in">
            ✨ Now Accepting Applications for A.Y. 2025-2026
          </span>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-8 leading-tight animate-slide-up">
            Shape the Future<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-gold-light">
              of Media
            </span>
          </h1>
          
          <p className="font-serif text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Join Ang Silakbo and be part of a passionate community dedicated to delivering 
            impactful journalism and creative content that matters to our community. 
            <span className="text-foreground font-medium"> Your voice, your story, your impact.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <button
              onClick={() => {
                document.getElementById('positions')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-accent text-lg px-8 py-4 flex items-center gap-2"
            >
              Join Our Team
              <ChevronRight className="w-5 h-5" />
            </button>
            <a
              href="#testimonials"
              className="px-8 py-4 rounded-xl font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              Read Testimonials
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 rounded-full bg-accent animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team Section */}
      <section id="positions" className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent font-medium text-sm rounded-full mb-4">
              Open Positions
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              Join Our Team
            </h2>
            <p className="text-muted-foreground font-serif text-lg max-w-2xl mx-auto">
              Choose between our creative writing team or dynamic production team to showcase 
              your talents and make a lasting impact in student journalism.
            </p>
          </div>

          {/* Team Cards */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <TeamCard type="editorial" onApply={() => openModal("editorial")} />
            <TeamCard type="production" onApply={() => openModal("production")} />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>

      {/* Footer */}
      <footer id="contact" className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Newspaper className="w-8 h-8 text-accent" />
                <span className="font-display text-2xl">ANG SILAKBO</span>
              </div>
              <p className="text-primary-foreground/70 font-serif leading-relaxed">
                Shaping the future of media through passionate journalism and creative 
                storytelling. Join us in making a difference, one story at a time.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#home" className="text-primary-foreground/70 hover:text-accent transition-colors">Home</a>
                </li>
                <li>
                  <a href="#positions" className="text-primary-foreground/70 hover:text-accent transition-colors">Positions</a>
                </li>
                <li>
                  <a href="#testimonials" className="text-primary-foreground/70 hover:text-accent transition-colors">Testimonials</a>
                </li>
                <li>
                  <a href="#contact" className="text-primary-foreground/70 hover:text-accent transition-colors">Contact</a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Contact Information</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-primary-foreground/70">
                  <Mail className="w-5 h-5 text-accent" />
                  <span>uclm@angsilakbo.edu.ph</span>
                </li>
                <li className="flex items-start gap-3 text-primary-foreground/70">
                  <MapPin className="w-5 h-5 text-accent mt-0.5" />
                  <span>University of Cebu Lapu-Lapu and Mandaue</span>
                </li>
              </ul>
              <div className="flex items-center gap-4 mt-6">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center">
            <p className="text-primary-foreground/50 text-sm">
              © {new Date().getFullYear()} Ang Silakbo Publication. All rights reserved.
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
