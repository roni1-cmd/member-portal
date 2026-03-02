import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, ChevronRight, ChevronLeft, Send, X, Facebook, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

type TeamType = "editorial" | "production";

const editorialPositions = [
  "Feature News Writer",
  "Editorial Writer",
  "Local News Writer",
  "Sports News Writer",
  "Entertainment News Editor",
  "Entertainment News Writer",
  "Layout Artist",
] as const;

const productionPositions = [
  "Photojournalist",
  "Video Journalist",
  "Video Editor",
  "Broadcaster",
] as const;

const allPositions = [...editorialPositions, ...productionPositions] as const;

const referralSources = [
  "Social Media",
  "Friend or Colleague",
  "School Announcement",
  "Website",
  "Other",
] as const;

const formSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  section: z.string().min(1, "Section is required").max(50),
  email: z.string().email("Please enter a valid email"),
  phone_number: z.string().min(10, "Please enter a valid phone number").max(20),
  complete_address: z.string().min(10, "Please enter your complete address").max(500),
  position: z.enum(allPositions, { required_error: "Please select a position" }),
  relevant_experience: z.string().min(20, "Please describe your experience (at least 20 characters)").max(2000),
  portfolio_link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  referral_source: z.enum(referralSources, { required_error: "Please select how you heard about us" }),
  additional_message: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

const stepLabels = ["Personal Info", "Position", "Experience", "Final Details"];

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamType: TeamType;
}

