import { useState } from "react";
import { ApplicationModal } from "@/components/ApplicationModal";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { TeamCard } from "@/components/TeamCard";
import { Newspaper, ChevronRight, ArrowRight, Facebook, Mail, MapPin } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";
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
              className="bg-accent text-accent-foreground font-semibold text-sm py-2.5 px-6 rounded-full hover:bg-accent/90 transition-all"
            >
              Subscribe
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-20 overflow-hidden">
        {/* Hero Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Background Illustration Area */}
          <div className="relative rounded-3xl bg-secondary overflow-hidden min-h-[400px] md:min-h-[500px]">
            {/* Hero Illustration */}
            <img 
              src={heroIllustration} 
              alt="Student journalists with cameras and microphones"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Subtle overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/30" />
            
            {/* Floating Card */}
            <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-[90%] sm:w-[350px] md:w-[400px] bg-card rounded-2xl shadow-2xl p-6 md:p-8 animate-slide-up">
              <span className="text-accent font-semibold text-sm uppercase tracking-wide">
                NOW ACCEPTING
              </span>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground mt-3 mb-4 leading-tight">
                Applications for A.Y. 2025-2026 are now open
              </h1>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                Join Ang Silakbo and be part of a passionate community dedicated to delivering impactful journalism.
              </p>
              <button
                onClick={() => document.getElementById('positions')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 text-foreground font-medium hover:text-accent transition-colors group"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team Section */}
      <section id="positions" className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
              Join Our Team
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Choose between our creative writing team or dynamic production team to showcase 
              your talents and make a lasting impact in student journalism.
            </p>
          </div>

          {/* Team Cards */}
          <div className="space-y-8">
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
                <img src={logo} alt="Ang Silakbo Logo" className="w-10 h-10 object-contain" />
                <span className="font-sans font-bold text-2xl">ANG SILAKBO</span>
              </div>
              <p className="text-primary-foreground/70 leading-relaxed">
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
