export interface Application {
  id: string;
  full_name: string;
  section: string;
  email: string;
  phone_number: string;
  complete_address: string;
  position: string;
  relevant_experience: string;
  portfolio_link: string | null;
  referral_source: string;
  additional_message: string | null;
  created_at: string;
}

export type AdminView = "applications" | "calendar" | "settings";

// Position-based gradient colors
export const positionGradients: Record<string, string> = {
  "Feature News Writer": "from-sky-400 to-sky-600",
  "Editorial Writer": "from-teal-400 to-teal-600",
  "Local News Writer": "from-emerald-400 to-emerald-600",
  "Sports News Writer": "from-orange-400 to-orange-600",
  "Layout Artist": "from-purple-400 to-purple-600",
  "Photojournalist": "from-pink-400 to-pink-600",
  "Video Journalist": "from-rose-400 to-rose-600",
  "Video Editor": "from-indigo-400 to-indigo-600",
  "Broadcaster": "from-amber-400 to-amber-600",
};

export const getGradient = (position: string) => {
  return positionGradients[position] || "from-accent to-accent/80";
};

export const getAvatarUrl = (name: string) => {
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(name)}`;
};

export const getInitialColor = (name: string) => {
  const colors = [
    "bg-blue-600", "bg-green-600", "bg-purple-600", "bg-red-600",
    "bg-amber-600", "bg-teal-600", "bg-pink-600", "bg-indigo-600",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatShortDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};
