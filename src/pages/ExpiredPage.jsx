import { Link } from 'react-router-dom'

export default function ExpiredPage() {
  return (
    <div style={{ maxWidth: 420, margin: '80px auto', padding: '0 20px' }}>
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16, color: '#dc2626' }}>⚠</div>
        <h2 style={{ margin: '0 0 8px' }}>Lien invalide ou expiré</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 24px' }}>
          Ce lien de signature n'est plus valide. Il se peut qu'il ait expiré ou qu'il soit incorrect.
        </p>
        <Link to="/">
          <button>Retourner à l'accueil</button>
        </Link>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 20 }}>
          Besoin d'aide ? Contactez l'expéditeur du document.
        </p>
      </div>
    </div>
  )
}