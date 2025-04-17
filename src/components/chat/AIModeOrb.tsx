import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { AiMode } from './AiModes';

interface AIModeOrbProps {
  active: boolean;
  activeMode: AiMode;
  size?: number;
}

export const AIModeOrb: React.FC<AIModeOrbProps> = ({ 
  active, 
  activeMode,
  size = 1.2
}) => {
  const { colorTheme, modeTheme } = useTheme();
  const [pulseScale, setPulseScale] = useState(1);
  
  // Define color based on active mode and theme
  const getOrbColor = () => {
    const isDark = modeTheme === 'dark';
    
    // Base colors for different modes
    const modeColors = {
      normal: isDark ? '#a5b4fc' : '#6366f1',      // Indigo
      lawyer: isDark ? '#f9a8d4' : '#ec4899',       // Pink
      reasoning: isDark ? '#93c5fd' : '#3b82f6',    // Blue
      analyst: isDark ? '#86efac' : '#22c55e',      // Green
      creative: isDark ? '#fcd34d' : '#f59e0b',     // Amber
      research: isDark ? '#c4b5fd' : '#8b5cf6',     // Purple
      educator: isDark ? '#fdba74' : '#f97316'      // Orange
    };
    
    return modeColors[activeMode] || modeColors.normal;
  };
  
  // Pulsating animation effect
  useEffect(() => {
    let animationFrame: number;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const pulseSpeed = active ? 1.5 : 0.8;
      const newScale = 1 + Math.sin(elapsed * 0.001 * pulseSpeed) * 0.05;
      setPulseScale(newScale);
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [active]);
  
  const orbSize = 60; // Base size in pixels
  const actualSize = orbSize * pulseScale;
  const sizeOffset = (actualSize - orbSize) / 2;
  
  return (
    <div className="w-24 h-24 flex items-center justify-center">
      <div 
        style={{
          width: `${actualSize}px`,
          height: `${actualSize}px`,
          backgroundColor: getOrbColor(),
          borderRadius: '50%',
          boxShadow: `0 0 15px ${getOrbColor()}80`,
          transform: `translate(-${sizeOffset}px, -${sizeOffset}px)`,
          transition: 'background-color 0.3s ease',
          position: 'relative'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '30%',
            height: '30%',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.3)',
            filter: 'blur(3px)'
          }}
        />
      </div>
    </div>
  );
};
