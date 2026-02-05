import { useState, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  initial: string;
  category: string;
  delay?: number;
  onSeeMore: () => void;
}

export function TestimonialCard({ quote, name, role, initial, category, delay = 0, onSeeMore }: TestimonialCardProps) {
  return (
    <div 
      className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 animate-slide-up border border-border"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Card Content */}
      <div className="p-6 md:p-8">
        {/* Category Tag */}
        <span className="text-accent font-semibold text-xs uppercase tracking-wider">
          {category}
        </span>

        {/* Quote Text */}
        <p className="text-foreground text-base md:text-lg leading-relaxed mt-3 mb-4 line-clamp-3">
          {quote}
        </p>
        
        {/* See More Button */}
        <button 
          onClick={onSeeMore}
          className="text-accent font-medium text-sm hover:underline transition-all mb-4"
        >
          See more →
        </button>
      </div>

      {/* Author Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-secondary via-accent/10 to-secondary overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        
        {/* Avatar */}
        <div className="absolute bottom-4 left-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg shadow-lg">
          {initial}
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-sm">{name}</h4>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
        
        {/* Arrow */}
        <button className="absolute bottom-4 right-6 w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-lg group-hover:bg-accent group-hover:text-accent-foreground transition-all">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

const testimonials = [
  {
    category: "Editor In Chief",
    quote: "Being the Editor-in-Chief of Ang Silakbo has been a transformative experience, shaping me in ways I couldn't have imagined. It's not just about deadlines and articles, it's about amplifying student voices and fostering a vibrant school community.",
    name: "Thea Clarisse Mae Inoc",
    role: "Former Editor In Chief | A.Y. 2024-2025",
    initial: "T",
  },
  {
    category: "Associate Editor",
    quote: "Ang Silakbo Publication has made a huge impact on me, helping me learn and grow as a writer and an individual. Becoming an Associate Editor was not something I initially looked forward to, but as time passed, I realized how much it had to offer.",
    name: "Lyka May Jakosalem",
    role: "Former Associate Editor | A.Y. 2024-2025",
    initial: "L",
  },
  {
    category: "Production Team",
    quote: "Being part of Ang Silakbo has been an incredible journey of growth and discovery. As a broadcaster and the head of production team, I've had the opportunity to capture the moments that tell powerful stories about our school community.",
    name: "Ron Asnahon",
    role: "Former Head of Production Team | A.Y. 2024-2025",
    initial: "R",
  },
];

export function TestimonialsSection() {
  const [selectedTestimonial, setSelectedTestimonial] = useState<typeof testimonials[0] | null>(null);

  return (
    <section className="py-20 md:py-28 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            Testimonials
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Hear from our alumni who have gone on to achieve remarkable success with Ang Silakbo.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial.name} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <TestimonialCard
                  {...testimonial}
                  delay={index * 150}
                  onSeeMore={() => setSelectedTestimonial(testimonial)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center gap-4 mt-8">
            <CarouselPrevious className="relative left-0 translate-y-0 bg-card border-border hover:bg-accent hover:text-accent-foreground" />
            <CarouselNext className="relative right-0 translate-y-0 bg-card border-border hover:bg-accent hover:text-accent-foreground" />
          </div>
        </Carousel>
      </div>

      {/* Full Testimonial Dialog */}
      <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-accent font-semibold text-sm uppercase tracking-wider">
              {selectedTestimonial?.category}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-foreground text-base md:text-lg leading-relaxed mb-6">
              "{selectedTestimonial?.quote}"
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg">
                {selectedTestimonial?.initial}
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{selectedTestimonial?.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedTestimonial?.role}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
