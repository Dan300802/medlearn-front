import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
  @keyframes slideUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes pulse-dot {
    0%,100% { transform:scale(1); }
    50%      { transform:scale(1.4); }
  }
  @keyframes float {
    0%,100% { transform:translateY(0); }
    50%      { transform:translateY(-6px); }
  }
  @keyframes countUp {
    from { opacity:0; transform:scale(0.5); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes menuSlide {
    from { opacity:0; transform:translateY(-10px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .ens-card {
    transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    cursor:pointer;
  }
  .ens-card:active { transform:scale(0.98); }
  @media (hover:hover) {
    .ens-card:hover { transform:translateY(-4px) scale(1.01); }
  }

  .ens-btn {
    transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    cursor:pointer;
  }
  .ens-btn:hover  { transform:translateY(-2px); }
  .ens-btn:active { transform:scale(0.97); }

  /* Burger : visible mobile/tablette seulement */
  .burger-ens  { display:flex !important; }
  .desktop-ens { display:none !important; }

  @media (min-width:1024px) {
    .burger-ens  { display:none !important; }
    .desktop-ens { display:flex !important; }
  }

  * { -webkit-tap-highlight-color:transparent; }
`

const stats = [
  { label:'Cours déposés',   valeur:4,   icon:'📚', color:'#6366F1', bg:'rgba(99,102,241,0.12)',  border:'rgba(99,102,241,0.25)' },
  { label:'Quiz générés',    valeur:38,  icon:'📝', color:'#10B981', bg:'rgba(16,185,129,0.12)',  border:'rgba(16,185,129,0.25)' },
  { label:'Cas cliniques',   valeur:8,   icon:'🩺', color:'#8B5CF6', bg:'rgba(139,92,246,0.12)', border:'rgba(139,92,246,0.25)' },
  { label:'Étudiants actifs',valeur:124, icon:'👨‍⚕️', color:'#F59E0B', bg:'rgba(245,158,11,0.12)', border:'rgba(245,158,11,0.25)' },
]

const coursRecents = [
  { titre:'Cardiologie — Insuffisance cardiaque', date:"Aujourd'hui", statut:'publié',  quiz:10, cas:2, icon:'❤️', color:'#EF4444' },
  { titre:'Neurologie — AVC ischémique',          date:'Il y a 2j',  statut:'publié',  quiz:8,  cas:1, icon:'🧠', color:'#8B5CF6' },
  { titre:'Infectiologie — Paludisme',            date:'Il y a 5j',  statut:'brouillon',quiz:6, cas:1, icon:'🦠', color:'#F59E0B' },
  { titre:'Pharmacologie — Antibiotiques',        date:'Il y a 1sem',statut:'publié',  quiz:14, cas:3, icon:'💊', color:'#10B981' },
]

function ThemeToggle({ dark, setDark }) {
  return (
    <button
      onClick={() => setDark(!dark)}
      className="ens-btn"
      title={dark ? 'Mode clair' : 'Mode sombre'}
      style={{
        width:'52px', height:'28px', borderRadius:'14px', border:'none',
        background: dark
          ? 'linear-gradient(135deg,#10B981,#059669)'
          : 'linear-gradient(135deg,#FCD34D,#F59E0B)',
        position:'relative', padding:0, flexShrink:0,
        boxShadow: dark
          ? '0 4px 12px rgba(16,185,129,0.4)'
          : '0 4px 12px rgba(245,158,11,0.4)',
      }}
    >
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

export default function DashboardEnseignant() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOuvert, setMenuOuvert] = useState(false)
  const [dark, setDark] = useState(() =>
    localStorage.getItem('medlearn-theme') !== 'light'
  )

  useEffect(() => {
    const s = document.createElement('style')
    s.id = 'ens-styles'
    s.textContent = globalStyles
    document.head.appendChild(s)
    return () => document.getElementById('ens-styles')?.remove()
  }, [])

  useEffect(() => {
    localStorage.setItem('medlearn-theme', dark ? 'dark' : 'light')
  }, [dark])

  const handleLogout = () => { logout(); navigate('/login') }

  // ── Tokens couleurs selon thème ──────────────────────────────────────────
  const t = {
    bg:           dark ? 'linear-gradient(160deg,#080818 0%,#0d1b2e 40%,#0a0f1e 100%)'
                       : 'linear-gradient(160deg,#F0F9F4 0%,#E8F5ED 40%,#F5FBF7 100%)',
    navBg:        dark ? 'rgba(8,8,24,0.9)'              : 'rgba(255,255,255,0.93)',
    navBorder:    dark ? 'rgba(255,255,255,0.06)'         : 'rgba(0,0,0,0.08)',
    menuBg:       dark ? 'rgba(8,8,24,0.97)'             : 'rgba(255,255,255,0.99)',
    text:         dark ? 'white'                          : '#0F172A',
    textSub:      dark ? 'rgba(255,255,255,0.4)'          : 'rgba(15,23,42,0.5)',
    textMuted:    dark ? 'rgba(255,255,255,0.25)'         : 'rgba(15,23,42,0.3)',
    titleGrad:    dark ? 'linear-gradient(135deg,#ffffff 0%,#6EE7B7 100%)'
                       : 'linear-gradient(135deg,#064E3B 0%,#10B981 100%)',
    cardBg:       dark ? 'rgba(255,255,255,0.04)'         : 'rgba(255,255,255,0.9)',
    cardBorder:   dark ? 'rgba(255,255,255,0.08)'         : 'rgba(0,0,0,0.08)',
    cardShadow:   dark ? 'none'                           : '0 2px 12px rgba(0,0,0,0.06)',
    orb1:         dark ? 'rgba(16,185,129,0.1)'           : 'rgba(16,185,129,0.08)',
    orb2:         dark ? 'rgba(99,102,241,0.08)'          : 'rgba(99,102,241,0.05)',
    grid:         dark ? 'rgba(16,185,129,0.025)'         : 'rgba(16,185,129,0.04)',
    ctaBg:        dark ? 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(99,102,241,0.15))'
                       : 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(99,102,241,0.08))',
    ctaBorder:    dark ? 'rgba(16,185,129,0.25)'          : 'rgba(16,185,129,0.3)',
    profileBg:    dark ? 'rgba(255,255,255,0.04)'         : 'rgba(0,0,0,0.04)',
    profileBorder:dark ? 'rgba(255,255,255,0.07)'         : 'rgba(0,0,0,0.08)',
    burgerBg:     dark ? 'rgba(255,255,255,0.06)'         : 'rgba(0,0,0,0.06)',
    burgerBorder: dark ? 'rgba(255,255,255,0.08)'         : 'rgba(0,0,0,0.1)',
    tagBg:        dark ? 'rgba(255,255,255,0.06)'         : 'rgba(0,0,0,0.05)',
    tagColor:     dark ? 'rgba(255,255,255,0.35)'         : 'rgba(15,23,42,0.4)',
    divider:      dark ? 'rgba(255,255,255,0.04)'         : 'rgba(0,0,0,0.05)',
    statBorder:   dark ? undefined                        : 'rgba(0,0,0,0.07)',
    desktopProfBg:dark ? 'rgba(255,255,255,0.05)'         : 'rgba(0,0,0,0.05)',
    desktopProfBd:dark ? 'rgba(255,255,255,0.08)'         : 'rgba(0,0,0,0.1)',
    logoutBg:     dark ? 'rgba(239,68,68,0.1)'            : 'rgba(239,68,68,0.07)',
    logoutBd:     dark ? 'rgba(239,68,68,0.2)'            : 'rgba(239,68,68,0.2)',
    nouveauBg:    dark ? 'rgba(16,185,129,0.15)'          : 'rgba(16,185,129,0.1)',
    nouveauBd:    dark ? 'rgba(16,185,129,0.25)'          : 'rgba(16,185,129,0.3)',
    editBg:       dark ? 'rgba(99,102,241,0.15)'          : 'rgba(99,102,241,0.1)',
    editBd:       dark ? 'rgba(99,102,241,0.25)'          : 'rgba(99,102,241,0.2)',
    deleteBg:     dark ? 'rgba(239,68,68,0.1)'            : 'rgba(239,68,68,0.07)',
    deleteBd:     dark ? 'rgba(239,68,68,0.2)'            : 'rgba(239,68,68,0.15)',
  }

  return (
    <div style={{
      minHeight:'100vh', background: t.bg,
      fontFamily:"'DM Sans',sans-serif", position:'relative',
      transition:'background 0.4s ease',
    }}>

      {/* Décors fond */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-60px', right:'-60px',
          width:'350px', height:'350px', borderRadius:'50%',
          background:`radial-gradient(circle,${t.orb1} 0%,transparent 65%)` }} />
        <div style={{ position:'absolute', bottom:'-80px', left:'-60px',
          width:'300px', height:'300px', borderRadius:'50%',
          background:`radial-gradient(circle,${t.orb2} 0%,transparent 65%)` }} />
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:`linear-gradient(${t.grid} 1px,transparent 1px),
            linear-gradient(90deg,${t.grid} 1px,transparent 1px)`,
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
          padding:'0 16px', height:'56px', maxWidth:'1100px', margin:'0 auto',
        }}>

          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{
              width:'32px', height:'32px', borderRadius:'9px',
              background:'linear-gradient(135deg,#10B981,#059669)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'16px', boxShadow:'0 4px 12px rgba(16,185,129,0.4)',
            }}>🏥</div>
            <div style={{ display:'flex', flexDirection:'column', lineHeight:1.1 }}>
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:'14px',
                fontWeight:800, color: t.text, transition:'color 0.3s ease' }}>
                MedLearn Pro
              </span>
              <span style={{ fontSize:'10px', color:'#10B981', fontWeight:700 }}>
                ENSEIGNANT
              </span>
            </div>
          </div>

          {/* ── Desktop : profil + toggle + déconnexion ── */}
          <div className="desktop-ens"
            style={{ alignItems:'center', gap:'10px' }}>
            <ThemeToggle dark={dark} setDark={setDark} />
            <div style={{
              display:'flex', alignItems:'center', gap:'8px',
              background: t.desktopProfBg,
              border:`1px solid ${t.desktopProfBd}`,
              borderRadius:'20px', padding:'6px 12px',
              transition:'all 0.3s ease',
            }}>
              <div style={{ width:'7px', height:'7px', borderRadius:'50%',
                background:'#10B981', animation:'pulse-dot 2s ease-in-out infinite' }} />
              <span style={{ color: t.textSub, fontSize:'12px',
                transition:'color 0.3s ease' }}>{user?.nom}</span>
              <span style={{
                background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)',
                color:'#10B981', fontSize:'10px', fontWeight:700,
                padding:'1px 7px', borderRadius:'8px',
              }}>Enseignant</span>
            </div>
            <button onClick={handleLogout} className="ens-btn"
              style={{
                padding:'7px 14px', borderRadius:'10px',
                background: t.logoutBg, border:`1px solid ${t.logoutBd}`,
                color:'#EF4444', fontSize:'12px', fontWeight:600,
              }}>
              Déconnexion
            </button>
          </div>

          {/* ── Mobile/Tablette : toggle + burger ── */}
          <div className="burger-ens"
            style={{ alignItems:'center', gap:'8px' }}>
            <ThemeToggle dark={dark} setDark={setDark} />
            <button
              onClick={() => setMenuOuvert(!menuOuvert)}
              className="ens-btn"
              style={{
                width:'36px', height:'36px', borderRadius:'10px',
                background: menuOuvert ? 'rgba(16,185,129,0.15)' : t.burgerBg,
                border:`1px solid ${menuOuvert ? 'rgba(16,185,129,0.3)' : t.burgerBorder}`,
                color: t.text, fontSize:'18px',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all 0.3s ease',
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
              transition:'all 0.3s ease',
            }}>
              <div style={{
                width:'38px', height:'38px', borderRadius:'11px', flexShrink:0,
                background:'linear-gradient(135deg,#10B981,#059669)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px',
              }}>👨‍🏫</div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ color: t.text, fontSize:'14px', fontWeight:600,
                  margin:0, fontFamily:"'Syne',sans-serif",
                  overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                  transition:'color 0.3s ease' }}>
                  {user?.nom}
                </p>
                <p style={{ color: t.textSub, fontSize:'11px', margin:0,
                  transition:'color 0.3s ease' }}>{user?.email}</p>
              </div>
              <span style={{
                background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)',
                color:'#10B981', fontSize:'10px', fontWeight:700,
                padding:'2px 8px', borderRadius:'8px', flexShrink:0,
              }}>Enseignant</span>
            </div>

            {/* Déconnexion */}
            <button onClick={handleLogout} className="ens-btn"
              style={{
                width:'100%', padding:'11px', borderRadius:'12px',
                background: t.logoutBg, border:`1px solid ${t.logoutBd}`,
                color:'#EF4444', fontSize:'13px', fontWeight:700,
                fontFamily:"'Syne',sans-serif",
              }}>
              🚪 Déconnexion
            </button>
          </div>
        )}
      </nav>

      {/* ── CONTENU ────────────────────────────────────────────────────── */}
      <div style={{ padding:'20px 16px 80px', maxWidth:'1100px',
        margin:'0 auto', position:'relative', zIndex:1 }}>

        {/* Hero */}
        <div style={{ marginBottom:'24px', animation:'slideUp 0.5s ease both' }}>
          <p style={{ color: t.textSub, fontSize:'13px', margin:'0 0 4px',
            transition:'color 0.3s ease' }}>👋 Bienvenue</p>
          <h1 style={{
            fontFamily:"'Syne',sans-serif", fontSize:'clamp(20px,5vw,28px)',
            fontWeight:800, margin:'0 0 4px',
            background: t.titleGrad,
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            transition:'all 0.3s ease',
          }}>
            {user?.nom} 👨‍🏫
          </h1>
          <p style={{ color: t.textMuted, fontSize:'12px', margin:0,
            transition:'color 0.3s ease' }}>
            Gérez vos cours et laissez l'IA générer le contenu pédagogique
          </p>
        </div>

        {/* CTA principal */}
        <div style={{ marginBottom:'24px',
          animation:'slideUp 0.5s ease 0.05s both', opacity:0 }}>
          <div style={{
            background: t.ctaBg, border:`1px solid ${t.ctaBorder}`,
            borderRadius:'24px', padding:'20px',
            display:'flex', alignItems:'center', gap:'16px', flexWrap:'wrap',
            transition:'all 0.3s ease',
          }}>
            <div style={{ fontSize:'48px', animation:'float 3s ease-in-out infinite',
              filter:'drop-shadow(0 0 20px rgba(16,185,129,0.4))' }}>🤖</div>
            <div style={{ flex:1, minWidth:'180px' }}>
              <h2 style={{ fontFamily:"'Syne',sans-serif",
                fontSize:'clamp(15px,4vw,20px)', fontWeight:800,
                color: t.text, margin:'0 0 4px', transition:'color 0.3s ease' }}>
                Déposer un nouveau cours
              </h2>
              <p style={{ color: t.textSub, fontSize:'clamp(11px,3vw,13px)',
                margin:0, lineHeight:1.5, transition:'color 0.3s ease' }}>
                L'IA génère automatiquement QCM, cas cliniques et annotations anatomiques
              </p>
            </div>
            <button onClick={() => navigate('/enseignant/depot')} className="ens-btn"
              style={{
                padding:'12px 24px', borderRadius:'16px', border:'none',
                background:'linear-gradient(135deg,#10B981,#059669)',
                color:'white', fontSize:'14px', fontWeight:700,
                fontFamily:"'Syne',sans-serif",
                boxShadow:'0 8px 24px rgba(16,185,129,0.4)', whiteSpace:'nowrap',
              }}>
              ✨ Nouveau cours
            </button>
          </div>
        </div>

        {/* STATS */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)',
          gap:'10px', marginBottom:'24px' }}>
          {stats.map((s, i) => (
            <div key={i} className="ens-card"
              style={{
                background: dark ? s.bg : 'rgba(255,255,255,0.9)',
                border:`1px solid ${dark ? s.border : t.statBorder || 'rgba(0,0,0,0.07)'}`,
                borderRadius:'18px', padding:'14px',
                boxShadow: t.cardShadow,
                animation:`slideUp 0.5s ease ${0.1+i*0.07}s both`, opacity:0,
                transition:'all 0.3s ease',
              }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                <span style={{ fontSize:'20px' }}>{s.icon}</span>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%',
                  background:s.color, boxShadow:`0 0 6px ${s.color}` }} />
              </div>
              <div style={{
                fontFamily:"'Syne',sans-serif", fontSize:'24px',
                fontWeight:800, color:s.color,
                animation:`countUp 0.6s cubic-bezier(0.34,1.56,0.64,1) ${0.2+i*0.1}s both`,
              }}>{s.valeur}</div>
              <div style={{ color: t.textSub, fontSize:'10px', marginTop:'2px',
                fontWeight:600, transition:'color 0.3s ease' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* MES COURS */}
        <div>
          <div style={{ display:'flex', alignItems:'center',
            justifyContent:'space-between', marginBottom:'14px' }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'15px',
              fontWeight:800, color: t.text, margin:0,
              transition:'color 0.3s ease' }}>Mes cours</h2>
            <button onClick={() => navigate('/enseignant/depot')} className="ens-btn"
              style={{
                padding:'6px 14px', borderRadius:'10px',
                background: t.nouveauBg, border:`1px solid ${t.nouveauBd}`,
                color:'#10B981', fontSize:'12px', fontWeight:700,
              }}>
              + Nouveau
            </button>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {coursRecents.map((c, i) => (
              <div key={i} className="ens-card"
                style={{
                  background: t.cardBg, border:`1px solid ${t.cardBorder}`,
                  borderRadius:'20px', padding:'14px 16px',
                  boxShadow: t.cardShadow,
                  animation:`slideUp 0.5s ease ${0.3+i*0.08}s both`, opacity:0,
                  transition:'background 0.3s ease, border-color 0.3s ease',
                }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  {/* Icône */}
                  <div style={{
                    width:'44px', height:'44px', borderRadius:'13px', flexShrink:0,
                    background:`${c.color}18`, border:`1px solid ${c.color}30`,
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px',
                  }}>{c.icon}</div>

                  {/* Infos */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center',
                      gap:'6px', marginBottom:'3px', flexWrap:'wrap' }}>
                      <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:'13px',
                        fontWeight:800, color: t.text, margin:0,
                        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                        transition:'color 0.3s ease' }}>
                        {c.titre}
                      </h3>
                      <span style={{
                        fontSize:'9px', fontWeight:700, padding:'2px 7px',
                        borderRadius:'6px', flexShrink:0,
                        background: c.statut === 'publié'
                          ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                        border: c.statut === 'publié'
                          ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)',
                        color: c.statut === 'publié' ? '#10B981' : '#F59E0B',
                      }}>{c.statut}</span>
                    </div>
                    <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'10px', color: t.textSub,
                        transition:'color 0.3s ease' }}>
                        📝 {c.quiz} quiz
                      </span>
                      <span style={{ fontSize:'10px', color: t.textSub,
                        transition:'color 0.3s ease' }}>
                        🩺 {c.cas} cas
                      </span>
                      <span style={{ fontSize:'10px', color: t.textMuted,
                        transition:'color 0.3s ease' }}>· {c.date}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display:'flex', gap:'6px', flexShrink:0 }}>
                    <button className="ens-btn"
                      style={{ width:'30px', height:'30px', borderRadius:'9px',
                        background: t.editBg, border:`1px solid ${t.editBd}`,
                        color:'#A5B4FC', fontSize:'13px',
                        display:'flex', alignItems:'center', justifyContent:'center' }}>
                      ✏️
                    </button>
                    <button className="ens-btn"
                      style={{ width:'30px', height:'30px', borderRadius:'9px',
                        background: t.deleteBg, border:`1px solid ${t.deleteBd}`,
                        color:'#FCA5A5', fontSize:'13px',
                        display:'flex', alignItems:'center', justifyContent:'center' }}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}