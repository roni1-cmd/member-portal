import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  initial: string;
  delay?: number;
}

export function TestimonialCard({ quote, name, role, initial, delay = 0 }: TestimonialCardProps) {
  return (
    <div 
      className="group relative bg-card rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-500 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Quote Icon */}
      <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg">
        <Quote className="w-4 h-4 text-accent-foreground" />
      </div>

      {/* Quote Text */}
      <p className="font-serif text-foreground/90 leading-relaxed mb-6 pt-2 italic">
        "{quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-navy-light flex items-center justify-center text-primary-foreground font-display text-xl">
          {initial}
        </div>
        <div>
          <h4 className="font-semibold text-foreground">{name}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>

      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-gold-light to-accent rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

const testimonials = [
  {
    quote: "Being the Editor-in-Chief of Ang Silakbo has been a transformative experience, shaping me in ways I couldn't have imagined. It's not just about deadlines and articles, it's about amplifying student voices and fostering a vibrant school community.",
    name: "Thea Clarisse Mae Inoc",
    role: "Former Editor In Chief | A.Y. 2024-2025",
    initial: "T",
  },
  {
    quote: "Ang Silakbo Publication has made a huge impact on me, helping me learn and grow as a writer and an individual. Becoming an Associate Editor was not something I initially looked forward to, but as time passed, I realized how much it had to offer.",
    name: "Lyka May Jakosalem",
    role: "Former Associate Editor | A.Y. 2024-2025",
    initial: "L",
  },
  {
    quote: "Being part of Ang Silakbo has been an incredible journey of growth and discovery. As a broadcaster and the head of production team, I've had the opportunity to capture the moments that tell powerful stories about our school community.",
    name: "Ron Asnahon",
    role: "Former Head of Production Team | A.Y. 2024-2025",
    initial: "R",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent font-medium text-sm rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Hear From Our Alumni
          </h2>
          <p className="text-muted-foreground font-serif text-lg max-w-2xl mx-auto">
            Discover how Ang Silakbo has shaped the careers and lives of our former members
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              {...testimonial}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
