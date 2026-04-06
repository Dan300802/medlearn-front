import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { questions as toutesLesQuestions } from '../../services/mockData'

const QUESTIONS_PAR_PARTIE = 10

const specialites = [
  { nom: 'Toutes', icon: '🏥', color: '#3B82F6' },
  { nom: 'Cardiologie', icon: '❤️', color: '#EF4444' },
  { nom: 'Neurologie', icon: '🧠', color: '#8B5CF6' },
  { nom: 'Hématologie', icon: '🩸', color: '#DC2626' },
  { nom: 'Pharmacologie', icon: '💊', color: '#10B981' },
  { nom: 'Infectiologie', icon: '🦠', color: '#F59E0B' },
  { nom: 'Chirurgie', icon: '🔬', color: '#06B6D4' },
  { nom: 'Endocrinologie', icon: '⚗️', color: '#EC4899' },
  { nom: 'Pneumologie', icon: '🫁', color: '#14B8A6' },
]

function melangerEtLimiter(liste, n) {
  return [...liste].sort(() => Math.random() - 0.5).slice(0, Math.min(n, liste.length))
}

/* ── Particules flottantes ── */
function Particles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            borderRadius: '50%',
            background: `rgba(255,255,255,${Math.random() * 0.15 + 0.05})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 8 + 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Styles globaux injectés ── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  * { box-sizing: border-box; }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.1; }
    50% { transform: translateY(-30px) rotate(180deg); opacity: 0.3; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes popIn {
    0%   { opacity: 0; transform: scale(0.8); }
    70%  { transform: scale(1.05); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes countUp {
    from { transform: scale(0.5); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
  @keyframes correctPop {
    0%   { transform: scale(1); }
    30%  { transform: scale(1.04); }
    60%  { transform: scale(0.98); }
    100% { transform: scale(1); }
  }
  @keyframes wrongShake {
    0%, 100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
  }
  @keyframes progressFill {
    from { width: 0; }
  }
  @keyframes starBurst {
    0%   { transform: scale(0) rotate(0deg); opacity: 1; }
    100% { transform: scale(2) rotate(180deg); opacity: 0; }
  }

  .slide-up    { animation: slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .pop-in      { animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .fade-in     { animation: fadeIn 0.4s ease forwards; }

  .quiz-btn {
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }
  .quiz-btn:hover { transform: translateY(-2px); }
  .quiz-btn:active { transform: scale(0.97); }

  .option-btn {
    font-family: 'DM Sans', sans-serif;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    cursor: pointer;
  }
  .option-btn:hover:not(.answered) {
    transform: translateX(6px) scale(1.01);
  }
  .option-correct { animation: correctPop 0.5s ease forwards; }
  .option-wrong   { animation: wrongShake 0.4s ease forwards; }

  .shimmer-text {
    background: linear-gradient(90deg, #fff 0%, #a5f3fc 40%, #fff 60%, #a5f3fc 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }

  .glass {
    background: rgba(255,255,255,0.07);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.12);
  }
  .glass-white {
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(12px);
  }
`

