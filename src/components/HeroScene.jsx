import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";

// A clay "agent graph": nodes = agents, edges = messages, pulses = traffic.
const N = 9;

function useGraph() {
  return useMemo(() => {
    const pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      pts.push(new THREE.Vector3(Math.cos(t) * r * 1.75, y * 1.5, Math.sin(t) * r * 1.75));
    }
    const edges = new Set();
    pts.forEach((p, i) => {
      const near = pts
        .map((q, j) => [j, p.distanceTo(q)])
        .filter(([j]) => j !== i)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 2);
      near.forEach(([j]) => edges.add(i < j ? `${i}-${j}` : `${j}-${i}`));
    });
    const list = [...edges].map((k) => k.split("-").map(Number));
    const sizes = pts.map((_, i) => (i === 4 ? 0.42 : 0.2 + ((i * 37) % 10) / 55));
    return { pts, edges: list, sizes };
  }, []);
}

function Edge({ a, b }) {
  const { pos, quat, len } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    const pos = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return { pos, quat, len };
  }, [a, b]);
  return (
    <mesh position={pos} quaternion={quat}>
      <cylinderGeometry args={[0.035, 0.035, len, 10]} />
      <meshStandardMaterial color="#9b1a1f" roughness={0.8} />
    </mesh>
  );
}

function Pulse({ graph, offset }) {
  const ref = useRef();
  const state = useRef({ e: offset % graph.edges.length, t: 0 });
  useFrame((_, dt) => {
    const s = state.current;
    s.t += dt * 0.7;
    if (s.t >= 1) {
      s.t = 0;
      s.e = (s.e + 3) % graph.edges.length;
    }
    const [i, j] = graph.edges[s.e];
    ref.current.position.lerpVectors(graph.pts[i], graph.pts[j], s.t);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 16, 16]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} roughness={0.4} />
    </mesh>
  );
}

function Graph() {
  const g = useGraph();
  const group = useRef();
  useFrame((state, dt) => {
    const grp = group.current;
    grp.rotation.y += dt * 0.18;
    const tx = state.pointer.y * 0.35;
    const tz = -state.pointer.x * 0.25;
    grp.rotation.x += (tx - grp.rotation.x) * 0.04;
    grp.rotation.z += (tz - grp.rotation.z) * 0.04;
  });
  return (
    <group ref={group}>
      {g.edges.map(([i, j]) => (
        <Edge key={`${i}-${j}`} a={g.pts[i]} b={g.pts[j]} />
      ))}
      {g.pts.map((p, i) => (
        <Float key={i} speed={1.4 + (i % 3) * 0.4} rotationIntensity={0.4} floatIntensity={0.35}>
          <mesh position={p}>
            <sphereGeometry args={[g.sizes[i], 48, 48]} />
            <meshPhysicalMaterial
              color={i === 4 ? "#f4efe8" : "#e3262b"}
              roughness={0.62}
              clearcoat={0.35}
              clearcoatRoughness={0.55}
              sheen={1}
              sheenColor={i === 4 ? "#ffffff" : "#ff8a8a"}
            />
          </mesh>
        </Float>
      ))}
      {[0, 4, 8].map((o) => (
        <Pulse key={o} graph={g} offset={o} />
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.2, 6.2], fov: 38 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#ffffff", "#e3262b", 0.55]} />
      <directionalLight position={[3, 4, 5]} intensity={2.3} />
      <directionalLight position={[-4, -2, -3]} intensity={0.7} color="#ffb3b3" />
      <Graph />
      <ContactShadows position={[0, -1.95, 0]} opacity={0.32} scale={6} blur={2.8} far={3} color="#8e1318" />
    </Canvas>
  );
}
