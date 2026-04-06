import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes slideUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes float {
    0%,100% { transform:translateY(0px); }
    50%      { transform:translateY(-8px); }
  }
  @keyframes pulse-dot {
    0%,100% { transform:scale(1); opacity:1; }
    50%      { transform:scale(1.4); opacity:0.7; }
  }
  @keyframes countUp {
    from { opacity:0; transform:scale(0.5); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes menuSlide {
    from { opacity:0; transform:translateY(-10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes progressGrow {
    from { width:0%; }
  }
  @keyframes levelPop {
    0%   { opacity:0; transform:scale(0.7) rotate(-10deg); }
    70%  { transform:scale(1.15) rotate(3deg); }
    100% { opacity:1; transform:scale(1) rotate(0deg); }
  }
  @keyframes shimmer {
    0%   { background-position:-200% center; }
    100% { background-position:200% center; }
  }
  @keyframes starSpin {
    from { transform:rotate(0deg) scale(1); }
    50%  { transform:rotate(180deg) scale(1.2); }
    to   { transform:rotate(360deg) scale(1); }
  }

  .module-card {
    transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);
    cursor:pointer; position:relative; overflow:hidden;
  }
  .module-card:active { transform:scale(0.97); }
  @media (hover:hover) {
    .module-card:hover { transform:translateY(-4px) scale(1.01); }
  }

  .stat-card { transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
  .stat-card:active { transform:scale(0.97); }

  .nav-btn {
    font-family:'DM Sans',sans-serif;
    transition:all 0.2s ease; cursor:pointer;
  }

  .level-badge {
    animation: levelPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s both;
  }

  .xp-bar-fill {
    animation: progressGrow 1.2s cubic-bezier(0.34,1.56,0.64,1) 0.5s both;
  }

  .shimmer-bar {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255,255,255,0.25) 50%,
      transparent 100%
    );
    background-size: 200% auto;
    animation: shimmer 2s linear infinite;
  }

  .burger-btn  { display:flex; }
  .desktop-profile { display:none; }
  @media (min-width:1024px) {
    .burger-btn      { display:none !important; }
    .desktop-profile { display:flex !important; }
  }

  * { -webkit-tap-highlight-color:transparent; }
`

// ── Données ───────────────────────────────────────────────────────────────────
const stats = [
  { label:'Quiz complétés', valeur:12, icon:'📝', color:'#6366F1', bg:'rgba(99,102,241,0.12)', border:'rgba(99,102,241,0.25)' },
  { label:'Score moyen',    valeur:'74%', icon:'🎯', color:'#10B981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.25)' },
  { label:'Cas cliniques',  valeur:5, icon:'🩺', color:'#8B5CF6', bg:'rgba(139,92,246,0.12)', border:'rgba(139,92,246,0.25)' },
  { label:'Temps total',    valeur:'8h', icon:'⏱️', color:'#F59E0B', bg:'rgba(245,158,11,0.12)', border:'rgba(245,158,11,0.25)' },
]

const modules = [
  {
    titre:'Quiz Interactifs', description:'QCM par spécialité avec correction instantanée',
    icon:'📝', lien:'/quiz', dispo:true,
    gradient:'linear-gradient(135deg,#3B82F6 0%,#6366F1 100%)',
    glow:'rgba(99,102,241,0.4)', tag:'8 spécialités',
  },
  {
    titre:'Cas Cliniques', description:'Patients virtuels et arbre diagnostique',
    icon:'🩺', lien:'/cas-cliniques', dispo:true,
    gradient:'linear-gradient(135deg,#8B5CF6 0%,#EC4899 100%)',
    glow:'rgba(139,92,246,0.4)', tag:'3 cas',
  },
  {
    titre:'Anatomie 3D', description:'Visualisation interactive des organes',
    icon:'🧬', lien:'/anatomie', dispo:true,
    gradient:'linear-gradient(135deg,#14B8A6 0%,#3B82F6 100%)',
    glow:'rgba(20,184,166,0.4)', tag:'5 organes',
  },
]

const activite = [
  { titre:'Quiz Cardiologie', score:'8/10', date:"Aujourd'hui", icon:'❤️', color:'#EF4444' },
  { titre:'Quiz Neurologie',  score:'6/10', date:'Hier',         icon:'🧠', color:'#8B5CF6' },
  { titre:'Cas Clinique #2',  score:'90%',  date:'Il y a 2j',    icon:'🩺', color:'#6366F1' },
  { titre:'Anatomie – Cœur', score:'—',    date:'Il y a 3j',    icon:'🧬', color:'#14B8A6' },
]

// ── Système de niveaux ────────────────────────────────────────────────────────
const NIVEAUX = [
  {
    nom:'Débutant',       emoji:'🌱', min:0,    max:500,
    couleur:'#10B981',    bg:'rgba(16,185,129,0.12)',  border:'rgba(16,185,129,0.3)',
    gradient:'linear-gradient(135deg,#10B981,#059669)',
    barreGradient:'linear-gradient(90deg,#10B981,#34D399)',
    prochain:'Intermédiaire',
  },
  {
    nom:'Intermédiaire',  emoji:'⚡', min:500,  max:1500,
    couleur:'#6366F1',    bg:'rgba(99,102,241,0.12)',  border:'rgba(99,102,241,0.3)',
    gradient:'linear-gradient(135deg,#6366F1,#4F46E5)',
    barreGradient:'linear-gradient(90deg,#6366F1,#818CF8)',
    prochain:'Avancé',
  },
  {
    nom:'Avancé',         emoji:'🔥', min:1500, max:3000,
    couleur:'#F59E0B',    bg:'rgba(245,158,11,0.12)',  border:'rgba(245,158,11,0.3)',
    gradient:'linear-gradient(135deg,#F59E0B,#D97706)',
    barreGradient:'linear-gradient(90deg,#F59E0B,#FCD34D)',
    prochain:'Expert',
  },
  {
    nom:'Expert',         emoji:'🏆', min:3000, max:5000,
    couleur:'#EC4899',    bg:'rgba(236,72,153,0.12)',  border:'rgba(236,72,153,0.3)',
    gradient:'linear-gradient(135deg,#EC4899,#DB2777)',
    barreGradient:'linear-gradient(90deg,#EC4899,#F472B6)',
    prochain:'Maître',
  },
  {
    nom:'Maître',         emoji:'👑', min:5000, max:10000,
    couleur:'#EAB308',    bg:'rgba(234,179,8,0.12)',   border:'rgba(234,179,8,0.3)',
    gradient:'linear-gradient(135deg,#EAB308,#CA8A04)',
    barreGradient:'linear-gradient(90deg,#EAB308,#FDE047)',
    prochain:null,
  },
]

const XP_ACTUEL = 820  // XP mock de l'utilisateur

function getNiveau(xp) {
  return NIVEAUX.find(n => xp >= n.min && xp < n.max) || NIVEAUX[NIVEAUX.length - 1]
}

function getPourcentageXP(xp) {
  const n = getNiveau(xp)
  return Math.round(((xp - n.min) / (n.max - n.min)) * 100)
}

// ── Composant Carte Niveau ────────────────────────────────────────────────────
function CarteNiveau({ dark, t }) {
  const niveau = getNiveau(XP_ACTUEL)
  const pct    = getPourcentageXP(XP_ACTUEL)
  const xpReste = niveau.max - XP_ACTUEL

  return (
    <div style={{
      background: dark
        ? `linear-gradient(135deg, ${niveau.bg}, rgba(255,255,255,0.03))`
        : `linear-gradient(135deg, ${niveau.bg}, rgba(255,255,255,0.6))`,
      border: `1px solid ${niveau.border}`,
      borderRadius:'24px', padding:'20px',
      marginBottom:'20px', position:'relative', overflow:'hidden',
      animation:'slideUp 0.5s ease 0.05s both', opacity:0,
      boxShadow: dark ? 'none' : '0 4px 20px rgba(0,0,0,0.07)',
      transition:'all 0.3s ease',
    }}>

      {/* Orbe décoratif */}
      <div style={{
        position:'absolute', top:'-30px', right:'-30px',
        width:'120px', height:'120px', borderRadius:'50%',
        background:`radial-gradient(circle, ${niveau.couleur}30 0%, transparent 70%)`,
        pointerEvents:'none',
      }} />

      {/* En-tête */}
      <div style={{ display:'flex', alignItems:'center',
        justifyContent:'space-between', marginBottom:'16px' }}>

        {/* Infos niveau */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div className="level-badge" style={{
            width:'52px', height:'52px', borderRadius:'16px',
            background: niveau.gradient,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'24px', flexShrink:0,
            boxShadow:`0 6px 20px ${niveau.couleur}40`,
          }}>
            {niveau.emoji}
          </div>
          <div>
            <p style={{ color: t.textMuted, fontSize:'10px', fontWeight:700,
              letterSpacing:'0.08em', textTransform:'uppercase',
              margin:'0 0 2px', transition:'color 0.3s ease' }}>
              Niveau actuel
            </p>
            <h3 style={{
              fontFamily:"'Syne',sans-serif", fontSize:'20px', fontWeight:800,
              margin:0, color: niveau.couleur,
            }}>
              {niveau.nom}
            </h3>
          </div>
        </div>

        {/* XP total */}
        <div style={{ textAlign:'right' }}>
          <div style={{
            fontFamily:"'Syne',sans-serif", fontSize:'22px', fontWeight:800,
            color: niveau.couleur, lineHeight:1,
          }}>
            {XP_ACTUEL.toLocaleString()}
          </div>
          <div style={{ color: t.textMuted, fontSize:'10px', fontWeight:600,
            transition:'color 0.3s ease' }}>XP total</div>
        </div>
      </div>

      {/* Barre de progression XP */}
      <div style={{ marginBottom:'10px' }}>
        <div style={{ display:'flex', justifyContent:'space-between',
          alignItems:'center', marginBottom:'6px' }}>
          <span style={{ color: t.textSub, fontSize:'11px', fontWeight:600,
            transition:'color 0.3s ease' }}>
            Progression vers <strong style={{ color: niveau.couleur }}>
              {niveau.prochain || 'Maîtrise totale'}
            </strong>
          </span>
          <span style={{ color: niveau.couleur, fontSize:'12px', fontWeight:800,
            fontFamily:"'Syne',sans-serif" }}>
            {pct}%
          </span>
        </div>

        {/* Barre */}
        <div style={{
          height:'10px', borderRadius:'5px',
          background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          overflow:'hidden', position:'relative',
        }}>
          <div className="xp-bar-fill" style={{
            height:'100%', borderRadius:'5px',
            background: niveau.barreGradient,
            width:`${pct}%`,
            boxShadow:`0 0 10px ${niveau.couleur}60`,
            position:'relative', overflow:'hidden',
          }}>
            {/* Shimmer */}
            <div className="shimmer-bar" style={{
              position:'absolute', inset:0, borderRadius:'5px',
            }} />
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'space-between',
          marginTop:'5px' }}>
          <span style={{ color: t.textMuted, fontSize:'10px',
            transition:'color 0.3s ease' }}>
            {XP_ACTUEL - niveau.min} / {niveau.max - niveau.min} XP
          </span>
          <span style={{ color: t.textMuted, fontSize:'10px',
            transition:'color 0.3s ease' }}>
            encore {xpReste} XP pour {niveau.prochain || '👑'}
          </span>
        </div>
      </div>

      {/* Tous les niveaux */}
      <div style={{ display:'flex', gap:'6px', marginTop:'14px' }}>
        {NIVEAUX.map((n, i) => {
          const actif = n.nom === niveau.nom
          const depasse = XP_ACTUEL >= n.max
          return (
            <div key={i} style={{ flex:1, textAlign:'center' }}>
              <div style={{
                height:'4px', borderRadius:'2px', marginBottom:'4px',
                background: depasse
                  ? n.couleur
                  : actif
                    ? `linear-gradient(90deg, ${n.couleur} ${pct}%, ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} ${pct}%)`
                    : dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                boxShadow: depasse || actif ? `0 0 6px ${n.couleur}60` : 'none',
                transition:'all 0.3s ease',
              }} />
              <span style={{
                fontSize:'9px', fontWeight: actif ? 800 : 500,
                color: actif ? n.couleur : depasse ? n.couleur : t.textMuted,
                fontFamily: actif ? "'Syne',sans-serif" : "'DM Sans',sans-serif",
                transition:'color 0.3s ease',
              }}>
                {n.emoji}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Composant Toggle Thème ────────────────────────────────────────────────────
function ThemeToggle({ dark, setDark }) {
  return (
    <button onClick={() => setDark(!dark)} className="nav-btn"
      title={dark ? 'Mode clair' : 'Mode sombre'}
      style={{
        width:'52px', height:'28px', borderRadius:'14px', border:'none',
        background: dark
          ? 'linear-gradient(135deg,#6366F1,#8B5CF6)'
          : 'linear-gradient(135deg,#FCD34D,#F59E0B)',
        position:'relative', padding:0, flexShrink:0,
        boxShadow: dark
          ? '0 4px 12px rgba(99,102,241,0.4)'
          : '0 4px 12px rgba(245,158,11,0.4)',
      }}>
      <div style={{
        position:'absolute', top:'3px',
        left: dark ? 'calc(100% - 25px)' : '3px',
        width:'22px', height:'22px', borderRadius:'11px',
        background:'white', display:'flex', alignItems:'center',
        justifyContent:'center', fontSize:'12px',
        transition:'left 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow:'0 2px 8px rgba(0,0,0,0.2)',
      }}>
        {dark ? '🌙' : '☀️'}
      </div>
    </button>
  )
}

// ── Dashboard principal ───────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOuvert, setMenuOuvert] = useState(false)
  const [heure, setHeure] = useState('')
  const [dark, setDark] = useState(() =>
    localStorage.getItem('medlearn-theme') !== 'light'
  )

  useEffect(() => {
    const s = document.createElement('style')
    s.id = 'dashboard-styles'
    s.textContent = globalStyles
    document.head.appendChild(s)
    return () => document.getElementById('dashboard-styles')?.remove()
  }, [])

  useEffect(() => {
    localStorage.setItem('medlearn-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const h = new Date().getHours()
    setHeure(h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir')
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  const niveau = getNiveau(XP_ACTUEL)

  const t = {
    bg:           dark ? 'linear-gradient(160deg,#080818 0%,#0d1b2e 40%,#0a0f1e 100%)'
                       : 'linear-gradient(160deg,#F0F4FF 0%,#E8F0FE 40%,#F5F7FF 100%)',
    navBg:        dark ? 'rgba(8,8,24,0.9)'              : 'rgba(255,255,255,0.92)',
    navBorder:    dark ? 'rgba(255,255,255,0.06)'         : 'rgba(0,0,0,0.08)',
    menuBg:       dark ? 'rgba(8,8,24,0.97)'             : 'rgba(255,255,255,0.99)',
    text:         dark ? 'white'                          : '#0F172A',
    textSub:      dark ? 'rgba(255,255,255,0.4)'          : 'rgba(15,23,42,0.5)',
    textMuted:    dark ? 'rgba(255,255,255,0.25)'         : 'rgba(15,23,42,0.35)',
    titleGrad:    dark
      ? 'linear-gradient(135deg,#ffffff 0%,#a5b4fc 100%)'
      : 'linear-gradient(135deg,#1E3A8A 0%,#6366F1 100%)',
    cardBg:       dark ? 'rgba(255,255,255,0.04)'         : 'rgba(255,255,255,0.9)',
    cardBorder:   dark ? 'rgba(255,255,255,0.08)'         : 'rgba(0,0,0,0.08)',
    cardShadow:   dark ? 'none'                           : '0 2px 12px rgba(0,0,0,0.06)',
    orb1:         dark ? 'rgba(99,102,241,0.1)'           : 'rgba(99,102,241,0.08)',
    orb2:         dark ? 'rgba(139,92,246,0.08)'          : 'rgba(139,92,246,0.06)',
    gridColor:    dark ? 'rgba(99,102,241,0.025)'         : 'rgba(99,102,241,0.04)',
    activityBg:   dark ? 'rgba(255,255,255,0.03)'         : 'rgba(255,255,255,0.8)',
    activityBorder:dark? 'rgba(255,255,255,0.07)'         : 'rgba(0,0,0,0.07)',
    divider:      dark ? 'rgba(255,255,255,0.04)'         : 'rgba(0,0,0,0.05)',
    burgerBg:     dark ? 'rgba(255,255,255,0.06)'         : 'rgba(0,0,0,0.06)',
    burgerBorder: dark ? 'rgba(255,255,255,0.08)'         : 'rgba(0,0,0,0.1)',
    tagBg:        dark ? 'rgba(255,255,255,0.07)'         : 'rgba(0,0,0,0.06)',
    tagColor:     dark ? 'rgba(255,255,255,0.4)'          : 'rgba(15,23,42,0.45)',
    profileBg:    dark ? 'rgba(255,255,255,0.04)'         : 'rgba(0,0,0,0.04)',
    profileBorder:dark ? 'rgba(255,255,255,0.07)'         : 'rgba(0,0,0,0.07)',
    logoutBg:     dark ? 'rgba(239,68,68,0.1)'            : 'rgba(239,68,68,0.08)',
    logoutBd:     dark ? 'rgba(239,68,68,0.2)'            : 'rgba(239,68,68,0.2)',
    moduleBg:     dark ? 'rgba(255,255,255,0.04)'         : 'rgba(255,255,255,0.85)',
    moduleBorder: dark ? 'rgba(255,255,255,0.08)'         : 'rgba(0,0,0,0.08)',
    desktopProfBg:dark ? 'rgba(255,255,255,0.05)'         : 'rgba(0,0,0,0.05)',
    desktopProfBd:dark ? 'rgba(255,255,255,0.08)'         : 'rgba(0,0,0,0.1)',
  }

  return (
    <div style={{
      minHeight:'100vh', background: t.bg,
      fontFamily:"'DM Sans',sans-serif", position:'relative',
      transition:'background 0.4s ease',
    }}>

      {/* Décors fond */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'300px', height:'300px',
          borderRadius:'50%', background:`radial-gradient(circle,${t.orb1} 0%,transparent 65%)` }} />
        <div style={{ position:'absolute', bottom:'-80px', left:'-60px', width:'300px', height:'300px',
          borderRadius:'50%', background:`radial-gradient(circle,${t.orb2} 0%,transparent 65%)` }} />
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:`linear-gradient(${t.gridColor} 1px,transparent 1px),
            linear-gradient(90deg,${t.gridColor} 1px,transparent 1px)`,
          backgroundSize:'50px 50px',
        }} />
      </div>

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav style={{
        position:'sticky', top:0, zIndex:100,
        background: t.navBg, backdropFilter:'blur(24px)',
        borderBottom:`1px solid ${t.navBorder}`,
        transition:'background 0.4s ease, border-color 0.4s ease',
      }}>
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 16px', height:'56px', maxWidth:'1200px', margin:'0 auto',
        }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{
              width:'32px', height:'32px', borderRadius:'9px',
              background:'linear-gradient(135deg,#6366F1,#8B5CF6)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'16px', boxShadow:'0 4px 12px rgba(99,102,241,0.4)',
            }}>🏥</div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:'15px',
              fontWeight:800, color: t.text, transition:'color 0.3s ease' }}>
              MedLearn Pro
            </span>
          </div>

          {/* Desktop */}
          <div className="desktop-profile"
            style={{ alignItems:'center', gap:'10px' }}>
            <ThemeToggle dark={dark} setDark={setDark} />
            {/* Badge niveau mini */}
            <div style={{
              display:'flex', alignItems:'center', gap:'6px',
              background: niveau.bg, border:`1px solid ${niveau.border}`,
              borderRadius:'20px', padding:'5px 12px',
              transition:'all 0.3s ease',
            }}>
              <span style={{ fontSize:'14px' }}>{niveau.emoji}</span>
              <span style={{ color: niveau.couleur, fontSize:'12px',
                fontWeight:700, fontFamily:"'Syne',sans-serif" }}>
                {niveau.nom}
              </span>
              <span style={{ color: t.textMuted, fontSize:'11px',
                transition:'color 0.3s ease' }}>·</span>
              <span style={{ color: t.textSub, fontSize:'11px',
                transition:'color 0.3s ease' }}>{XP_ACTUEL} XP</span>
            </div>
            <div style={{
              display:'flex', alignItems:'center', gap:'8px',
              background: t.desktopProfBg, border:`1px solid ${t.desktopProfBd}`,
              borderRadius:'20px', padding:'6px 12px',
            }}>
              <div style={{ width:'7px', height:'7px', borderRadius:'50%',
                background:'#10B981', animation:'pulse-dot 2s ease-in-out infinite' }} />
              <span style={{ color: t.textSub, fontSize:'12px' }}>{user?.nom}</span>
            </div>
            <button onClick={handleLogout} className="nav-btn"
              style={{ padding:'7px 14px', borderRadius:'10px',
                border:`1px solid ${t.logoutBd}`, background: t.logoutBg,
                color:'#EF4444', fontSize:'12px', fontWeight:600 }}>
              Déconnexion
            </button>
          </div>

          {/* Mobile burger */}
          <div className="burger-btn" style={{ alignItems:'center', gap:'8px' }}>
            <ThemeToggle dark={dark} setDark={setDark} />
            <button onClick={() => setMenuOuvert(!menuOuvert)} className="nav-btn"
              style={{
                width:'36px', height:'36px', borderRadius:'10px',
                background: menuOuvert ? 'rgba(99,102,241,0.15)' : t.burgerBg,
                border:`1px solid ${menuOuvert ? 'rgba(99,102,241,0.3)' : t.burgerBorder}`,
                color: t.text, fontSize:'18px',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
              {menuOuvert ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {menuOuvert && (
          <div style={{
            animation:'menuSlide 0.25s ease both',
            background: t.menuBg, backdropFilter:'blur(20px)',
            borderTop:`1px solid ${t.navBorder}`,
            padding:'12px 16px 16px',
          }}>
            {/* Badge niveau dans le menu */}
            <div style={{
              display:'flex', alignItems:'center', gap:'10px',
              background: niveau.bg, border:`1px solid ${niveau.border}`,
              borderRadius:'14px', padding:'10px 14px', marginBottom:'10px',
            }}>
              <span style={{ fontSize:'22px' }}>{niveau.emoji}</span>
              <div style={{ flex:1 }}>
                <p style={{ color: niveau.couleur, fontSize:'13px',
                  fontWeight:800, margin:0, fontFamily:"'Syne',sans-serif" }}>
                  {niveau.nom}
                </p>
                <p style={{ color: t.textSub, fontSize:'11px', margin:0 }}>
                  {XP_ACTUEL} XP · {getPourcentageXP(XP_ACTUEL)}% vers {niveau.prochain}
                </p>
              </div>
            </div>
            {/* Profil */}
            <div style={{
              display:'flex', alignItems:'center', gap:'10px',
              background: t.profileBg, border:`1px solid ${t.profileBorder}`,
              borderRadius:'14px', padding:'10px 14px', marginBottom:'10px',
            }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'10px',
                background:'linear-gradient(135deg,#6366F1,#8B5CF6)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>
                👨‍⚕️
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ color: t.text, fontSize:'13px', fontWeight:600,
                  margin:0, fontFamily:"'Syne',sans-serif",
                  overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {user?.nom}
                </p>
                <p style={{ color: t.textSub, fontSize:'11px', margin:0 }}>
                  {user?.email}
                </p>
              </div>
            </div>
            <button onClick={handleLogout} className="nav-btn"
              style={{ width:'100%', padding:'11px', borderRadius:'12px',
                background: t.logoutBg, border:`1px solid ${t.logoutBd}`,
                color:'#EF4444', fontSize:'13px', fontWeight:700,
                fontFamily:"'Syne',sans-serif" }}>
              🚪 Déconnexion
            </button>
          </div>
        )}
      </nav>

      {/* ── CONTENU ────────────────────────────────────────────────────── */}
      <div style={{ padding:'20px 16px 80px', position:'relative', zIndex:1,
        maxWidth:'1200px', margin:'0 auto' }}>

        {/* Salutation */}
        <div style={{ marginBottom:'16px', animation:'slideUp 0.5s ease both' }}>
          <p style={{ color: t.textSub, fontSize:'13px', margin:'0 0 4px',
            transition:'color 0.3s ease' }}>
            👋 {heure}
          </p>
          <h1 style={{
            fontFamily:"'Syne',sans-serif", fontSize:'clamp(20px,6vw,28px)',
            fontWeight:800, margin:'0 0 2px',
            background: t.titleGrad,
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>
            {user?.nom?.split(' ')[0]} 🎓
          </h1>
          <p style={{ color: t.textMuted, fontSize:'12px', margin:0,
            transition:'color 0.3s ease' }}>
            Continuez votre formation médicale
          </p>
        </div>

        {/* ── CARTE NIVEAU ───────────────────────────────────────────── */}
        <CarteNiveau dark={dark} t={t} />

        {/* ── STATS 2x2 ──────────────────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
          gap:'10px', marginBottom:'24px' }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card"
              style={{
                background: dark ? s.bg : 'rgba(255,255,255,0.9)',
                border:`1px solid ${dark ? s.border : 'rgba(0,0,0,0.07)'}`,
                borderRadius:'18px', padding:'14px',
                boxShadow: t.cardShadow,
                animation:`slideUp 0.5s ease ${0.15+i*0.07}s both`, opacity:0,
                transition:'all 0.3s ease',
              }}>
              <div style={{ display:'flex', alignItems:'center',
                justifyContent:'space-between', marginBottom:'8px' }}>
                <span style={{ fontSize:'20px' }}>{s.icon}</span>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%',
                  background: s.color, boxShadow:`0 0 6px ${s.color}` }} />
              </div>
              <div style={{
                fontFamily:"'Syne',sans-serif", fontSize:'22px',
                fontWeight:800, color: s.color,
                animation:`countUp 0.6s cubic-bezier(0.34,1.56,0.64,1) ${0.3+i*0.1}s both`,
              }}>{s.valeur}</div>
              <div style={{ color: t.textSub, fontSize:'10px',
                marginTop:'2px', fontWeight:600, lineHeight:1.3,
                transition:'color 0.3s ease' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── MODULES ────────────────────────────────────────────────── */}
        <div style={{ marginBottom:'24px' }}>
          <div style={{ display:'flex', alignItems:'center',
            justifyContent:'space-between', marginBottom:'12px' }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'15px',
              fontWeight:800, color: t.text, margin:0,
              transition:'color 0.3s ease' }}>Modules</h2>
            <span style={{ color: t.textMuted, fontSize:'11px',
              transition:'color 0.3s ease' }}>
              {modules.filter(m=>m.dispo).length} actifs
            </span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {modules.map((m, i) => (
              <div key={i} onClick={() => m.dispo && navigate(m.lien)}
                className="module-card"
                style={{
                  background: t.moduleBg, border:`1px solid ${t.moduleBorder}`,
                  borderRadius:'20px', padding:'14px 16px',
                  boxShadow: t.cardShadow,
                  animation:`slideUp 0.5s ease ${0.3+i*0.1}s both`, opacity:0,
                  transition:'background 0.3s ease, border-color 0.3s ease',
                }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{
                    width:'46px', height:'46px', borderRadius:'14px', flexShrink:0,
                    background: m.gradient,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'22px', boxShadow:`0 6px 18px ${m.glow}`,
                  }}>{m.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center',
                      gap:'6px', marginBottom:'2px', flexWrap:'wrap' }}>
                      <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:'14px',
                        fontWeight:800, color: t.text, margin:0,
                        transition:'color 0.3s ease' }}>{m.titre}</h3>
                      <span style={{
                        fontSize:'9px', fontWeight:700, padding:'1px 7px',
                        borderRadius:'6px', background: t.tagBg, color: t.tagColor,
                        flexShrink:0, transition:'all 0.3s ease',
                      }}>{m.tag}</span>
                    </div>
                    <p style={{ color: t.textSub, fontSize:'11px', margin:0,
                      lineHeight:1.4, overflow:'hidden', textOverflow:'ellipsis',
                      whiteSpace:'nowrap', transition:'color 0.3s ease' }}>
                      {m.description}
                    </p>
                  </div>
                  <div style={{
                    width:'30px', height:'30px', borderRadius:'9px', flexShrink:0,
                    background: m.gradient,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'13px', boxShadow:`0 3px 12px ${m.glow}`,
                  }}>→</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ACTIVITÉ RÉCENTE ───────────────────────────────────────── */}
        <div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'15px',
            fontWeight:800, color: t.text, margin:'0 0 12px',
            transition:'color 0.3s ease' }}>Activité récente</h2>
          <div style={{
            background: t.activityBg, border:`1px solid ${t.activityBorder}`,
            borderRadius:'20px', overflow:'hidden',
            boxShadow: t.cardShadow,
            animation:'slideUp 0.5s ease 0.5s both', opacity:0,
            transition:'all 0.3s ease',
          }}>
            {activite.map((a, i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:'10px', padding:'12px 14px',
                borderBottom: i < activite.length-1 ? `1px solid ${t.divider}` : 'none',
              }}>
                <div style={{
                  width:'36px', height:'36px', borderRadius:'11px', flexShrink:0,
                  background:`${a.color}18`, border:`1px solid ${a.color}25`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'16px',
                }}>{a.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:'13px', fontWeight:600, color: t.text,
                    margin:'0 0 1px', overflow:'hidden', textOverflow:'ellipsis',
                    whiteSpace:'nowrap', transition:'color 0.3s ease' }}>
                    {a.titre}
                  </p>
                  <p style={{ fontSize:'10px', color: t.textMuted, margin:0,
                    transition:'color 0.3s ease' }}>{a.date}</p>
                </div>
                <span style={{
                  fontSize:'11px', fontWeight:700, padding:'3px 10px',
                  borderRadius:'8px', background:`${a.color}15`,
                  border:`1px solid ${a.color}25`, color: a.color, flexShrink:0,
                }}>{a.score}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}