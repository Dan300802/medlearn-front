import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes slideUp {
    from { opacity:0; transform:translateY(30px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes float {
    0%,100% { transform:translateY(0px) rotate(0deg); }
    33%      { transform:translateY(-12px) rotate(2deg); }
    66%      { transform:translateY(-6px) rotate(-1deg); }
  }
  @keyframes pulse-ring {
    0%   { transform:scale(1); opacity:0.6; }
    100% { transform:scale(1.8); opacity:0; }
  }
  @keyframes shimmer {
    0%   { background-position:-200% center; }
    100% { background-position:200% center; }
  }
  @keyframes orbit {
    from { transform:rotate(0deg) translateX(120px) rotate(0deg); }
    to   { transform:rotate(360deg) translateX(120px) rotate(-360deg); }
  }
  @keyframes orbit2 {
    from { transform:rotate(120deg) translateX(160px) rotate(-120deg); }
    to   { transform:rotate(480deg) translateX(160px) rotate(-480deg); }
  }
  @keyframes orbit3 {
    from { transform:rotate(240deg) translateX(100px) rotate(-240deg); }
    to   { transform:rotate(600deg) translateX(100px) rotate(-600deg); }
  }
  @keyframes gradientShift {
    0%,100% { background-position:0% 50%; }
    50%      { background-position:100% 50%; }
  }
  @keyframes blink {
    0%,100% { opacity:1; }
    50%      { opacity:0; }
  }

  .auth-input {
    width:100%; padding:14px 16px; border-radius:14px;
    border:1.5px solid rgba(255,255,255,0.1);
    background:rgba(255,255,255,0.06);
    color:white; font-family:'DM Sans',sans-serif; font-size:14px;
    outline:none; transition:all 0.3s ease; box-sizing:border-box;
  }
  .auth-input::placeholder { color:rgba(255,255,255,0.25); }
  .auth-input:focus {
    border-color:rgba(99,102,241,0.7);
    background:rgba(99,102,241,0.08);
    box-shadow:0 0 0 4px rgba(99,102,241,0.12);
  }

  .auth-btn {
    width:100%; padding:15px; border-radius:16px; border:none; cursor:pointer;
    font-family:'Syne',sans-serif; font-size:15px; font-weight:800;
    letter-spacing:0.03em; transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    position:relative; overflow:hidden;
  }
  .auth-btn:hover  { transform:translateY(-2px); }
  .auth-btn:active { transform:scale(0.98); }
  .auth-btn::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);
    transform:translateX(-100%); transition:transform 0.5s ease;
  }
  .auth-btn:hover::after { transform:translateX(100%); }
`

function FloatingOrbs() {
  return (
    <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      {/* Orbe principal */}
      <div style={{
        position:'absolute', top:'10%', left:'15%',
        width:'300px', height:'300px', borderRadius:'50%',
        background:'radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%)',
        animation:'float 6s ease-in-out infinite',
      }} />
      <div style={{
        position:'absolute', bottom:'15%', right:'10%',
        width:'250px', height:'250px', borderRadius:'50%',
        background:'radial-gradient(circle,rgba(139,92,246,0.15) 0%,transparent 70%)',
        animation:'float 8s ease-in-out infinite', animationDelay:'2s',
      }} />
      <div style={{
        position:'absolute', top:'50%', right:'20%',
        width:'180px', height:'180px', borderRadius:'50%',
        background:'radial-gradient(circle,rgba(59,130,246,0.12) 0%,transparent 70%)',
        animation:'float 7s ease-in-out infinite', animationDelay:'4s',
      }} />

      {/* Particules */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position:'absolute',
          width:`${Math.random()*4+1}px`, height:`${Math.random()*4+1}px`,
          borderRadius:'50%',
          background:`rgba(${Math.random()>0.5?'99,102,241':'139,92,246'},${Math.random()*0.4+0.1})`,
          left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
          animation:`float ${Math.random()*6+4}s ease-in-out infinite`,
          animationDelay:`${Math.random()*5}s`,
        }} />
      ))}

      {/* Grille */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:`linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),
          linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px)`,
        backgroundSize:'50px 50px',
      }} />
    </div>
  )
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email:'', password:'' })
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  useEffect(() => {
    const s = document.createElement('style')
    s.textContent = globalStyles
    document.head.appendChild(s)
    return () => document.head.removeChild(s)
  }, [])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
  e.preventDefault()
  setErreur('')
  setLoading(true)
  await new Promise(r => setTimeout(r, 800))

  // Mock étudiant
  if (form.email === 'etudiant@test.com' && form.password === '1234') {
    login({ nom:'Ahmed Diallo', email:form.email, role:'etudiant' }, 'mock-token-123')
    navigate('/dashboard')
  }
  // Mock enseignant
  else if (form.email === 'enseignant@test.com' && form.password === '1234') {
    login({ nom:'Dr. Kofi Mensah', email:form.email, role:'enseignant' }, 'mock-token-456')
    navigate('/enseignant')
  }
  else {
    setErreur('Email ou mot de passe incorrect')
    setLoading(false)
  }
}

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg,#0a0a1a 0%,#0f0c29 40%,#1a0a3e 100%)',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:"'DM Sans',sans-serif", padding:'20px', position:'relative',
    }}>
      <FloatingOrbs />

      {/* Card */}
      <div style={{
        width:'100%', maxWidth:'420px', position:'relative', zIndex:10,
        animation:'slideUp 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
      }}>

        {/* Halo derrière la card */}
        <div style={{
          position:'absolute', inset:'-20px',
          background:'radial-gradient(ellipse,rgba(99,102,241,0.15) 0%,transparent 70%)',
          borderRadius:'40px', pointerEvents:'none',
        }} />

        <div style={{
          background:'rgba(255,255,255,0.05)',
          backdropFilter:'blur(24px)',
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:'28px', padding:'36px 32px',
          boxShadow:'0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        }}>

          {/* Logo animé */}
          <div style={{ textAlign:'center', marginBottom:'32px' }}>
            <div style={{ position:'relative', display:'inline-block', marginBottom:'16px' }}>
              <div style={{
                width:'72px', height:'72px', borderRadius:'22px',
                background:'linear-gradient(135deg,#6366F1,#8B5CF6)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'32px', margin:'0 auto',
                boxShadow:'0 8px 32px rgba(99,102,241,0.4)',
                animation:'float 4s ease-in-out infinite',
              }}>🏥</div>
              {/* Ring animé */}
              <div style={{
                position:'absolute', inset:'-8px', borderRadius:'30px',
                border:'2px solid rgba(99,102,241,0.3)',
                animation:'pulse-ring 2s ease-out infinite',
              }} />
            </div>

            <h1 style={{
              fontFamily:"'Syne',sans-serif", fontSize:'26px', fontWeight:800,
              margin:'0 0 4px',
              background:'linear-gradient(135deg,#ffffff,#a5b4fc)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>MedLearn Pro</h1>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'13px', margin:0 }}>
              Connexion à votre espace
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom:'14px' }}>
              <label style={{ display:'block', color:'rgba(255,255,255,0.6)',
                fontSize:'12px', fontWeight:600, marginBottom:'6px',
                letterSpacing:'0.05em', textTransform:'uppercase' }}>
                Email
              </label>
              <div style={{ position:'relative' }}>
                <span style={{
                  position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)',
                  fontSize:'16px', pointerEvents:'none',
                }}>✉️</span>
                <input
                  type="email" name="email" value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="votre@email.com"
                  required
                  className="auth-input"
                  style={{ paddingLeft:'42px' }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom:'20px' }}>
              <label style={{ display:'block', color:'rgba(255,255,255,0.6)',
                fontSize:'12px', fontWeight:600, marginBottom:'6px',
                letterSpacing:'0.05em', textTransform:'uppercase' }}>
                Mot de passe
              </label>
              <div style={{ position:'relative' }}>
                <span style={{
                  position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)',
                  fontSize:'16px', pointerEvents:'none',
                }}>🔒</span>
                <input
                  type="password" name="password" value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  required
                  className="auth-input"
                  style={{ paddingLeft:'42px' }}
                />
              </div>
            </div>

            {/* Erreur */}
            {erreur && (
              <div style={{
                background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)',
                borderRadius:'12px', padding:'10px 14px', marginBottom:'16px',
                animation:'slideUp 0.3s ease both',
                display:'flex', alignItems:'center', gap:'8px',
              }}>
                <span>⚠️</span>
                <span style={{ color:'#FCA5A5', fontSize:'13px' }}>{erreur}</span>
              </div>
            )}

            {/* Bouton */}
            <button type="submit" className="auth-btn"
              disabled={loading}
              style={{
                background: loading
                  ? 'rgba(99,102,241,0.5)'
                  : 'linear-gradient(135deg,#6366F1 0%,#8B5CF6 100%)',
                color:'white',
                boxShadow: loading ? 'none' : '0 8px 32px rgba(99,102,241,0.4)',
              }}>
              {loading ? (
                <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                  <span style={{
                    width:'16px', height:'16px', borderRadius:'50%',
                    border:'2px solid rgba(255,255,255,0.3)',
                    borderTopColor:'white', display:'inline-block',
                    animation:'rotate-slow 0.8s linear infinite',
                  }} />
                  Connexion...
                </span>
              ) : '→ Se connecter'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'20px 0' }}>
            <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.08)' }} />
            <span style={{ color:'rgba(255,255,255,0.25)', fontSize:'12px' }}>ou</span>
            <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Lien inscription */}
          <p style={{ textAlign:'center', color:'rgba(255,255,255,0.4)', fontSize:'13px', margin:0 }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color:'#A5B4FC', fontWeight:700, textDecoration:'none' }}>
              S'inscrire gratuitement →
            </Link>
          </p>

          {/* Hint test */}
          <div style={{
            marginTop:'20px', background:'rgba(99,102,241,0.08)',
            border:'1px solid rgba(99,102,241,0.2)', borderRadius:'14px',
            padding:'10px 14px', display:'flex', alignItems:'center', gap:'8px',
          }}>
            <span style={{ fontSize:'14px' }}>🧪</span>
            <div>
              <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'11px', margin:0 }}>
                Mode démo · <span style={{ color:'#A5B4FC' }}>etudiant@test.com</span>
                {' '}/ <span style={{ color:'#A5B4FC' }}>1234</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}