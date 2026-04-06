import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const getStyles = (dark) => `
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
  @keyframes toggleSlide {
    from { transform:translateX(0px); }
    to   { transform:translateX(22px); }
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

  /* Burger visible seulement mobile/tablette */
  .burger-btn { display:flex; }
  /* Profil desktop visible seulement desktop */
  .desktop-profile { display:none; }

  @media (min-width:1024px) {
    .burger-btn { display:none !important; }
    .desktop-profile { display:flex !important; }
  }

  * { -webkit-tap-highlight-color:transparent; }
`

const stats = [
  { label:'Quiz complétés', valeur:12, icon:'📝', color:'#6366F1', bg:'rgba(99,102,241,0.12)', border:'rgba(99,102,241,0.25)' },
  { label:'Score moyen', valeur:'74%', icon:'🎯', color:'#10B981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.25)' },
  { label:'Cas cliniques', valeur:5, icon:'🩺', color:'#8B5CF6', bg:'rgba(139,92,246,0.12)', border:'rgba(139,92,246,0.25)' },
  { label:'Temps total', valeur:'8h', icon:'⏱️', color:'#F59E0B', bg:'rgba(245,158,11,0.12)', border:'rgba(245,158,11,0.25)' },
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
  { titre:'Quiz Neurologie', score:'6/10', date:'Hier', icon:'🧠', color:'#8B5CF6' },
  { titre:'Cas Clinique #2', score:'90%', date:'Il y a 2j', icon:'🩺', color:'#6366F1' },
  { titre:'Anatomie – Cœur', score:'—', date:'Il y a 3j', icon:'🧬', color:'#14B8A6' },
]

