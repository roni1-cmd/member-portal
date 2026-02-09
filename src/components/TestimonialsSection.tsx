import { useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const testimonials = [
  {
    category: "Editor In Chief",
    quote: "Being the Editor-in-Chief of Ang Silakbo has been a transformative experience, shaping me in ways I couldn't have imagined. It's not just about deadlines and articles, it's about amplifying student voices and fostering a vibrant school community.",
    name: "Thea Clarisse Mae Inoc",
    role: "Former Editor In Chief | A.Y. 2024-2025",
    initial: "T",
    bgColor: "bg-[hsl(350,80%,90%)]",
  },
  {
    category: "Associate Editor",
    quote: "Ang Silakbo Publication has made a huge impact on me, helping me learn and grow as a writer and an individual. Becoming an Associate Editor was not something I initially looked forward to, but as time passed, I realized how much it had to offer.",
    name: "Lyka May Jakosalem",
    role: "Former Associate Editor | A.Y. 2024-2025",
    initial: "L",
    bgColor: "bg-[hsl(45,80%,90%)]",
  },
  {
    category: "Production Team",
    quote: "Being part of Ang Silakbo has been an incredible journey of growth and discovery. As a broadcaster and the head of production team, I've had the opportunity to capture the moments that tell powerful stories about our school community.",
    name: "Ron Asnahon",
    role: "Former Head of Production Team | A.Y. 2024-2025",
    initial: "R",
    bgColor: "bg-[hsl(150,40%,88%)]",
  },
];

export function TestimonialsSection() {
  const [selectedTestimonial, setSelectedTestimonial] = useState<typeof testimonials[0] | null>(null);

  return (
    <section className="py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Voices from our alumni
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Hear from the people who shaped Ang Silakbo and went on to achieve remarkable success in their careers.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={`${testimonial.bgColor} rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-[280px] group cursor-pointer hover:shadow-lg transition-all duration-300 ${index === 2 ? "md:col-span-2" : ""}`}
              onClick={() => setSelectedTestimonial(testimonial)}
            >
              {/* Title */}
              <div>
                <h3 className="font-sans font-semibold text-xl md:text-2xl text-foreground mb-4 leading-snug">
                  {testimonial.category}
                </h3>
                <p className="text-foreground/70 text-sm md:text-base leading-relaxed line-clamp-3">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Author + Arrow */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-foreground font-bold text-sm">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-foreground/50 text-xs">{testimonial.role}</p>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
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
