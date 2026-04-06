import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes slideUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes slideIn {
    from { opacity:0; transform:translateX(-20px); }
    to   { opacity:1; transform:translateX(0); }
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
  @keyframes shimmer {
    0%   { background-position:-200% center; }
    100% { background-position:200% center; }
  }
  @keyframes gradientMove {
    0%,100% { background-position:0% 50%; }
    50%      { background-position:100% 50%; }
  }
  @keyframes rotate-slow {
    from { transform:rotate(0deg); }
    to   { transform:rotate(360deg); }
  }
  @keyframes fadeIn {
    from { opacity:0; }
    to   { opacity:1; }
  }

  .module-card {
    transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);
    cursor:pointer; position:relative; overflow:hidden;
  }
  .module-card:hover {
    transform:translateY(-6px) scale(1.02);
  }
  .module-card::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg,rgba(255,255,255,0.08),transparent);
    opacity:0; transition:opacity 0.3s ease;
  }
  .module-card:hover::before { opacity:1; }

  .stat-card {
    transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .stat-card:hover { transform:translateY(-3px) scale(1.03); }

  .nav-btn {
    font-family:'DM Sans',sans-serif;
    transition:all 0.2s ease; cursor:pointer;
  }
  .nav-btn:hover { transform:translateY(-1px); }
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
    glow:'rgba(99,102,241,0.4)',
    tag:'8 spécialités',
  },
  {
    titre:'Cas Cliniques', description:'Patients virtuels et arbre diagnostique complet',
    icon:'🩺', lien:'/cas-cliniques', dispo:true,
    gradient:'linear-gradient(135deg,#8B5CF6 0%,#EC4899 100%)',
    glow:'rgba(139,92,246,0.4)',
    tag:'3 cas disponibles',
  },
  {
    titre:'Anatomie 3D', description:'Visualisation interactive des organes en temps réel',
    icon:'🧬', lien:'/anatomie', dispo:true,
    gradient:'linear-gradient(135deg,#14B8A6 0%,#3B82F6 100%)',
    glow:'rgba(20,184,166,0.4)',
    tag:'5 organes · WebGL',
  },
]

