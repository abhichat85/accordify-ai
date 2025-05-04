import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface HeroBackgroundProps {
  children: ReactNode;
  className?: string;
}

export const HeroBackground: React.FC<HeroBackgroundProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative z-10 ${className}`}>
      {children}
    </div>
  );
};

interface AnimatedHeroTextProps {
  text: string;
}

export const AnimatedHeroText: React.FC<AnimatedHeroTextProps> = ({ text }) => {
  // Split the text by <br> tags to handle line breaks
  const textParts = text.split("<br>");
  
  return (
    <>
      {textParts.map((part, index) => (
        <React.Fragment key={index}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.2,
              ease: "easeOut" 
            }}
          >
            {part}
          </motion.span>
          {index < textParts.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
};
