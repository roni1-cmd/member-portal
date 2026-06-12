import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, ChevronRight, ChevronLeft, Send, X, Facebook, Mail, Camera, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";

type TeamType = "editorial" | "production" | "finance";

const editorialPositions = [
  "Feature News Writer",
  "Editorial Writer",
  "Local News Writer",
  "Sports News Writer",
  "Associate Editor",
  "Editor",
  "Editorial Cartoonist",
  "Layout Artist",
] as const;

const productionPositions = [
  "Photojournalist",
  "Video Journalist",
  "Video Editor",
  "Broadcaster",
  "Assistant Production Head",
] as const;

const financePositions = [
  "Auditor",
] as const;

const allPositions = [...editorialPositions, ...productionPositions, ...financePositions] as const;

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

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" as const },
  }),
};

export function ApplicationModal({ isOpen, onClose, teamType }: ApplicationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamType>(teamType);
  const [direction, setDirection] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const positions = selectedTeam === "editorial" ? editorialPositions : selectedTeam === "production" ? productionPositions : financePositions;
  const teamName = selectedTeam === "editorial" ? "Editorial Board" : selectedTeam === "production" ? "Production Team" : "Finance Team";

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

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    document.body.style.overflow = "";
    setCurrentStep(1);
    setIsSubmitted(false);
    setSelectedPhoto(null);
    setPhotoPreview(null);
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
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo must be less than 2MB");
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, WebP, or GIF)");
      return;
    }

    setSelectedPhoto(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      let profilePhotoUrl: string | null = null;

      // Upload photo if selected
      if (selectedPhoto) {
        const fileExt = selectedPhoto.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(filePath, selectedPhoto, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error("Error uploading photo:", uploadError);
          toast.error("Failed to upload photo. Please try again.");
          setIsSubmitting(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(filePath);

        profilePhotoUrl = urlData.publicUrl;
      }

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
        profile_photo: profilePhotoUrl,
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

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Blurred overlay backdrop */}
      <motion.div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      {/* Scaled content panel */}
      <motion.div
        className="relative flex flex-col min-h-0 flex-1 bg-background"
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
      {/* Step Label + Progress Bar */}
      <div className="shrink-0">
        {/* Bar */}
        <div className="h-[3px] bg-border overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            initial={false}
            animate={{ scaleX: isSubmitted ? 1 : currentStep / 4 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      </div>

      {/* Top Bar */}
      <motion.div
        className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-border"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <div className="flex items-center gap-3">
          <img src={logo} alt="Ang Silakbo Logo" className="w-7 h-7 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span className="font-bold text-lg text-foreground tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
            ANG SILAKBO
          </span>
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            {!isSubmitted && (
              <motion.span
                key={currentStep}
                className="text-[11px] font-medium text-muted-foreground tracking-wide hidden sm:block"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                Step {currentStep} of 4 — {stepLabels[currentStep - 1]}
              </motion.span>
            )}
          </AnimatePresence>
          <motion.button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </div>
      </motion.div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
          {/* Header */}
          <motion.div
            className="text-center mb-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent font-medium text-sm rounded-full mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {teamName}
            </span>
            <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Join Our Team
            </h2>
            <p className="text-muted-foreground text-base md:text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Complete the form below to apply for A.Y. 2026-2027
            </p>
          </motion.div>

          {/* Step Indicator */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-10"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <motion.div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300",
                    currentStep > i + 1
                      ? "bg-accent text-accent-foreground"
                      : currentStep === i + 1
                      ? "bg-foreground text-background"
                      : "bg-secondary text-muted-foreground"
                  )}
                  animate={{
                    scale: currentStep === i + 1 ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {currentStep > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                </motion.div>
                <span className={cn(
                  "text-xs font-medium hidden sm:block",
                  currentStep >= i + 1 ? "text-foreground" : "text-muted-foreground"
                )} style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {label}
                </span>
                {i < stepLabels.length - 1 && (
                  <motion.div
                    className="w-6 sm:w-10 h-0.5 mx-1"
                    animate={{ backgroundColor: currentStep > i + 1 ? "hsl(var(--accent))" : "hsl(var(--border))" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                className="bg-card rounded-2xl p-10 text-center"
                style={{ boxShadow: 'var(--shadow-card)', fontFamily: "'Poppins', sans-serif" }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Check className="w-8 h-8 text-accent" />
                </motion.div>
                <h3 className="font-bold text-2xl md:text-3xl mb-3 text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>Application Submitted!</h3>
                <p className="text-muted-foreground leading-relaxed max-w-md mx-auto mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Thank you for your interest in joining Ang Silakbo. We will review your application and get back to you soon.
                </p>
                <motion.button
                  onClick={handleClose}
                  className="bg-accent text-accent-foreground font-semibold px-8 py-3 rounded-full hover:bg-accent/90 transition-all"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Close
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} key="form">
                <div className="bg-card rounded-2xl p-6 md:p-10 overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
                  <AnimatePresence mode="wait" custom={direction}>
                    {/* Step 1 */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                      >
                        <h3 className="font-bold text-xl md:text-2xl mb-1 text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>Personal Information</h3>
                        <p className="text-muted-foreground text-sm mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>Tell us about yourself</p>
                        <div className="space-y-5">
                          {/* Profile Photo Upload */}
                          <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                              <div
                                className="w-24 h-24 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-accent transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                {photoPreview ? (
                                  <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="flex flex-col items-center text-muted-foreground">
                                    <Camera className="w-8 h-8 mb-1" />
                                    <span className="text-xs">Add Photo</span>
                                  </div>
                                )}
                              </div>
                              {photoPreview && (
                                <button
                                  type="button"
                                  onClick={removePhoto}
                                  className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              onChange={handlePhotoSelect}
                              className="hidden"
                            />
                            <p className="text-xs text-muted-foreground mt-2">Max 2MB (optional)</p>
                          </div>
                          <InputField label="Full Name" error={errors.full_name?.message}>
                            <input {...register("full_name")} className="form-input-pill" placeholder="Juan Dela Cruz" />
                          </InputField>
                          <InputField label="Section" error={errors.section?.message}>
                            <input {...register("section")} className="form-input-pill" placeholder="ST11A1" />
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
                      </motion.div>
                    )}

                    {/* Step 2 */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                      >
                        <h3 className="font-bold text-xl md:text-2xl mb-1 text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>Position Selection</h3>
                        <p className="text-muted-foreground text-sm mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Choose your team and desired role</p>

                        {/* Team Tabs */}
                        <div className="flex gap-1 bg-secondary p-1 rounded-xl mb-6">
                          {(["editorial", "production", "finance"] as TeamType[]).map((team) => (
                            <motion.button
                              key={team}
                              type="button"
                              onClick={() => setSelectedTeam(team)}
                              className={cn(
                                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200",
                                selectedTeam === team
                                  ? "bg-background text-foreground shadow-sm"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                              style={{ fontFamily: "'Poppins', sans-serif" }}
                              whileTap={{ scale: 0.97 }}
                            >
                              {team === "editorial" ? "Editorial Board" : team === "production" ? "Production Team" : "Finance Team"}
                            </motion.button>
                          ))}
                        </div>

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={selectedTeam}
                            className="grid gap-3"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                          >
                            {positions.map((position, idx) => (
                              <motion.label
                                key={position}
                                className={cn(
                                  "flex items-center p-4 rounded-xl border-2 cursor-pointer transition-colors duration-200",
                                  watch("position") === position
                                    ? "border-accent bg-accent/5"
                                    : "border-border hover:border-accent/40 hover:bg-secondary/50"
                                )}
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                              >
                                <input type="radio" {...register("position")} value={position} className="sr-only" />
                                <div className={cn(
                                  "w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all",
                                  watch("position") === position ? "border-accent bg-accent" : "border-muted-foreground"
                                )}>
                                  {watch("position") === position && <div className="w-2 h-2 rounded-full bg-accent-foreground" />}
                                </div>
                                <span className="font-medium text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{position}</span>
                              </motion.label>
                            ))}
                          </motion.div>
                        </AnimatePresence>
                        {errors.position && <p className="text-destructive text-sm mt-3" style={{ fontFamily: "'Poppins', sans-serif" }}>{errors.position.message}</p>}
                      </motion.div>
                    )}

                    {/* Step 3 */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                      >
                        <h3 className="font-bold text-xl md:text-2xl mb-1 text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>Experience & Portfolio</h3>
                        <p className="text-muted-foreground text-sm mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>Share your background and work</p>
                        <div className="space-y-5">
                          <InputField label="Relevant Experience" error={errors.relevant_experience?.message}>
                            <textarea {...register("relevant_experience")} className="form-input-pill min-h-[160px] resize-none" placeholder="Describe your experience in journalism, writing, photography, video production, or any related field..." />
                          </InputField>
                          <InputField label="Portfolio Google Drive Link" error={errors.portfolio_link?.message} optional>
                            <input {...register("portfolio_link")} type="url" className="form-input-pill" placeholder="https://drive.google.com/..." />
                          </InputField>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4 */}
                    {currentStep === 4 && (
                      <motion.div
                        key="step4"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                      >
                        <h3 className="font-bold text-xl md:text-2xl mb-1 text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>Final Details</h3>
                        <p className="text-muted-foreground text-sm mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Almost there!</p>

                        {/* Confirmation Summary */}
                        <motion.div
                          className="rounded-2xl border border-accent/30 bg-accent/5 p-4 mb-7 flex items-center gap-4"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                        >
                          <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 text-accent" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>Applying as</p>
                            <AnimatePresence mode="wait">
                              <motion.p
                                key={watch("full_name") + watch("position")}
                                className="font-semibold text-sm text-foreground truncate"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.2 }}
                              >
                                {watch("full_name") || "—"}
                              </motion.p>
                            </AnimatePresence>
                            <AnimatePresence mode="wait">
                              <motion.p
                                key={watch("position")}
                                className="text-xs text-accent font-medium mt-0.5"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.2, delay: 0.05 }}
                              >
                                {watch("position") || "No position selected"}
                              </motion.p>
                            </AnimatePresence>
                          </div>
                          <div className="ml-auto shrink-0 text-right">
                            <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>Team</p>
                            <p className="text-xs font-medium text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>{teamName}</p>
                          </div>
                        </motion.div>

                        <div className="space-y-5">
                          <div>
                            <label className="block text-sm font-medium mb-3 text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>How did you hear about us? *</label>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {referralSources.map((source, idx) => (
                                <motion.label
                                  key={source}
                                  className={cn(
                                    "flex items-center p-3 rounded-xl border-2 cursor-pointer transition-colors duration-200",
                                    watch("referral_source") === source
                                      ? "border-accent bg-accent/5"
                                      : "border-border hover:border-accent/40"
                                  )}
                                  style={{ fontFamily: "'Poppins', sans-serif" }}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                >
                                  <input type="radio" {...register("referral_source")} value={source} className="sr-only" />
                                  <div className={cn(
                                    "w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-all",
                                    watch("referral_source") === source ? "border-accent bg-accent" : "border-muted-foreground"
                                  )}>
                                    {watch("referral_source") === source && <div className="w-1.5 h-1.5 rounded-full bg-accent-foreground" />}
                                  </div>
                                  <span className="text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>{source}</span>
                                </motion.label>
                              ))}
                            </div>
                            {errors.referral_source && <p className="text-destructive text-sm mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{errors.referral_source.message}</p>}
                          </div>
                          <InputField label="Additional Message" error={errors.additional_message?.message} optional>
                            <textarea {...register("additional_message")} className="form-input-pill min-h-[100px] resize-none" placeholder="Anything else you'd like us to know?" />
                          </InputField>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex justify-between mt-10 pt-6 border-t border-border">
                    <motion.button
                      type="button"
                      onClick={prevStep}
                      className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-colors",
                        currentStep === 1 ? "opacity-0 pointer-events-none" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                      whileHover={{ x: -2 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </motion.button>

                    {currentStep < 4 ? (
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center gap-2 bg-foreground text-background font-semibold text-sm px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                        whileHover={{ scale: 1.03, x: 2 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Continue
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-accent text-accent-foreground font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-accent/90 transition-colors disabled:opacity-50"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                        <Send className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="bg-background border-t border-border mt-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>Follow Us</span>
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
                <img src={logo} alt="Ang Silakbo Logo" className="w-6 h-6 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <span className="font-bold text-sm text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>ANG SILAKBO</span>
              </div>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
                © {new Date().getFullYear()} Ang Silakbo Publication
              </p>
            </div>
          </div>
        </footer>
      </div>
      </motion.div>
    </motion.div>
  );
}

function InputField({ label, error, optional, children }: { label: string; error?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <label className="block text-sm font-medium mb-2 text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {label} {optional ? <span className="text-muted-foreground font-normal">(Optional)</span> : "*"}
      </label>
      {children}
      {error && (
        <motion.p
          className="text-destructive text-sm mt-1"
          style={{ fontFamily: "'Poppins', sans-serif" }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
