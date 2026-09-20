import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosConfig'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import StatusBadge from '../components/StatusBadge'

export default function DashboardPage() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    api.get('/documents?page=0&size=100')
      .then((res) => setDocuments(res.data.content))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const counts = {
    total: documents.length,
    DRAFT: documents.filter((d) => d.status === 'DRAFT').length,
    SENT: documents.filter((d) => d.status === 'SENT').length,
    SIGNED: documents.filter((d) => d.status === 'SIGNED').length,
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 32, maxWidth: 900 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0 }}>Bonjour, {user?.fullName}</h2>
            <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Voici un aperçu de vos documents
            </p>
          </div>
          <Link to="/upload">
            <button>+ Nouveau document</button>
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <StatCard label="Total" value={counts.total} />
          <StatCard label="Brouillons" value={counts.DRAFT} color="var(--draft-text)" />
          <StatCard label="Envoyés" value={counts.SENT} color="var(--sent-text)" />
          <StatCard label="Signés" value={counts.SIGNED} color="var(--signed-text)" />
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading && <p style={{ padding: 20 }}>Chargement...</p>}
          {!loading && documents.length === 0 && (
            <p style={{ padding: 20, color: 'var(--text-muted)' }}>Aucun document pour l'instant.</p>
          )}
          {!loading && documents.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  <th style={thStyle}>Titre du document</th>
                  <th style={thStyle}>Signataire</th>
                  <th style={thStyle}>Statut</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={tdStyle}>{doc.title}</td>
                    <td style={tdStyle}>{doc.signerEmail || '—'}</td>
                    <td style={tdStyle}><StatusBadge status={doc.status} /></td>
                    <td style={tdStyle}>
                      <Link to={`/documents/${doc.id}`}>Voir</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="card" style={{ flex: 1, textAlign: 'center' }}>
      <p style={{ fontSize: 24, fontWeight: 600, margin: 0, color: color || '#1a1a1a' }}>{value}</p>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>{label}</p>
    </div>
  )
}

const thStyle = { padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }
const tdStyle = { padding: '12px 16px', fontSize: 14 }