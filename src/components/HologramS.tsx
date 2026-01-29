import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Center, Float } from "@react-three/drei";
import * as THREE from "three";

const RotatingS = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Rotate on its own Y axis (spinning in place)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  const hologramMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color("#00d4ff") },
          color2: { value: new THREE.Color("#0088ff") },
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
            float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 1.5);
            
            // Scanline effect
            float scanline = sin(vPosition.y * 20.0 + time * 3.0) * 0.15 + 0.85;
            
            // Gradient between colors
            vec3 color = mix(color1, color2, vUv.y);
            
            // Holographic flicker
            float flicker = sin(time * 8.0) * 0.03 + 0.97;
            
            // Pulsing glow effect - slow breathe
            float pulse = sin(time * 1.5) * 0.15 + 0.85;
            
            // Intense glow burst every few seconds
            float burst = pow(sin(time * 0.8) * 0.5 + 0.5, 3.0) * 0.3;
            
            // Combine effects with pulsing
            float alpha = (0.7 + fresnel * 0.3 + burst) * scanline * flicker * pulse;
            
            // Add extra brightness during pulse
            vec3 finalColor = color + color * burst * 0.5;
            
            gl_FragColor = vec4(finalColor, alpha);
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
    <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
      <Center>
        <group ref={groupRef}>
          {/* Main S with hologram material */}
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={4}
            height={0.8}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.08}
            bevelSize={0.04}
            bevelOffset={0}
            bevelSegments={8}
          >
            S
            <primitive object={hologramMaterial} attach="material" />
          </Text3D>

          {/* Inner glow layer */}
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={4}
            height={0.8}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.08}
            bevelSize={0.04}
            bevelOffset={0}
            bevelSegments={8}
          >
            S
            <meshBasicMaterial
              color="#00d4ff"
              transparent
              opacity={0.4}
            />
          </Text3D>

          {/* Outer glow S */}
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={4.1}
            height={0.85}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.1}
            bevelSize={0.06}
            bevelOffset={0}
            bevelSegments={8}
          >
            S
            <meshBasicMaterial
              color="#00d4ff"
              transparent
              opacity={0.15}
              side={THREE.BackSide}
            />
          </Text3D>
        </group>
      </Center>
    </Float>
  );
};


// Floating data particles orbiting
const DataParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 80;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 4.5 + Math.random() * 2;
      const height = (Math.random() - 0.5) * 4;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.15;
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
        size={0.12}
        color="#00d4ff"
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
};

export const HologramS = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#0066ff" />
        <pointLight position={[0, 0, 10]} intensity={1} color="#ffffff" />
        
        <RotatingS />
        
        <DataParticles />
      </Canvas>
    </div>
  );
};

export default HologramS;
