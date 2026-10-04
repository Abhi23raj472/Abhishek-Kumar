import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/*
 * The backdrop: a night-side Earth seen from low orbit, then a flight out
 * past two planets into deep space as the page scrolls. Everything is drawn
 * procedurally (no textures to download). The scene renders only while the
 * tab is visible, and holds a single still frame for reduced motion.
 */

// 3D simplex noise by Ashima Arts / Stefan Gustavson (MIT licence).
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){float f=0.0,a=0.5;for(int i=0;i<5;i++){f+=a*snoise(p);p*=2.03;a*=0.5;}return f;}
`

const SUN = new THREE.Vector3(1, 0.35, 0.55).normalize()

const SURFACE_VERT = /* glsl */ `
varying vec3 vObj;
varying vec3 vN;
varying vec3 vV;
void main(){
  vObj = position;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vN = normalize(mat3(modelMatrix) * normal);
  vV = normalize(cameraPosition - world.xyz);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

const EARTH_FRAG = /* glsl */ `
uniform vec3 uSun;
uniform float uTime;
varying vec3 vObj;
varying vec3 vN;
varying vec3 vV;
${NOISE}
void main(){
  vec3 p = normalize(vObj);
  float h = fbm(p * 2.1);
  float land = smoothstep(0.03, 0.09, h);
  float ice = smoothstep(0.8, 0.92, abs(p.y));
  vec3 ocean = mix(vec3(0.01, 0.03, 0.09), vec3(0.02, 0.09, 0.22), smoothstep(-0.45, 0.05, h));
  vec3 ground = mix(vec3(0.12, 0.17, 0.10), vec3(0.36, 0.31, 0.22), smoothstep(0.12, 0.5, h));
  vec3 col = mix(ocean, ground, land);
  col = mix(col, vec3(0.82, 0.87, 0.93), ice);
  float clouds = smoothstep(0.12, 0.62, fbm(p * 3.4 + vec3(uTime * 0.006, 0.0, uTime * 0.004)));
  col = mix(col, vec3(0.9, 0.93, 0.97), clouds * 0.55);

  vec3 n = normalize(vN);
  float ndl = dot(n, uSun);
  float day = smoothstep(-0.12, 0.28, ndl);
  vec3 lit = col * (0.02 + max(ndl, 0.0) * 1.15);
  // Cities glow on the night side, through gaps in the cloud.
  float city = land * (1.0 - ice) * (1.0 - clouds) * smoothstep(0.35, 0.8, snoise(p * 38.0) * 0.5 + 0.5);
  vec3 night = vec3(1.0, 0.72, 0.38) * city * 0.85;
  vec3 c = mix(night, lit, day);

  float rim = pow(1.0 - max(dot(n, normalize(vV)), 0.0), 3.0);
  c += vec3(0.32, 0.56, 1.0) * rim * (0.25 + day * 0.9);
  gl_FragColor = vec4(c, 1.0);
}
`

const ATMO_VERT = /* glsl */ `
varying vec3 vNormal;
void main(){
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
const ATMO_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uPower;
varying vec3 vNormal;
void main(){
  float i = pow(max(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), uPower);
  gl_FragColor = vec4(uColor, 1.0) * i;
}
`

const PLANET_FRAG = /* glsl */ `
uniform vec3 uSun;
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform float uBands;
uniform float uSeed;
uniform float uFade;
varying vec3 vObj;
varying vec3 vN;
varying vec3 vV;
${NOISE}
void main(){
  vec3 p = normalize(vObj);
  float warp = fbm(p * 2.5 + uSeed) * 1.6;
  float b = sin(p.y * uBands + warp) * 0.5 + 0.5;
  float grain = fbm(p * 7.0 + uSeed * 2.0) * 0.5 + 0.5;
  vec3 col = mix(uA, uB, b);
  col = mix(col, uC, smoothstep(0.55, 0.85, grain) * 0.6);
  vec3 n = normalize(vN);
  float ndl = max(dot(n, uSun), 0.0);
  vec3 c = col * (0.03 + ndl * 1.1);
  float rim = pow(1.0 - max(dot(n, normalize(vV)), 0.0), 4.0);
  c += uB * rim * 0.25 * ndl;
  gl_FragColor = vec4(c, uFade);
}
`

const RING_VERT = /* glsl */ `
varying float vR;
void main(){
  vR = length(position.xy);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
const RING_FRAG = /* glsl */ `
uniform float uInner;
uniform float uOuter;
uniform vec3 uColor;
uniform float uFade;
varying float vR;
void main(){
  float t = (vR - uInner) / (uOuter - uInner);
  float bands = 0.45 + 0.35 * sin(t * 46.0) + 0.2 * sin(t * 13.0);
  float a = bands * smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.8, t) * 0.55;
  gl_FragColor = vec4(uColor, a * uFade);
}
`

const STAR_VERT = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
uniform float uTime;
uniform float uPixelRatio;
varying vec3 vColor;
varying float vAlpha;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float size = aSize * uPixelRatio * (320.0 / -mv.z);
  vAlpha = (0.65 + 0.35 * sin(uTime * 1.3 + aPhase)) * clamp(size, 0.0, 1.0);
  gl_PointSize = clamp(size, 1.0, 7.0 * uPixelRatio);
  vColor = aColor;
}
`
const STAR_FRAG = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vColor, a * a * vAlpha);
}
`

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.35, 'rgba(255,255,255,0.35)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function makeStars(count) {
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  const size = new Float32Array(count)
  const phase = new Float32Array(count)
  const tints = [
    [0.85, 0.9, 1.0],
    [1.0, 1.0, 1.0],
    [0.7, 0.8, 1.0],
    [1.0, 0.88, 0.72],
  ]
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 2200
    pos[i * 3 + 1] = (Math.random() - 0.5) * 1600
    pos[i * 3 + 2] = 300 - Math.random() * 3000
    const t = tints[Math.random() < 0.08 ? 3 : Math.floor(Math.random() * 3)]
    col.set(t, i * 3)
    size[i] = 0.6 + Math.pow(Math.random(), 4) * 3.2
    phase[i] = Math.random() * Math.PI * 2
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
  return geo
}

function planet({ radius, position, a, b, c, bands, seed, segments = 64 }) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, segments, segments / 2),
    new THREE.ShaderMaterial({
      vertexShader: SURFACE_VERT,
      fragmentShader: PLANET_FRAG,
      uniforms: {
        uSun: { value: SUN },
        uA: { value: new THREE.Color(a) },
        uB: { value: new THREE.Color(b) },
        uC: { value: new THREE.Color(c) },
        uBands: { value: bands },
        uSeed: { value: seed },
        uFade: { value: 0 },
      },
      transparent: true,
    }),
  )
  mesh.position.copy(position)
  return mesh
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export default function SpaceScene({ launched }) {
  const canvasRef = useRef(null)
  const launchedRef = useRef(launched)
  launchedRef.current = launched

  useEffect(() => {
    const canvas = canvasRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 768px)').matches

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    } catch {
      return // no WebGL: the CSS gradient behind the canvas stays as the backdrop
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.25 : 1.5))
    renderer.setClearColor(0x03050a, 1)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.5, 4000)

    // Stars
    const starMat = new THREE.ShaderMaterial({
      vertexShader: STAR_VERT,
      fragmentShader: STAR_FRAG,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: renderer.getPixelRatio() } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    scene.add(new THREE.Points(makeStars(small ? 2600 : 5200), starMat))

    // Faint nebulae at a few depths
    const glow = glowTexture()
    ;[
      [-420, 160, -380, 900, 0x3b5bdb, 0.1],
      [520, -120, -950, 1300, 0x6d4bd8, 0.08],
      [-300, -200, -1500, 1500, 0x1c7ed6, 0.09],
      [250, 220, -2100, 1600, 0x9c36b5, 0.06],
    ].forEach(([x, y, z, s, color, opacity]) => {
      const sp = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: glow, color, opacity, blending: THREE.AdditiveBlending, depthWrite: false }),
      )
      sp.position.set(x, y, z)
      sp.scale.set(s, s, 1)
      scene.add(sp)
    })

    // Earth, seen from just above its night-side limb
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(60, small ? 96 : 160, small ? 64 : 112),
      new THREE.ShaderMaterial({
        vertexShader: SURFACE_VERT,
        fragmentShader: EARTH_FRAG,
        uniforms: { uSun: { value: SUN }, uTime: { value: 0 } },
      }),
    )
    earth.position.set(0, -79, -12)
    earth.rotation.z = 0.35
    scene.add(earth)
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(60 * 1.07, 96, 64),
      new THREE.ShaderMaterial({
        vertexShader: ATMO_VERT,
        fragmentShader: ATMO_FRAG,
        uniforms: { uColor: { value: new THREE.Color(0x4d8dff) }, uPower: { value: 3.2 } },
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    )
    atmo.position.copy(earth.position)
    scene.add(atmo)

    // A ringed giant, a rocky red world and a distant ice moon along the route
    const giant = planet({
      radius: 70, position: new THREE.Vector3(330, 90, -700), seed: 3.1, bands: 16,
      a: '#9c7b56', b: '#e3cfa6', c: '#6b4a32',
    })
    giant.rotation.z = 0.4
    scene.add(giant)
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(92, 150, 160),
      new THREE.ShaderMaterial({
        vertexShader: RING_VERT,
        fragmentShader: RING_FRAG,
        uniforms: { uInner: { value: 92 }, uOuter: { value: 150 }, uColor: { value: new THREE.Color('#d9c6a0') }, uFade: { value: 0 } },
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
      }),
    )
    ring.position.copy(giant.position)
    ring.rotation.set(-1.25, 0.25, 0.35)
    scene.add(ring)
    const red = planet({
      radius: 26, position: new THREE.Vector3(-210, -70, -1250), seed: 7.7, bands: 4,
      a: '#7a2e1d', b: '#c2643c', c: '#3d1a12',
    })
    scene.add(red)
    const ice = planet({
      radius: 16, position: new THREE.Vector3(150, 150, -1720), seed: 1.9, bands: 9,
      a: '#8fb7d6', b: '#e3f0fa', c: '#5a7f9e', segments: 48,
    })
    scene.add(ice)

    // Meteors: short streaks that cross the view every few seconds
    const meteorGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
    const meteorMat = new THREE.LineBasicMaterial({ color: 0xcfe1ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending })
    const meteor = new THREE.Line(meteorGeo, meteorMat)
    scene.add(meteor)
    const m = { t: 1, next: 4, from: new THREE.Vector3(), dir: new THREE.Vector3() }

    // Camera path
    const launchFrom = new THREE.Vector3(0, -13.5, 14)
    const base = new THREE.Vector3(0, 0, 62)
    const travel = 1720
    let progress = 0
    let mx = 0
    let my = 0
    let launchStart = null
    const onMove = (e) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1
      my = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      // Keep Earth's limb in frame on tall phone screens.
      camera.fov = w / h < 0.8 ? 62 : 50
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    const scrollTarget = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      return max > 0 ? window.scrollY / max : 0
    }

    const clock = new THREE.Clock()
    let raf = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (document.hidden) return
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime

      // Launch: rise from the limb to orbit once the intro has finished.
      let launch = 1
      if (!reduce) {
        if (!launchedRef.current) launch = 0
        else {
          if (launchStart === null) launchStart = t
          launch = easeInOut(Math.min(1, (t - launchStart) / 3.2))
        }
      }
      progress += (scrollTarget() - progress) * Math.min(1, dt * 4)

      camera.position.lerpVectors(launchFrom, base, launch)
      camera.position.z -= progress * travel
      camera.position.y += progress * 30 + Math.sin(t * 0.3) * 0.4
      camera.position.x += mx * 4
      camera.position.y -= my * 2.5
      camera.lookAt(camera.position.x * 0.4, camera.position.y - 4 * (1 - launch) - my * 2, camera.position.z - 120)

      starMat.uniforms.uTime.value = t
      earth.material.uniforms.uTime.value = t
      earth.rotation.y = t * 0.012
      // Planets fade up only as the camera closes in, so the hero stays clear.
      for (const pl of [giant, red, ice]) {
        const d = camera.position.z - pl.position.z
        pl.material.uniforms.uFade.value = Math.min(1, Math.max(0, (720 - d) / 320))
        pl.visible = pl.material.uniforms.uFade.value > 0.001
      }
      ring.material.uniforms.uFade.value = giant.material.uniforms.uFade.value
      ring.visible = giant.visible
      giant.rotation.y = t * 0.02
      red.rotation.y = t * 0.03
      ice.rotation.y = -t * 0.025

      // Meteor
      m.next -= dt
      if (m.next <= 0 && m.t >= 1) {
        m.t = 0
        m.next = 5 + Math.random() * 6
        m.from.set(camera.position.x + (Math.random() - 0.3) * 260, camera.position.y + 80 + Math.random() * 60, camera.position.z - 260)
        m.dir.set(-0.8 - Math.random() * 0.4, -0.55, 0).normalize()
      }
      if (m.t < 1) {
        m.t = Math.min(1, m.t + dt * 1.4)
        const head = m.from.clone().addScaledVector(m.dir, m.t * 320)
        const tail = head.clone().addScaledVector(m.dir, -40)
        meteorGeo.setFromPoints([tail, head])
        meteorMat.opacity = Math.sin(m.t * Math.PI) * 0.8
      }

      renderer.render(scene, camera)
    }

    if (reduce) {
      camera.position.copy(base)
      camera.lookAt(0, 0, base.z - 120)
      const still = () => renderer.render(scene, camera)
      still()
      window.addEventListener('resize', still)
      return () => {
        window.removeEventListener('resize', still)
        window.removeEventListener('resize', resize)
        window.removeEventListener('pointermove', onMove)
        renderer.dispose()
      }
    }
    frame()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      scene.traverse((o) => {
        o.geometry?.dispose()
        o.material?.dispose()
      })
      glow.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <>
      <div aria-hidden className="fixed inset-0 -z-20 bg-[radial-gradient(ellipse_at_50%_120%,#0b1b3a,#03050a_60%)]" />
      <canvas ref={canvasRef} aria-hidden className="fixed inset-0 -z-10 h-full w-full" />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(0_0_0/0.55))]" />
    </>
  )
}
