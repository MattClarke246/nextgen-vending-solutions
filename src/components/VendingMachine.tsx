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

    // Stable Display Case Positioning (No bouncing)
    // On desktop, push it to the right half so text on the left is readable.
    // On mobile, center it but push it down slightly to stay underneath text.
    const isMobile = window.innerWidth < 1024;
    groupRef.current.position.x = isMobile ? 0 : 2.5;
    groupRef.current.position.y = isMobile ? 0 : -0.5;
    groupRef.current.scale.setScalar(isMobile ? 0.7 : 1.1);

    // Clean spin mechanics based purely on scroll depth
    if (!isOpen) {
      // At top of page (progress=0), faces forward.
      // Spins slowly exactly 2 full rotations as user scrolls the entire page.
      groupRef.current.rotation.y = progress * Math.PI * 4;
    } else {
      // When user clicks to open, lock the machine towards them to examine products
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0.1, 0.1);
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
        {/* Hollow Main Body */}
        <group>
          {/* Back panel */}
          <RoundedBox args={[1.5, 2.5, 0.2]} radius={0.08} smoothness={8} position={[0, 0, -0.4]} castShadow>
            <meshPhysicalMaterial color={customization.brandColor} metalness={0.6} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
          </RoundedBox>
          {/* Left panel */}
          <RoundedBox args={[0.2, 2.5, 0.8]} radius={0.08} smoothness={8} position={[-0.65, 0, 0.1]} castShadow>
            <meshPhysicalMaterial color={customization.brandColor} metalness={0.6} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
          </RoundedBox>
          {/* Right panel */}
          <RoundedBox args={[0.2, 2.5, 0.8]} radius={0.08} smoothness={8} position={[0.65, 0, 0.1]} castShadow>
            <meshPhysicalMaterial color={customization.brandColor} metalness={0.6} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
          </RoundedBox>
          {/* Top panel */}
          <RoundedBox args={[1.1, 0.2, 0.8]} radius={0.08} smoothness={8} position={[0, 1.15, 0.1]} castShadow>
            <meshPhysicalMaterial color={customization.brandColor} metalness={0.6} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
          </RoundedBox>
          {/* Bottom panel */}
          <RoundedBox args={[1.1, 0.2, 0.8]} radius={0.08} smoothness={8} position={[0, -1.15, 0.1]} castShadow>
            <meshPhysicalMaterial color={customization.brandColor} metalness={0.6} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
          </RoundedBox>
        </group>

        {/* Interior Backdrop */}
        <mesh position={[0, 0, -0.29]}>
          <planeGeometry args={[1.3, 2.3]} />
          <meshStandardMaterial color="#EAEAEA" roughness={0.2} metalness={0.5} />
        </mesh>

        {/* Interior LED Light Strip */}
        <mesh position={[0, 1.15, 0.2]}>
          <boxGeometry args={[1.2, 0.05, 0.05]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} />
        </mesh>

        {/* Door Group (Glass + Frame) */}
        <group ref={doorRef} position={[0.75, 0, 0.5]}>
          <group position={[-0.75, 0, 0]}>
            {/* Glass Front */}
            <RoundedBox args={[1.1, 2.1, 0.05]} radius={0.02} smoothness={4} position={[0, 0, 0]}>
              <meshPhysicalMaterial 
                transparent 
                opacity={0.1} 
                transmission={0.9} 
                thickness={2}
                roughness={0.05} 
                metalness={0.1}
                clearcoat={1}
                clearcoatRoughness={0.1}
                color="#ffffff"
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
        <meshStandardMaterial color="#007AFF" emissive="#007AFF" emissiveIntensity={1} />
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
          <meshStandardMaterial color="#FFFFFF" metalness={0.8} roughness={0.1} />
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
                color={j % 3 === 0 ? "#FF3B30" : j % 3 === 1 ? "#34C759" : "#007AFF"} 
                metalness={isDrink ? 0.8 : 0.1}
                roughness={0.2}
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
