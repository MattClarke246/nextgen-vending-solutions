import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface VendingMachineProps {
  scrollProgress: any;
  customization: {
    brandColor: string;
    productType: 'drinks' | 'snacks' | 'mixed';
  };
}

export function VendingMachine({ scrollProgress, customization }: VendingMachineProps) {
  const groupRef = useRef<THREE.Group>(null);
  const doorRef = useRef<THREE.Group>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Animation for door opening
  useFrame((state) => {
    if (!groupRef.current || !doorRef.current) return;
    
    const progress = scrollProgress.get();
    
    // Door rotation animation
    const targetRotation = isOpen ? -Math.PI * 0.6 : 0;
    doorRef.current.rotation.y = THREE.MathUtils.lerp(doorRef.current.rotation.y, targetRotation, 0.1);

    // Base rotation (only if door is closed or in certain sections)
    if (!isOpen) {
      groupRef.current.rotation.y = progress * Math.PI * 2 + state.clock.getElapsedTime() * 0.2;
    } else {
      // If open, face the user more directly but with a slight tilt
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0.2, 0.1);
    }
    
    // Position shifting (same as before)
    if (progress < 0.25) {
      groupRef.current.position.x = 0;
      groupRef.current.position.y = -0.5;
      groupRef.current.scale.setScalar(1);
    } else if (progress < 0.5) {
      const t = (progress - 0.25) / 0.25;
      groupRef.current.position.x = THREE.MathUtils.lerp(0, 2, t);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.8, t));
    } else if (progress < 0.75) {
      const t = (progress - 0.5) / 0.25;
      groupRef.current.position.x = THREE.MathUtils.lerp(2, 0, t);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.8, 1.2, t));
    } else {
      const t = (progress - 0.75) / 0.25;
      groupRef.current.position.x = 0;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(1.2, 0.5, t));
      groupRef.current.position.y = THREE.MathUtils.lerp(-0.5, -2, t);
    }
  });

  return (
    <group 
      ref={groupRef} 
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Float speed={isOpen ? 0 : 2} rotationIntensity={isOpen ? 0 : 0.5} floatIntensity={isOpen ? 0 : 0.5}>
        {/* Main Body */}
        <RoundedBox args={[1.5, 2.5, 1]} radius={0.08} smoothness={8} position={[0, 0, 0]} castShadow>
          <meshPhysicalMaterial color={customization.brandColor} metalness={0.6} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
        </RoundedBox>

        {/* Interior */}
        <RoundedBox args={[1.35, 2.35, 0.8]} radius={0.04} smoothness={4} position={[0, 0, -0.05]}>
          <meshStandardMaterial color="#02040a" roughness={0.6} />
        </RoundedBox>

        {/* Interior LED Light Strip */}
        <mesh position={[0, 1.15, 0.2]}>
          <boxGeometry args={[1.2, 0.05, 0.05]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={3} />
        </mesh>

        {/* Door Group (Glass + Frame) */}
        <group ref={doorRef} position={[0.75, 0, 0.5]}>
          <group position={[-0.75, 0, 0]}>
            {/* Glass Front */}
            <RoundedBox args={[1.3, 2, 0.05]} radius={0.02} smoothness={4} position={[0, 0.1, 0.01]}>
              <meshPhysicalMaterial 
                transparent 
                opacity={0.1} 
                transmission={0.9} 
                thickness={1} 
                roughness={0.1} 
                metalness={0.2}
                clearcoat={1}
                clearcoatRoughness={0.1}
                color="#0066ff"
              />
            </RoundedBox>
            {/* Door Frame (Hollow) */}
            <group position={[0, 0, 0]}>
              {/* Left */}
              <RoundedBox args={[0.2, 2.5, 0.1]} radius={0.04} smoothness={4} position={[-0.65, 0, 0]}>
                <meshPhysicalMaterial color={customization.brandColor} metalness={0.6} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
              </RoundedBox>
              {/* Right */}
              <RoundedBox args={[0.2, 2.5, 0.1]} radius={0.04} smoothness={4} position={[0.65, 0, 0]}>
                <meshPhysicalMaterial color={customization.brandColor} metalness={0.6} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
              </RoundedBox>
              {/* Top */}
              <RoundedBox args={[1.1, 0.2, 0.1]} radius={0.04} smoothness={4} position={[0, 1.15, 0]}>
                <meshPhysicalMaterial color={customization.brandColor} metalness={0.6} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
              </RoundedBox>
              {/* Bottom */}
              <RoundedBox args={[1.1, 0.2, 0.1]} radius={0.04} smoothness={4} position={[0, -1.15, 0]}>
                <meshPhysicalMaterial color={customization.brandColor} metalness={0.6} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
              </RoundedBox>
            </group>
            
            {/* Payment Panel (Attached to door) */}
            <PaymentPanel scrollProgress={scrollProgress} />
          </group>
        </group>

        {/* Product Racks (Static inside) */}
        <Racks scrollProgress={scrollProgress} productType={customization.productType} />

        {/* Cooling System */}
        <CoolingSystem scrollProgress={scrollProgress} />

        {/* Interaction Prompt */}
        {hovered && !isOpen && (
          <Html position={[0, 1.5, 0]} center>
            <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap pointer-events-none shadow-lg">
              Click to Open
            </div>
          </Html>
        )}
      </Float>
    </group>
  );
}

