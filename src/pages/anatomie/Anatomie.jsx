import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes slideUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes popIn {
    0%  { opacity:0; transform:scale(0.85); }
    70% { transform:scale(1.03); }
    100%{ opacity:1; transform:scale(1); }
  }
  @keyframes fadeIn {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes pulse-glow {
    0%,100% { box-shadow: 0 0 12px rgba(20,184,166,0.3); }
    50%      { box-shadow: 0 0 28px rgba(20,184,166,0.7); }
  }
  @keyframes rotate-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-8px); }
  }

  .anat-btn {
    font-family:'DM Sans',sans-serif;
    transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);
    cursor:pointer;
  }
  .anat-btn:hover  { transform:translateY(-2px); }
  .anat-btn:active { transform:scale(0.97); }

  .organ-card {
    transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    cursor:pointer;
  }
  .organ-card:hover {
    transform:translateY(-4px) scale(1.02);
  }

  .annotation-dot {
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .canvas-container canvas {
    border-radius: 20px;
  }
`

// ── Données des organes ───────────────────────────────────────────────────────
const organes = [
  {
    id: 'coeur',
    nom: 'Cœur',
    icon: '❤️',
    couleur: '#EF4444',
    couleurSecondaire: '#FCA5A5',
    description: 'Pompe musculaire centrale du système cardiovasculaire',
    structures: ['Ventricule gauche', 'Ventricule droit', 'Oreillette gauche', 'Oreillette droite', 'Valves cardiaques', 'Artère aorte', 'Artère pulmonaire'],
    faits: [
      'Le cœur bat environ 100 000 fois par jour',
      'Il pompe ~5 litres de sang par minute au repos',
      'Le muscle cardiaque (myocarde) ne se fatigue jamais',
      'Le cœur génère sa propre électricité via le nœud sinusal',
    ],
    quiz: [
      { q: 'Quel est le rôle du ventricule gauche ?', r: 'Pomper le sang oxygéné vers la circulation systémique via l\'aorte' },
      { q: 'Qu\'est-ce que la systole ?', r: 'Phase de contraction du myocarde qui éjecte le sang hors du cœur' },
    ],
    geometrie: 'coeur',
  },
  {
    id: 'cerveau',
    nom: 'Cerveau',
    icon: '🧠',
    couleur: '#8B5CF6',
    couleurSecondaire: '#C4B5FD',
    description: 'Centre de contrôle du système nerveux central',
    structures: ['Cortex cérébral', 'Lobe frontal', 'Lobe temporal', 'Lobe pariétal', 'Lobe occipital', 'Cervelet', 'Tronc cérébral'],
    faits: [
      'Le cerveau contient ~86 milliards de neurones',
      'Il consomme 20% de l\'énergie totale du corps',
      'Le cerveau humain pèse environ 1,4 kg',
      'Il traite l\'information à ~120 m/s dans les fibres myélinisées',
    ],
    quiz: [
      { q: 'Quel lobe est responsable du langage ?', r: 'Le lobe frontal gauche (aire de Broca pour la production, aire de Wernicke pour la compréhension)' },
      { q: 'Quel est le rôle du cervelet ?', r: 'Coordination des mouvements, équilibre et tonus musculaire' },
    ],
    geometrie: 'cerveau',
  },
  {
    id: 'poumon',
    nom: 'Poumons',
    icon: '🫁',
    couleur: '#14B8A6',
    couleurSecondaire: '#99F6E4',
    description: 'Organes des échanges gazeux de la respiration',
    structures: ['Trachée', 'Bronches souches', 'Bronchioles', 'Alvéoles pulmonaires', 'Plèvre', 'Lobe supérieur', 'Lobe inférieur'],
    faits: [
      'La surface d\'échange alvéolaire est ~70 m² (terrain de tennis)',
      'On inspire environ 15 000 litres d\'air par jour',
      'Les poumons contiennent ~300 millions d\'alvéoles',
      'Le poumon droit a 3 lobes, le gauche 2 lobes',
    ],
    quiz: [
      { q: 'Qu\'est-ce que la capacité vitale ?', r: 'Volume maximal d\'air que l\'on peut expirer après une inspiration maximale (~4,5L)' },
      { q: 'Où ont lieu les échanges gazeux ?', r: 'Au niveau des alvéoles pulmonaires, par diffusion à travers la membrane alvéolo-capillaire' },
    ],
    geometrie: 'poumon',
  },
  {
    id: 'foie',
    nom: 'Foie',
    icon: '🟤',
    couleur: '#92400E',
    couleurSecondaire: '#D97706',
    description: 'Plus grande glande du corps, centre métabolique majeur',
    structures: ['Lobe droit', 'Lobe gauche', 'Vésicule biliaire', 'Veine porte', 'Artère hépatique', 'Lobules hépatiques', 'Cellules de Kupffer'],
    faits: [
      'Le foie effectue plus de 500 fonctions métaboliques',
      'Il reçoit 25% du débit cardiaque',
      'C\'est le seul organe capable de se régénérer',
      'Il produit 600-1000 ml de bile par jour',
    ],
    quiz: [
      { q: 'Qu\'est-ce que la gluconéogenèse ?', r: 'Synthèse de glucose à partir de précurseurs non glucidiques (acides aminés, lactate) dans le foie' },
      { q: 'Quel est le rôle de la veine porte ?', r: 'Drainer le sang riche en nutriments du tube digestif vers le foie pour métabolisation' },
    ],
    geometrie: 'foie',
  },
  {
    id: 'rein',
    nom: 'Reins',
    icon: '🫘',
    couleur: '#B45309',
    couleurSecondaire: '#F59E0B',
    description: 'Organes de filtration du sang et régulation hydro-électrolytique',
    structures: ['Cortex rénal', 'Médullaire rénale', 'Néphrons', 'Glomérules', 'Tubules', 'Bassinets', 'Uretères'],
    faits: [
      'Chaque rein contient ~1 million de néphrons',
      'Les reins filtrent 180 litres de plasma par jour',
      'Ils régulent la pression artérielle via le système rénine-angiotensine',
      'Ils produisent l\'érythropoïétine (EPO)',
    ],
    quiz: [
      { q: 'Qu\'est-ce que la clairance de la créatinine ?', r: 'Mesure de la capacité de filtration glomérulaire, reflet de la fonction rénale (~120 ml/min)' },
      { q: 'Où se fait la réabsorption principale du sodium ?', r: 'Dans le tube contourné proximal (~70% du Na filtré)' },
    ],
    geometrie: 'rein',
  },
]

// ── Scène Three.js par organe ─────────────────────────────────────────────────
function creerScene(canvas, organe) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
  camera.position.set(0, 0, 5)

  // Lumières
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
  mainLight.position.set(5, 8, 5)
  mainLight.castShadow = true
  scene.add(mainLight)

  const fillLight = new THREE.DirectionalLight(new THREE.Color(organe.couleur), 0.6)
  fillLight.position.set(-4, -2, 3)
  scene.add(fillLight)

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.4)
  rimLight.position.set(0, -5, -5)
  scene.add(rimLight)

  // Matériau principal
  const color = new THREE.Color(organe.couleur)
  const material = new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.1,
    roughness: 0.3,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    transparent: true,
    opacity: 0.92,
  })

  const materialSecondaire = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(organe.couleurSecondaire),
    metalness: 0.05,
    roughness: 0.4,
    transparent: true,
    opacity: 0.7,
  })

  let group = new THREE.Group()

  // ── Géométries par organe ─────────────────────────────────────────────────
  if (organe.geometrie === 'coeur') {
    // Corps principal
    const corps = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material)
    corps.scale.set(1, 1.1, 0.85)
    group.add(corps)

    // Aorte
    const aorte = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.12, 1.2, 16), materialSecondaire)
    aorte.position.set(0.3, 1.2, 0)
    aorte.rotation.z = -0.3
    group.add(aorte)

    // Artère pulmonaire
    const pulm = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.9, 16), materialSecondaire)
    pulm.position.set(-0.3, 1.1, 0.1)
    pulm.rotation.z = 0.4
    group.add(pulm)

    // Ventricule gauche (bosse)
    const vg = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 24), material)
    vg.position.set(-0.35, -0.2, 0.5)
    vg.scale.set(1, 1.2, 0.9)
    group.add(vg)

    // Oreillettes
    const og = new THREE.Mesh(new THREE.SphereGeometry(0.38, 20, 20), materialSecondaire)
    og.position.set(-0.55, 0.55, -0.3)
    group.add(og)

    const od = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), materialSecondaire)
    od.position.set(0.55, 0.45, -0.25)
    group.add(od)

    // Veine cave
    const veineCave = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.8, 12), materialSecondaire)
    veineCave.position.set(0.7, 0.6, -0.2)
    veineCave.rotation.z = 0.5
    group.add(veineCave)

  } else if (organe.geometrie === 'cerveau') {
    // Hémisphère gauche
    const hemisG = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32,
      0, Math.PI, 0, Math.PI), material)
    hemisG.position.x = -0.05
    hemisG.rotation.y = Math.PI / 2
    group.add(hemisG)

    // Hémisphère droit
    const hemisD = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32,
      0, Math.PI, 0, Math.PI), material)
    hemisD.position.x = 0.05
    hemisD.rotation.y = -Math.PI / 2
    group.add(hemisD)

    // Cervelet
    const cervelet = new THREE.Mesh(new THREE.SphereGeometry(0.48, 24, 24), materialSecondaire)
    cervelet.position.set(0, -0.8, -0.6)
    cervelet.scale.set(1.3, 0.7, 0.9)
    group.add(cervelet)

    // Tronc cérébral
    const tronc = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.9, 16), materialSecondaire)
    tronc.position.set(0, -1.1, -0.2)
    tronc.rotation.x = 0.3
    group.add(tronc)

    // Sillon inter-hémisphérique
    const sillon = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 1.8, 1.8),
      new THREE.MeshPhysicalMaterial({ color: 0x1a1a2e, roughness: 1 })
    )
    sillon.position.set(0, 0.1, 0)
    group.add(sillon)

    // Gyri (replis) simulés
    for (let i = 0; i < 8; i++) {
      const gyrus = new THREE.Mesh(
        new THREE.TorusGeometry(0.6 + Math.random() * 0.3, 0.05, 8, 20,
          Math.PI * (0.3 + Math.random() * 0.5)),
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(organe.couleurSecondaire),
          roughness: 0.5, transparent: true, opacity: 0.5
        })
      )
      gyrus.position.set(
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.4
      )
      gyrus.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      group.add(gyrus)
    }

  } else if (organe.geometrie === 'poumon') {
    // Poumon gauche
    const pG = new THREE.Mesh(new THREE.SphereGeometry(0.82, 32, 32), material)
    pG.position.set(-0.7, 0.1, 0)
    pG.scale.set(0.85, 1.3, 0.7)
    group.add(pG)

    // Poumon droit (plus grand)
    const pD = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), material)
    pD.position.set(0.75, 0.1, 0)
    pD.scale.set(0.9, 1.35, 0.72)
    group.add(pD)

    // Trachée
    const trachee = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 1.2, 16), materialSecondaire)
    trachee.position.set(0, 1.2, 0)
    group.add(trachee)

    // Carène + bronches
    const bronchG = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.7, 12), materialSecondaire)
    bronchG.position.set(-0.4, 0.7, 0)
    bronchG.rotation.z = 0.6
    group.add(bronchG)

    const bronchD = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.6, 12), materialSecondaire)
    bronchD.position.set(0.4, 0.72, 0)
    bronchD.rotation.z = -0.5
    group.add(bronchD)

    // Lobes (séparations)
    const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 20), materialSecondaire)
    lobe1.position.set(-0.65, -0.6, 0.1)
    lobe1.scale.set(0.9, 0.8, 0.7)
    group.add(lobe1)

    const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 20), materialSecondaire)
    lobe2.position.set(0.8, -0.65, 0.1)
    lobe2.scale.set(0.85, 0.75, 0.7)
    group.add(lobe2)

  } else if (organe.geometrie === 'foie') {
    // Lobe droit (dominant)
    const lobeD = new THREE.Mesh(new THREE.SphereGeometry(1.1, 32, 32), material)
    lobeD.position.set(0.4, 0, 0)
    lobeD.scale.set(1, 0.65, 0.8)
    group.add(lobeD)

    // Lobe gauche
    const lobeG = new THREE.Mesh(new THREE.SphereGeometry(0.7, 28, 28), material)
    lobeG.position.set(-0.8, 0.05, 0)
    lobeG.scale.set(0.9, 0.55, 0.75)
    group.add(lobeG)

    // Vésicule biliaire
    const vesicule = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 20),
      new THREE.MeshPhysicalMaterial({ color: 0x65a30d, roughness: 0.4,
        transparent: true, opacity: 0.85 }))
    vesicule.position.set(0.3, -0.55, 0.4)
    vesicule.scale.set(0.7, 1.4, 0.7)
    group.add(vesicule)

    // Veine porte
    const vporte = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.8, 12), materialSecondaire)
    vporte.position.set(0, -0.45, -0.3)
    vporte.rotation.x = 0.4
    group.add(vporte)

  } else if (organe.geometrie === 'rein') {
    // Rein gauche
    const reinG = new THREE.Mesh(
      new THREE.SphereGeometry(0.75, 32, 32), material
    )
    reinG.position.set(-0.9, 0, 0)
    reinG.scale.set(0.7, 1.15, 0.6)
    group.add(reinG)

    // Rein droit
    const reinD = new THREE.Mesh(
      new THREE.SphereGeometry(0.75, 32, 32), material
    )
    reinD.position.set(0.9, -0.1, 0)
    reinD.scale.set(0.7, 1.15, 0.6)
    group.add(reinD)

    // Bassinets
    const bassG = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), materialSecondaire)
    bassG.position.set(-0.75, 0, 0.2)
    group.add(bassG)

    const bassD = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), materialSecondaire)
    bassD.position.set(0.75, -0.1, 0.2)
    group.add(bassD)

    // Uretères
    const ureG = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6, 10), materialSecondaire)
    ureG.position.set(-0.9, -1.1, 0)
    group.add(ureG)

    const ureD = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6, 10), materialSecondaire)
    ureD.position.set(0.9, -1.2, 0)
    group.add(ureD)

    // Artères rénales
    const artG = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.7, 10), materialSecondaire)
    artG.position.set(-0.35, 0.1, 0)
    artG.rotation.z = Math.PI / 2
    group.add(artG)

    const artD = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.7, 10), materialSecondaire)
    artD.position.set(0.35, 0, 0)
    artD.rotation.z = Math.PI / 2
    group.add(artD)
  }

  // Particules orbitales
  const particleGeo = new THREE.BufferGeometry()
  const particleCount = 80
  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const r = 1.8 + Math.random() * 0.8
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const particleMat = new THREE.PointsMaterial({
    color: new THREE.Color(organe.couleur),
    size: 0.03,
    transparent: true,
    opacity: 0.6,
  })
  const particles = new THREE.Points(particleGeo, particleMat)
  scene.add(particles)

  scene.add(group)

  // Interaction souris
  let isDragging = false
  let prevMouse = { x: 0, y: 0 }
  let autoRotate = true

  canvas.addEventListener('mousedown', e => {
    isDragging = true
    autoRotate = false
    prevMouse = { x: e.clientX, y: e.clientY }
  })
  canvas.addEventListener('mousemove', e => {
    if (!isDragging) return
    const dx = e.clientX - prevMouse.x
    const dy = e.clientY - prevMouse.y
    group.rotation.y += dx * 0.01
    group.rotation.x += dy * 0.01
    prevMouse = { x: e.clientX, y: e.clientY }
  })
  canvas.addEventListener('mouseup', () => {
    isDragging = false
    setTimeout(() => autoRotate = true, 2000)
  })

  // Touch support mobile
  canvas.addEventListener('touchstart', e => {
    isDragging = true
    autoRotate = false
    prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  })
  canvas.addEventListener('touchmove', e => {
    if (!isDragging) return
    const dx = e.touches[0].clientX - prevMouse.x
    const dy = e.touches[0].clientY - prevMouse.y
    group.rotation.y += dx * 0.01
    group.rotation.x += dy * 0.01
    prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  })
  canvas.addEventListener('touchend', () => {
    isDragging = false
    setTimeout(() => autoRotate = true, 2000)
  })

  // Zoom molette
  canvas.addEventListener('wheel', e => {
    camera.position.z = Math.max(2.5, Math.min(8, camera.position.z + e.deltaY * 0.005))
  })

  // Animation loop
  let animId
  const clock = new THREE.Clock()
  const animate = () => {
    animId = requestAnimationFrame(animate)
    const t = clock.getElapsedTime()
    if (autoRotate) {
      group.rotation.y += 0.005
      group.rotation.x = Math.sin(t * 0.3) * 0.1
    }
    particles.rotation.y += 0.002
    particles.rotation.x += 0.001
    renderer.render(scene, camera)
  }
  animate()

  // Resize
  const handleResize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', handleResize)

  return () => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', handleResize)
    renderer.dispose()
  }
}

// ── Composant Visualiseur 3D ───────────────────────────────────────────────────
function Visualiseur3D({ organe }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const cleanup = creerScene(canvasRef.current, organe)
    return cleanup
  }, [organe])

  return (
    <div style={{ position:'relative', width:'100%', height:'300px', borderRadius:'20px',
      overflow:'hidden', background:'radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.9) 100%)' }}>
      <canvas ref={canvasRef} style={{ width:'100%', height:'100%', display:'block' }} />
      <div style={{ position:'absolute', bottom:'10px', left:'50%', transform:'translateX(-50%)',
        background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)',
        border:'1px solid rgba(255,255,255,0.1)', borderRadius:'20px',
        padding:'4px 12px', fontSize:'11px', color:'rgba(255,255,255,0.5)',
        whiteSpace:'nowrap' }}>
        🖱️ Glisser pour tourner · Molette pour zoomer
      </div>
    </div>
  )
}

// ── Page principale ────────────────────────────────────────────────────────────
export default function Anatomie() {
  const navigate = useNavigate()
  const [organeActif, setOrganeActif] = useState(null)
  const [onglet, setOnglet] = useState('structures')
  const [quizIndex, setQuizIndex] = useState(0)
  const [showReponse, setShowReponse] = useState(false)

  useEffect(() => {
    const s = document.createElement('style')
    s.textContent = globalStyles
    document.head.appendChild(s)
    return () => document.head.removeChild(s)
  }, [])

  const ouvrirOrgane = (organe) => {
    setOrganeActif(organe)
    setOnglet('structures')
    setQuizIndex(0)
    setShowReponse(false)
  }

  // ── LISTE ORGANES ──────────────────────────────────────────────────────────
  if (!organeActif) return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #071525 100%)',
      fontFamily:"'DM Sans',sans-serif", position:'relative', overflow:'hidden',
    }}>
      {/* Grille décorative */}
      <div style={{
        position:'fixed', inset:0, pointerEvents:'none',
        backgroundImage:`linear-gradient(rgba(20,184,166,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(20,184,166,0.04) 1px, transparent 1px)`,
        backgroundSize:'40px 40px',
      }} />
      <div style={{ position:'fixed', top:'-100px', right:'-100px', width:'400px', height:'400px',
        borderRadius:'50%', background:'radial-gradient(circle,rgba(20,184,166,0.12) 0%,transparent 70%)',
        pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'-80px', left:'-60px', width:'350px', height:'350px',
        borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)',
        pointerEvents:'none' }} />

      {/* Navbar */}
      <nav style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:'12px' }}>
        <button onClick={() => navigate('/dashboard')} className="anat-btn"
          style={{ width:'40px', height:'40px', borderRadius:'12px',
            border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)',
            color:'white', fontSize:'18px', display:'flex', alignItems:'center', justifyContent:'center' }}>
          ←
        </button>
        <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'14px' }}>Anatomie 3D</span>
      </nav>

      {/* Hero */}
      <div style={{ textAlign:'center', padding:'16px 20px 36px', animation:'slideUp 0.5s ease both' }}>
        <div style={{ fontSize:'64px', marginBottom:'12px', animation:'float 3s ease-in-out infinite',
          filter:'drop-shadow(0 0 30px rgba(20,184,166,0.5))' }}>🧬</div>
        <h1 style={{
          fontFamily:"'Syne',sans-serif", fontSize:'clamp(26px,6vw,42px)', fontWeight:800,
          margin:'0 0 8px',
          background:'linear-gradient(135deg,#ffffff 0%,#99f6e4 50%,#2dd4bf 100%)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        }}>Anatomie 3D</h1>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'14px', margin:0 }}>
          Explore · Tourne · Apprends · Quiz intégré
        </p>
      </div>

      {/* Grille organes */}
      <div style={{ maxWidth:'600px', margin:'0 auto', padding:'0 16px 60px',
        display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'12px' }}>
        {organes.map((organe, i) => (
          <div key={organe.id} onClick={() => ouvrirOrgane(organe)}
            className="organ-card"
            style={{
              background:'rgba(255,255,255,0.04)', backdropFilter:'blur(12px)',
              border:`1px solid rgba(255,255,255,0.08)`,
              borderRadius:'24px', padding:'20px',
              animation:`slideUp 0.5s ease ${i*0.1}s both`,
            }}
          >
            {/* Icône avec glow */}
            <div style={{
              width:'56px', height:'56px', borderRadius:'18px',
              background:`linear-gradient(135deg, ${organe.couleur}30, ${organe.couleur}15)`,
              border:`1px solid ${organe.couleur}40`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'28px', marginBottom:'12px',
              boxShadow:`0 0 20px ${organe.couleur}20`,
            }}>
              {organe.icon}
            </div>

            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:'16px', fontWeight:800,
              color:'white', margin:'0 0 4px' }}>{organe.nom}</h3>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px', margin:'0 0 14px',
              lineHeight:1.4 }}>{organe.description}</p>

            {/* Tags structures */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'4px', marginBottom:'14px' }}>
              {organe.structures.slice(0, 3).map((s, j) => (
                <span key={j} style={{
                  fontSize:'9px', fontWeight:600, padding:'2px 7px', borderRadius:'10px',
                  background:`${organe.couleur}20`, border:`1px solid ${organe.couleur}30`,
                  color: organe.couleur,
                }}>{s}</span>
              ))}
              <span style={{ fontSize:'9px', color:'rgba(255,255,255,0.3)',
                padding:'2px 7px' }}>+{organe.structures.length - 3}</span>
            </div>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:'10px', color:'rgba(255,255,255,0.3)' }}>
                {organe.quiz.length} quiz · {organe.faits.length} faits
              </span>
              <span style={{ color: organe.couleur, fontSize:'13px', fontWeight:700 }}>Explorer →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ── DÉTAIL ORGANE ──────────────────────────────────────────────────────────
  const onglets = [
    { id:'structures', label:'Structures', icon:'🔬' },
    { id:'faits', label:'Faits clés', icon:'💡' },
    { id:'quiz', label:'Quiz', icon:'🎯' },
  ]

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #071525 100%)',
      fontFamily:"'DM Sans',sans-serif",
    }}>
      {/* Navbar */}
      <nav style={{
        position:'sticky', top:0, zIndex:50,
        background:'rgba(10,22,40,0.9)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'12px 16px',
        display:'flex', alignItems:'center', gap:'12px',
      }}>
        <button onClick={() => setOrganeActif(null)} className="anat-btn"
          style={{ width:'38px', height:'38px', borderRadius:'10px',
            border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)',
            color:'white', fontSize:'18px', display:'flex', alignItems:'center', justifyContent:'center' }}>
          ←
        </button>
        <span style={{ fontSize:'20px' }}>{organeActif.icon}</span>
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:'16px',
          fontWeight:800, color:'white' }}>{organeActif.nom}</span>
        <span style={{
          marginLeft:'auto', fontSize:'10px', fontWeight:700, padding:'3px 10px', borderRadius:'10px',
          background:`${organeActif.couleur}25`, border:`1px solid ${organeActif.couleur}40`,
          color: organeActif.couleur,
        }}>
          {organeActif.structures.length} structures
        </span>
      </nav>

      <div style={{ maxWidth:'600px', margin:'0 auto', padding:'16px 16px 60px' }}>

        {/* Visualiseur 3D */}
        <div style={{ marginBottom:'16px', animation:'popIn 0.5s ease both' }}>
          <Visualiseur3D organe={organeActif} />
        </div>

        {/* Description */}
        <div style={{
          background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:'18px', padding:'14px 16px', marginBottom:'16px',
          animation:'slideUp 0.4s ease 0.1s both', opacity:0,
        }}>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'13px', margin:0, lineHeight:1.6 }}>
            {organeActif.description}
          </p>
        </div>

        {/* Onglets */}
        <div style={{ display:'flex', gap:'6px', marginBottom:'16px',
          background:'rgba(255,255,255,0.04)', borderRadius:'16px', padding:'4px' }}>
          {onglets.map(o => (
            <button key={o.id} onClick={() => setOnglet(o.id)}
              className="anat-btn"
              style={{
                flex:1, padding:'10px', borderRadius:'12px', border:'none',
                background: onglet === o.id
                  ? `linear-gradient(135deg, ${organeActif.couleur}, ${organeActif.couleur}cc)`
                  : 'transparent',
                color: onglet === o.id ? 'white' : 'rgba(255,255,255,0.4)',
                fontSize:'12px', fontWeight:700,
                boxShadow: onglet === o.id ? `0 4px 16px ${organeActif.couleur}40` : 'none',
                display:'flex', flexDirection:'column', alignItems:'center', gap:'2px',
              }}>
              <span>{o.icon}</span>
              <span>{o.label}</span>
            </button>
          ))}
        </div>

        {/* Contenu onglets */}
        {onglet === 'structures' && (
          <div style={{ animation:'fadeIn 0.3s ease both' }}>
            {organeActif.structures.map((s, i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:'12px', padding:'12px 14px',
                background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)',
                borderRadius:'14px', marginBottom:'8px',
                animation:`slideUp 0.3s ease ${i*0.05}s both`,
              }}>
                <div style={{
                  width:'8px', height:'8px', borderRadius:'50%', flexShrink:0,
                  background: organeActif.couleur,
                  boxShadow:`0 0 8px ${organeActif.couleur}80`,
                }} />
                <span style={{ color:'rgba(255,255,255,0.8)', fontSize:'13px', fontWeight:500 }}>{s}</span>
                <span style={{ marginLeft:'auto', fontSize:'18px', opacity:0.3 }}>→</span>
              </div>
            ))}
          </div>
        )}

        {onglet === 'faits' && (
          <div style={{ animation:'fadeIn 0.3s ease both' }}>
            {organeActif.faits.map((f, i) => (
              <div key={i} style={{
                background:`linear-gradient(135deg, ${organeActif.couleur}12, ${organeActif.couleur}06)`,
                border:`1px solid ${organeActif.couleur}25`, borderRadius:'16px',
                padding:'14px 16px', marginBottom:'10px',
                animation:`slideUp 0.3s ease ${i*0.08}s both`,
                display:'flex', gap:'10px', alignItems:'flex-start',
              }}>
                <span style={{ fontSize:'20px', flexShrink:0 }}>
                  {['🔬','⚡','🏋️','🔋'][i % 4]}
                </span>
                <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'13px', margin:0, lineHeight:1.6 }}>{f}</p>
              </div>
            ))}
          </div>
        )}

        {onglet === 'quiz' && (
          <div style={{ animation:'fadeIn 0.3s ease both' }}>
            <div style={{
              background:'rgba(255,255,255,0.05)', border:`1px solid ${organeActif.couleur}30`,
              borderRadius:'20px', padding:'20px', marginBottom:'12px',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'14px' }}>
                <span style={{ fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.4)',
                  textTransform:'uppercase', letterSpacing:'0.08em' }}>Question {quizIndex + 1}/{organeActif.quiz.length}</span>
                <span style={{ fontSize:'11px', color: organeActif.couleur, fontWeight:700 }}>
                  {organeActif.nom}
                </span>
              </div>
              <p style={{ fontFamily:"'Syne',sans-serif", fontSize:'15px', fontWeight:700,
                color:'white', lineHeight:1.5, marginBottom:'16px' }}>
                {organeActif.quiz[quizIndex].q}
              </p>

              {!showReponse ? (
                <button onClick={() => setShowReponse(true)} className="anat-btn"
                  style={{
                    width:'100%', padding:'13px', borderRadius:'14px', border:'none',
                    background:`linear-gradient(135deg, ${organeActif.couleur}, ${organeActif.couleur}cc)`,
                    color:'white', fontSize:'14px', fontWeight:700,
                    fontFamily:"'Syne',sans-serif",
                    boxShadow:`0 6px 20px ${organeActif.couleur}40`,
                  }}>
                  💡 Révéler la réponse
                </button>
              ) : (
                <div style={{
                  background:`${organeActif.couleur}15`, border:`1px solid ${organeActif.couleur}30`,
                  borderRadius:'14px', padding:'14px',
                  animation:'slideUp 0.3s ease both',
                }}>
                  <p style={{ fontSize:'11px', fontWeight:700, color: organeActif.couleur,
                    textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px' }}>✓ Réponse</p>
                  <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'13px', lineHeight:1.6, margin:0 }}>
                    {organeActif.quiz[quizIndex].r}
                  </p>
                </div>
              )}
            </div>

            {showReponse && (
              <button
                onClick={() => {
                  setQuizIndex(i => (i + 1) % organeActif.quiz.length)
                  setShowReponse(false)
                }}
                className="anat-btn"
                style={{
                  width:'100%', padding:'13px', borderRadius:'14px', border:'none',
                  background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)',
                  color:'white', fontSize:'14px', fontWeight:700,
                  fontFamily:"'Syne',sans-serif",
                }}>
                Question suivante →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}