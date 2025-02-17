import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { random } from 'maath';

interface ParticleFieldProps {
  count?: number;
  variant?: 'cyber' | 'holographic' | 'bronze';
}

const variants = {
  cyber: {
    color: '#00FFE5', // neon-cyan
    size: 0.002,
    speed: 1,
  },
  holographic: {
    color: '#4DFFEA', // holographic-teal
    size: 0.003,
    speed: 0.8,
  },
  bronze: {
    color: '#BD8B4A', // metallic-bronze
    size: 0.004,
    speed: 0.6,
  },
};

function ParticleField({ count = 5000, variant = 'cyber' }: ParticleFieldProps) {
  const points = useRef<THREE.Points>(null!);
  
  useFrame((state, delta) => {
    const speed = variants[variant].speed;
    points.current.rotation.x -= delta / (10 / speed);
    points.current.rotation.y -= delta / (15 / speed);
  });

  const positions = React.useMemo(() => {
    const positions = new Float32Array(count * 3);
    random.inSphere(positions, { radius: 1.5 });
    return positions;
  }, [count]);

  return (
    <Points ref={points} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={variants[variant].color}
        size={variants[variant].size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

interface HolographicBackgroundProps {
  variant?: 'cyber' | 'holographic' | 'bronze';
}

const HolographicBackground: React.FC<HolographicBackgroundProps> = ({
  variant = 'cyber',
}) => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <color attach="background" args={['#0A0F1C']} />
        <fog attach="fog" args={['#0A0F1C', 1, 2]} />
        <ParticleField variant={variant} />
        
        {/* Secondary particle field for depth */}
        <ParticleField count={2000} variant={variant === 'cyber' ? 'holographic' : 'cyber'} />
        
        {/* Ambient light for better visibility */}
        <ambientLight intensity={0.1} />
      </Canvas>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-dark-bronze opacity-30" />
      
      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay">
        <div className="w-full h-full" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 255, 229, 0.03) 1px, rgba(0, 255, 229, 0.03) 2px)',
          backgroundSize: '100% 2px',
        }} />
      </div>
    </div>
  );
};

export default HolographicBackground; 