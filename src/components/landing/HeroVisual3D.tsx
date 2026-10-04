"use client";

import React, { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ArgilaShieldProps {
  scrollProgress?: number;
}

const ArgilaShieldArtifact: React.FC<ArgilaShieldProps> = ({ scrollProgress = 0 }) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const medallionRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const haloRingRef = useRef<THREE.Mesh>(null);
  const satellitesRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Mouse tracking with smooth lerp
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // Load the Argila Emblem texture
  const emblemTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load("/argila-logo-ink.png");
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  // Ascending Celestial Starlight / Ember Particles
  const [particlePositions, particleScales] = useMemo(() => {
    const count = 160;
    const pos = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.3 + Math.random() * 1.6;
      pos[i * 3] = radius * Math.cos(angle);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
      pos[i * 3 + 2] = radius * Math.sin(angle);
      scales[i] = 0.5 + Math.random() * 0.8;
    }
    return [pos, scales];
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Lerp mouse coordinates smoothly
    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

    // Root Group breathing levitation & gentle tilt
    if (rootGroupRef.current) {
      rootGroupRef.current.position.y = Math.sin(t * 1.4) * 0.08;
      rootGroupRef.current.rotation.x = mouse.current.y * 0.25;
      rootGroupRef.current.rotation.y = mouse.current.x * 0.35 + scrollProgress * 1.2;
    }

    // Shield Medallion slow majestic yaw swing
    if (medallionRef.current) {
      medallionRef.current.rotation.y = Math.sin(t * 0.4) * 0.22;
      medallionRef.current.rotation.z = Math.cos(t * 0.5) * 0.04;
    }

    // Inner Luminous Lime Gyro Ring
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = t * 0.35;
      innerRingRef.current.rotation.z = -t * 0.25;
    }

    // Outer Celestial Ivory Ring
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = -t * 0.28;
      outerRingRef.current.rotation.x = t * 0.15;
    }

    // Polar Halo Ring
    if (haloRingRef.current) {
      haloRingRef.current.rotation.z = t * 0.18;
    }

    // Orbiting Satellite Beacons
    if (satellitesRef.current) {
      satellitesRef.current.rotation.y = t * 0.45;
      satellitesRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }

    // Particle Swarm slow vertical drift
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] += delta * 0.25;
        if (positions[i * 3 + 1] > 2.0) {
          positions[i * 3 + 1] = -2.0;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = t * 0.04;
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]}>
      {/* Central Shield Talisman Medallion */}
      <group ref={medallionRef}>
        {/* Front Shield Emblem Plane */}
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[2.25, 2.25]} />
          <meshBasicMaterial
            map={emblemTexture}
            transparent
            side={THREE.FrontSide}
            depthWrite={false}
          />
        </mesh>

        {/* Back Shield Emblem Plane (mirrored back) */}
        <mesh position={[0, 0, -0.04]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.25, 2.25]} />
          <meshBasicMaterial
            map={emblemTexture}
            transparent
            side={THREE.FrontSide}
            depthWrite={false}
          />
        </mesh>

        {/* Solid Dark Metallic Backplate Core */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.22, 1.25, 0.06, 64]} />
          <meshPhysicalMaterial
            color="#141c11"
            roughness={0.2}
            metalness={0.9}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            reflectivity={0.9}
          />
        </mesh>

        {/* Gilded Inner Bevel Rim */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.25, 0.035, 16, 64]} />
          <meshStandardMaterial
            color="#B8F34A"
            metalness={0.85}
            roughness={0.25}
            emissive="#B8F34A"
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Subtle Protective Glass Shield Shell */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.35, 32, 32]} />
          <meshPhysicalMaterial
            color="#B8F34A"
            roughness={0.08}
            metalness={0.1}
            transmission={0.95}
            ior={1.45}
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Gyroscopic Celestial Ring 1 - Luminous Moss Lime */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.72, 0.018, 16, 80]} />
        <meshBasicMaterial color="#B8F34A" opacity={0.7} transparent />
      </mesh>

      {/* Gyroscopic Celestial Ring 2 - Wireframe Ivory */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[2.15, 0.012, 16, 96]} />
        <meshBasicMaterial color="#F4F1E8" opacity={0.35} transparent wireframe />
      </mesh>

      {/* Outer Halo Perimeter */}
      <mesh ref={haloRingRef}>
        <torusGeometry args={[2.45, 0.008, 16, 110]} />
        <meshBasicMaterial color="#A0AA98" opacity={0.2} transparent />
      </mesh>

      {/* Orbiting Satellite Crystals */}
      <group ref={satellitesRef}>
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 1.9,
              Math.sin(angle * 2) * 0.35,
              Math.sin(angle) * 1.9,
            ]}
          >
            <octahedronGeometry args={[0.07, 0]} />
            <meshStandardMaterial
              color={i === 0 ? "#B8F34A" : "#F4F1E8"}
              emissive={i === 0 ? "#B8F34A" : "#F4F1E8"}
              emissiveIntensity={0.6}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Ascending Starlight / Ember Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#B8F34A"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Volumetric Lights */}
      {/* Front Specular Highlight Light */}
      <directionalLight position={[2, 3, 4]} intensity={2.8} color="#FFFFF8" />
      {/* Luminous Key Light */}
      <pointLight position={[3, 2, 2]} intensity={7.0} color="#B8F34A" distance={8} />
      {/* Deep Forest Fill Light */}
      <pointLight position={[-3, -2, -2]} intensity={5.0} color="#283615" distance={8} />
      {/* Ivory Rim Light */}
      <pointLight position={[0, -3, 3]} intensity={4.5} color="#F4F1E8" distance={8} />
      <ambientLight intensity={1.2} />
    </group>
  );
};

// Graceful Fallback for devices without WebGL
const HeroVisualFallback: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none p-6">
      <div className="relative w-full max-w-[340px] aspect-square rounded-full border border-white/[0.08] flex items-center justify-center animate-[spin_60s_linear_infinite]">
        <div className="w-[84%] h-[84%] rounded-full border border-dashed border-[#B8F34A]/30 flex items-center justify-center animate-[spin_35s_linear_infinite_reverse]">
          <div className="relative w-[70%] h-[70%] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/argila-logo-ink.png"
              alt="Argila Shield"
              className="w-full h-full object-contain drop-shadow-[0_0_35px_rgba(184,243,74,0.35)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export interface HeroVisual3DProps {
  className?: string;
  scrollProgress?: number;
}

export const HeroVisual3D: React.FC<HeroVisual3DProps> = ({
  className = "w-full h-full",
  scrollProgress = 0,
}) => {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (hasWebGL === false) {
    return <HeroVisualFallback />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Suspense fallback={<HeroVisualFallback />}>
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          className="w-full h-full pointer-events-auto"
        >
          <ArgilaShieldArtifact scrollProgress={scrollProgress} />
        </Canvas>
      </Suspense>
    </div>
  );
};