// ── Composant Toggle Thème ────────────────────────────────────────────────────
function ThemeToggle({ dark, setDark }) {
  return (
    <button
      onClick={() => setDark(!dark)}
      className="nav-btn"
      title={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      style={{
        width:'52px', height:'28px', borderRadius:'14px', border:'none',
        background: dark
          ? 'linear-gradient(135deg,#6366F1,#8B5CF6)'
          : 'linear-gradient(135deg,#FCD34D,#F59E0B)',
        position:'relative', padding:0, flexShrink:0,
        boxShadow: dark
          ? '0 4px 12px rgba(99,102,241,0.4)'
          : '0 4px 12px rgba(245,158,11,0.4)',
      }}
    >
      {/* Curseur */}
      <div style={{
        position:'absolute', top:'3px',
        left: dark ? 'calc(100% - 25px)' : '3px',
        width:'22px', height:'22px', borderRadius:'11px',
        background:'white',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'12px', transition:'left 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow:'0 2px 8px rgba(0,0,0,0.2)',
      }}>
        {dark ? '🌙' : '☀️'}
      </div>
    </button>
  )
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOuvert, setMenuOuvert] = useState(false)
  const [heure, setHeure] = useState('')
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('medlearn-theme') !== 'light'
  })

  useEffect(() => {
    const styleEl = document.createElement('style')
    styleEl.id = 'dashboard-styles'
    styleEl.textContent = getStyles(dark)
    document.head.appendChild(styleEl)
    return () => { const el = document.getElementById('dashboard-styles'); el?.remove() }
  }, [dark])

  useEffect(() => {
    localStorage.setItem('medlearn-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const h = new Date().getHours()
    setHeure(h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir')
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  // ── Couleurs selon thème ──────────────────────────────────────────────────
  const t = {
    bg:          dark ? 'linear-gradient(160deg,#080818 0%,#0d1b2e 40%,#0a0f1e 100%)'
                      : 'linear-gradient(160deg,#F0F4FF 0%,#E8F0FE 40%,#F5F7FF 100%)',
    navBg:       dark ? 'rgba(8,8,24,0.9)'    : 'rgba(255,255,255,0.92)',
    navBorder:   dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
    cardBg:      dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)',
    cardBorder:  dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    text:        dark ? 'white'               : '#0F172A',
    textSub:     dark ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.5)',
    textMuted:   dark ? 'rgba(255,255,255,0.25)' : 'rgba(15,23,42,0.35)',
    titleGrad:   dark
      ? 'linear-gradient(135deg,#ffffff 0%,#a5b4fc 100%)'
      : 'linear-gradient(135deg,#1E3A8A 0%,#6366F1 100%)',
    menuBg:      dark ? 'rgba(8,8,24,0.97)'   : 'rgba(255,255,255,0.99)',
    orb1:        dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)',
    orb2:        dark ? 'rgba(139,92,246,0.08)': 'rgba(139,92,246,0.06)',
    gridColor:   dark ? 'rgba(99,102,241,0.025)' : 'rgba(99,102,241,0.04)',
    activityBg:  dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
    activityBorder: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
    divider:     dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
    burgerBg:    dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    burgerBorder:dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
    tagBg:       dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
    tagColor:    dark ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.45)',
    profileBg:   dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
    profileBorder:dark? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
    logoutBg:    dark ? 'rgba(239,68,68,0.1)'   : 'rgba(239,68,68,0.08)',
    logoutBorder:dark ? 'rgba(239,68,68,0.2)'   : 'rgba(239,68,68,0.2)',
    moduleBg:    dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)',
    moduleBorder:dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    desktopProfileBg: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    desktopProfileBorder: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
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

          {/* Desktop : profil + toggle + déconnexion */}
          <div className="desktop-profile"
            style={{ alignItems:'center', gap:'10px' }}>
            <ThemeToggle dark={dark} setDark={setDark} />
            <div style={{
              display:'flex', alignItems:'center', gap:'8px',
              background: t.desktopProfileBg, border:`1px solid ${t.desktopProfileBorder}`,
              borderRadius:'20px', padding:'6px 12px',
              transition:'all 0.3s ease',
            }}>
              <div style={{ width:'7px', height:'7px', borderRadius:'50%',
                background:'#10B981', animation:'pulse-dot 2s ease-in-out infinite' }} />
              <span style={{ color: t.textSub, fontSize:'12px' }}>{user?.nom}</span>
              <span style={{
                background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.25)',
                color:'#6366F1', fontSize:'10px', fontWeight:700,
                padding:'1px 7px', borderRadius:'8px', textTransform:'capitalize',
              }}>{user?.role}</span>
            </div>
            <button onClick={handleLogout} className="nav-btn"
              style={{
                padding:'7px 14px', borderRadius:'10px',
                border:`1px solid ${t.logoutBorder}`, background: t.logoutBg,
                color:'#EF4444', fontSize:'12px', fontWeight:600,
              }}>
              Déconnexion
            </button>
          </div>

          {/* Mobile/Tablette : toggle + burger */}
          <div className="burger-btn"
            style={{ alignItems:'center', gap:'8px' }}>
            <ThemeToggle dark={dark} setDark={setDark} />
            <button
              onClick={() => setMenuOuvert(!menuOuvert)}
              className="nav-btn"
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

        {/* Menu déroulant mobile */}
        {menuOuvert && (
          <div style={{
            animation:'menuSlide 0.25s ease both',
            background: t.menuBg, backdropFilter:'blur(20px)',
            borderTop:`1px solid ${t.navBorder}`,
            padding:'12px 16px 16px',
            transition:'background 0.3s ease',
          }}>
            {/* Profil */}
            <div style={{
              display:'flex', alignItems:'center', gap:'10px',
              background: t.profileBg, border:`1px solid ${t.profileBorder}`,
              borderRadius:'14px', padding:'12px 14px', marginBottom:'10px',
            }}>
              <div style={{
                width:'38px', height:'38px', borderRadius:'11px', flexShrink:0,
                background:'linear-gradient(135deg,#6366F1,#8B5CF6)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px',
              }}>👨‍⚕️</div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ color: t.text, fontSize:'14px', fontWeight:600,
                  margin:0, fontFamily:"'Syne',sans-serif",
                  overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {user?.nom}
                </p>
                <p style={{ color: t.textSub, fontSize:'11px', margin:0 }}>{user?.email}</p>
              </div>
              <span style={{
                background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.25)',
                color:'#6366F1', fontSize:'10px', fontWeight:700,
                padding:'2px 8px', borderRadius:'8px', textTransform:'capitalize', flexShrink:0,
              }}>{user?.role}</span>
            </div>

            {/* Déconnexion */}
            <button onClick={handleLogout} className="nav-btn"
              style={{
                width:'100%', padding:'11px', borderRadius:'12px',
                background: t.logoutBg, border:`1px solid ${t.logoutBorder}`,
                color:'#EF4444', fontSize:'13px', fontWeight:700,
                fontFamily:"'Syne',sans-serif",
              }}>
              🚪 Déconnexion
            </button>
          </div>
        )}
      </nav>

      {/* ── CONTENU ────────────────────────────────────────────────────── */}
      <div style={{ padding:'20px 16px 80px', position:'relative', zIndex:1,
        maxWidth:'1200px', margin:'0 auto' }}>

        {/* Salutation */}
        <div style={{ marginBottom:'20px', animation:'slideUp 0.5s ease both' }}>
          <p style={{ color: t.textSub, fontSize:'13px', margin:'0 0 4px',
            transition:'color 0.3s ease' }}>
            👋 {heure}
          </p>
          <h1 style={{
            fontFamily:"'Syne',sans-serif", fontSize:'clamp(20px,6vw,28px)',
            fontWeight:800, margin:'0 0 2px',
            background: t.titleGrad,
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            transition:'all 0.3s ease',
          }}>
            {user?.nom?.split(' ')[0]} 🎓
          </h1>
          <p style={{ color: t.textMuted, fontSize:'12px', margin:0, transition:'color 0.3s ease' }}>
            Continuez votre formation médicale
          </p>
        </div>

        {/* ── STATS 2x2 ──────────────────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
          gap:'10px', marginBottom:'24px' }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card"
              style={{
                background: dark ? s.bg : 'rgba(255,255,255,0.9)',
                border:`1px solid ${dark ? s.border : 'rgba(0,0,0,0.07)'}`,
                borderRadius:'18px', padding:'14px',
                boxShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
                animation:`slideUp 0.5s ease ${i*0.07}s both`,
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
                animation:`countUp 0.6s cubic-bezier(0.34,1.56,0.64,1) ${0.2+i*0.1}s both`,
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
              fontWeight:800, color: t.text, margin:0, transition:'color 0.3s ease' }}>
              Modules
            </h2>
            <span style={{ color: t.textMuted, fontSize:'11px', transition:'color 0.3s ease' }}>
              {modules.filter(m=>m.dispo).length} actifs
            </span>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {modules.map((m, i) => (
              <div key={i} onClick={() => m.dispo && navigate(m.lien)}
                className="module-card"
                style={{
                  background: t.moduleBg,
                  border:`1px solid ${t.moduleBorder}`,
                  borderRadius:'20px', padding:'14px 16px',
                  boxShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
                  animation:`slideUp 0.5s ease ${0.2+i*0.1}s both`,
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
                        fontWeight:800, color: t.text, margin:0, transition:'color 0.3s ease' }}>
                        {m.titre}
                      </h3>
                      <span style={{
                        fontSize:'9px', fontWeight:700, padding:'1px 7px', borderRadius:'6px',
                        background: t.tagBg, color: t.tagColor,
                        flexShrink:0, transition:'all 0.3s ease',
                      }}>{m.tag}</span>
                    </div>
                    <p style={{ color: t.textSub, fontSize:'11px', margin:0, lineHeight:1.4,
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                      transition:'color 0.3s ease' }}>
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
            fontWeight:800, color: t.text, margin:'0 0 12px', transition:'color 0.3s ease' }}>
            Activité récente
          </h2>
          <div style={{
            background: t.activityBg, border:`1px solid ${t.activityBorder}`,
            borderRadius:'20px', overflow:'hidden',
            boxShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
            animation:'slideUp 0.5s ease 0.45s both',
            transition:'all 0.3s ease',
          }}>
            {activite.map((a, i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:'10px',
                padding:'12px 14px',
                borderBottom: i < activite.length-1 ? `1px solid ${t.divider}` : 'none',
                transition:'background 0.2s ease',
              }}>
                <div style={{
                  width:'36px', height:'36px', borderRadius:'11px', flexShrink:0,
                  background:`${a.color}18`, border:`1px solid ${a.color}25`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px',
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
                  fontSize:'11px', fontWeight:700, padding:'3px 10px', borderRadius:'8px',
                  background:`${a.color}15`, border:`1px solid ${a.color}25`,
                  color: a.color, flexShrink:0,
                }}>{a.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}