const activite = [
  { titre:'Quiz Cardiologie', score:'8/10', date:"Aujourd'hui", icon:'❤️', color:'#EF4444' },
  { titre:'Quiz Neurologie', score:'6/10', date:'Hier', icon:'🧠', color:'#8B5CF6' },
  { titre:'Cas Clinique #2', score:'90%', date:'Il y a 2j', icon:'🩺', color:'#6366F1' },
  { titre:'Anatomie – Cœur', score:'—', date:'Il y a 3j', icon:'🧬', color:'#14B8A6' },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOuvert, setMenuOuvert] = useState(false)
  const [heure, setHeure] = useState('')

  useEffect(() => {
    const s = document.createElement('style')
    s.textContent = globalStyles
    document.head.appendChild(s)

    const h = new Date().getHours()
    setHeure(h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir')

    return () => document.head.removeChild(s)
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(160deg,#080818 0%,#0d1b2e 40%,#0a0f1e 100%)',
      fontFamily:"'DM Sans',sans-serif", position:'relative', overflow:'hidden',
    }}>

      {/* Décors de fond */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'500px', height:'500px',
          borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 65%)' }} />
        <div style={{ position:'absolute', bottom:'-100px', left:'-80px', width:'450px', height:'450px',
          borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 65%)' }} />
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:`linear-gradient(rgba(99,102,241,0.025) 1px,transparent 1px),
            linear-gradient(90deg,rgba(99,102,241,0.025) 1px,transparent 1px)`,
          backgroundSize:'60px 60px',
        }} />
      </div>

      {/* ── NAVBAR ────────────────────────────────────────────────────────── */}
      <nav style={{
        position:'sticky', top:0, zIndex:100,
        background:'rgba(8,8,24,0.85)', backdropFilter:'blur(24px)',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
        padding:'0 20px',
      }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto', height:'60px',
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>

          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{
              width:'36px', height:'36px', borderRadius:'10px',
              background:'linear-gradient(135deg,#6366F1,#8B5CF6)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'18px', boxShadow:'0 4px 16px rgba(99,102,241,0.4)',
            }}>🏥</div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:'16px',
              fontWeight:800, color:'white' }}>MedLearn Pro</span>
          </div>

          {/* Desktop actions */}
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px',
              background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:'20px', padding:'6px 12px' }}>
              <div style={{ width:'8px', height:'8px', borderRadius:'50%',
                background:'#10B981', animation:'pulse-dot 2s ease-in-out infinite' }} />
              <span style={{ color:'rgba(255,255,255,0.6)', fontSize:'12px',
                fontFamily:"'DM Sans',sans-serif" }}>{user?.nom}</span>
              <span style={{ background:'rgba(99,102,241,0.2)', border:'1px solid rgba(99,102,241,0.3)',
                color:'#A5B4FC', fontSize:'10px', fontWeight:700, padding:'1px 7px',
                borderRadius:'8px', textTransform:'capitalize' }}>{user?.role}</span>
            </div>
            <button onClick={handleLogout} className="nav-btn"
              style={{ padding:'7px 14px', borderRadius:'10px', border:'1px solid rgba(239,68,68,0.25)',
                background:'rgba(239,68,68,0.1)', color:'#FCA5A5', fontSize:'12px', fontWeight:600 }}>
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      {/* ── CONTENU ───────────────────────────────────────────────────────── */}
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'28px 20px 60px', position:'relative', zIndex:1 }}>

        {/* Hero salutation */}
        <div style={{ marginBottom:'28px', animation:'slideUp 0.5s ease both' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px' }}>
            <span style={{ fontSize:'24px' }}>👋</span>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'14px', margin:0 }}>{heure}</p>
          </div>
          <h1 style={{
            fontFamily:"'Syne',sans-serif", fontSize:'clamp(22px,5vw,32px)',
            fontWeight:800, margin:'0 0 4px',
            background:'linear-gradient(135deg,#ffffff 0%,#a5b4fc 60%,#c4b5fd 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>
            {user?.nom?.split(' ')[0] || 'Étudiant'} 🎓
          </h1>
          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'13px', margin:0 }}>
            Continuez votre formation médicale
          </p>
        </div>

        {/* ── STATS ─────────────────────────────────────────────────────── */}
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(2,1fr)',
          gap:'10px', marginBottom:'28px',
        }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card"
              style={{
                background: s.bg, border:`1px solid ${s.border}`,
                borderRadius:'20px', padding:'16px',
                animation:`slideUp 0.5s ease ${i*0.08}s both`, opacity:0,
              }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
                <span style={{ fontSize:'22px' }}>{s.icon}</span>
                <div style={{ width:'6px', height:'6px', borderRadius:'50%',
                  background: s.color, boxShadow:`0 0 8px ${s.color}` }} />
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'26px',
                fontWeight:800, color: s.color,
                animation:`countUp 0.6s cubic-bezier(0.34,1.56,0.64,1) ${0.2+i*0.1}s both` }}>
                {s.valeur}
              </div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px',
                marginTop:'3px', fontWeight:600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── MODULES ───────────────────────────────────────────────────── */}
        <div style={{ marginBottom:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'16px',
              fontWeight:800, color:'white', margin:0 }}>Modules</h2>
            <span style={{ color:'rgba(255,255,255,0.25)', fontSize:'12px' }}>
              {modules.filter(m=>m.dispo).length}/{modules.length} actifs
            </span>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {modules.map((m, i) => (
              <div key={i} onClick={() => m.dispo && navigate(m.lien)}
                className="module-card"
                style={{
                  background:`linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))`,
                  border:'1px solid rgba(255,255,255,0.08)',
                  borderRadius:'22px', padding:'18px 20px',
                  animation:`slideUp 0.5s ease ${0.2+i*0.1}s both`, opacity:0,
                  opacity: m.dispo ? 1 : 0.5,
                }}>
                <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>

                  {/* Icône avec gradient */}
                  <div style={{
                    width:'52px', height:'52px', borderRadius:'16px', flexShrink:0,
                    background: m.gradient,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'24px',
                    boxShadow:`0 8px 24px ${m.glow}`,
                  }}>
                    {m.icon}
                  </div>

                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'3px' }}>
                      <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:'15px',
                        fontWeight:800, color:'white', margin:0 }}>{m.titre}</h3>
                      <span style={{
                        fontSize:'9px', fontWeight:700, padding:'2px 8px', borderRadius:'8px',
                        background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)',
                      }}>{m.tag}</span>
                    </div>
                    <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'12px', margin:0 }}>
                      {m.description}
                    </p>
                  </div>

                  <div style={{
                    width:'32px', height:'32px', borderRadius:'10px', flexShrink:0,
                    background: m.dispo ? m.gradient : 'rgba(255,255,255,0.06)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'14px', boxShadow: m.dispo ? `0 4px 16px ${m.glow}` : 'none',
                  }}>
                    {m.dispo ? '→' : '🔒'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ACTIVITÉ RÉCENTE ──────────────────────────────────────────── */}
        <div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'16px',
            fontWeight:800, color:'white', margin:'0 0 14px' }}>Activité récente</h2>

          <div style={{
            background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
            borderRadius:'22px', overflow:'hidden',
            animation:'slideUp 0.5s ease 0.5s both', opacity:0,
          }}>
            {activite.map((a, i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:'12px',
                padding:'14px 18px',
                borderBottom: i < activite.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                transition:'background 0.2s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                <div style={{
                  width:'38px', height:'38px', borderRadius:'12px', flexShrink:0,
                  background:`${a.color}18`, border:`1px solid ${a.color}30`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px',
                }}>
                  {a.icon}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:'13px', fontWeight:600, color:'rgba(255,255,255,0.85)',
                    margin:'0 0 2px' }}>{a.titre}</p>
                  <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.3)', margin:0 }}>{a.date}</p>
                </div>
                <span style={{
                  fontSize:'12px', fontWeight:700, padding:'4px 12px', borderRadius:'10px',
                  background:`${a.color}18`, border:`1px solid ${a.color}25`,
                  color: a.color,
                }}>{a.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}