import { useState, useEffect, useCallback } from "react";
import { ApplicationModal } from "@/components/ApplicationModal";
import { Facebook, Mail, Send } from "lucide-react";
import logo from "@/assets/logo.png";
import slide1 from "@/assets/slide-1.png";
import slide2 from "@/assets/slide-2.png";
import slide3 from "@/assets/slide-3.png";

type TeamType = "editorial" | "production";

const slides = [slide1, slide2, slide3];

const typingPhrases = [
  "I want to apply as 'Broadcaster'",
  "I want to apply as 'Feature Writer'",
  "I want to apply as 'Editorial Writer'",
  "I want to apply as 'Photojournalist'",
  "I want to apply as 'Layout Artist'",
  "I want to apply as 'Video Editor'",
];

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamType>("editorial");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const openModal = (team: TeamType) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  // Slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Typing animation
  useEffect(() => {
    const currentPhrase = typingPhrases[phraseIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setTypedText(currentPhrase.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
          if (charIndex + 1 === currentPhrase.length) {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          setTypedText(currentPhrase.slice(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
          if (charIndex <= 1) {
            setIsDeleting(false);
            setPhraseIndex((prev) => (prev + 1) % typingPhrases.length);
            setCharIndex(0);
          }
        }
      },
      isDeleting ? 30 : 60
    );
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-16">
            <button
              onClick={() => openModal("editorial")}
              className="bg-accent text-accent-foreground font-semibold text-sm py-2 px-6 rounded-full hover:bg-accent/90 transition-all active:scale-95"
            >
              Apply Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero - Full viewport with slideshow */}
      <section className="relative flex-1 min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background slideshow */}
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: currentSlide === i ? 1 : 0 }}
          >
            <img
              src={slide}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl px-4 sm:px-6 lg:px-8 text-left flex flex-col items-start">
          <div className="flex items-center justify-start gap-3 mb-8">
            <img src={logo} alt="Ang Silakbo Logo" className="w-12 h-12 object-contain" />
          </div>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            ANG SILAKBO
          </h1>

          <p className="text-white/80 text-xl md:text-2xl mb-12 font-light">
            Amplifying Voices. Empowering Stories.
          </p>

          {/* Search bar with typing animation */}
          <div
            className="w-full max-w-3xl bg-white/95 backdrop-blur-sm rounded-full flex items-center px-8 py-6 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow active:scale-[0.98]"
            onClick={() => openModal("editorial")}
          >
            <span className="flex-1 text-left text-muted-foreground text-xl md:text-3xl font-normal" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {typedText}
              <span className="inline-block w-0.5 h-8 bg-accent ml-0.5 animate-pulse align-middle" />
            </span>
            <Send className="w-8 h-8 text-accent ml-4 shrink-0" />
          </div>

          <p className="text-white/70 text-sm mt-6">
            Join our publication for A.Y. 2026-2027
          </p>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === i ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-foreground">Follow Us</span>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-95" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="mailto:uclm@angsilakbo.edu.ph" className="text-muted-foreground hover:text-foreground transition-all hover:scale-110 active:scale-95" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4"><div className="h-px bg-border" /></div>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Ang Silakbo Logo" className="w-6 h-6 object-contain" />
              <span className="font-bold text-sm text-foreground" style={{ fontFamily: 'Poppins, sans-serif' }}>ANG SILAKBO</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Ang Silakbo Publication
            </p>
          </div>
        </div>
      </footer>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        teamType={selectedTeam}
      />
    </div>
  );
};

export default Index;
