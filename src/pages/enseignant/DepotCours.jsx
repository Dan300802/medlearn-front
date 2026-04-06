import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
  @keyframes slideUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes spin {
    from { transform:rotate(0deg); }
    to   { transform:rotate(360deg); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.6; transform:scale(0.97); }
  }
  @keyframes progressFill {
    from { width:0%; }
  }
  @keyframes float {
    0%,100% { transform:translateY(0); }
    50%      { transform:translateY(-6px); }
  }
  @keyframes typewriter {
    from { opacity:0; transform:translateX(-4px); }
    to   { opacity:1; transform:translateX(0); }
  }

  .depot-btn {
    transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    cursor:pointer;
  }
  .depot-btn:hover  { transform:translateY(-2px); }
  .depot-btn:active { transform:scale(0.97); }

  .drop-zone {
    transition:all 0.3s ease;
    cursor:pointer;
  }
  .drop-zone:hover {
    border-color:rgba(16,185,129,0.6) !important;
    background:rgba(16,185,129,0.08) !important;
  }
  .drop-zone.dragover {
    border-color:#10B981 !important;
    background:rgba(16,185,129,0.12) !important;
    transform:scale(1.01);
  }

  .tab-btn {
    transition:all 0.25s ease;
    cursor:pointer;
  }

  textarea.depot-textarea {
    width:100%; min-height:180px; padding:14px;
    border-radius:14px; border:1.5px solid rgba(255,255,255,0.1);
    background:rgba(255,255,255,0.04);
    color:white; font-family:'DM Sans',sans-serif; font-size:14px;
    outline:none; resize:vertical; box-sizing:border-box;
    line-height:1.6; transition:all 0.3s ease;
  }
  textarea.depot-textarea::placeholder { color:rgba(255,255,255,0.2); }
  textarea.depot-textarea:focus {
    border-color:rgba(16,185,129,0.5);
    background:rgba(16,185,129,0.06);
    box-shadow:0 0 0 4px rgba(16,185,129,0.1);
  }
