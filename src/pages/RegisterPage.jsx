import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(email, password, fullName)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'inscription')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <strong style={{ fontSize: 20 }}>Signix</strong>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 4px' }}>Créer un compte</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 20px' }}>
          Créez votre compte en quelques secondes
        </p>

        <form onSubmit={handleSubmit}>
          <label>Nom complet</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <label>Email</label>
          <input
            type="email"
            placeholder="exemple@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          {error && <p style={{ color: '#dc2626', fontSize: 13 }}>{error}</p>}
          <button type="submit" style={{ width: '100%' }}>S'inscrire</button>
        </form>

        <p style={{ fontSize: 13, textAlign: 'center', marginTop: 16 }}>
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}