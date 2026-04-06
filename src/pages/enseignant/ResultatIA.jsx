import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
  @keyframes slideUp {
    from { opacity:0; transform:translateY(20px); }
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
  .res-btn {
    transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    cursor:pointer;
  }
  .res-btn:hover  { transform:translateY(-2px); }
  .res-btn:active { transform:scale(0.97); }
  .item-card {
    transition:all 0.2s ease;
  }
  .item-card:hover {
    background:rgba(255,255,255,0.06) !important;
  }
`

// ── Données mock générées par IA ──────────────────────────────────────────────
const genererContenu = (cours) => ({
  quiz: [
    { enonce:`Quelle est la définition de l'insuffisance cardiaque selon la spécialité ${cours?.specialite} ?`, difficulte:'facile', valide:true },
    { enonce:'Quel signe clinique est le plus spécifique de la décompensation cardiaque gauche ?', difficulte:'moyen', valide:true },
    { enonce:'Quel biomarqueur est utilisé en urgence pour le diagnostic de l\'insuffisance cardiaque ?', difficulte:'moyen', valide:true },
    { enonce:'Quelle classe médicamenteuse améliore la survie dans l\'insuffisance cardiaque chronique ?', difficulte:'difficile', valide:true },
    { enonce:'Quelle est la fraction d\'éjection normale du ventricule gauche ?', difficulte:'facile', valide:true },
    { enonce:'Quels sont les critères de Framingham pour le diagnostic d\'insuffisance cardiaque ?', difficulte:'difficile', valide:false },
    { enonce:'Quel examen de première intention devant une suspicion d\'insuffisance cardiaque ?', difficulte:'facile', valide:true },
    { enonce:'Comment classer l\'insuffisance cardiaque selon la NYHA ?', difficulte:'moyen', valide:true },
    { enonce:'Quelle est la cause la plus fréquente d\'insuffisance cardiaque dans les pays développés ?', difficulte:'facile', valide:true },
    { enonce:'Quels sont les facteurs déclenchants d\'une décompensation cardiaque aiguë ?', difficulte:'moyen', valide:true },
  ],
  casClinique: {
    titre:`Cas clinique — ${cours?.specialite || 'Cardiologie'}`,
    patient:'M. Koffi, 65 ans, hypertendu diabétique',
    etapes:['Anamnèse', 'Examen clinique', 'Diagnostic', 'Traitement'],
    valide:true,
  },
  anatomie: {
    organes:['Cœur', 'Poumons', 'Vaisseaux'],
    annotations:['Ventricule gauche', 'Oreillette gauche', 'Valve mitrale', 'Aorte ascendante'],
    valide:true,
  },
})

