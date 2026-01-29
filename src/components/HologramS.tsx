import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Center, Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

const RotatingS = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      glowRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const hologramMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color("#00d4ff") },
          color2: { value: new THREE.Color("#0066ff") },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          varying vec3 vNormal;
          
          void main() {
            vUv = uv;
            vPosition = position;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color1;
          uniform vec3 color2;
          varying vec2 vUv;
          varying vec3 vPosition;
          varying vec3 vNormal;
          
          void main() {
            // Fresnel effect for edge glow
            vec3 viewDirection = normalize(cameraPosition - vPosition);
            float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.0);
            
            // Scanline effect
            float scanline = sin(vPosition.y * 30.0 + time * 2.0) * 0.1 + 0.9;
            
            // Gradient between colors
            vec3 color = mix(color1, color2, vUv.y);
            
            // Holographic flicker
            float flicker = sin(time * 10.0) * 0.05 + 0.95;
            
            // Combine effects
            float alpha = (0.4 + fresnel * 0.6) * scanline * flicker;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  );

  // Update shader time uniform
  useFrame((state) => {
    hologramMaterial.uniforms.time.value = state.clock.elapsedTime;
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Center>
        <group>
          {/* Main S with hologram material */}
          <Text3D
            ref={meshRef}
            font="/fonts/helvetiker_bold.typeface.json"
            size={3}
            height={0.5}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.05}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={8}
          >
            S
            <primitive object={hologramMaterial} attach="material" />
          </Text3D>

          {/* Outer glow S */}
          <Text3D
            ref={glowRef}
            font="/fonts/helvetiker_bold.typeface.json"
            size={3.05}
            height={0.52}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.05}
            bevelSize={0.03}
            bevelOffset={0}
            bevelSegments={8}
          >
            S
            <meshBasicMaterial
              color="#00d4ff"
              transparent
              opacity={0.1}
              side={THREE.BackSide}
            />
          </Text3D>
        </group>
      </Center>
    </Float>
  );
};

// Holographic ring around the S
const HolographicRing = () => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0, 0]}>
      <torusGeometry args={[4, 0.02, 16, 100]} />
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.4} />
    </mesh>
  );
};

// Floating data particles
const DataParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 50;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 3.5 + Math.random() * 1;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#00d4ff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

export const HologramS = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-60">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0066ff" />
        
        <RotatingS />
        <HolographicRing />
        <DataParticles />
      </Canvas>
    </div>
  );
};

export default HologramS;
