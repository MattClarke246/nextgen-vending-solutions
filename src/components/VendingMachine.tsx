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
  const backRef = useRef<any>(null);
  const leftRef = useRef<any>(null);
  const rightRef = useRef<any>(null);
  const topRef = useRef<any>(null);
  const bottomRef = useRef<any>(null);
  const racksRef = useRef<THREE.Group>(null);
  const coolingRef = useRef<THREE.Mesh>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Parse brand color as THREE color
  const brandColor = customization.brandColor;
  const isDark = brandColor === '#5C5C5F' || brandColor === '#2E3641';

  useFrame(() => {
    if (!groupRef.current || !doorRef.current) return;
    const progress = scrollProgress.get();

    // Sine-wave explosion math strictly between 50%–75%
    let explodeAmount = 0;
    if (progress > 0.5 && progress < 0.75) {
      explodeAmount = Math.sin(((progress - 0.5) / 0.25) * Math.PI);
    }

    // Exit: scroll machine up off-screen past 75%
    let exitY = 0;
    if (progress > 0.75) {
      exitY = (progress - 0.75) * 35;
    }

    const isMobile = window.innerWidth < 1024;
    // Pin layout strictly to the right side of the screen on desktop to clear text completely.
    groupRef.current.position.x = isMobile ? 0 : 1.4;
    groupRef.current.position.y = (isMobile ? 0 : -0.3) + exitY;
    groupRef.current.scale.setScalar(isMobile ? 0.65 : 1.0);

    // Explode parts - massively throw the components outward to avoid center-crush
    if (topRef.current)    topRef.current.position.y    =  1.3 + explodeAmount * 0.9;
    if (bottomRef.current) bottomRef.current.position.y = -1.3 - explodeAmount * 0.9;
    if (leftRef.current)   leftRef.current.position.x   = -0.75 - explodeAmount * 1.3;
    if (rightRef.current)  rightRef.current.position.x  =  0.75 + explodeAmount * 1.3;
    if (backRef.current)   backRef.current.position.z   = -0.45 - explodeAmount * 0.6;
    if (racksRef.current)  racksRef.current.position.z  =  explodeAmount * 0.6;
    if (coolingRef.current) coolingRef.current.position.y = -1.3 - explodeAmount * 1.3;

    // Door forward
    const doorTarget = isOpen ? Math.PI * 0.6 : 0;
    doorRef.current.rotation.y = THREE.MathUtils.lerp(doorRef.current.rotation.y, doorTarget, 0.1);
    doorRef.current.position.z = 0.5 + explodeAmount * 0.65;

    // Rotation
    if (!isOpen) {
      groupRef.current.rotation.y = progress * Math.PI * 6;
    } else {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0.1, 0.1);
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Float speed={isOpen ? 0 : 1.5} rotationIntensity={isOpen ? 0 : 0.2} floatIntensity={isOpen ? 0 : 0.3}>
        {/* ── CHASSIS WALLS ── */}
        <group>
          {/* Back wall */}
          <RoundedBox ref={backRef} args={[1.6, 2.8, 0.18]} radius={0.06} smoothness={8} position={[0, 0, -0.45]} castShadow>
            <meshPhysicalMaterial color={brandColor} metalness={0.75} roughness={0.15} clearcoat={1} clearcoatRoughness={0.08} />
          </RoundedBox>
          {/* Left wall */}
          <RoundedBox ref={leftRef} args={[0.18, 2.8, 0.92]} radius={0.06} smoothness={8} position={[-0.75, 0, 0.01]} castShadow>
            <meshPhysicalMaterial color={brandColor} metalness={0.75} roughness={0.15} clearcoat={1} clearcoatRoughness={0.08} />
          </RoundedBox>
          {/* Right wall */}
          <RoundedBox ref={rightRef} args={[0.18, 2.8, 0.92]} radius={0.06} smoothness={8} position={[0.75, 0, 0.01]} castShadow>
            <meshPhysicalMaterial color={brandColor} metalness={0.75} roughness={0.15} clearcoat={1} clearcoatRoughness={0.08} />
          </RoundedBox>
          {/* Top cap */}
          <RoundedBox ref={topRef} args={[1.6, 0.18, 0.92]} radius={0.06} smoothness={8} position={[0, 1.3, 0.01]} castShadow>
            <meshPhysicalMaterial color={brandColor} metalness={0.75} roughness={0.15} clearcoat={1} clearcoatRoughness={0.08} />
          </RoundedBox>
          {/* Bottom base */}
          <RoundedBox ref={bottomRef} args={[1.6, 0.18, 0.92]} radius={0.06} smoothness={8} position={[0, -1.3, 0.01]} castShadow>
            <meshPhysicalMaterial color={brandColor} metalness={0.75} roughness={0.15} clearcoat={1} clearcoatRoughness={0.08} />
          </RoundedBox>
        </group>

        {/* ── INTERIOR ── */}
        {/* Interior backdrop – painted metal matching chassis */}
        <mesh position={[0, 0, -0.35]}>
          <planeGeometry args={[1.42, 2.62]} />
          <meshPhysicalMaterial color={brandColor} metalness={0.6} roughness={0.2} clearcoat={0.5} />
        </mesh>

        {/* Interior ceiling LED strip */}
        <mesh position={[0, 1.18, -0.05]}>
          <boxGeometry args={[1.3, 0.04, 0.06]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFAE0" emissiveIntensity={3} />
        </mesh>
        <pointLight position={[0, 1.0, 0.1]} intensity={1.5} color="#FFFFFF" distance={3} />

        {/* ── LOGO PANEL (top) ── */}
        <mesh position={[0, 0.98, 0.47]}>
          <planeGeometry args={[1.1, 0.28]} />
          <meshStandardMaterial color={isDark ? '#1C1C1E' : '#007AFF'} roughness={0.3} metalness={0.5} />
        </mesh>

        {/* ── PRODUCT RACKS (inside machine) ── */}
        <group ref={racksRef}>
          <Racks productType={customization.productType} />
        </group>

        {/* ── DISPENSING TRAY SLOT ── */}
        <mesh position={[0, -0.95, 0.47]}>
          <boxGeometry args={[0.9, 0.1, 0.04]} />
          <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Tray recess */}
        <mesh position={[0, -1.06, 0.35]}>
          <boxGeometry args={[0.85, 0.14, 0.22]} />
          <meshStandardMaterial color="#0A0A0A" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* ── COOLING / BASE UNIT ── */}
        <mesh ref={coolingRef} position={[0, -1.3, 0]}>
          <boxGeometry args={[1.55, 0.22, 0.88]} />
          <meshStandardMaterial color={isDark ? '#111' : '#2A2A2C'} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Ventilation grille slots */}
        {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
          <mesh key={i} position={[x, -1.3, 0.45]}>
            <boxGeometry args={[0.06, 0.14, 0.01]} />
            <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}

        {/* ── DOOR ASSEMBLY ── */}
        <group ref={doorRef} position={[0.75, 0, 0.5]}>
          <group position={[-0.75, 0, 0]}>
            {/* Tempered glass door */}
            <RoundedBox args={[1.3, 2.62, 0.04]} radius={0.02} smoothness={6} position={[0, 0, 0]}>
              <meshPhysicalMaterial
                transparent
                opacity={0.08}
                transmission={0.95}
                thickness={3}
                roughness={0.02}
                metalness={0.0}
                clearcoat={1}
                clearcoatRoughness={0.05}
                color="#DDEEFF"
                ior={1.5}
              />
            </RoundedBox>

            {/* Door frame – left pillar */}
            <RoundedBox args={[0.12, 2.8, 0.10]} radius={0.04} smoothness={6} position={[-0.71, 0, 0]}>
              <meshPhysicalMaterial color={brandColor} metalness={0.75} roughness={0.15} clearcoat={1} />
            </RoundedBox>
            {/* Door frame – right pillar */}
            <RoundedBox args={[0.12, 2.8, 0.10]} radius={0.04} smoothness={6} position={[0.71, 0, 0]}>
              <meshPhysicalMaterial color={brandColor} metalness={0.75} roughness={0.15} clearcoat={1} />
            </RoundedBox>
            
            {/* Hinge / Frame Ambient Shadow Void */}
            <mesh position={[-0.78, 0, -0.04]}>
              <boxGeometry args={[0.08, 2.7, 0.08]} />
              <meshStandardMaterial color="#000000" metalness={0} roughness={1} />
            </mesh>

            {/* ── PAYMENT PANEL (right side of door frame) ── */}
            <group position={[0.58, 0.3, 0.06]}>
              {/* Panel body */}
              <RoundedBox args={[0.22, 0.95, 0.08]} radius={0.03} smoothness={6}>
                <meshPhysicalMaterial color="#1C1C1E" metalness={0.85} roughness={0.15} clearcoat={1} />
              </RoundedBox>
              {/* LCD screen */}
              <mesh position={[0, 0.3, 0.045]}>
                <planeGeometry args={[0.16, 0.18]} />
                <meshStandardMaterial color="#007AFF" emissive="#007AFF" emissiveIntensity={1.2} />
              </mesh>
              {/* Card tap ring */}
              <mesh position={[0, 0.05, 0.045]}>
                <ringGeometry args={[0.05, 0.07, 32]} />
                <meshStandardMaterial color="#34C759" emissive="#34C759" emissiveIntensity={1} />
              </mesh>
              {/* Keypad dots */}
              {[0.12, 0, -0.12].map((py, row) =>
                [-0.05, 0.0, 0.05].map((px, col) => (
                  <mesh key={`${row}${col}`} position={[px, -0.18 + py, 0.045]}>
                    <circleGeometry args={[0.012, 8]} />
                    <meshStandardMaterial color="#48484A" />
                  </mesh>
                ))
              )}
              {/* Coin slot */}
              <mesh position={[0, -0.38, 0.045]}>
                <boxGeometry args={[0.12, 0.025, 0.01]} />
                <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ── HOVER PROMPT ── */}
        {hovered && !isOpen && (
          <Html position={[0, 1.65, 0]} center>
            <div className="bg-accent text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap pointer-events-none shadow-lg">
              Click to Open
            </div>
          </Html>
        )}
      </Float>
    </group>
  );
}

