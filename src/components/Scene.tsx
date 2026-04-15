import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, ContactShadows, Environment } from '@react-three/drei';
import { VendingMachine } from './VendingMachine';
import { Suspense } from 'react';

interface SceneProps {
  scrollProgress: any;
  customization: {
    brandColor: string;
    productType: 'drinks' | 'snacks' | 'mixed';
  };
}

export function Scene({ scrollProgress, customization }: SceneProps) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-auto">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, toneMapping: 3 /* ACESFilmic */ }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={42} />

        {/* Luxury dark studio lighting */}
        {/* Soft key light from upper left */}
        <spotLight
          position={[-4, 6, 5]}
          angle={0.28}
          penumbra={1}
          intensity={2.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
          color="#E8F0FF"
        />
        {/* Warm rim light from upper right */}
        <spotLight
          position={[5, 4, -3]}
          angle={0.4}
          penumbra={1}
          intensity={1.4}
          color="#FFE8CC"
        />
        {/* Cool fill from below-left */}
        <pointLight position={[-3, -3, 3]} intensity={0.6} color="#4060FF" />
        {/* Subtle accent glow for the machine screen */}
        <pointLight position={[0.6, 0.3, 1.5]} intensity={0.5} color="#0A84FF" distance={2.5} />
        {/* General ambient — very dark to preserve drama */}
        <ambientLight intensity={0.25} color="#101020" />

        <Suspense fallback={null}>
          <VendingMachine scrollProgress={scrollProgress} customization={customization} />
          {/* City-night HDRI-like env for metallic reflections */}
          <Environment preset="city" />
        </Suspense>

        <ContactShadows
          position={[0, -2.6, 0]}
          opacity={0.55}
          scale={8}
          blur={3.5}
          far={5}
          color="#000818"
        />
      </Canvas>
    </div>
  );
}