function PaymentPanel({ scrollProgress }: { scrollProgress: any }) {
  const ref = useRef<THREE.Group>(null);
  
  return (
    <group ref={ref} position={[0.6, 0.5, 0.06]}>
      <RoundedBox args={[0.2, 0.8, 0.1]} radius={0.02} smoothness={4}>
        <meshPhysicalMaterial color="#1d1d1f" metalness={0.8} roughness={0.2} clearcoat={1} />
      </RoundedBox>
      {/* Screen */}
      <mesh position={[0, 0.2, 0.051]}>
        <planeGeometry args={[0.15, 0.2]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

function Racks({ scrollProgress, productType }: { scrollProgress: any, productType: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = scrollProgress.get();
    if (progress > 0.5 && progress < 0.75) {
      const t = (progress - 0.5) / 0.25;
      groupRef.current.position.z = t * 0.5; // Subtle shift in exploded view
    } else {
      groupRef.current.position.z = 0;
    }
  });

  const products = useMemo(() => {
    return [0.6, 0.2, -0.2, -0.6].map((y, i) => (
      <group key={i} position={[0, y, 0.1]}>
        <RoundedBox args={[1.2, 0.02, 0.6]} radius={0.01} smoothness={4}>
          <meshStandardMaterial color="#112233" metalness={0.6} roughness={0.1} />
        </RoundedBox>
        {[-0.4, -0.2, 0, 0.2, 0.4].map((x, j) => {
          const isDrink = productType === 'drinks' || (productType === 'mixed' && i < 2);
          return (
            <mesh key={j} position={[x, 0.15, 0]}>
              {isDrink ? (
                <cylinderGeometry args={[0.07, 0.07, 0.25, 16]} />
              ) : (
                <boxGeometry args={[0.12, 0.18, 0.05]} />
              )}
              <meshStandardMaterial 
                color={j % 3 === 0 ? "#00e5ff" : j % 3 === 1 ? "#ffffff" : "#0f172a"} 
                metalness={isDrink ? 0.8 : 0.2}
                roughness={0.2}
                emissive={j % 3 === 0 ? "#002244" : "#000000"}
              />
            </mesh>
          );
        })}
      </group>
    ));
  }, [productType]);

  return <group ref={groupRef}>{products}</group>;
}

function CoolingSystem({ scrollProgress }: { scrollProgress: any }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    const progress = scrollProgress.get();
    if (progress > 0.5 && progress < 0.75) {
      const t = (progress - 0.5) / 0.25;
      ref.current.position.y = -1.3 - t * 0.5;
    } else {
      ref.current.position.y = -1.3;
    }
  });

  return (
    <mesh ref={ref} position={[0, -1.3, 0]}>
      <boxGeometry args={[1.4, 0.3, 0.9]} />
      <meshStandardMaterial color="#111" metalness={1} roughness={0.3} />
    </mesh>
  );
}
