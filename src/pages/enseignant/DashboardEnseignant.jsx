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
  .ens-card {
    transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    cursor:pointer;
  }
  .ens-card:hover { transform:translateY(-4px) scale(1.01); }
  .ens-card:active { transform:scale(0.98); }
  .ens-btn {
    transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    cursor:pointer;
  }
  .ens-btn:hover { transform:translateY(-2px); }
  .ens-btn:active { transform:scale(0.97); }
  * { -webkit-tap-highlight-color:transparent; }
`

const stats = [
  { label:'Cours déposés', valeur:4, icon:'📚', color:'#6366F1', bg:'rgba(99,102,241,0.12)', border:'rgba(99,102,241,0.25)' },
  { label:'Quiz générés', valeur:38, icon:'📝', color:'#10B981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.25)' },
  { label:'Cas cliniques', valeur:8, icon:'🩺', color:'#8B5CF6', bg:'rgba(139,92,246,0.12)', border:'rgba(139,92,246,0.25)' },
  { label:'Étudiants actifs', valeur:124, icon:'👨‍⚕️', color:'#F59E0B', bg:'rgba(245,158,11,0.12)', border:'rgba(245,158,11,0.25)' },
]

const coursRecents = [
  {
    titre:'Cardiologie — Insuffisance cardiaque',
    date:'Aujourd\'hui', statut:'publié',
    quiz:10, cas:2, icon:'❤️', color:'#EF4444',
  },
  {
    titre:'Neurologie — AVC ischémique',
    date:'Il y a 2j', statut:'publié',
    quiz:8, cas:1, icon:'🧠', color:'#8B5CF6',
  },
  {
    titre:'Infectiologie — Paludisme',
    date:'Il y a 5j', statut:'brouillon',
    quiz:6, cas:1, icon:'🦠', color:'#F59E0B',
  },
  {
    titre:'Pharmacologie — Antibiotiques',
    date:'Il y a 1sem', statut:'publié',
    quiz:14, cas:3, icon:'💊', color:'#10B981',
  },
]

export default function DashboardEnseignant() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOuvert, setMenuOuvert] = useState(false)

  useEffect(() => {
    const s = document.createElement('style')
    s.textContent = globalStyles
    document.head.appendChild(s)
    return () => document.head.removeChild(s)
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(160deg,#080818 0%,#0d1b2e 50%,#0a0f1e 100%)',
      fontFamily:"'DM Sans',sans-serif", position:'relative',
    }}>
      {/* Fond décoratif */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'350px', height:'350px',
          borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,0.1) 0%,transparent 65%)' }} />
        <div style={{ position:'absolute', bottom:'-80px', left:'-60px', width:'300px', height:'300px',
          borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 65%)' }} />
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:`linear-gradient(rgba(16,185,129,0.025) 1px,transparent 1px),
            linear-gradient(90deg,rgba(16,185,129,0.025) 1px,transparent 1px)`,
          backgroundSize:'50px 50px',
        }} />
      </div>

      {/* NAVBAR */}
      <nav style={{
        position:'sticky', top:0, zIndex:100,
        background:'rgba(8,8,24,0.9)', backdropFilter:'blur(24px)',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 16px', height:'56px', maxWidth:'1100px', margin:'0 auto' }}>

          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{
              width:'32px', height:'32px', borderRadius:'9px',
              background:'linear-gradient(135deg,#10B981,#059669)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'16px', boxShadow:'0 4px 12px rgba(16,185,129,0.4)',
            }}>🏥</div>
            <div>
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:'14px',
                fontWeight:800, color:'white' }}>MedLearn Pro</span>
              <span style={{ fontSize:'10px', color:'#10B981', marginLeft:'6px',
                fontWeight:700 }}>ENSEIGNANT</span>
            </div>
          </div>

          {/* Desktop */}
          <div style={{ display:'none' }} className="desktop-nav">
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px',
                background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)',
                borderRadius:'20px', padding:'6px 12px' }}>
                <div style={{ width:'7px', height:'7px', borderRadius:'50%',
                  background:'#10B981', animation:'pulse-dot 2s ease-in-out infinite' }} />
                <span style={{ color:'rgba(255,255,255,0.6)', fontSize:'12px' }}>{user?.nom}</span>
                <span style={{ background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)',
                  color:'#10B981', fontSize:'10px', fontWeight:700,
                  padding:'1px 7px', borderRadius:'8px' }}>Enseignant</span>
              </div>
              <button onClick={handleLogout} className="ens-btn"
                style={{ padding:'7px 14px', borderRadius:'10px',
                  border:'1px solid rgba(239,68,68,0.25)', background:'rgba(239,68,68,0.1)',
                  color:'#FCA5A5', fontSize:'12px', fontWeight:600 }}>
                Déconnexion
              </button>
            </div>
          </div>

          {/* Mobile burger */}
          <button onClick={() => setMenuOuvert(!menuOuvert)} className="ens-btn"
            style={{ width:'36px', height:'36px', borderRadius:'10px',
              background: menuOuvert ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
              border:`1px solid ${menuOuvert ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
              color:'white', fontSize:'18px',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
            {menuOuvert ? '✕' : '☰'}
          </button>
        </div>

        {/* Menu mobile */}
        {menuOuvert && (
          <div style={{ background:'rgba(8,8,24,0.97)', backdropFilter:'blur(20px)',
            borderTop:'1px solid rgba(255,255,255,0.06)', padding:'12px 16px 16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px',
              background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:'14px', padding:'12px 14px', marginBottom:'10px' }}>
              <div style={{ width:'38px', height:'38px', borderRadius:'11px',
                background:'linear-gradient(135deg,#10B981,#059669)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>
                👨‍🏫
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ color:'white', fontSize:'14px', fontWeight:600,
                  margin:0, fontFamily:"'Syne',sans-serif" }}>{user?.nom}</p>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px', margin:0 }}>
                  {user?.email}
                </p>
              </div>
              <span style={{ background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)',
                color:'#10B981', fontSize:'10px', fontWeight:700,
                padding:'2px 8px', borderRadius:'8px' }}>Enseignant</span>
            </div>
            <button onClick={handleLogout} className="ens-btn"
              style={{ width:'100%', padding:'11px', borderRadius:'12px',
                background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)',
                color:'#EF4444', fontSize:'13px', fontWeight:700,
                fontFamily:"'Syne',sans-serif" }}>
              🚪 Déconnexion
            </button>
          </div>
        )}
      </nav>

      {/* CONTENU */}
      <div style={{ padding:'20px 16px 80px', maxWidth:'1100px',
        margin:'0 auto', position:'relative', zIndex:1 }}>

        {/* Hero */}
        <div style={{ marginBottom:'24px', animation:'slideUp 0.5s ease both' }}>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px', margin:'0 0 4px' }}>
            👋 Bienvenue
          </p>
          <h1 style={{
            fontFamily:"'Syne',sans-serif", fontSize:'clamp(20px,5vw,28px)',
            fontWeight:800, margin:'0 0 4px',
            background:'linear-gradient(135deg,#ffffff 0%,#6EE7B7 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>
            {user?.nom} 👨‍🏫
          </h1>
          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'12px', margin:0 }}>
            Gérez vos cours et laissez l'IA générer le contenu pédagogique
          </p>
        </div>

        {/* CTA principal */}
        <div style={{ marginBottom:'24px', animation:'slideUp 0.5s ease 0.05s both', opacity:0 }}>
          <div style={{
            background:'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(99,102,241,0.15))',
            border:'1px solid rgba(16,185,129,0.25)', borderRadius:'24px', padding:'20px',
            display:'flex', alignItems:'center', gap:'16px', flexWrap:'wrap',
          }}>
            <div style={{ fontSize:'48px', animation:'float 3s ease-in-out infinite',
              filter:'drop-shadow(0 0 20px rgba(16,185,129,0.4))' }}>🤖</div>
            <div style={{ flex:1, minWidth:'200px' }}>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(15px,4vw,20px)',
                fontWeight:800, color:'white', margin:'0 0 4px' }}>
                Déposer un nouveau cours
              </h2>
              <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'clamp(11px,3vw,13px)',
                margin:0, lineHeight:1.5 }}>
                L'IA génère automatiquement des QCM, cas cliniques et annotations anatomiques
              </p>
            </div>
            <button onClick={() => navigate('/enseignant/depot')} className="ens-btn"
              style={{
                padding:'12px 24px', borderRadius:'16px', border:'none',
                background:'linear-gradient(135deg,#10B981,#059669)',
                color:'white', fontSize:'14px', fontWeight:700,
                fontFamily:"'Syne',sans-serif",
                boxShadow:'0 8px 24px rgba(16,185,129,0.4)',
                whiteSpace:'nowrap',
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
                background: s.bg, border:`1px solid ${s.border}`,
                borderRadius:'18px', padding:'14px',
                animation:`slideUp 0.5s ease ${0.1+i*0.07}s both`, opacity:0,
              }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                <span style={{ fontSize:'20px' }}>{s.icon}</span>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%',
                  background:s.color, boxShadow:`0 0 6px ${s.color}` }} />
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'24px',
                fontWeight:800, color:s.color }}>{s.valeur}</div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'10px',
                marginTop:'2px', fontWeight:600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* COURS RÉCENTS */}
        <div>
          <div style={{ display:'flex', alignItems:'center',
            justifyContent:'space-between', marginBottom:'14px' }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'15px',
              fontWeight:800, color:'white', margin:0 }}>Mes cours</h2>
            <button onClick={() => navigate('/enseignant/depot')} className="ens-btn"
              style={{ padding:'6px 14px', borderRadius:'10px', border:'none',
                background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.25)',
                color:'#10B981', fontSize:'12px', fontWeight:700 }}>
              + Nouveau
            </button>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {coursRecents.map((c, i) => (
              <div key={i} className="ens-card"
                style={{
                  background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
                  borderRadius:'20px', padding:'14px 16px',
                  animation:`slideUp 0.5s ease ${0.3+i*0.08}s both`, opacity:0,
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
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'3px' }}>
                      <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:'13px',
                        fontWeight:800, color:'white', margin:0,
                        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {c.titre}
                      </h3>
                      <span style={{
                        fontSize:'9px', fontWeight:700, padding:'2px 7px', borderRadius:'6px',
                        flexShrink:0,
                        background: c.statut === 'publié'
                          ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                        border: c.statut === 'publié'
                          ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)',
                        color: c.statut === 'publié' ? '#10B981' : '#F59E0B',
                      }}>{c.statut}</span>
                    </div>

                    {/* Tags IA */}
                    <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'10px', color:'rgba(255,255,255,0.4)',
                        display:'flex', alignItems:'center', gap:'3px' }}>
                        📝 {c.quiz} quiz
                      </span>
                      <span style={{ fontSize:'10px', color:'rgba(255,255,255,0.4)',
                        display:'flex', alignItems:'center', gap:'3px' }}>
                        🩺 {c.cas} cas
                      </span>
                      <span style={{ fontSize:'10px', color:'rgba(255,255,255,0.3)' }}>
                        · {c.date}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display:'flex', gap:'6px', flexShrink:0 }}>
                    <button className="ens-btn"
                      style={{ width:'30px', height:'30px', borderRadius:'9px',
                        background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.25)',
                        color:'#A5B4FC', fontSize:'13px',
                        display:'flex', alignItems:'center', justifyContent:'center' }}>
                      ✏️
                    </button>
                    <button className="ens-btn"
                      style={{ width:'30px', height:'30px', borderRadius:'9px',
                        background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)',
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