export default function Quiz() {
  const navigate = useNavigate()
  const [etape, setEtape] = useState('accueil')
  const [specialite, setSpecialite] = useState('Toutes')
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [reponseChoisie, setReponseChoisie] = useState(null)
  const [score, setScore] = useState(0)
  const [historique, setHistorique] = useState([])
  const [animKey, setAnimKey] = useState(0)
  const [showExplication, setShowExplication] = useState(false)
  const [optionAnim, setOptionAnim] = useState(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = globalStyles
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  const demarrer = () => {
    const filtre = specialite === 'Toutes'
      ? toutesLesQuestions
      : toutesLesQuestions.filter(q => q.specialite === specialite)
    setQuestions(melangerEtLimiter(filtre, QUESTIONS_PAR_PARTIE))
    setIndex(0); setScore(0); setHistorique([])
    setReponseChoisie(null); setShowExplication(false)
    setAnimKey(k => k + 1)
    setEtape('quiz')
  }

  const choisirReponse = (i) => {
    if (reponseChoisie !== null) return
    const q = questions[index]
    const correct = i === q.bonne_reponse
    setOptionAnim({ index: i, correct })
    setReponseChoisie(i)
    if (correct) setScore(s => s + 1)
    setHistorique(h => [...h, { question: q, reponse: i, correct }])
    setTimeout(() => setShowExplication(true), 400)
  }

  const suivant = () => {
    setShowExplication(false)
    setOptionAnim(null)
    setTimeout(() => {
      if (index + 1 >= questions.length) { setEtape('resultat') }
      else {
        setIndex(i => i + 1)
        setReponseChoisie(null)
        setAnimKey(k => k + 1)
      }
    }, 200)
  }

  const pourcentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0

  const mention = () => {
    if (pourcentage >= 80) return { texte: 'Excellent !', emoji: '🏆', grad: 'linear-gradient(135deg,#10B981,#059669)' }
    if (pourcentage >= 60) return { texte: 'Bien joué !', emoji: '👍', grad: 'linear-gradient(135deg,#3B82F6,#2563EB)' }
    if (pourcentage >= 40) return { texte: 'Peut mieux faire', emoji: '📚', grad: 'linear-gradient(135deg,#F59E0B,#D97706)' }
    return { texte: 'À revoir', emoji: '💪', grad: 'linear-gradient(135deg,#EF4444,#DC2626)' }
  }

  const specInfo = specialites.find(s => s.nom === specialite) || specialites[0]

  // ── ACCUEIL ───────────────────────────────────────────────────────────────
  if (etape === 'accueil') return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a3e 40%, #0d1b4b 100%)',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Particles />

      {/* Orbes décoratifs */}
      <div style={{ position:'fixed', top:'-100px', right:'-100px', width:'400px', height:'400px',
        borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
        pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'-150px', left:'-100px', width:'500px', height:'500px',
        borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
        pointerEvents:'none' }} />

      {/* Navbar */}
      <nav style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:'12px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          className="quiz-btn"
          style={{ width:'40px', height:'40px', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.15)',
            background:'rgba(255,255,255,0.08)', color:'white', fontSize:'18px', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center' }}
        >←</button>
        <span style={{ color:'rgba(255,255,255,0.7)', fontFamily:"'DM Sans', sans-serif", fontSize:'14px' }}>
          Quiz Médical
        </span>
      </nav>

      {/* Hero */}
      <div className="slide-up" style={{ textAlign:'center', padding:'20px 20px 32px' }}>
        <div style={{ fontSize:'72px', marginBottom:'12px', filter:'drop-shadow(0 0 30px rgba(59,130,246,0.5))' }}>
          🧬
        </div>
        <h1 style={{
          fontFamily:"'Syne', sans-serif", fontSize:'clamp(28px,6vw,42px)',
          fontWeight:800, margin:'0 0 8px',
          background:'linear-gradient(135deg, #ffffff 0%, #93c5fd 50%, #a5b4fc 100%)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        }}>
          Quiz Interactif
        </h1>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'14px', margin:0 }}>
          10 questions · Résultat complet à la fin · Mélangé aléatoirement
        </p>
      </div>

      {/* Card principale */}
      <div className="slide-up" style={{ maxWidth:'520px', margin:'0 auto', padding:'0 16px 40px',
        animationDelay:'0.1s', opacity:0 }}>
        <div className="glass" style={{ borderRadius:'28px', padding:'24px' }}>

          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'12px', fontWeight:600,
            letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'16px' }}>
            Choisir une spécialité
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'8px', marginBottom:'20px' }}>
            {specialites.map((s, idx) => {
              const dispo = s.nom === 'Toutes'
                ? toutesLesQuestions.length
                : toutesLesQuestions.filter(q => q.specialite === s.nom).length
              const actif = specialite === s.nom
              return (
                <button
                  key={s.nom}
                  onClick={() => setSpecialite(s.nom)}
                  className="quiz-btn"
                  style={{
                    padding:'12px 8px', borderRadius:'16px', border:'none', cursor:'pointer',
                    background: actif ? s.color : 'rgba(255,255,255,0.06)',
                    boxShadow: actif ? `0 8px 24px ${s.color}44` : 'none',
                    transform: actif ? 'scale(1.05)' : 'scale(1)',
                    transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    display:'flex', flexDirection:'column', alignItems:'center', gap:'4px',
                    animation: `slideUp 0.4s ease ${idx * 0.05}s both`,
                  }}
                >
                  <span style={{ fontSize:'22px' }}>{s.icon}</span>
                  <span style={{ fontSize:'10px', fontWeight:600, color:'white',
                    lineHeight:'1.2', textAlign:'center' }}>{s.nom}</span>
                  <span style={{ fontSize:'10px', color: actif ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.35)' }}>
                    {dispo}Q
                  </span>
                </button>
              )
            })}
          </div>

          {/* Info bandeau */}
          <div style={{ background:'rgba(59,130,246,0.15)', borderRadius:'16px', padding:'14px 16px',
            display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px',
            border:'1px solid rgba(59,130,246,0.25)' }}>
            <span style={{ fontSize:'28px' }}>🎯</span>
            <div>
              <p style={{ color:'white', fontSize:'13px', fontWeight:600, margin:'0 0 2px' }}>
                {QUESTIONS_PAR_PARTIE} questions par partie
              </p>
              <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'11px', margin:0 }}>
                Spécialité sélectionnée :{' '}
                <span style={{ color: specInfo.color, fontWeight:600 }}>
                  {specInfo.icon} {specialite}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={demarrer}
            className="quiz-btn"
            style={{
              width:'100%', padding:'16px', borderRadius:'18px', border:'none', cursor:'pointer',
              background:'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
              color:'white', fontSize:'16px', fontWeight:700,
              fontFamily:"'Syne', sans-serif",
              boxShadow:'0 8px 32px rgba(99,102,241,0.4)',
              letterSpacing:'0.02em',
            }}
          >
            ▶ Démarrer la partie
          </button>
        </div>
      </div>
    </div>
  )

  // ── QUIZ ──────────────────────────────────────────────────────────────────
  if (etape === 'quiz') {
    const q = questions[index]
    const progression = ((index + 1) / questions.length) * 100
    const lettres = ['A', 'B', 'C', 'D']
    const diffColors = {
      facile: { bg:'rgba(16,185,129,0.15)', text:'#10B981', border:'rgba(16,185,129,0.3)' },
      moyen:  { bg:'rgba(245,158,11,0.15)', text:'#F59E0B', border:'rgba(245,158,11,0.3)' },
      difficile: { bg:'rgba(239,68,68,0.15)', text:'#EF4444', border:'rgba(239,68,68,0.3)' },
    }
    const dc = diffColors[q.difficulte]

    const getOptionStyle = (i) => {
      const base = {
        width:'100%', textAlign:'left', padding:'14px 16px', borderRadius:'16px',
        border:'2px solid', cursor: reponseChoisie !== null ? 'default' : 'pointer',
        display:'flex', alignItems:'center', gap:'12px', marginBottom:'10px',
        fontFamily:"'DM Sans', sans-serif", fontSize:'14px', fontWeight:500,
        transition:'all 0.3s ease',
      }
      if (reponseChoisie === null) return {
        ...base, background:'rgba(255,255,255,0.06)', borderColor:'rgba(255,255,255,0.12)',
        color:'white',
      }
      if (i === q.bonne_reponse) return {
        ...base, background:'rgba(16,185,129,0.2)', borderColor:'#10B981', color:'#6EE7B7',
        animation: i === q.bonne_reponse ? 'correctPop 0.5s ease' : 'none',
      }
      if (i === reponseChoisie) return {
        ...base, background:'rgba(239,68,68,0.15)', borderColor:'#EF4444', color:'#FCA5A5',
        animation:'wrongShake 0.4s ease',
      }
      return { ...base, background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.05)',
        color:'rgba(255,255,255,0.3)', }
    }

    return (
      <div style={{
        minHeight:'100vh',
        background:'linear-gradient(135deg, #0f0c29 0%, #1a1a3e 50%, #0d1b4b 100%)',
        fontFamily:"'DM Sans', sans-serif",
        position:'relative', overflow:'hidden',
      }}>
        <Particles />

        {/* Header */}
        <div style={{
          position:'sticky', top:0, zIndex:50,
          background:'rgba(15,12,41,0.85)', backdropFilter:'blur(20px)',
          borderBottom:'1px solid rgba(255,255,255,0.08)',
          padding:'12px 16px',
        }}>
          <div style={{ maxWidth:'640px', margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
              <button
                onClick={() => setEtape('accueil')}
                className="quiz-btn"
                style={{ width:'36px', height:'36px', borderRadius:'10px',
                  background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)',
                  color:'rgba(255,255,255,0.7)', cursor:'pointer', fontSize:'16px',
                  display:'flex', alignItems:'center', justifyContent:'center' }}
              >✕</button>

              {/* Indicateurs pastilles */}
              <div style={{ display:'flex', gap:'5px', alignItems:'center' }}>
                {questions.map((_, i) => {
                  const h = historique[i]
                  const actif = i === index
                  return (
                    <div key={i} style={{
                      height:'6px', borderRadius:'3px',
                      width: actif ? '20px' : '6px',
                      background: h ? (h.correct ? '#10B981' : '#EF4444') :
                        actif ? '#3B82F6' : 'rgba(255,255,255,0.15)',
                      transition:'all 0.3s ease',
                      boxShadow: actif ? '0 0 8px #3B82F6' : 'none',
                    }} />
                  )
                })}
              </div>

              <div style={{ textAlign:'right' }}>
                <span style={{ fontFamily:"'Syne', sans-serif", fontSize:'16px',
                  fontWeight:800, color:'white' }}>{index + 1}</span>
                <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'13px' }}>/{questions.length}</span>
              </div>
            </div>

            {/* Barre progression */}
            <div style={{ height:'4px', background:'rgba(255,255,255,0.08)', borderRadius:'2px', overflow:'hidden' }}>
              <div style={{
                height:'100%', borderRadius:'2px',
                background:'linear-gradient(90deg, #3B82F6, #6366F1)',
                width:`${progression}%`, transition:'width 0.6s cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow:'0 0 10px rgba(99,102,241,0.6)',
              }} />
            </div>
          </div>
        </div>

        {/* Contenu question */}
        <div key={animKey} ref={contentRef}
          style={{ maxWidth:'640px', margin:'0 auto', padding:'24px 16px 100px' }}>

          {/* Badges */}
          <div className="slide-up" style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' }}>
            <span style={{
              background:'rgba(99,102,241,0.2)', border:'1px solid rgba(99,102,241,0.4)',
              color:'#A5B4FC', fontSize:'11px', fontWeight:600,
              padding:'4px 12px', borderRadius:'20px', letterSpacing:'0.05em'
            }}>{q.specialite}</span>
            <span style={{
              background: dc.bg, border:`1px solid ${dc.border}`,
              color: dc.text, fontSize:'11px', fontWeight:600,
              padding:'4px 12px', borderRadius:'20px', letterSpacing:'0.05em',
              textTransform:'capitalize'
            }}>{q.difficulte}</span>
            <span style={{
              marginLeft:'auto', color:'rgba(255,255,255,0.4)', fontSize:'11px', fontWeight:600
            }}>Score : {score} pt{score > 1 ? 's' : ''}</span>
          </div>

          {/* Card question */}
          <div className="slide-up glass" style={{
            borderRadius:'24px', padding:'24px', marginBottom:'20px',
            animationDelay:'0.05s', opacity:0,
          }}>
            <p style={{
              fontFamily:"'Syne', sans-serif", fontSize:'clamp(15px,3.5vw,18px)',
              fontWeight:700, color:'white', margin:0, lineHeight:1.5,
            }}>{q.enonce}</p>
          </div>

          {/* Options */}
          <div>
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => choisirReponse(i)}
                className="option-btn"
                style={{
                  ...getOptionStyle(i),
                  animationDelay: `${0.1 + i * 0.07}s`,
                  animation: reponseChoisie === null
                    ? `slideIn 0.4s ease ${0.1 + i * 0.07}s both`
                    : optionAnim?.index === i
                      ? (optionAnim.correct ? 'correctPop 0.5s ease' : 'wrongShake 0.4s ease')
                      : 'none',
                }}
              >
                {/* Lettre */}
                <span style={{
                  width:'32px', height:'32px', borderRadius:'10px', flexShrink:0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'12px', fontWeight:800, fontFamily:"'Syne', sans-serif",
                  background: reponseChoisie === null ? 'rgba(255,255,255,0.1)' :
                    i === q.bonne_reponse ? '#10B981' :
                    i === reponseChoisie ? '#EF4444' : 'rgba(255,255,255,0.05)',
                  color: reponseChoisie === null ? 'rgba(255,255,255,0.6)' : 'white',
                  transition:'all 0.3s ease',
                }}>
                  {lettres[i]}
                </span>

                <span style={{ flex:1, lineHeight:1.4 }}>{opt}</span>

                {reponseChoisie !== null && i === q.bonne_reponse && (
                  <span style={{ fontSize:'18px', animation:'popIn 0.3s ease' }}>✓</span>
                )}
                {reponseChoisie === i && i !== q.bonne_reponse && (
                  <span style={{ fontSize:'18px' }}>✗</span>
                )}
              </button>
            ))}
          </div>

          {/* Explication */}
          {showExplication && (
            <div className="slide-up" style={{
              borderRadius:'20px', padding:'16px 18px', marginTop:'4px',
              background: reponseChoisie === q.bonne_reponse
                ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${reponseChoisie === q.bonne_reponse ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.25)'}`,
            }}>
              <p style={{ fontSize:'12px', fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase',
                color: reponseChoisie === q.bonne_reponse ? '#10B981' : '#EF4444', marginBottom:'6px' }}>
                {reponseChoisie === q.bonne_reponse ? '✅ Bonne réponse !' : '❌ Mauvaise réponse'}
              </p>
              <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.75)', margin:0, lineHeight:1.6 }}>
                {q.explication}
              </p>
            </div>
          )}
        </div>

        {/* Bouton suivant — fixé en bas */}
        {reponseChoisie !== null && (
          <div className="slide-up" style={{
            position:'fixed', bottom:0, left:0, right:0, padding:'16px',
            background:'linear-gradient(0deg, rgba(15,12,41,1) 0%, rgba(15,12,41,0) 100%)',
            zIndex:100,
          }}>
            <div style={{ maxWidth:'640px', margin:'0 auto' }}>
              <button
                onClick={suivant}
                className="quiz-btn"
                style={{
                  width:'100%', padding:'16px', borderRadius:'18px', border:'none', cursor:'pointer',
                  background:'linear-gradient(135deg, #3B82F6, #6366F1)',
                  color:'white', fontSize:'15px', fontWeight:700,
                  fontFamily:"'Syne', sans-serif",
                  boxShadow:'0 8px 32px rgba(99,102,241,0.5)',
                }}
              >
                {index + 1 >= questions.length
                  ? '🏁 Voir mes résultats'
                  : `Suivante → ${index + 2}/${questions.length}`}
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
      background:'linear-gradient(135deg, #0f0c29 0%, #1a1a3e 50%, #0d1b4b 100%)',
      fontFamily:"'DM Sans', sans-serif",
    }}>
      <Particles />

      {/* Hero résultats */}
      <div className="slide-up" style={{
        textAlign:'center', padding:'48px 20px 40px',
        position:'relative',
      }}>
        <div style={{ fontSize:'56px', marginBottom:'16px',
          animation:'countUp 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both' }}>
          {m.emoji}
        </div>

        {/* Score circulaire */}
        <div style={{
          display:'inline-flex', flexDirection:'column', alignItems:'center',
          background:'rgba(255,255,255,0.07)', backdropFilter:'blur(12px)',
          border:'1px solid rgba(255,255,255,0.12)',
          borderRadius:'28px', padding:'28px 40px', marginBottom:'20px',
          animation:'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both',
        }}>
          <span style={{
            fontFamily:"'Syne', sans-serif", fontSize:'clamp(52px,15vw,80px)',
            fontWeight:800, lineHeight:1,
            background: m.grad,
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>
            {pourcentage}%
          </span>
          <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'13px', marginTop:'4px' }}>
            {score} / {questions.length} correctes
          </span>
        </div>

        <div style={{
          display:'inline-block', padding:'8px 20px', borderRadius:'20px',
          background: 'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)',
          color:'white', fontSize:'14px', fontWeight:700,
          fontFamily:"'Syne', sans-serif",
        }}>
          {m.texte}
        </div>
      </div>

      {/* Stats */}
      <div className="slide-up" style={{
        maxWidth:'560px', margin:'0 auto', padding:'0 16px',
        display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'28px',
        animationDelay:'0.4s', opacity:0,
      }}>
        {[
          { label:'Correctes', val:score, color:'#10B981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.25)' },
          { label:'Incorrectes', val:questions.length-score, color:'#EF4444', bg:'rgba(239,68,68,0.12)', border:'rgba(239,68,68,0.25)' },
          { label:'Total', val:questions.length, color:'#6366F1', bg:'rgba(99,102,241,0.12)', border:'rgba(99,102,241,0.25)' },
        ].map((s, i) => (
          <div key={i} style={{
            background: s.bg, border:`1px solid ${s.border}`,
            borderRadius:'20px', padding:'16px', textAlign:'center',
            animation:`popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${0.4+i*0.1}s both`,
          }}>
            <div style={{ fontFamily:"'Syne', sans-serif", fontSize:'32px', fontWeight:800, color: s.color }}>
              {s.val}
            </div>
            <div style={{ color:'rgba(255,255,255,0.45)', fontSize:'11px', marginTop:'4px', fontWeight:600 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Correction */}
      <div style={{ maxWidth:'560px', margin:'0 auto', padding:'0 16px 120px' }}>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'11px', fontWeight:700,
          letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'14px' }}>
          Correction détaillée
        </p>

        {historique.map((h, i) => (
          <div key={i} className="fade-in" style={{
            background:'rgba(255,255,255,0.05)', backdropFilter:'blur(8px)',
            border:`1px solid ${h.correct ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.25)'}`,
            borderRadius:'20px', overflow:'hidden', marginBottom:'10px',
            borderLeft:`4px solid ${h.correct ? '#10B981' : '#EF4444'}`,
            animation:`slideUp 0.4s ease ${i * 0.05}s both`,
          }}>
            <div style={{ padding:'14px 16px', display:'flex', gap:'12px', alignItems:'flex-start' }}>
              <span style={{
                width:'28px', height:'28px', borderRadius:'8px', flexShrink:0,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'12px', fontWeight:800, fontFamily:"'Syne', sans-serif",
                background: h.correct ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.2)',
                color: h.correct ? '#10B981' : '#EF4444',
              }}>{i + 1}</span>
              <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.85)', margin:0,
                fontWeight:600, lineHeight:1.5, flex:1 }}>
                {h.question.enonce}
              </p>
              <span style={{ fontSize:'16px', flexShrink:0 }}>{h.correct ? '✅' : '❌'}</span>
            </div>

            {!h.correct && (
              <div style={{ padding:'0 16px 10px 56px' }}>
                <p style={{ fontSize:'11px', color:'#FCA5A5', margin:'0 0 2px' }}>
                  ✗ Ta réponse : <span style={{ fontWeight:700 }}>{h.question.options[h.reponse]}</span>
                </p>
                <p style={{ fontSize:'11px', color:'#6EE7B7', margin:0 }}>
                  ✓ Bonne : <span style={{ fontWeight:700 }}>{h.question.options[h.question.bonne_reponse]}</span>
                </p>
              </div>
            )}

            <div style={{
              background:'rgba(0,0,0,0.2)', padding:'10px 16px',
              borderTop:'1px solid rgba(255,255,255,0.06)',
            }}>
              <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.5)', margin:0, lineHeight:1.6 }}>
                💡 {h.question.explication}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Boutons fixes */}
      <div style={{
        position:'fixed', bottom:0, left:0, right:0, padding:'16px',
        background:'linear-gradient(0deg, rgba(15,12,41,1) 60%, transparent 100%)',
        zIndex:100,
      }}>
        <div style={{ maxWidth:'560px', margin:'0 auto', display:'flex', gap:'10px' }}>
          <button
            onClick={demarrer}
            className="quiz-btn"
            style={{
              flex:1, padding:'15px', borderRadius:'16px', border:'none', cursor:'pointer',
              background:'linear-gradient(135deg, #3B82F6, #6366F1)',
              color:'white', fontSize:'14px', fontWeight:700,
              fontFamily:"'Syne', sans-serif",
              boxShadow:'0 6px 24px rgba(99,102,241,0.4)',
            }}
          >🔄 Nouvelle partie</button>
          <button
            onClick={() => navigate('/dashboard')}
            className="quiz-btn"
            style={{
              flex:1, padding:'15px', borderRadius:'16px', cursor:'pointer',
              background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)',
              color:'white', fontSize:'14px', fontWeight:700,
              fontFamily:"'Syne', sans-serif",
            }}
          >🏠 Dashboard</button>
        </div>
      </div>
    </div>
  )
}