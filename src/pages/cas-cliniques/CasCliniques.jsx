import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { casCliniques } from '../../services/casCliniquesData'

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes slideUp {
    from { opacity:0; transform:translateY(30px); }
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
  @keyframes pulse {
    0%,100% { opacity:1; }
    50%      { opacity:0.5; }
  }
  @keyframes correctPop {
    0%  { transform:scale(1); }
    40% { transform:scale(1.03); }
    100%{ transform:scale(1); }
  }
  @keyframes wrongShake {
    0%,100%{ transform:translateX(0); }
    25%    { transform:translateX(-6px); }
    75%    { transform:translateX(6px); }
  }

  .cas-btn {
    font-family:'DM Sans',sans-serif;
    transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);
    cursor:pointer;
  }
  .cas-btn:hover { transform:translateY(-2px); }
  .cas-btn:active{ transform:scale(0.97); }

  .option-card {
    font-family:'DM Sans',sans-serif;
    transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    cursor:pointer;
  }
  .option-card:hover:not(.done){
    transform:translateX(5px);
    border-color:rgba(139,92,246,0.6) !important;
    background:rgba(139,92,246,0.08) !important;
  }
`

function Particles() {
  return (
    <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      {[...Array(15)].map((_, i) => (
        <div key={i} style={{
          position:'absolute',
          width:`${Math.random()*5+2}px`, height:`${Math.random()*5+2}px`,
          borderRadius:'50%',
          background:`rgba(139,92,246,${Math.random()*0.15+0.05})`,
          left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
          animation:`pulse ${Math.random()*4+4}s ease-in-out infinite`,
          animationDelay:`${Math.random()*4}s`,
        }} />
      ))}
    </div>
  )
}

const diffColors = {
  facile:   { bg:'rgba(16,185,129,0.15)',  text:'#10B981', border:'rgba(16,185,129,0.3)' },
  moyen:    { bg:'rgba(245,158,11,0.15)',  text:'#F59E0B', border:'rgba(245,158,11,0.3)' },
  difficile:{ bg:'rgba(239,68,68,0.15)',   text:'#EF4444', border:'rgba(239,68,68,0.3)' },
}

export default function CasCliniques() {
  const navigate = useNavigate()
  const [etape, setEtape]               = useState('liste')      // liste | intro | cas | resultat
  const [casChoisi, setCasChoisi]       = useState(null)
  const [etapeIndex, setEtapeIndex]     = useState(0)
  const [reponse, setReponse]           = useState(null)         // index choisi
  const [showFeedback, setShowFeedback] = useState(false)
  const [scoreTotal, setScoreTotal]     = useState(0)
  const [scoreMax, setScoreMax]         = useState(0)
  const [historique, setHistorique]     = useState([])
  const [animKey, setAnimKey]           = useState(0)

  useEffect(() => {
    const s = document.createElement('style')
    s.textContent = globalStyles
    document.head.appendChild(s)
    return () => document.head.removeChild(s)
  }, [])

  const demarrerCas = (cas) => {
    setCasChoisi(cas)
    setEtapeIndex(0)
    setReponse(null)
    setShowFeedback(false)
    setScoreTotal(0)
    setHistorique([])
    const max = cas.etapes.reduce((acc, e) =>
      acc + Math.max(...e.options.map(o => o.points)), 0)
    setScoreMax(max)
    setAnimKey(k => k + 1)
    setEtape('intro')
  }

  const choisirReponse = (i) => {
    if (reponse !== null) return
    const etapeCourante = casChoisi.etapes[etapeIndex]
    const opt = etapeCourante.options[i]
    setReponse(i)
    setScoreTotal(s => s + opt.points)
    setHistorique(h => [...h, {
      etape: etapeCourante,
      reponseIndex: i,
      reponse: opt,
    }])
    setTimeout(() => setShowFeedback(true), 350)
  }

  const etapeSuivante = () => {
    setShowFeedback(false)
    setTimeout(() => {
      if (etapeIndex + 1 >= casChoisi.etapes.length) {
        setEtape('resultat')
      } else {
        setEtapeIndex(i => i + 1)
        setReponse(null)
        setAnimKey(k => k + 1)
      }
    }, 200)
  }

  const pourcentage = scoreMax > 0 ? Math.round((scoreTotal / scoreMax) * 100) : 0
  const mention = () => {
    if (pourcentage >= 80) return { texte:'Expert clinicien !', emoji:'🏆', color:'#10B981' }
    if (pourcentage >= 60) return { texte:'Bon raisonnement', emoji:'👍', color:'#3B82F6' }
    if (pourcentage >= 40) return { texte:'À approfondir', emoji:'📚', color:'#F59E0B' }
    return { texte:'Révise ce cas', emoji:'💪', color:'#EF4444' }
  }

  // ── LISTE ─────────────────────────────────────────────────────────────────
  if (etape === 'liste') return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg, #1a0533 0%, #2d1b69 40%, #1a0a3e 100%)',
      fontFamily:"'DM Sans',sans-serif", position:'relative', overflow:'hidden',
    }}>
      <Particles />
      <div style={{ position:'fixed', top:'-80px', right:'-80px', width:'350px', height:'350px',
        borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.2) 0%,transparent 70%)',
        pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'-100px', left:'-60px', width:'400px', height:'400px',
        borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)',
        pointerEvents:'none' }} />

      {/* Navbar */}
      <nav style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:'12px' }}>
        <button onClick={() => navigate('/dashboard')} className="cas-btn"
          style={{ width:'40px', height:'40px', borderRadius:'12px',
            border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.08)',
            color:'white', fontSize:'18px', display:'flex', alignItems:'center', justifyContent:'center' }}>
          ←
        </button>
        <span style={{ color:'rgba(255,255,255,0.6)', fontSize:'14px' }}>Cas Cliniques</span>
      </nav>

      {/* Hero */}
      <div style={{ textAlign:'center', padding:'16px 20px 32px',
        animation:'slideUp 0.5s ease both' }}>
        <div style={{ fontSize:'64px', marginBottom:'12px',
          filter:'drop-shadow(0 0 30px rgba(139,92,246,0.5))' }}>🩺</div>
        <h1 style={{
          fontFamily:"'Syne',sans-serif", fontSize:'clamp(26px,6vw,40px)', fontWeight:800,
          margin:'0 0 8px',
          background:'linear-gradient(135deg,#ffffff 0%,#c4b5fd 50%,#a78bfa 100%)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        }}>Cas Cliniques</h1>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'14px', margin:0 }}>
          Raisonnement clinique · Diagnostic · Thérapeutique
        </p>
      </div>

      {/* Cards cas */}
      <div style={{ maxWidth:'560px', margin:'0 auto', padding:'0 16px 40px' }}>
        {casCliniques.map((cas, i) => {
          const dc = diffColors[cas.difficulte]
          return (
            <div key={cas.id} style={{
              background:'rgba(255,255,255,0.06)', backdropFilter:'blur(12px)',
              border:'1px solid rgba(255,255,255,0.1)', borderRadius:'24px',
              padding:'20px', marginBottom:'14px', cursor:'pointer',
              animation:`slideUp 0.5s ease ${i*0.1}s both`,
              transition:'all 0.3s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'
                e.currentTarget.style.background = 'rgba(139,92,246,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              }}
              onClick={() => demarrerCas(cas)}
            >
              <div style={{ display:'flex', alignItems:'flex-start', gap:'14px' }}>
                <div style={{
                  width:'52px', height:'52px', borderRadius:'16px', flexShrink:0,
                  background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.3)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px',
                }}>
                  {cas.icon}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px', flexWrap:'wrap' }}>
                    <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:'15px', fontWeight:700,
                      color:'white', margin:0 }}>{cas.titre}</h3>
                    <span style={{ fontSize:'10px', fontWeight:700, padding:'2px 10px', borderRadius:'20px',
                      background: dc.bg, border:`1px solid ${dc.border}`, color: dc.text,
                      textTransform:'capitalize' }}>
                      {cas.difficulte}
                    </span>
                  </div>
                  <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'12px', margin:'0 0 10px' }}>
                    {cas.specialite} · {cas.patient.age} ans · {cas.patient.sexe}
                  </p>
                  <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'12px', margin:'0 0 12px',
                    lineHeight:1.5 }}>
                    {cas.presentation.slice(0, 100)}...
                  </p>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', gap:'6px' }}>
                      {cas.etapes.map((_, j) => (
                        <div key={j} style={{ width:'20px', height:'4px', borderRadius:'2px',
                          background:'rgba(139,92,246,0.4)' }} />
                      ))}
                    </div>
                    <span style={{ color:'#A78BFA', fontSize:'12px', fontWeight:600 }}>
                      {cas.etapes.length} étapes →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // ── INTRO PATIENT ─────────────────────────────────────────────────────────
  if (etape === 'intro') return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg,#1a0533 0%,#2d1b69 40%,#1a0a3e 100%)',
      fontFamily:"'DM Sans',sans-serif", position:'relative',
    }}>
      <Particles />
      <nav style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:'12px' }}>
        <button onClick={() => setEtape('liste')} className="cas-btn"
          style={{ width:'40px', height:'40px', borderRadius:'12px',
            border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.08)',
            color:'white', fontSize:'18px', display:'flex', alignItems:'center', justifyContent:'center' }}>
          ←
        </button>
        <span style={{ color:'rgba(255,255,255,0.6)', fontSize:'14px' }}>{casChoisi.titre}</span>
      </nav>

      <div style={{ maxWidth:'560px', margin:'0 auto', padding:'16px 16px 100px' }}>

        {/* Fiche patient */}
        <div style={{ animation:'slideUp 0.5s ease both', marginBottom:'16px' }}>
          <div style={{
            background:'rgba(255,255,255,0.07)', backdropFilter:'blur(12px)',
            border:'1px solid rgba(255,255,255,0.12)', borderRadius:'24px', padding:'24px',
          }}>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px', fontWeight:700,
              letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'16px' }}>
              Fiche patient
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'20px' }}>
              <div style={{
                width:'64px', height:'64px', borderRadius:'20px',
                background:'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(99,102,241,0.3))',
                border:'1px solid rgba(139,92,246,0.4)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px',
              }}>
                {casChoisi.patient.avatar}
              </div>
              <div>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'18px', fontWeight:800,
                  color:'white', margin:'0 0 4px' }}>{casChoisi.patient.nom}</h2>
                <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'13px', margin:0 }}>
                  {casChoisi.patient.age} ans · {casChoisi.patient.sexe} · {casChoisi.patient.profession}
                </p>
              </div>
            </div>

            {/* Constantes */}
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px', fontWeight:700,
              letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'10px' }}>
              Constantes vitales
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'8px', marginBottom:'20px' }}>
              {Object.entries(casChoisi.constantes).map(([k, v]) => {
                const labels = { pa:'Pression artérielle', fc:'Fréquence cardiaque',
                  spo2:'SpO₂', temperature:'Température', fr:'Fréquence respi.' }
                const icons  = { pa:'🩺', fc:'❤️', spo2:'🫁', temperature:'🌡️', fr:'💨' }
                return (
                  <div key={k} style={{
                    background:'rgba(255,255,255,0.05)', borderRadius:'14px', padding:'10px 12px',
                    border:'1px solid rgba(255,255,255,0.08)',
                  }}>
                    <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'10px', margin:'0 0 2px' }}>
                      {icons[k]} {labels[k]}
                    </p>
                    <p style={{ fontFamily:"'Syne',sans-serif", fontSize:'14px', fontWeight:700,
                      color:'white', margin:0 }}>{v}</p>
                  </div>
                )
              })}
            </div>

            {/* Présentation */}
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px', fontWeight:700,
              letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'10px' }}>
              Motif de consultation
            </p>
            <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'14px', lineHeight:1.7,
              margin:0, background:'rgba(139,92,246,0.1)', borderRadius:'14px', padding:'14px',
              border:'1px solid rgba(139,92,246,0.2)' }}>
              {casChoisi.presentation}
            </p>
          </div>
        </div>

        {/* Étapes preview */}
        <div style={{ animation:'slideUp 0.5s ease 0.1s both', opacity:0, marginBottom:'20px' }}>
          <div style={{
            background:'rgba(255,255,255,0.05)', borderRadius:'20px', padding:'16px',
            border:'1px solid rgba(255,255,255,0.08)',
          }}>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px', fontWeight:700,
              letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'12px' }}>
              Déroulement du cas · {casChoisi.etapes.length} étapes
            </p>
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
              {casChoisi.etapes.map((e, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap:'6px',
                  background:'rgba(139,92,246,0.12)', borderRadius:'20px',
                  padding:'6px 12px', border:'1px solid rgba(139,92,246,0.2)',
                }}>
                  <span style={{ fontSize:'14px' }}>{e.icon}</span>
                  <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'12px', fontWeight:600 }}>
                    {e.titre}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bouton démarrer fixé en bas */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'16px',
        background:'linear-gradient(0deg,rgba(26,5,51,1) 0%,transparent 100%)', zIndex:100 }}>
        <div style={{ maxWidth:'560px', margin:'0 auto' }}>
          <button onClick={() => setEtape('cas')} className="cas-btn"
            style={{
              width:'100%', padding:'16px', borderRadius:'18px', border:'none',
              background:'linear-gradient(135deg,#8B5CF6,#6366F1)',
              color:'white', fontSize:'16px', fontWeight:700,
              fontFamily:"'Syne',sans-serif",
              boxShadow:'0 8px 32px rgba(139,92,246,0.4)',
            }}>
            🩺 Commencer le cas clinique
          </button>
        </div>
      </div>
    </div>
  )

  // ── CAS EN COURS ──────────────────────────────────────────────────────────
  if (etape === 'cas') {
    const etapeCourante = casChoisi.etapes[etapeIndex]
    const progression = ((etapeIndex + 1) / casChoisi.etapes.length) * 100

    return (
      <div style={{
        minHeight:'100vh',
        background:'linear-gradient(135deg,#1a0533 0%,#2d1b69 40%,#1a0a3e 100%)',
        fontFamily:"'DM Sans',sans-serif", position:'relative',
      }}>
        <Particles />

        {/* Header sticky */}
        <div style={{
          position:'sticky', top:0, zIndex:50,
          background:'rgba(26,5,51,0.9)', backdropFilter:'blur(20px)',
          borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'12px 16px',
        }}>
          <div style={{ maxWidth:'600px', margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
              <button onClick={() => setEtape('liste')} className="cas-btn"
                style={{ width:'36px', height:'36px', borderRadius:'10px',
                  background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)',
                  color:'white', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                ✕
              </button>

              {/* Steps indicators */}
              <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                {casChoisi.etapes.map((e, i) => (
                  <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'3px' }}>
                    <div style={{
                      width: i === etapeIndex ? '28px' : '24px',
                      height: i === etapeIndex ? '28px' : '24px',
                      borderRadius:'8px',
                      background: i < etapeIndex
                        ? 'rgba(16,185,129,0.8)'
                        : i === etapeIndex
                          ? 'linear-gradient(135deg,#8B5CF6,#6366F1)'
                          : 'rgba(255,255,255,0.1)',
                      border: i === etapeIndex ? '2px solid rgba(139,92,246,0.8)' : 'none',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize: i === etapeIndex ? '12px' : '10px',
                      transition:'all 0.3s ease',
                      boxShadow: i === etapeIndex ? '0 0 12px rgba(139,92,246,0.5)' : 'none',
                    }}>
                      {i < etapeIndex ? '✓' : e.icon}
                    </div>
                  </div>
                ))}
              </div>

              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:'13px', fontWeight:700, color:'white' }}>
                {etapeIndex + 1}<span style={{ color:'rgba(255,255,255,0.35)' }}>/{casChoisi.etapes.length}</span>
              </span>
            </div>

            {/* Barre */}
            <div style={{ height:'3px', background:'rgba(255,255,255,0.08)', borderRadius:'2px', overflow:'hidden' }}>
              <div style={{
                height:'100%', borderRadius:'2px',
                background:'linear-gradient(90deg,#8B5CF6,#6366F1)',
                width:`${progression}%`, transition:'width 0.6s cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow:'0 0 10px rgba(139,92,246,0.6)',
              }} />
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div key={animKey} style={{ maxWidth:'600px', margin:'0 auto', padding:'20px 16px 120px' }}>

          {/* Badge étape */}
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px',
            animation:'slideUp 0.4s ease both' }}>
            <div style={{
              background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.4)',
              borderRadius:'12px', padding:'6px 14px',
              display:'flex', alignItems:'center', gap:'6px',
            }}>
              <span style={{ fontSize:'16px' }}>{etapeCourante.icon}</span>
              <span style={{ color:'#C4B5FD', fontSize:'12px', fontWeight:700,
                fontFamily:"'Syne',sans-serif" }}>
                {etapeCourante.titre}
              </span>
            </div>
            <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px' }}>
              Score : {scoreTotal} pts
            </span>
          </div>

          {/* Question */}
          <div style={{
            background:'rgba(255,255,255,0.07)', backdropFilter:'blur(12px)',
            border:'1px solid rgba(255,255,255,0.12)', borderRadius:'22px', padding:'20px',
            marginBottom:'16px', animation:'slideUp 0.4s ease 0.05s both', opacity:0,
          }}>
            <p style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(14px,3.5vw,17px)',
              fontWeight:700, color:'white', margin:0, lineHeight:1.5 }}>
              {etapeCourante.question}
            </p>
          </div>

          {/* Options */}
          <div style={{ marginBottom:'16px' }}>
            {etapeCourante.options.map((opt, i) => {
              const estChoisie = reponse === i
              const apresReponse = reponse !== null
              const estCorrecte = opt.correct

              let bg = 'rgba(255,255,255,0.05)'
              let border = '1px solid rgba(255,255,255,0.1)'
              let color = 'rgba(255,255,255,0.8)'
              let anim = `slideUp 0.4s ease ${0.1 + i * 0.07}s both`

              if (apresReponse) {
                if (estCorrecte) {
                  bg = 'rgba(16,185,129,0.15)'; border = '1px solid rgba(16,185,129,0.5)'; color = '#6EE7B7'
                  if (estChoisie) anim = 'correctPop 0.5s ease'
                } else if (estChoisie) {
                  bg = 'rgba(239,68,68,0.12)'; border = '1px solid rgba(239,68,68,0.4)'; color = '#FCA5A5'
                  anim = 'wrongShake 0.4s ease'
                } else {
                  bg = 'rgba(255,255,255,0.02)'; color = 'rgba(255,255,255,0.25)'
                }
              }

              return (
                <div key={i} onClick={() => choisirReponse(i)}
                  className={`option-card ${apresReponse ? 'done' : ''}`}
                  style={{
                    background: bg, border, borderRadius:'16px', padding:'14px 16px',
                    marginBottom:'8px', display:'flex', alignItems:'center', gap:'12px',
                    animation: anim, opacity: apresReponse ? 1 : 0,
                    cursor: apresReponse ? 'default' : 'pointer',
                  }}
                >
                  <div style={{
                    width:'32px', height:'32px', borderRadius:'10px', flexShrink:0,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'12px', fontWeight:800, fontFamily:"'Syne',sans-serif",
                    background: apresReponse
                      ? estCorrecte ? 'rgba(16,185,129,0.3)' : estChoisie ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.05)'
                      : 'rgba(139,92,246,0.2)',
                    color: apresReponse
                      ? estCorrecte ? '#10B981' : estChoisie ? '#EF4444' : 'rgba(255,255,255,0.2)'
                      : '#C4B5FD',
                    border: apresReponse ? 'none' : '1px solid rgba(139,92,246,0.3)',
                  }}>
                    {['A','B','C','D'][i]}
                  </div>
                  <span style={{ flex:1, fontSize:'13px', color, lineHeight:1.5, fontWeight:500 }}>
                    {opt.texte}
                  </span>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'2px' }}>
                    {apresReponse && (
                      <span style={{ fontSize:'16px' }}>
                        {estCorrecte ? '✓' : estChoisie ? '✗' : ''}
                      </span>
                    )}
                    {apresReponse && estCorrecte && (
                      <span style={{ fontSize:'10px', fontWeight:700, color:'#10B981',
                        background:'rgba(16,185,129,0.15)', padding:'2px 6px', borderRadius:'6px' }}>
                        +{opt.points} pts
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div style={{
              borderRadius:'18px', padding:'16px', marginBottom:'8px',
              animation:'slideUp 0.4s ease both',
              background: reponse !== null && etapeCourante.options[reponse].correct
                ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${reponse !== null && etapeCourante.options[reponse].correct
                ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.25)'}`,
            }}>
              <p style={{
                fontSize:'11px', fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase',
                color: reponse !== null && etapeCourante.options[reponse].correct ? '#10B981' : '#EF4444',
                marginBottom:'6px',
              }}>
                {reponse !== null && etapeCourante.options[reponse].correct ? '✅ Bon raisonnement !' : '❌ Pas tout à fait'}
              </p>
              <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.75)', margin:0, lineHeight:1.6 }}>
                {reponse !== null && etapeCourante.options[reponse].correct
                  ? etapeCourante.feedback.bien
                  : etapeCourante.feedback.erreur}
              </p>
            </div>
          )}
        </div>

        {/* Bouton suivant fixé */}
        {reponse !== null && (
          <div style={{
            position:'fixed', bottom:0, left:0, right:0, padding:'16px',
            background:'linear-gradient(0deg,rgba(26,5,51,1) 0%,transparent 100%)', zIndex:100,
          }}>
            <div style={{ maxWidth:'600px', margin:'0 auto' }}>
              <button onClick={etapeSuivante} className="cas-btn"
                style={{
                  width:'100%', padding:'16px', borderRadius:'18px', border:'none',
                  background:'linear-gradient(135deg,#8B5CF6,#6366F1)',
                  color:'white', fontSize:'15px', fontWeight:700,
                  fontFamily:"'Syne',sans-serif",
                  boxShadow:'0 8px 32px rgba(139,92,246,0.4)',
                }}>
                {etapeIndex + 1 >= casChoisi.etapes.length
                  ? '🏁 Voir mon bilan'
                  : `Étape suivante → ${etapeCourante.titre} ✓`}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── RÉSULTATS ─────────────────────────────────────────────────────────────
  const m = mention()
  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg,#1a0533 0%,#2d1b69 40%,#1a0a3e 100%)',
      fontFamily:"'DM Sans',sans-serif",
    }}>
      <Particles />

      {/* Hero */}
      <div style={{ textAlign:'center', padding:'48px 20px 32px',
        animation:'slideUp 0.5s ease both' }}>
        <div style={{ fontSize:'52px', marginBottom:'16px' }}>{m.emoji}</div>
        <div style={{
          display:'inline-flex', flexDirection:'column', alignItems:'center',
          background:'rgba(255,255,255,0.07)', backdropFilter:'blur(12px)',
          border:'1px solid rgba(255,255,255,0.12)', borderRadius:'28px',
          padding:'24px 40px', marginBottom:'16px',
          animation:'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both',
        }}>
          <span style={{
            fontFamily:"'Syne',sans-serif", fontSize:'clamp(48px,12vw,72px)', fontWeight:800,
            lineHeight:1, color: m.color,
          }}>{pourcentage}%</span>
          <span style={{ color:'rgba(255,255,255,0.45)', fontSize:'13px', marginTop:'4px' }}>
            {scoreTotal} / {scoreMax} points
          </span>
        </div>
        <p style={{ fontFamily:"'Syne',sans-serif", color:'white', fontSize:'16px',
          fontWeight:700, margin:0 }}>{m.texte}</p>
      </div>

      {/* Stats étapes */}
      <div style={{ maxWidth:'560px', margin:'0 auto', padding:'0 16px 24px' }}>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px', fontWeight:700,
          letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'14px' }}>
          Bilan par étape
        </p>
        {historique.map((h, i) => {
          const maxPts = Math.max(...h.etape.options.map(o => o.points))
          const pct = maxPts > 0 ? Math.round((h.reponse.points / maxPts) * 100) : 0
          return (
            <div key={i} style={{
              background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)',
              borderLeft:`4px solid ${h.reponse.correct ? '#10B981' : '#EF4444'}`,
              borderRadius:'18px', overflow:'hidden', marginBottom:'10px',
              animation:`slideUp 0.4s ease ${i*0.08}s both`,
            }}>
              <div style={{ padding:'14px 16px', display:'flex', gap:'12px', alignItems:'flex-start' }}>
                <div style={{
                  width:'36px', height:'36px', borderRadius:'10px', flexShrink:0,
                  background: h.reponse.correct ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px',
                }}>
                  {h.etape.icon}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px' }}>
                    <p style={{ fontFamily:"'Syne',sans-serif", fontSize:'13px', fontWeight:700,
                      color:'white', margin:0 }}>{h.etape.titre}</p>
                    <span style={{
                      fontSize:'12px', fontWeight:700, padding:'2px 10px', borderRadius:'10px',
                      background: h.reponse.correct ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)',
                      color: h.reponse.correct ? '#10B981' : '#EF4444',
                    }}>{h.reponse.points}/{maxPts} pts</span>
                  </div>
                  <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'12px', margin:'0 0 8px',
                    lineHeight:1.4 }}>{h.reponse.texte}</p>
                  {/* Mini barre score */}
                  <div style={{ height:'4px', background:'rgba(255,255,255,0.08)', borderRadius:'2px' }}>
                    <div style={{
                      height:'100%', borderRadius:'2px',
                      background: pct >= 70 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#EF4444',
                      width:`${pct}%`, transition:'width 1s ease',
                    }} />
                  </div>
                </div>
              </div>
              <div style={{ background:'rgba(0,0,0,0.2)', padding:'10px 16px',
                borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.5)', margin:0, lineHeight:1.6 }}>
                  💡 {h.reponse.correct ? h.etape.feedback.bien : h.etape.feedback.erreur}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Boutons */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'16px',
        background:'linear-gradient(0deg,rgba(26,5,51,1) 60%,transparent 100%)', zIndex:100 }}>
        <div style={{ maxWidth:'560px', margin:'0 auto', display:'flex', gap:'10px' }}>
          <button onClick={() => demarrerCas(casChoisi)} className="cas-btn"
            style={{ flex:1, padding:'15px', borderRadius:'16px', border:'none',
              background:'linear-gradient(135deg,#8B5CF6,#6366F1)',
              color:'white', fontSize:'14px', fontWeight:700,
              fontFamily:"'Syne',sans-serif", boxShadow:'0 6px 24px rgba(139,92,246,0.4)' }}>
            🔄 Recommencer
          </button>
          <button onClick={() => setEtape('liste')} className="cas-btn"
            style={{ flex:1, padding:'15px', borderRadius:'16px',
              background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)',
              color:'white', fontSize:'14px', fontWeight:700,
              fontFamily:"'Syne',sans-serif" }}>
            📋 Autres cas
          </button>
        </div>
      </div>
    </div>
  )
}