// ── PRODUCT RACKS ─────────────────────────────────────────────────────────────

function Racks({ productType }: { productType: string }) {
  const products = useMemo(() => {
    return [0.55, 0.18, -0.19, -0.56].map((y, rowIdx) => {
      const isDrink = productType === 'drinks' || (productType === 'mixed' && rowIdx < 2);
      return (
        <group key={rowIdx} position={[0, y, 0.05]}>
          {/* Shelf surface */}
          <mesh>
            <boxGeometry args={[1.35, 0.025, 0.55]} />
            <meshStandardMaterial color="#E5E5EA" metalness={0.5} roughness={0.2} />
          </mesh>
          {/* Shelf front lip */}
          <mesh position={[0, 0.04, 0.28]}>
            <boxGeometry args={[1.35, 0.06, 0.02]} />
            <meshStandardMaterial color="#D1D1D6" metalness={0.5} roughness={0.25} />
          </mesh>
          {/* Products */}
          {[-0.48, -0.28, -0.08, 0.12, 0.32, 0.52].map((x, j) => {
            const colors = ['#FF3B30', '#34C759', '#007AFF', '#FF9500', '#AF52DE', '#FFCC00'];
            return (
              <mesh key={j} position={[x, isDrink ? 0.13 : 0.1, 0]}>
                {isDrink ? (
                  <cylinderGeometry args={[0.065, 0.065, 0.24, 20]} />
                ) : (
                  <boxGeometry args={[0.11, 0.17, 0.09]} />
                )}
                <meshPhysicalMaterial
                  color={colors[j % colors.length]}
                  metalness={isDrink ? 0.85 : 0.05}
                  roughness={isDrink ? 0.1 : 0.4}
                  clearcoat={isDrink ? 0.8 : 0}
                />
              </mesh>
            );
          })}
        </group>
      );
    });
  }, [productType]);

  return <group>{products}</group>;
}
