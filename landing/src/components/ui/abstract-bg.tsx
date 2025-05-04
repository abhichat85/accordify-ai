import React from "react";

interface AbstractBgProps {
  variant?: "purple" | "blue" | "green";
  intensity?: "light" | "medium" | "strong";
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
    },
    blue: {
      light: "from-blue-400/10 to-blue-600/5",
      medium: "from-blue-400/20 to-blue-600/10",
      strong: "from-blue-400/30 to-blue-600/20",
    },
    green: {
      light: "from-green-400/10 to-green-600/5",
      medium: "from-green-400/20 to-green-600/10",
      strong: "from-green-400/30 to-green-600/20",
    },
  };

  const gradientClasses = colorMap[variant][intensity];

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${gradientClasses} ${className}`}
      aria-hidden="true"
    />
  );
};
