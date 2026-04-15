import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows, Float } from '@react-three/drei';
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
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        <ambientLight intensity={1.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
        <pointLight position={[0, 5, 10]} intensity={0.5} color="#ffffff" />
        
        <Suspense fallback={null}>
          <VendingMachine scrollProgress={scrollProgress} customization={customization} />
          <Environment preset="studio" />
        </Suspense>

        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.15} 
          scale={10} 
          blur={2.5} 
          far={4.5} 
          color="#000000"
        />
      </Canvas>
    </div>
  );
}
