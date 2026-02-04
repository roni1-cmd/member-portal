import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, ChevronRight, ChevronLeft, User, Briefcase, FileText, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

type TeamType = "editorial" | "production";

const editorialPositions = [
  "Feature News Writer",
  "Editorial Writer",
  "Local News Writer",
  "Sports News Writer",
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

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Position", icon: Briefcase },
  { id: 3, title: "Experience", icon: FileText },
  { id: 4, title: "Final Details", icon: Send },
];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/95 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full h-full overflow-y-auto py-8 px-4 sm:py-12">
        <div className="max-w-3xl mx-auto animate-scale-in">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 rounded-full bg-card/10 text-primary-foreground hover:bg-card/20 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent font-medium text-sm rounded-full mb-4">
              {teamName}
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-primary-foreground mb-2">
              Join Our Team
            </h2>
            <p className="text-primary-foreground/70 font-serif">
              Complete the form below to apply
            </p>
          </div>

          {isSubmitted ? (
            <div className="form-card text-center animate-scale-in">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
                <Check className="w-10 h-10 text-accent" />
              </div>
              <h3 className="font-display text-3xl mb-4 text-foreground">Application Submitted!</h3>
              <p className="text-muted-foreground font-serif leading-relaxed max-w-md mx-auto mb-8">
                Thank you for your interest in joining Ang Silakbo. We will review your application and get back to you soon.
              </p>
              <button onClick={handleClose} className="btn-accent">
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8 px-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "step-indicator",
                          currentStep === step.id && "active",
                          currentStep > step.id && "completed",
                          currentStep < step.id && "pending"
                        )}
                      >
                        {currentStep > step.id ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "mt-2 text-xs font-medium hidden sm:block",
                          currentStep >= step.id ? "text-primary-foreground" : "text-primary-foreground/50"
                        )}
                      >
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "w-8 sm:w-16 lg:w-24 h-0.5 mx-2 transition-colors duration-300",
                          currentStep > step.id ? "bg-accent" : "bg-primary-foreground/20"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Form Card */}
              <form onSubmit={handleSubmit(onSubmit)} className="form-card">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="animate-slide-in-right">
                    <h3 className="font-display text-2xl md:text-3xl mb-2 text-foreground">Personal Information</h3>
                    <p className="text-muted-foreground mb-8 font-serif">Tell us about yourself</p>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name *</label>
                        <input
                          {...register("full_name")}
                          className="input-editorial w-full"
                          placeholder="Juan Dela Cruz"
                        />
                        {errors.full_name && (
                          <p className="text-destructive text-sm mt-1">{errors.full_name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Section *</label>
                        <input
                          {...register("section")}
                          className="input-editorial w-full"
                          placeholder="e.g., 12-STEM A"
                        />
                        {errors.section && (
                          <p className="text-destructive text-sm mt-1">{errors.section.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address *</label>
                        <input
                          {...register("email")}
                          type="email"
                          className="input-editorial w-full"
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number *</label>
                        <input
                          {...register("phone_number")}
                          type="tel"
                          className="input-editorial w-full"
                          placeholder="09XX XXX XXXX"
                        />
                        {errors.phone_number && (
                          <p className="text-destructive text-sm mt-1">{errors.phone_number.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Complete Address *</label>
                        <textarea
                          {...register("complete_address")}
                          className="input-editorial w-full min-h-[100px] resize-none"
                          placeholder="Street, Barangay, City/Municipality, Province"
                        />
                        {errors.complete_address && (
                          <p className="text-destructive text-sm mt-1">{errors.complete_address.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Position Selection */}
                {currentStep === 2 && (
                  <div className="animate-slide-in-right">
                    <h3 className="font-display text-2xl md:text-3xl mb-2 text-foreground">Position Selection</h3>
                    <p className="text-muted-foreground mb-8 font-serif">Choose your desired role in the {teamName}</p>

                    <div className="grid gap-3">
                      {positions.map((position) => (
                        <label
                          key={position}
                          className={cn(
                            "flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                            watch("position") === position
                              ? "border-accent bg-accent/10"
                              : "border-border hover:border-accent/50 hover:bg-secondary/50"
                          )}
                        >
                          <input
                            type="radio"
                            {...register("position")}
                            value={position}
                            className="sr-only"
                          />
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all",
                              watch("position") === position
                                ? "border-accent bg-accent"
                                : "border-muted-foreground"
                            )}
                          >
                            {watch("position") === position && (
                              <div className="w-2 h-2 rounded-full bg-accent-foreground" />
                            )}
                          </div>
                          <span className="font-medium">{position}</span>
                        </label>
                      ))}
                    </div>
                    {errors.position && (
                      <p className="text-destructive text-sm mt-3">{errors.position.message}</p>
                    )}
                  </div>
                )}

                {/* Step 3: Experience & Portfolio */}
                {currentStep === 3 && (
                  <div className="animate-slide-in-right">
                    <h3 className="font-display text-2xl md:text-3xl mb-2 text-foreground">Experience & Portfolio</h3>
                    <p className="text-muted-foreground mb-8 font-serif">Share your background and work</p>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium mb-2">Relevant Experience *</label>
                        <textarea
                          {...register("relevant_experience")}
                          className="input-editorial w-full min-h-[180px] resize-none"
                          placeholder="Describe your experience in journalism, writing, photography, video production, or any related field..."
                        />
                        {errors.relevant_experience && (
                          <p className="text-destructive text-sm mt-1">{errors.relevant_experience.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Portfolio Google Drive Link</label>
                        <input
                          {...register("portfolio_link")}
                          type="url"
                          className="input-editorial w-full"
                          placeholder="https://drive.google.com/..."
                        />
                        <p className="text-muted-foreground text-xs mt-2">
                          Share a link to your work samples (articles, photos, videos, etc.)
                        </p>
                        {errors.portfolio_link && (
                          <p className="text-destructive text-sm mt-1">{errors.portfolio_link.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Final Details */}
                {currentStep === 4 && (
                  <div className="animate-slide-in-right">
                    <h3 className="font-display text-2xl md:text-3xl mb-2 text-foreground">Final Details</h3>
                    <p className="text-muted-foreground mb-8 font-serif">Almost there!</p>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium mb-3">How did you hear about us? *</label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {referralSources.map((source) => (
                            <label
                              key={source}
                              className={cn(
                                "flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                watch("referral_source") === source
                                  ? "border-accent bg-accent/10"
                                  : "border-border hover:border-accent/50"
                              )}
                            >
                              <input
                                type="radio"
                                {...register("referral_source")}
                                value={source}
                                className="sr-only"
                              />
                              <div
                                className={cn(
                                  "w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-all",
                                  watch("referral_source") === source
                                    ? "border-accent bg-accent"
                                    : "border-muted-foreground"
                                )}
                              >
                                {watch("referral_source") === source && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-accent-foreground" />
                                )}
                              </div>
                              <span className="text-sm font-medium">{source}</span>
                            </label>
                          ))}
                        </div>
                        {errors.referral_source && (
                          <p className="text-destructive text-sm mt-2">{errors.referral_source.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Additional Message (Optional)</label>
                        <textarea
                          {...register("additional_message")}
                          className="input-editorial w-full min-h-[120px] resize-none"
                          placeholder="Anything else you'd like us to know?"
                        />
                        {errors.additional_message && (
                          <p className="text-destructive text-sm mt-1">{errors.additional_message.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-10 pt-6 border-t border-border">
                  <button
                    type="button"
                    onClick={prevStep}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all",
                      currentStep === 1
                        ? "opacity-0 pointer-events-none"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-accent flex items-center gap-2"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-accent flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
