import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Lightformer, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Phones get a lighter version of the glass so the page stays smooth.
const small = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

/** Glass material shared by every shape. Tuned for a dark page. */
function Glass({ tint = '#ffffff', ...props }) {
  return (
    <MeshTransmissionMaterial
      samples={small ? 3 : 4}
      resolution={small ? 256 : 384}
      thickness={0.9}
      roughness={0.05}
      transmission={1}
      ior={1.35}
      chromaticAberration={0.35}
      anisotropy={0.2}
      distortion={0.25}
      distortionScale={0.4}
      temporalDistortion={0.08}
      backside
      backsideThickness={0.4}
      color={tint}
      {...props}
    />
  )
}

/**
 * Soft colour fields behind the shapes. The glass refracts what is in the
 * 3D scene (not the web page), so this gives it colour to bend.
 */
function Backdrop() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 512
    const g = c.getContext('2d')
    const blob = (x, y, r, col) => {
      const grd = g.createRadialGradient(x, y, 0, x, y, r)
      grd.addColorStop(0, col)
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = grd
      g.fillRect(0, 0, 512, 512)
    }
    // keep every blob well inside the texture so the plane has no visible edge
    blob(210, 230, 130, 'rgba(16,185,129,0.85)')
    blob(310, 200, 120, 'rgba(14,165,233,0.8)')
    blob(290, 320, 130, 'rgba(139,92,246,0.75)')
    blob(200, 330, 90, 'rgba(251,146,60,0.45)')
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
  return (
    <mesh position={[0, 0, -3.5]} scale={[11, 11, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={tex} transparent opacity={0.45} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

/** Tilts the whole scene toward the pointer, eased. */
function Rig({ children, reduce }) {
  const group = useRef()
  useFrame((state, dt) => {
    if (!group.current) return
    const tx = reduce ? 0 : state.pointer.y * 0.25
    const ty = reduce ? 0 : state.pointer.x * 0.4
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, tx, 3, dt)
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, ty, 3, dt)
  })
  return <group ref={group}>{children}</group>
}

function Spin({ children, speed = 0.2, reduce }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (reduce || !ref.current) return
    ref.current.rotation.x += dt * speed * 0.6
    ref.current.rotation.y += dt * speed
  })
  return <group ref={ref}>{children}</group>
}

function Shapes({ reduce }) {
  const f = reduce ? 0 : 1
  return (
    <Rig reduce={reduce}>
      <Float speed={1.4 * f} rotationIntensity={0.6 * f} floatIntensity={1.2 * f}>
        <Spin speed={0.25} reduce={reduce}>
          <mesh position={[0.2, 0.1, 0]} scale={1.05}>
            <torusKnotGeometry args={[0.9, 0.32, 220, 36]} />
            <Glass tint="#ffffff" background={new THREE.Color('#e3f1ef')} />
          </mesh>
        </Spin>
      </Float>

      <Float speed={2 * f} rotationIntensity={1.2 * f} floatIntensity={2 * f}>
        <mesh position={[-2.1, 1.3, -0.8]} scale={0.55}>
          <icosahedronGeometry args={[1, 0]} />
          <Glass tint="#bff6ff" thickness={0.6} background={new THREE.Color('#bfe9f7')} />
        </mesh>
      </Float>

      <Float speed={1.7 * f} rotationIntensity={0.8 * f} floatIntensity={1.6 * f}>
        <mesh position={[2.2, -1.2, -0.5]} scale={0.5}>
          <sphereGeometry args={[1, 64, 64]} />
          <Glass tint="#e7dcff" thickness={1.4} background={new THREE.Color('#ddd3fe')} />
        </mesh>
      </Float>

      <Float speed={2.4 * f} rotationIntensity={1.5 * f} floatIntensity={1.4 * f}>
        <mesh position={[-1.6, -1.5, 0.4]} scale={0.34} rotation={[0.6, 0.4, 0]}>
          <boxGeometry args={[1.3, 1.3, 1.3]} />
          <Glass tint="#d9fff0" thickness={0.5} background={new THREE.Color('#bff0dc')} />
        </mesh>
      </Float>
    </Rig>
  )
}

/** Switches the render loop on/off from inside the canvas. */
function LoopControl({ running }) {
  const setFrameloop = useThree((s) => s.setFrameloop)
  useEffect(() => { setFrameloop(running ? 'always' : 'never') }, [running, setFrameloop])
  return null
}

/**
 * Hero 3D scene. Stops rendering when scrolled out of view to save battery.
 * All lighting is built in-scene (no external HDR download).
 */
export default function GlassScene({ reduce = false }) {
  const wrap = useRef(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setVisible(e.intersectionRatio > 0.25), { threshold: [0, 0.25, 0.5] })
    if (wrap.current) obs.observe(wrap.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={wrap}
      className="h-full w-full"
      style={{
        maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 55%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, #000 55%, transparent 100%)',
      }}
    >
      <Canvas
        dpr={small ? 1 : [1, 1.25]}
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <LoopControl running={visible} />
        <Backdrop />
        <Shapes reduce={reduce} />
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 3, 0, 1]}>
            <Lightformer form="circle" intensity={4} color="#10b981" position={[0, 5, -9]} scale={4} />
            <Lightformer form="circle" intensity={3} color="#22d3ee" position={[-5, 1, -1]} scale={3} />
            <Lightformer form="circle" intensity={3} color="#a78bfa" position={[5, -1, -1]} scale={3} />
            <Lightformer form="ring" intensity={2} color="#ffffff" position={[-4, -4, 2]} scale={6} />
            <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[0, 0, 8]} scale={[10, 2, 1]} />
          </group>
        </Environment>
      </Canvas>
    </div>
  )
}
