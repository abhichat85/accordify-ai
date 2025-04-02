
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AnimatedOrb } from './AnimatedOrb';
import { cn } from '@/lib/utils';

interface OrbCanvasProps {
  className?: string;
  color?: string;
  size?: number;
  speed?: number;
  distort?: number;
  enableControls?: boolean;
}

export const OrbCanvas: React.FC<OrbCanvasProps> = ({
  className,
  color = "#9b87f5",
  size = 1,
  speed = 1,
  distort = 0.4,
  enableControls = false
}) => {
  return (
    <div className={cn("relative w-full h-full", className)}>
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Suspense fallback={null}>
          <AnimatedOrb
            color={color}
            radius={size}
            speed={speed}
            distort={distort}
          />
        </Suspense>
        {enableControls && <OrbitControls enableZoom={false} />}
      </Canvas>
    </div>
  );
};
