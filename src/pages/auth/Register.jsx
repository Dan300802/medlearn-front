import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
  @keyframes slideUp {
    from { opacity:0; transform:translateY(30px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes float {
    0%,100% { transform:translateY(0px); }
    50%      { transform:translateY(-10px); }
  }
  @keyframes pulse-ring {
    0%   { transform:scale(1); opacity:0.6; }
    100% { transform:scale(1.8); opacity:0; }
  }
  @keyframes checkPop {
    0%   { transform:scale(0) rotate(-180deg); opacity:0; }
    70%  { transform:scale(1.2) rotate(10deg); }
    100% { transform:scale(1) rotate(0deg); opacity:1; }
  }
  @keyframes rotate-slow {
    from { transform:rotate(0deg); }
    to   { transform:rotate(360deg); }
  }

  .auth-input {
    width:100%; padding:13px 16px; border-radius:13px;
    border:1.5px solid rgba(255,255,255,0.1);
    background:rgba(255,255,255,0.06);
    color:white; font-family:'DM Sans',sans-serif; font-size:14px;
    outline:none; transition:all 0.3s ease; box-sizing:border-box;
  }
  .auth-input::placeholder { color:rgba(255,255,255,0.25); }
  .auth-input:focus {
    border-color:rgba(139,92,246,0.7);
    background:rgba(139,92,246,0.08);
    box-shadow:0 0 0 4px rgba(139,92,246,0.12);
  }

  .role-card {
    flex:1; padding:14px 10px; border-radius:14px; border:2px solid;
    cursor:pointer; text-align:center; transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    font-family:'DM Sans',sans-serif;
  }
  .role-card:hover { transform:translateY(-3px); }

  .auth-btn {
    width:100%; padding:15px; border-radius:16px; border:none; cursor:pointer;
    font-family:'Syne',sans-serif; font-size:15px; font-weight:800;
    transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    position:relative; overflow:hidden;
  }
  .auth-btn:hover  { transform:translateY(-2px); }
  .auth-btn:active { transform:scale(0.98); }
`

function FloatingOrbs() {
  return (
    <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      <div style={{
        position:'absolute', top:'5%', right:'10%', width:'280px', height:'280px',
        borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 70%)',
        animation:'float 7s ease-in-out infinite',
      }} />
      <div style={{
        position:'absolute', bottom:'10%', left:'5%', width:'220px', height:'220px',
        borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)',
        animation:'float 9s ease-in-out infinite', animationDelay:'3s',
      }} />
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:`linear-gradient(rgba(139,92,246,0.03) 1px,transparent 1px),
          linear-gradient(90deg,rgba(139,92,246,0.03) 1px,transparent 1px)`,
        backgroundSize:'50px 50px',
      }} />
      {[...Array(15)].map((_,i) => (
        <div key={i} style={{
          position:'absolute',
          width:`${Math.random()*3+1}px`, height:`${Math.random()*3+1}px`,
          borderRadius:'50%', background:`rgba(139,92,246,${Math.random()*0.4+0.1})`,
          left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
          animation:`float ${Math.random()*6+4}s ease-in-out infinite`,
          animationDelay:`${Math.random()*5}s`,
        }} />
      ))}
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nom:'', email:'', password:'', role:'etudiant' })
  const [succes, setSucces] = useState(false)
  const [loading, setLoading] = useState(false)
  const [etape, setEtape] = useState(1)

  useEffect(() => {
    const s = document.createElement('style')
    s.textContent = globalStyles
    document.head.appendChild(s)
    return () => document.head.removeChild(s)
  }, [])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSucces(true)
  }

  const roles = [
    { id:'etudiant', icon:'👨‍⚕️', label:'Étudiant', desc:'En médecine' },
    { id:'enseignant', icon:'👨‍🏫', label:'Enseignant', desc:'Médecin / Prof' },
  ]

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg,#0a0a1a 0%,#1a0533 40%,#0f0c29 100%)',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:"'DM Sans',sans-serif", padding:'20px', position:'relative',
    }}>
      <FloatingOrbs />

      <div style={{
        width:'100%', maxWidth:'420px', position:'relative', zIndex:10,
        animation:'slideUp 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
      }}>
        <div style={{ position:'absolute', inset:'-20px',
          background:'radial-gradient(ellipse,rgba(139,92,246,0.12) 0%,transparent 70%)',
          borderRadius:'40px', pointerEvents:'none' }} />

        <div style={{
          background:'rgba(255,255,255,0.05)', backdropFilter:'blur(24px)',
          border:'1px solid rgba(255,255,255,0.1)', borderRadius:'28px',
          padding:'36px 32px',
          boxShadow:'0 32px 80px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.05)',
        }}>

          {succes ? (
            /* ── Succès ── */
            <div style={{ textAlign:'center', animation:'slideUp 0.5s ease both' }}>
              <div style={{
                width:'80px', height:'80px', borderRadius:'24px', margin:'0 auto 20px',
                background:'linear-gradient(135deg,#10B981,#059669)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'36px',
                boxShadow:'0 8px 32px rgba(16,185,129,0.4)',
                animation:'checkPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
              }}>✓</div>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'22px', fontWeight:800,
                color:'white', margin:'0 0 8px' }}>Compte créé !</h2>
              <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'13px', margin:'0 0 28px' }}>
                Bienvenue sur MedLearn Pro, {form.nom.split(' ')[0]} 👋
              </p>
              <button onClick={() => navigate('/login')} className="auth-btn"
                style={{ background:'linear-gradient(135deg,#6366F1,#8B5CF6)',
                  color:'white', boxShadow:'0 8px 32px rgba(99,102,241,0.4)' }}>
                → Se connecter maintenant
              </button>
            </div>
          ) : (
            <>
              {/* Logo */}
              <div style={{ textAlign:'center', marginBottom:'28px' }}>
                <div style={{ position:'relative', display:'inline-block', marginBottom:'14px' }}>
                  <div style={{
                    width:'64px', height:'64px', borderRadius:'20px',
                    background:'linear-gradient(135deg,#8B5CF6,#6366F1)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'28px', margin:'0 auto',
                    boxShadow:'0 8px 32px rgba(139,92,246,0.4)',
                    animation:'float 4s ease-in-out infinite',
                  }}>🏥</div>
                  <div style={{ position:'absolute', inset:'-8px', borderRadius:'28px',
                    border:'2px solid rgba(139,92,246,0.3)',
                    animation:'pulse-ring 2s ease-out infinite' }} />
                </div>
                <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'24px', fontWeight:800,
                  margin:'0 0 4px',
                  background:'linear-gradient(135deg,#ffffff,#c4b5fd)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  Créer un compte
                </h1>
                <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px', margin:0 }}>
                  Rejoignez MedLearn Pro gratuitement
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Nom */}
                <div style={{ marginBottom:'12px' }}>
                  <label style={{ display:'block', color:'rgba(255,255,255,0.5)',
                    fontSize:'11px', fontWeight:600, marginBottom:'5px',
                    letterSpacing:'0.06em', textTransform:'uppercase' }}>Nom complet</label>
                  <div style={{ position:'relative' }}>
                    <span style={{ position:'absolute', left:'13px', top:'50%',
                      transform:'translateY(-50%)', fontSize:'15px', pointerEvents:'none' }}>👤</span>
                    <input type="text" name="nom" value={form.nom} onChange={handleChange}
                      placeholder="Ahmed Diallo" required className="auth-input"
                      style={{ paddingLeft:'40px' }} />
                  </div>
                </div>

                {/* Email */}
                <div style={{ marginBottom:'12px' }}>
                  <label style={{ display:'block', color:'rgba(255,255,255,0.5)',
                    fontSize:'11px', fontWeight:600, marginBottom:'5px',
                    letterSpacing:'0.06em', textTransform:'uppercase' }}>Email</label>
                  <div style={{ position:'relative' }}>
                    <span style={{ position:'absolute', left:'13px', top:'50%',
                      transform:'translateY(-50%)', fontSize:'15px', pointerEvents:'none' }}>✉️</span>
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="votre@email.com" required className="auth-input"
                      style={{ paddingLeft:'40px' }} />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom:'16px' }}>
                  <label style={{ display:'block', color:'rgba(255,255,255,0.5)',
                    fontSize:'11px', fontWeight:600, marginBottom:'5px',
                    letterSpacing:'0.06em', textTransform:'uppercase' }}>Mot de passe</label>
                  <div style={{ position:'relative' }}>
                    <span style={{ position:'absolute', left:'13px', top:'50%',
                      transform:'translateY(-50%)', fontSize:'15px', pointerEvents:'none' }}>🔒</span>
                    <input type="password" name="password" value={form.password} onChange={handleChange}
                      placeholder="••••••••" required className="auth-input"
                      style={{ paddingLeft:'40px' }} />
                  </div>
                </div>

                {/* Rôle */}
                <div style={{ marginBottom:'20px' }}>
                  <label style={{ display:'block', color:'rgba(255,255,255,0.5)',
                    fontSize:'11px', fontWeight:600, marginBottom:'8px',
                    letterSpacing:'0.06em', textTransform:'uppercase' }}>Je suis</label>
                  <div style={{ display:'flex', gap:'10px' }}>
                    {roles.map(r => (
                      <div key={r.id} onClick={() => setForm({ ...form, role:r.id })}
                        className="role-card"
                        style={{
                          borderColor: form.role === r.id ? '#8B5CF6' : 'rgba(255,255,255,0.08)',
                          background: form.role === r.id ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                          boxShadow: form.role === r.id ? '0 0 20px rgba(139,92,246,0.2)' : 'none',
                        }}>
                        <div style={{ fontSize:'24px', marginBottom:'4px' }}>{r.icon}</div>
                        <div style={{ color:'white', fontSize:'13px', fontWeight:700,
                          fontFamily:"'Syne',sans-serif" }}>{r.label}</div>
                        <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'11px' }}>{r.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="auth-btn" disabled={loading}
                  style={{
                    background: loading ? 'rgba(139,92,246,0.5)'
                      : 'linear-gradient(135deg,#8B5CF6,#6366F1)',
                    color:'white',
                    boxShadow: loading ? 'none' : '0 8px 32px rgba(139,92,246,0.4)',
                  }}>
                  {loading ? (
                    <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                      <span style={{ width:'16px', height:'16px', borderRadius:'50%',
                        border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white',
                        display:'inline-block', animation:'rotate-slow 0.8s linear infinite' }} />
                      Création en cours...
                    </span>
                  ) : '✨ Créer mon compte'}
                </button>
              </form>

              <p style={{ textAlign:'center', color:'rgba(255,255,255,0.35)',
                fontSize:'13px', margin:'20px 0 0' }}>
                Déjà un compte ?{' '}
                <Link to="/login" style={{ color:'#C4B5FD', fontWeight:700, textDecoration:'none' }}>
                  Se connecter →
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}