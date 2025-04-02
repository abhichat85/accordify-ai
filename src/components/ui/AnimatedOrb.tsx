
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import { Color, Mesh } from 'three';

interface AnimatedOrbProps {
  color?: string;
  speed?: number;
  distort?: number;
  radius?: number;
}

export const AnimatedOrb: React.FC<AnimatedOrbProps> = ({
  color = "#9b87f5",
  speed = 1,
  distort = 0.4,
  radius = 1
}) => {
  const mesh = useRef<Mesh>(null!);
  
  useFrame((state) => {
    if (!mesh.current) return;
    
    // Subtle rotation animation
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.1;
    mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * speed * 0.2) * 0.1;
    
    // Breathing effect - subtle scale changes
    const breathingScale = 1 + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.04;
    mesh.current.scale.set(breathingScale, breathingScale, breathingScale);
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[radius, 64, 64]} />
      <MeshDistortMaterial
        color={new Color(color)}
        attach="material"
        distort={distort * (0.5 + Math.sin(speed) * 0.1)}
        speed={speed * 0.6}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
};
