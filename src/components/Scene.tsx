import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows, Float, Sparkles } from '@react-three/drei';
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
        <ambientLight intensity={0.4} color="#4080ff" />
        <spotLight position={[10, 10, 10]} angle={0.25} penumbra={1} intensity={2.5} castShadow color="#00e5ff" />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#0033ff" />
        <pointLight position={[0, 0, 5]} intensity={1.5} color="#00e5ff" />
        
        <Sparkles count={150} scale={12} size={2} speed={0.4} opacity={0.8} color="#00e5ff" />
        
        <Suspense fallback={null}>
          <VendingMachine scrollProgress={scrollProgress} customization={customization} />
          <Environment preset="night" />
        </Suspense>

        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.3} 
          scale={10} 
          blur={3} 
          far={4.5} 
          color="#00e5ff"
        />
      </Canvas>
    </div>
  );
}