export function ApplicationModal({ isOpen, onClose, teamType }: ApplicationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const positions = teamType === "editorial" ? editorialPositions : productionPositions;
  const teamName = teamType === "editorial" ? "Editorial Board" : "Production Team";

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const handleClose = () => {
    setCurrentStep(1);
    setIsSubmitted(false);
    reset();
    onClose();
  };

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return trigger(["full_name", "section", "email", "phone_number", "complete_address"]);
      case 2:
        return trigger(["position"]);
      case 3:
        return trigger(["relevant_experience", "portfolio_link"]);
      case 4:
        return trigger(["referral_source", "additional_message"]);
      default:
        return true;
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("membership_applications").insert({
        full_name: data.full_name,
        section: data.section,
        email: data.email,
        phone_number: data.phone_number,
        complete_address: data.complete_address,
        position: data.position,
        relevant_experience: data.relevant_experience,
        portfolio_link: data.portfolio_link || null,
        referral_source: data.referral_source,
        additional_message: data.additional_message || null,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Ang Silakbo Logo" className="w-7 h-7 object-contain" />
          <span className="font-sans font-bold text-lg text-foreground tracking-tight">
            ANG SILAKBO
          </span>
        </div>
        <button
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-secondary transition-colors active:scale-95"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent font-sans font-medium text-sm rounded-full mb-5">
              {teamName}
            </span>
            <h2 className="font-sans font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-3">
              Join Our Team
            </h2>
            <p className="text-muted-foreground font-sans text-base md:text-lg">
              Complete the form below to apply for A.Y. 2025-2026
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-sans font-semibold transition-all duration-300",
                    currentStep > i + 1
                      ? "bg-accent text-accent-foreground"
                      : currentStep === i + 1
                      ? "bg-foreground text-background"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {currentStep > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={cn(
                  "text-xs font-sans font-medium hidden sm:block",
                  currentStep >= i + 1 ? "text-foreground" : "text-muted-foreground"
                )}>
                  {label}
                </span>
                {i < stepLabels.length - 1 && (
                  <div className={cn(
                    "w-6 sm:w-10 h-0.5 mx-1",
                    currentStep > i + 1 ? "bg-accent" : "bg-border"
                  )} />
                )}
              </div>
            ))}
          </div>

          {isSubmitted ? (
            <div className="bg-card rounded-2xl p-10 text-center animate-scale-in" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                <Check className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-sans font-bold text-2xl md:text-3xl mb-3 text-foreground">Application Submitted!</h3>
              <p className="text-muted-foreground font-sans leading-relaxed max-w-md mx-auto mb-8">
                Thank you for your interest in joining Ang Silakbo. We will review your application and get back to you soon.
              </p>
              <button onClick={handleClose} className="bg-accent text-accent-foreground font-sans font-semibold px-8 py-3 rounded-full hover:bg-accent/90 transition-all active:scale-95">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-card rounded-2xl p-6 md:p-10" style={{ boxShadow: 'var(--shadow-card)' }}>
                {/* Step 1 */}
                {currentStep === 1 && (
                  <div className="animate-slide-in-right">
                    <h3 className="font-sans font-bold text-xl md:text-2xl mb-1 text-foreground">Personal Information</h3>
                    <p className="text-muted-foreground font-sans text-sm mb-8">Tell us about yourself</p>
                    <div className="space-y-5">
                      <InputField label="Full Name" error={errors.full_name?.message}>
                        <input {...register("full_name")} className="form-input-pill" placeholder="Juan Dela Cruz" />
                      </InputField>
                      <InputField label="Section" error={errors.section?.message}>
                        <input {...register("section")} className="form-input-pill" placeholder="e.g., 12-STEM A" />
                      </InputField>
                      <InputField label="Email Address" error={errors.email?.message}>
                        <input {...register("email")} type="email" className="form-input-pill" placeholder="your.email@example.com" />
                      </InputField>
                      <InputField label="Phone Number" error={errors.phone_number?.message}>
                        <input {...register("phone_number")} type="tel" className="form-input-pill" placeholder="09XX XXX XXXX" />
                      </InputField>
                      <InputField label="Complete Address" error={errors.complete_address?.message}>
                        <textarea {...register("complete_address")} className="form-input-pill min-h-[100px] resize-none" placeholder="Street, Barangay, City/Municipality, Province" />
                      </InputField>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {currentStep === 2 && (
                  <div className="animate-slide-in-right">
                    <h3 className="font-sans font-bold text-xl md:text-2xl mb-1 text-foreground">Position Selection</h3>
                    <p className="text-muted-foreground font-sans text-sm mb-8">Choose your desired role in the {teamName}</p>
                    <div className="grid gap-3">
                      {positions.map((position) => (
                        <label
                          key={position}
                          className={cn(
                            "flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 font-sans",
                            watch("position") === position
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-accent/40 hover:bg-secondary/50"
                          )}
                        >
                          <input type="radio" {...register("position")} value={position} className="sr-only" />
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all",
                            watch("position") === position ? "border-accent bg-accent" : "border-muted-foreground"
                          )}>
                            {watch("position") === position && <div className="w-2 h-2 rounded-full bg-accent-foreground" />}
                          </div>
                          <span className="font-medium text-sm">{position}</span>
                        </label>
                      ))}
                    </div>
                    {errors.position && <p className="text-destructive text-sm mt-3 font-sans">{errors.position.message}</p>}
                  </div>
                )}

                {/* Step 3 */}
                {currentStep === 3 && (
                  <div className="animate-slide-in-right">
                    <h3 className="font-sans font-bold text-xl md:text-2xl mb-1 text-foreground">Experience & Portfolio</h3>
                    <p className="text-muted-foreground font-sans text-sm mb-8">Share your background and work</p>
                    <div className="space-y-5">
                      <InputField label="Relevant Experience" error={errors.relevant_experience?.message}>
                        <textarea {...register("relevant_experience")} className="form-input-pill min-h-[160px] resize-none" placeholder="Describe your experience in journalism, writing, photography, video production, or any related field..." />
                      </InputField>
                      <InputField label="Portfolio Google Drive Link" error={errors.portfolio_link?.message} optional>
                        <input {...register("portfolio_link")} type="url" className="form-input-pill" placeholder="https://drive.google.com/..." />
                      </InputField>
                    </div>
                  </div>
                )}

                {/* Step 4 */}
                {currentStep === 4 && (
                  <div className="animate-slide-in-right">
                    <h3 className="font-sans font-bold text-xl md:text-2xl mb-1 text-foreground">Final Details</h3>
                    <p className="text-muted-foreground font-sans text-sm mb-8">Almost there!</p>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-sans font-medium mb-3 text-foreground">How did you hear about us? *</label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {referralSources.map((source) => (
                            <label
                              key={source}
                              className={cn(
                                "flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 font-sans",
                                watch("referral_source") === source
                                  ? "border-accent bg-accent/5"
                                  : "border-border hover:border-accent/40"
                              )}
                            >
                              <input type="radio" {...register("referral_source")} value={source} className="sr-only" />
                              <div className={cn(
                                "w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-all",
                                watch("referral_source") === source ? "border-accent bg-accent" : "border-muted-foreground"
                              )}>
                                {watch("referral_source") === source && <div className="w-1.5 h-1.5 rounded-full bg-accent-foreground" />}
                              </div>
                              <span className="text-sm font-medium">{source}</span>
                            </label>
                          ))}
                        </div>
                        {errors.referral_source && <p className="text-destructive text-sm mt-2 font-sans">{errors.referral_source.message}</p>}
                      </div>
                      <InputField label="Additional Message" error={errors.additional_message?.message} optional>
                        <textarea {...register("additional_message")} className="form-input-pill min-h-[100px] resize-none" placeholder="Anything else you'd like us to know?" />
                      </InputField>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-10 pt-6 border-t border-border">
                  <button
                    type="button"
                    onClick={prevStep}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-full font-sans font-medium text-sm transition-all active:scale-95",
                      currentStep === 1 ? "opacity-0 pointer-events-none" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2 bg-foreground text-background font-sans font-semibold text-sm px-6 py-2.5 rounded-full hover:opacity-90 transition-all active:scale-95"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-accent text-accent-foreground font-sans font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-accent/90 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-background border-t border-border mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center gap-6">
              <span className="text-sm font-sans font-medium text-foreground">Follow Us</span>
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
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="Ang Silakbo Logo" className="w-6 h-6 object-contain" />
                  <span className="font-sans font-bold text-sm text-foreground">ANG SILAKBO</span>
                </div>
              </div>
              <p className="text-xs font-sans text-muted-foreground">
                © {new Date().getFullYear()} Ang Silakbo Publication
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function InputField({ label, error, optional, children }: { label: string; error?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-sans font-medium mb-2 text-foreground">
        {label} {optional ? <span className="text-muted-foreground font-normal">(Optional)</span> : "*"}
      </label>
      {children}
      {error && <p className="text-destructive text-sm mt-1 font-sans">{error}</p>}
    </div>
  );
}
