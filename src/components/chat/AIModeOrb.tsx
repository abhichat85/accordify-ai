
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import { useTheme } from '@/contexts/ThemeContext';
import { AiMode } from './AiModes';
import * as THREE from 'three';

interface AIModeOrbProps {
  active: boolean;
  activeMode: AiMode;
  size?: number;
}

const OrbMesh: React.FC<{ active: boolean; activeMode: AiMode; size: number }> = ({ 
  active, 
  activeMode,
  size 
}) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const { colorTheme, modeTheme } = useTheme();
  
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
  
  // Animation parameters
  const [animationState, setAnimationState] = useState({
    pulseSpeed: active ? 1.5 : 0.8,
    distortionSpeed: active ? 0.8 : 0.4,
    distortionIntensity: active ? 0.4 : 0.2,
    scale: 1.0
  });
  
  // Update animation parameters when active state changes
  useEffect(() => {
    setAnimationState({
      pulseSpeed: active ? 1.5 : 0.8,
      distortionSpeed: active ? 0.8 : 0.4,
      distortionIntensity: active ? 0.4 : 0.2,
      scale: 1.0
    });
  }, [active]);
  
  // Run the animation
  useFrame(({ clock }) => {
    if (mesh.current) {
      const t = clock.getElapsedTime();
      
      // Breathing/pulsating effect
      const pulse = 1 + Math.sin(t * animationState.pulseSpeed) * 0.05;
      mesh.current.scale.set(pulse, pulse, pulse);
      
      // Slight rotation for more liveliness
      mesh.current.rotation.y = t * 0.1;
      mesh.current.rotation.z = t * 0.05;
    }
  });
  
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[size, 64, 64]} />
      <MeshDistortMaterial
        color={getOrbColor()}
        attach="material"
        distort={animationState.distortionIntensity}
        speed={animationState.distortionSpeed}
        roughness={0.4}
        metalness={0.3}
      />
    </mesh>
  );
};

export const AIModeOrb: React.FC<AIModeOrbProps> = ({ 
  active, 
  activeMode,
  size = 1.2  // Increased the default size from 0.8 to 1.2
}) => {
  return (
    <div className="w-24 h-24"> {/* Increased from w-16 h-16 to w-24 h-24 */}
      <Canvas camera={{ position: [0, 0, 5], fov: 25 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <OrbMesh active={active} activeMode={activeMode} size={size} />
      </Canvas>
    </div>
  );
};