`

const etapesIA = [
  { label:'Lecture du contenu',         icon:'📖', duree:1200 },
  { label:'Analyse médicale',           icon:'🔬', duree:1500 },
  { label:'Génération des QCM',         icon:'📝', duree:2000 },
  { label:'Création des cas cliniques', icon:'🩺', duree:2000 },
  { label:'Annotations anatomiques',    icon:'🧬', duree:1500 },
  { label:'Finalisation',               icon:'✨', duree:800  },
]

export default function DepotCours() {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [onglet, setOnglet] = useState('pdf')
  const [fichier, setFichier] = useState(null)
  const [texte, setTexte] = useState('')
  const [titre, setTitre] = useState('')
  const [specialite, setSpecialite] = useState('Cardiologie')
  const [dragOver, setDragOver] = useState(false)
  const [generation, setGeneration] = useState(false)
  const [etapeEnCours, setEtapeEnCours] = useState(0)
  const [etapesFaites, setEtapesFaites] = useState([])
  const [progression, setProgression] = useState(0)

  const specialites = [
    'Cardiologie','Neurologie','Infectiologie','Hématologie',
    'Pneumologie','Chirurgie','Endocrinologie','Pharmacologie','Urgences',
  ]

  useEffect(() => {
    const s = document.createElement('style')
    s.textContent = globalStyles
    document.head.appendChild(s)
    return () => document.head.removeChild(s)
  }, [])

  const handleFile = (file) => {
    if (!file) return
    if (file.type === 'application/pdf' || file.type.startsWith('text/')) {
      setFichier(file)
    } else {
      alert('Veuillez déposer un fichier PDF ou texte.')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const peutGenerer = titre.trim() &&
    (onglet === 'pdf' ? fichier : texte.trim().length > 100)

  const lancerGeneration = async () => {
    if (!peutGenerer) return
    setGeneration(true)
    setEtapesFaites([])
    setEtapeEnCours(0)
    setProgression(0)

    let prog = 0
    for (let i = 0; i < etapesIA.length; i++) {
      setEtapeEnCours(i)
      await new Promise(r => setTimeout(r, etapesIA[i].duree))
      setEtapesFaites(f => [...f, i])
      prog = Math.round(((i + 1) / etapesIA.length) * 100)
      setProgression(prog)
    }

    // Sauvegarde des données pour la page résultat
    const donnees = {
      titre, specialite,
      source: onglet === 'pdf' ? fichier?.name : 'Texte saisi',
      texteContenu: texte,
    }
    localStorage.setItem('cours-genere', JSON.stringify(donnees))
    navigate('/enseignant/resultat')
  }

  // ── LOADING IA ─────────────────────────────────────────────────────────────
  if (generation) return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(160deg,#080818 0%,#0d1b2e 50%,#0a0f1e 100%)',
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', padding:'20px', fontFamily:"'DM Sans',sans-serif",
    }}>
      <div style={{ width:'100%', maxWidth:'420px', textAlign:'center' }}>

        {/* Icône IA animée */}
        <div style={{ fontSize:'64px', marginBottom:'20px',
          animation:'float 2s ease-in-out infinite',
          filter:'drop-shadow(0 0 30px rgba(16,185,129,0.5))' }}>🤖</div>

        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'22px', fontWeight:800,
          color:'white', margin:'0 0 4px' }}>Analyse en cours...</h2>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px', margin:'0 0 32px' }}>
          L'IA génère le contenu pédagogique
        </p>

        {/* Barre de progression */}
        <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:'8px',
          height:'8px', overflow:'hidden', marginBottom:'28px',
          boxShadow:'0 0 20px rgba(16,185,129,0.2)' }}>
          <div style={{
            height:'100%', borderRadius:'8px',
            background:'linear-gradient(90deg,#10B981,#6366F1)',
            width:`${progression}%`, transition:'width 0.5s ease',
            boxShadow:'0 0 12px rgba(16,185,129,0.6)',
          }} />
        </div>

        {/* Étapes */}
        <div style={{ display:'flex', flexDirection:'column', gap:'8px', textAlign:'left' }}>
          {etapesIA.map((e, i) => {
            const fait = etapesFaites.includes(i)
            const enCours = etapeEnCours === i && !fait
            return (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:'10px',
                padding:'10px 14px', borderRadius:'14px',
                background: fait ? 'rgba(16,185,129,0.1)'
                  : enCours ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                border: fait ? '1px solid rgba(16,185,129,0.25)'
                  : enCours ? '1px solid rgba(99,102,241,0.25)' : '1px solid rgba(255,255,255,0.05)',
                transition:'all 0.4s ease',
                opacity: i > etapeEnCours ? 0.35 : 1,
              }}>
                <span style={{ fontSize:'18px', flexShrink:0,
                  animation: enCours ? 'pulse 1s ease-in-out infinite' : 'none' }}>
                  {fait ? '✅' : enCours ? e.icon : e.icon}
                </span>
                <span style={{
                  fontSize:'13px', fontWeight: enCours ? 700 : 500,
                  color: fait ? '#10B981' : enCours ? 'white' : 'rgba(255,255,255,0.4)',
                  transition:'all 0.3s ease',
                }}>{e.label}</span>
                {enCours && (
                  <div style={{ marginLeft:'auto', flexShrink:0 }}>
                    <div style={{
                      width:'16px', height:'16px', borderRadius:'50%',
                      border:'2px solid rgba(255,255,255,0.2)',
                      borderTopColor:'white',
                      animation:'spin 0.8s linear infinite',
                    }} />
                  </div>
                )}
                {fait && (
                  <span style={{ marginLeft:'auto', color:'#10B981',
                    fontSize:'12px', fontWeight:700 }}>
                    {progression < 100 ? '' : ''}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        <p style={{ color:'rgba(255,255,255,0.25)', fontSize:'11px', marginTop:'20px' }}>
          {progression}% complété
        </p>
      </div>
    </div>
  )

  // ── FORMULAIRE ─────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(160deg,#080818 0%,#0d1b2e 50%,#0a0f1e 100%)',
      fontFamily:"'DM Sans',sans-serif",
    }}>
      {/* Fond */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'300px', height:'300px',
          borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,0.1) 0%,transparent 65%)' }} />
        <div style={{ position:'absolute', inset:0,
          backgroundImage:`linear-gradient(rgba(16,185,129,0.02) 1px,transparent 1px),
            linear-gradient(90deg,rgba(16,185,129,0.02) 1px,transparent 1px)`,
          backgroundSize:'50px 50px' }} />
      </div>

      {/* Navbar */}
      <nav style={{ position:'sticky', top:0, zIndex:100,
        background:'rgba(8,8,24,0.9)', backdropFilter:'blur(24px)',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
        padding:'0 16px', height:'56px',
        display:'flex', alignItems:'center', gap:'12px' }}>
        <button onClick={() => navigate('/enseignant')} className="depot-btn"
          style={{ width:'36px', height:'36px', borderRadius:'10px',
            background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)',
            color:'white', fontSize:'18px',
            display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:'15px',
          fontWeight:800, color:'white' }}>Nouveau cours</span>
        <span style={{ fontSize:'10px', color:'#10B981', fontWeight:700,
          background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.25)',
          padding:'2px 8px', borderRadius:'8px' }}>IA</span>
      </nav>

      <div style={{ maxWidth:'600px', margin:'0 auto', padding:'20px 16px 80px',
        position:'relative', zIndex:1 }}>

        {/* Titre */}
        <div style={{ marginBottom:'20px', animation:'slideUp 0.4s ease both' }}>
          <label style={{ display:'block', color:'rgba(255,255,255,0.5)',
            fontSize:'11px', fontWeight:700, letterSpacing:'0.08em',
            textTransform:'uppercase', marginBottom:'8px' }}>
            Titre du cours *
          </label>
          <input
            type="text" value={titre} onChange={e => setTitre(e.target.value)}
            placeholder="Ex: Cardiologie — Insuffisance cardiaque aiguë"
            style={{
              width:'100%', padding:'13px 16px', borderRadius:'14px',
              border:'1.5px solid rgba(255,255,255,0.1)',
              background:'rgba(255,255,255,0.05)',
              color:'white', fontFamily:"'DM Sans',sans-serif", fontSize:'14px',
              outline:'none', boxSizing:'border-box', transition:'all 0.3s ease',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'rgba(16,185,129,0.5)'
              e.target.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.1)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(255,255,255,0.1)'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        {/* Spécialité */}
        <div style={{ marginBottom:'20px', animation:'slideUp 0.4s ease 0.05s both', opacity:0 }}>
          <label style={{ display:'block', color:'rgba(255,255,255,0.5)',
            fontSize:'11px', fontWeight:700, letterSpacing:'0.08em',
            textTransform:'uppercase', marginBottom:'8px' }}>
            Spécialité médicale
          </label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
            {specialites.map(s => (
              <button key={s} onClick={() => setSpecialite(s)}
                className="depot-btn"
                style={{
                  padding:'6px 14px', borderRadius:'20px', border:'none',
                  background: specialite === s
                    ? 'linear-gradient(135deg,#10B981,#059669)'
                    : 'rgba(255,255,255,0.06)',
                  border: specialite === s
                    ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  color:'white', fontSize:'12px', fontWeight:600,
                  boxShadow: specialite === s ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Onglets PDF / Texte */}
        <div style={{ animation:'slideUp 0.4s ease 0.1s both', opacity:0 }}>
          <label style={{ display:'block', color:'rgba(255,255,255,0.5)',
            fontSize:'11px', fontWeight:700, letterSpacing:'0.08em',
            textTransform:'uppercase', marginBottom:'10px' }}>
            Contenu du cours *
          </label>

          {/* Tabs */}
          <div style={{ display:'flex', gap:'4px', background:'rgba(255,255,255,0.04)',
            borderRadius:'14px', padding:'4px', marginBottom:'14px' }}>
            {[
              { id:'pdf', label:'📄 Fichier PDF', },
              { id:'texte', label:'✏️ Saisir le texte' },
            ].map(t => (
              <button key={t.id} onClick={() => setOnglet(t.id)}
                className="tab-btn"
                style={{
                  flex:1, padding:'10px', borderRadius:'10px', border:'none',
                  background: onglet === t.id
                    ? 'linear-gradient(135deg,#10B981,#059669)'
                    : 'transparent',
                  color: onglet === t.id ? 'white' : 'rgba(255,255,255,0.4)',
                  fontSize:'13px', fontWeight:700,
                  fontFamily:"'Syne',sans-serif",
                  boxShadow: onglet === t.id ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Zone PDF */}
          {onglet === 'pdf' && (
            <div
              className={`drop-zone${dragOver ? ' dragover' : ''}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border:'2px dashed rgba(16,185,129,0.3)',
                borderRadius:'20px', padding:'32px 20px', textAlign:'center',
                background:'rgba(16,185,129,0.04)',
              }}
            >
              <input ref={fileRef} type="file" accept=".pdf,.txt"
                onChange={e => handleFile(e.target.files[0])}
                style={{ display:'none' }} />

              {fichier ? (
                <div>
                  <div style={{ fontSize:'40px', marginBottom:'8px' }}>✅</div>
                  <p style={{ color:'#10B981', fontWeight:700, fontSize:'14px', margin:'0 0 4px' }}>
                    {fichier.name}
                  </p>
                  <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px', margin:'0 0 12px' }}>
                    {(fichier.size / 1024).toFixed(0)} Ko
                  </p>
                  <button onClick={e => { e.stopPropagation(); setFichier(null) }}
                    className="depot-btn"
                    style={{ padding:'6px 16px', borderRadius:'10px', border:'none',
                      background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.25)',
                      color:'#FCA5A5', fontSize:'12px', fontWeight:600 }}>
                    Changer de fichier
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize:'40px', marginBottom:'10px',
                    animation:'float 3s ease-in-out infinite' }}>📄</div>
                  <p style={{ color:'white', fontWeight:700, fontSize:'14px', margin:'0 0 4px',
                    fontFamily:"'Syne',sans-serif" }}>
                    Glisser votre PDF ici
                  </p>
                  <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px', margin:'0 0 14px' }}>
                    ou cliquer pour sélectionner
                  </p>
                  <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.25)',
                    background:'rgba(255,255,255,0.05)', padding:'4px 12px', borderRadius:'8px' }}>
                    PDF · TXT · Max 10 Mo
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Zone texte */}
          {onglet === 'texte' && (
            <div>
              <textarea
                className="depot-textarea"
                value={texte}
                onChange={e => setTexte(e.target.value)}
                placeholder="Collez ou saisissez ici le contenu de votre cours médical...&#10;&#10;Ex: L'insuffisance cardiaque est un syndrome clinique caractérisé par..."
              />
              <p style={{ color:'rgba(255,255,255,0.25)', fontSize:'11px',
                marginTop:'6px', textAlign:'right' }}>
                {texte.length} caractères
                {texte.length < 100 && texte.length > 0 && (
                  <span style={{ color:'#F59E0B' }}> · minimum 100 requis</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Aperçu génération */}
        {peutGenerer && (
          <div style={{
            marginTop:'20px', background:'rgba(16,185,129,0.08)',
            border:'1px solid rgba(16,185,129,0.2)', borderRadius:'18px', padding:'16px',
            animation:'slideUp 0.3s ease both',
          }}>
            <p style={{ color:'#10B981', fontSize:'12px', fontWeight:700,
              textTransform:'uppercase', letterSpacing:'0.06em', margin:'0 0 10px' }}>
              ✨ L'IA va générer
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px' }}>
              {[
                { icon:'📝', label:'10 QCM', desc:'avec corrections' },
                { icon:'🩺', label:'1 Cas clinique', desc:'4 étapes' },
                { icon:'🧬', label:'Anatomie', desc:'organes liés' },
              ].map((g, i) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.04)',
                  borderRadius:'12px', padding:'10px', textAlign:'center' }}>
                  <div style={{ fontSize:'20px', marginBottom:'4px' }}>{g.icon}</div>
                  <div style={{ color:'white', fontSize:'11px', fontWeight:700,
                    fontFamily:"'Syne',sans-serif" }}>{g.label}</div>
                  <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'10px' }}>{g.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bouton fixé en bas */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:'16px',
        background:'linear-gradient(0deg,rgba(8,8,24,1) 0%,transparent 100%)', zIndex:100 }}>
        <div style={{ maxWidth:'600px', margin:'0 auto' }}>
          <button onClick={lancerGeneration} className="depot-btn"
            disabled={!peutGenerer}
            style={{
              width:'100%', padding:'16px', borderRadius:'18px', border:'none',
              background: peutGenerer
                ? 'linear-gradient(135deg,#10B981,#6366F1)'
                : 'rgba(255,255,255,0.06)',
              color: peutGenerer ? 'white' : 'rgba(255,255,255,0.25)',
              fontSize:'15px', fontWeight:700, fontFamily:"'Syne',sans-serif",
              boxShadow: peutGenerer ? '0 8px 32px rgba(16,185,129,0.35)' : 'none',
            }}>
            {peutGenerer ? '🤖 Générer avec l\'IA' : 'Remplissez les champs requis'}
          </button>
        </div>
      </div>
    </div>
  )
}