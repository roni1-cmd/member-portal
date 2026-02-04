import { MembershipForm } from "@/components/MembershipForm";
import { Newspaper } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-6 px-4 border-b border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <Newspaper className="w-8 h-8 text-accent" />
          <h1 className="font-display text-2xl md:text-3xl text-foreground tracking-tight">
            The Publication
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent font-medium text-sm rounded-full mb-6 animate-fade-in">
            Now Accepting Applications
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 animate-slide-up leading-tight">
            Join Our Team
          </h2>
          <p className="text-muted-foreground font-serif text-lg md:text-xl leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Be part of a passionate team dedicated to delivering quality journalism. 
            We're looking for creative minds ready to make their mark.
          </p>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-16 bg-border" />
          <div className="w-2 h-2 rounded-full bg-accent" />
          <div className="h-px w-16 bg-border" />
        </div>

        {/* Form */}
        <div className="px-4 pb-16">
          <MembershipForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} The Publication. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
