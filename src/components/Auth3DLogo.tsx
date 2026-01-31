import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, Center, Float } from "@react-three/drei";
import * as THREE from "three";

const RotatingU = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
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
            vec3 viewDirection = normalize(cameraPosition - vPosition);
            float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 1.5);
            
            float scanline = sin(vPosition.y * 15.0 + time * 2.0) * 0.1 + 0.9;
            
            vec3 color = mix(color1, color2, vUv.y);
            
            float flicker = sin(time * 6.0) * 0.02 + 0.98;
            float pulse = sin(time * 1.2) * 0.1 + 0.9;
            float burst = pow(sin(time * 0.6) * 0.5 + 0.5, 3.0) * 0.2;
            
            float alpha = (0.8 + fresnel * 0.2 + burst) * scanline * flicker * pulse;
            vec3 finalColor = color + color * burst * 0.4;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  );

  useFrame((state) => {
    hologramMaterial.uniforms.time.value = state.clock.elapsedTime;
  });

  return (
    <Float speed={1.2} rotationIntensity={0} floatIntensity={0.2}>
      <Center>
        <group ref={groupRef}>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={5}
            height={1}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.1}
            bevelSize={0.05}
            bevelOffset={0}
            bevelSegments={8}
          >
            U
            <primitive object={hologramMaterial} attach="material" />
          </Text3D>

          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={5}
            height={1}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.1}
            bevelSize={0.05}
            bevelOffset={0}
            bevelSegments={8}
          >
            U
            <meshBasicMaterial color="#00d4ff" transparent opacity={0.35} />
          </Text3D>

          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={5.15}
            height={1.05}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.12}
            bevelSize={0.07}
            bevelOffset={0}
            bevelSegments={8}
          >
            U
            <meshBasicMaterial
              color="#00d4ff"
              transparent
              opacity={0.12}
              side={THREE.BackSide}
            />
          </Text3D>
        </group>
      </Center>
    </Float>
  );
};

export const Auth3DLogo = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [-3, 0, 14], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#0066ff" />
        <pointLight position={[0, 0, 10]} intensity={0.8} color="#ffffff" />
        
        <RotatingU />
      </Canvas>
    </div>
  );
};

export default Auth3DLogo;
