import React from "react";

interface AbstractBgProps {
  variant?: "purple" | "blue" | "green" | "mesh";
  intensity?: "light" | "medium" | "strong" | "low";
  className?: string;
}

export const AbstractBg: React.FC<AbstractBgProps> = ({
  variant = "purple",
  intensity = "medium",
  className = "",
}) => {
  // Define color values based on variant
  const colorMap = {
    purple: {
      light: "from-purple-400/10 to-purple-600/5",
      medium: "from-purple-400/20 to-purple-600/10",
      strong: "from-purple-400/30 to-purple-600/20",
      low: "from-purple-400/5 to-purple-600/2",
    },
    blue: {
      light: "from-blue-400/10 to-blue-600/5",
      medium: "from-blue-400/20 to-blue-600/10",
      strong: "from-blue-400/30 to-blue-600/20",
      low: "from-blue-400/5 to-blue-600/2",
    },
    green: {
      light: "from-green-400/10 to-green-600/5",
      medium: "from-green-400/20 to-green-600/10",
      strong: "from-green-400/30 to-green-600/20",
      low: "from-green-400/5 to-green-600/2",
    },
    mesh: {
      light: "from-primary/10 to-primary/5 via-transparent",
      medium: "from-primary/20 to-primary/10 via-transparent",
      strong: "from-primary/30 to-primary/20 via-transparent",
      low: "from-primary/5 to-primary/2 via-transparent",
    }
  };

  // Safely access the gradient classes with fallbacks
  const variantClasses = colorMap[variant] || colorMap.purple;
  const gradientClasses = variantClasses[intensity] || variantClasses.medium;

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${gradientClasses} ${className}`}
      aria-hidden="true"
    />
  );
};