export default function ResultatIA() {
  const navigate = useNavigate()
  const [cours, setCours] = useState(null)
  const [contenu, setContenu] = useState(null)
  const [onglet, setOnglet] = useState('quiz')
  const [publie, setPublie] = useState(false)

  useEffect(() => {
    const s = document.createElement('style')
    s.textContent = globalStyles
    document.head.appendChild(s)

    const data = localStorage.getItem('cours-genere')
    if (data) {
      const parsed = JSON.parse(data)
      setCours(parsed)
      setContenu(genererContenu(parsed))
    } else {
      navigate('/enseignant/depot')
    }
    return () => document.head.removeChild(s)
  }, [])

  const toggleValide = (type, index) => {
    setContenu(prev => {
      if (type === 'quiz') {
        const q = [...prev.quiz]
        q[index] = { ...q[index], valide: !q[index].valide }
        return { ...prev, quiz: q }
      }
      return prev
    })
  }

  const publier = () => setPublie(true)

  const diffColor = (d) => ({
    facile:   { bg:'rgba(16,185,129,0.15)',  color:'#10B981' },
    moyen:    { bg:'rgba(245,158,11,0.15)', color:'#F59E0B' },
    difficile:{ bg:'rgba(239,68,68,0.15)',  color:'#EF4444' },
  }[d] || {})

  if (!contenu) return null

  // ── PUBLIÉ ─────────────────────────────────────────────────────────────────
  if (publie) return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(160deg,#080818 0%,#0d1b2e 50%,#0a0f1e 100%)',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:"'DM Sans',sans-serif", padding:'20px',
    }}>
      <div style={{ textAlign:'center', animation:'popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both' }}>
        <div style={{ fontSize:'72px', marginBottom:'16px' }}>🎉</div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(22px,5vw,30px)',
          fontWeight:800, color:'white', margin:'0 0 8px',
          background:'linear-gradient(135deg,#10B981,#6366F1)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          Cours publié !
        </h1>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'14px', margin:'0 0 8px' }}>
          {cours?.titre}
        </p>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'13px', margin:'0 0 28px' }}>
          {contenu.quiz.filter(q=>q.valide).length} QCM ·
          1 cas clinique · {contenu.anatomie.annotations.length} annotations
          disponibles pour les étudiants
        </p>
        <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => navigate('/enseignant/depot')} className="res-btn"
            style={{ padding:'13px 24px', borderRadius:'14px', border:'none',
              background:'linear-gradient(135deg,#10B981,#059669)',
              color:'white', fontSize:'14px', fontWeight:700,
              fontFamily:"'Syne',sans-serif",
              boxShadow:'0 6px 20px rgba(16,185,129,0.35)' }}>
            ✨ Nouveau cours
          </button>
          <button onClick={() => navigate('/enseignant')} className="res-btn"
            style={{ padding:'13px 24px', borderRadius:'14px',
              background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)',
              color:'white', fontSize:'14px', fontWeight:700,
              fontFamily:"'Syne',sans-serif" }}>
            🏠 Dashboard
          </button>
        </div>
      </div>
    </div>
  )

  // ── RÉSULTAT ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(160deg,#080818 0%,#0d1b2e 50%,#0a0f1e 100%)',
      fontFamily:"'DM Sans',sans-serif",
    }}>
      {/* Fond */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'300px', height:'300px',
          borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 65%)' }} />
      </div>

      {/* Navbar */}
      <nav style={{ position:'sticky', top:0, zIndex:100,
        background:'rgba(8,8,24,0.9)', backdropFilter:'blur(24px)',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
        padding:'0 16px', height:'56px',
        display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <button onClick={() => navigate('/enseignant/depot')} className="res-btn"
            style={{ width:'36px', height:'36px', borderRadius:'10px',
              background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)',
              color:'white', fontSize:'18px',
              display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:'14px',
              fontWeight:800, color:'white' }}>Contenu généré</span>
            <span style={{ fontSize:'10px', color:'#10B981', marginLeft:'8px', fontWeight:700 }}>
              ✨ IA
            </span>
          </div>
        </div>
        <span style={{ color:'rgba(255,255,255,0.4)', fontSize:'12px',
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          maxWidth:'150px' }}>{cours?.titre}</span>
      </nav>

      <div style={{ maxWidth:'640px', margin:'0 auto', padding:'16px 16px 120px',
        position:'relative', zIndex:1 }}>

        {/* Résumé */}
        <div style={{ animation:'slideUp 0.4s ease both', marginBottom:'16px' }}>
          <div style={{
            background:'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(99,102,241,0.08))',
            border:'1px solid rgba(16,185,129,0.2)', borderRadius:'20px', padding:'16px',
          }}>
            <p style={{ color:'#10B981', fontSize:'11px', fontWeight:700,
              textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 12px' }}>
              ✨ Généré avec succès
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
              {[
                { icon:'📝', val:contenu.quiz.length, label:'QCM' },
                { icon:'🩺', val:'1', label:'Cas clinique' },
                { icon:'🧬', val:contenu.anatomie.annotations.length, label:'Annotations' },
              ].map((g, i) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.05)',
                  borderRadius:'14px', padding:'12px', textAlign:'center' }}>
                  <div style={{ fontSize:'22px', marginBottom:'4px' }}>{g.icon}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'20px',
                    fontWeight:800, color:'white' }}>{g.val}</div>
                  <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'10px' }}>{g.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div style={{ display:'flex', gap:'4px', background:'rgba(255,255,255,0.04)',
          borderRadius:'14px', padding:'4px', marginBottom:'16px',
          animation:'slideUp 0.4s ease 0.1s both', opacity:0 }}>
          {[
            { id:'quiz', label:'📝 QCM', count:contenu.quiz.filter(q=>q.valide).length },
            { id:'cas', label:'🩺 Cas' },
            { id:'anatomie', label:'🧬 Anatomie' },
          ].map(t => (
            <button key={t.id} onClick={() => setOnglet(t.id)}
              className="res-btn"
              style={{
                flex:1, padding:'9px 6px', borderRadius:'10px', border:'none',
                background: onglet === t.id
                  ? 'linear-gradient(135deg,#10B981,#059669)'
                  : 'transparent',
                color: onglet === t.id ? 'white' : 'rgba(255,255,255,0.4)',
                fontSize:'12px', fontWeight:700,
                fontFamily:"'Syne',sans-serif",
                boxShadow: onglet === t.id ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
              }}>
              {t.label}
              {t.count !== undefined && onglet === t.id && (
                <span style={{ marginLeft:'4px', background:'rgba(255,255,255,0.2)',
                  borderRadius:'8px', padding:'1px 6px', fontSize:'10px' }}>
                  {t.count}✓
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── QCM ── */}
        {onglet === 'quiz' && (
          <div style={{ animation:'fadeIn 0.3s ease both' }}>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px', marginBottom:'12px' }}>
              Cochez/décochez les questions à inclure dans le quiz final
            </p>
            {contenu.quiz.map((q, i) => (
              <div key={i} onClick={() => toggleValide('quiz', i)}
                className="item-card"
                style={{
                  display:'flex', gap:'12px', alignItems:'flex-start',
                  background:'rgba(255,255,255,0.04)', border:`1px solid ${q.valide ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius:'16px', padding:'12px 14px', marginBottom:'8px',
                  cursor:'pointer', transition:'all 0.2s ease',
                  animation:`slideUp 0.3s ease ${i*0.04}s both`,
                }}>
                {/* Checkbox */}
                <div style={{
                  width:'22px', height:'22px', borderRadius:'7px', flexShrink:0, marginTop:'1px',
                  background: q.valide ? '#10B981' : 'rgba(255,255,255,0.06)',
                  border: q.valide ? 'none' : '2px solid rgba(255,255,255,0.15)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'12px', transition:'all 0.2s ease',
                  boxShadow: q.valide ? '0 0 8px rgba(16,185,129,0.4)' : 'none',
                }}>
                  {q.valide ? '✓' : ''}
                </div>

                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ color: q.valide ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)',
                    fontSize:'13px', margin:'0 0 6px', lineHeight:1.5,
                    transition:'color 0.2s ease' }}>
                    {q.enonce}
                  </p>
                  <span style={{
                    fontSize:'10px', fontWeight:700, padding:'2px 8px', borderRadius:'8px',
                    background: diffColor(q.difficulte).bg,
                    color: diffColor(q.difficulte).color,
                    textTransform:'capitalize',
                  }}>{q.difficulte}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CAS CLINIQUE ── */}
        {onglet === 'cas' && (
          <div style={{ animation:'fadeIn 0.3s ease both' }}>
            <div style={{
              background: contenu.casClinique.valide ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.04)',
              border:`1px solid ${contenu.casClinique.valide ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius:'20px', padding:'18px', marginBottom:'12px',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px' }}>
                <div style={{ fontSize:'32px' }}>🩺</div>
                <div>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:'15px',
                    fontWeight:800, color:'white', margin:'0 0 2px' }}>
                    {contenu.casClinique.titre}
                  </h3>
                  <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'12px', margin:0 }}>
                    Patient : {contenu.casClinique.patient}
                  </p>
                </div>
              </div>

              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'14px' }}>
                {contenu.casClinique.etapes.map((e, i) => (
                  <span key={i} style={{
                    fontSize:'11px', fontWeight:600, padding:'4px 12px', borderRadius:'10px',
                    background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.25)',
                    color:'#A5B4FC',
                  }}>{i+1}. {e}</span>
                ))}
              </div>

              <div style={{ display:'flex', gap:'8px' }}>
                <button className="res-btn"
                  style={{ flex:1, padding:'10px', borderRadius:'12px', border:'none',
                    background:'linear-gradient(135deg,#10B981,#059669)',
                    color:'white', fontSize:'12px', fontWeight:700,
                    fontFamily:"'Syne',sans-serif",
                    boxShadow:'0 4px 12px rgba(16,185,129,0.3)' }}>
                  ✓ Inclure dans la publication
                </button>
                <button className="res-btn"
                  style={{ padding:'10px 14px', borderRadius:'12px',
                    background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
                    color:'rgba(255,255,255,0.6)', fontSize:'12px', fontWeight:600 }}>
                  ✏️ Modifier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ANATOMIE ── */}
        {onglet === 'anatomie' && (
          <div style={{ animation:'fadeIn 0.3s ease both' }}>
            <div style={{
              background:'rgba(20,184,166,0.08)', border:'1px solid rgba(20,184,166,0.2)',
              borderRadius:'20px', padding:'18px', marginBottom:'12px',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
                <span style={{ fontSize:'28px' }}>🧬</span>
                <div>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:'15px',
                    fontWeight:800, color:'white', margin:'0 0 2px' }}>
                    Organes identifiés
                  </h3>
                  <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'12px', margin:0 }}>
                    Liés au contenu du cours
                  </p>
                </div>
              </div>

              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'16px' }}>
                {contenu.anatomie.organes.map((o, i) => (
                  <span key={i} style={{
                    fontSize:'12px', fontWeight:700, padding:'6px 14px', borderRadius:'12px',
                    background:'rgba(20,184,166,0.15)', border:'1px solid rgba(20,184,166,0.3)',
                    color:'#2DD4BF',
                  }}>{o}</span>
                ))}
              </div>

              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px',
                fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em',
                margin:'0 0 8px' }}>Annotations générées</p>
              {contenu.anatomie.annotations.map((a, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap:'8px',
                  padding:'8px 12px', background:'rgba(255,255,255,0.04)',
                  borderRadius:'10px', marginBottom:'6px',
                  animation:`slideUp 0.3s ease ${i*0.06}s both`,
                }}>
                  <div style={{ width:'6px', height:'6px', borderRadius:'50%',
                    background:'#14B8A6', flexShrink:0 }} />
                  <span style={{ color:'rgba(255,255,255,0.75)', fontSize:'13px' }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Boutons publication fixés */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'12px 16px',
        background:'linear-gradient(0deg,rgba(8,8,24,1) 0%,transparent 100%)', zIndex:100 }}>
        <div style={{ maxWidth:'640px', margin:'0 auto', display:'flex', gap:'10px' }}>
          <button onClick={() => navigate('/enseignant/depot')} className="res-btn"
            style={{ padding:'14px', borderRadius:'16px',
              background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)',
              color:'white', fontSize:'13px', fontWeight:700,
              fontFamily:"'Syne',sans-serif", whiteSpace:'nowrap' }}>
            ← Refaire
          </button>
          <button onClick={publier} className="res-btn"
            style={{ flex:1, padding:'14px', borderRadius:'16px', border:'none',
              background:'linear-gradient(135deg,#10B981,#6366F1)',
              color:'white', fontSize:'14px', fontWeight:700,
              fontFamily:"'Syne',sans-serif",
              boxShadow:'0 8px 28px rgba(16,185,129,0.35)' }}>
            🚀 Publier pour les étudiants
          </button>
        </div>
      </div>
    </div>
  )
}