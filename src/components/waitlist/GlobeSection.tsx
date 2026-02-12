import { useRef, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { CelestialBackground } from "@/components/ui/CelestialBackground";
import { useClipReveal } from "@/hooks/useClipReveal";

const Globe = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Create globe wireframe geometry
  const wireframeGeo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.8, 12);
    return geo;
  }, []);

  // Create scattered dot points on sphere surface
  const dotPositions = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = 1.82;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  // Create arc connections between random points
  const arcs = useMemo(() => {
    const arcCount = 8;
    const curves: THREE.BufferGeometry[] = [];
    for (let i = 0; i < arcCount; i++) {
      const phi1 = Math.acos(2 * Math.random() - 1);
      const theta1 = 2 * Math.PI * Math.random();
      const phi2 = Math.acos(2 * Math.random() - 1);
      const theta2 = 2 * Math.PI * Math.random();
      const r = 1.82;

      const start = new THREE.Vector3(
        r * Math.sin(phi1) * Math.cos(theta1),
        r * Math.sin(phi1) * Math.sin(theta1),
        r * Math.cos(phi1)
      );
      const end = new THREE.Vector3(
        r * Math.sin(phi2) * Math.cos(theta2),
        r * Math.sin(phi2) * Math.sin(theta2),
        r * Math.cos(phi2)
      );

      const mid = start.clone().add(end).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(r * 1.5);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(40);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      curves.push(geo);
    }
    return curves;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.08;
      meshRef.current.rotation.x = Math.sin(t * 0.05) * 0.1;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.08;
      pointsRef.current.rotation.x = Math.sin(t * 0.05) * 0.1;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.03);
    }
  });

  return (
    <group>
      {/* Inner glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.03}
        />
      </mesh>

      {/* Wireframe globe */}
      <mesh ref={meshRef} geometry={wireframeGeo}>
        <meshBasicMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Dot points on surface */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dotPositions.length / 3}
            array={dotPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#06b6d4"
          size={0.012}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Arc connections rendered as thin tubes */}
      {arcs.map((geo, i) => {
        const positions = geo.getAttribute("position") as THREE.BufferAttribute;
        const points: THREE.Vector3[] = [];
        for (let j = 0; j < positions.count; j++) {
          points.push(new THREE.Vector3(positions.getX(j), positions.getY(j), positions.getZ(j)));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeo = new THREE.TubeGeometry(curve, 40, 0.004, 4, false);
        return (
          <mesh key={i} geometry={tubeGeo}>
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.25} />
          </mesh>
        );
      })}

      {/* Outer atmosphere ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.02, 128]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export const GlobeSection = () => {
  const { ref, style } = useClipReveal({ direction: "down", duration: 1000 });

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <CelestialBackground variant="convergence" intensity="medium" />
      <div className="container mx-auto px-4">
        <div ref={ref} style={style} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Connecting <span className="text-primary text-glow">Global Talent</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Building a worldwide network of senior professionals, one signal at a time.
          </p>
        </div>
        <div className="relative w-full h-[400px] md:h-[500px] mx-auto max-w-3xl">
          {/* Ambient glow behind globe */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full celestial-breathe"
              style={{
                background:
                  "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
              }}
            />
          </div>
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              style={{ background: "transparent" }}
              gl={{ alpha: true, antialias: true }}
            >
              <ambientLight intensity={0.3} />
              <Globe />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={false}
                rotateSpeed={0.3}
              />
            </Canvas>
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default GlobeSection;
