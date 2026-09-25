import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosConfig'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import StatusBadge from '../components/StatusBadge'

const PAGE_SIZE = 10

export default function DashboardPage() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const { user } = useAuth()

  const loadDocuments = () => {
    setLoading(true)
    const params = { page, size: PAGE_SIZE }
    if (title) params.title = title
    if (status) params.status = status

    api.get('/documents', { params })
      .then((res) => {
        setDocuments(res.data.content)
        setTotalPages(res.data.totalPages)
        setTotalElements(res.data.totalElements)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadDocuments()
  }, [page, status])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(0)
    loadDocuments()
  }

  const handleStatusChange = (e) => {
    setStatus(e.target.value)
    setPage(0)
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 32, maxWidth: 900 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0 }}>Bonjour, {user?.fullName}</h2>
            <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>
              {totalElements} document{totalElements !== 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/upload">
            <button>+ Nouveau document</button>
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ margin: 0 }}
            />
            <button type="submit" className="secondary">Rechercher</button>
          </form>

          <select value={status} onChange={handleStatusChange} style={{ width: 160, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>
            <option value="">Tous les statuts</option>
            <option value="DRAFT">Brouillon</option>
            <option value="SENT">Envoyé</option>
            <option value="SIGNED">Signé</option>
            <option value="EXPIRED">Expiré</option>
          </select>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading && <p style={{ padding: 20 }}>Chargement...</p>}
          {!loading && documents.length === 0 && (
            <p style={{ padding: 20, color: 'var(--text-muted)' }}>Aucun document trouvé.</p>
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

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
            <button
              className="secondary"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Précédent
            </button>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
              Page {page + 1} / {totalPages}
            </span>
            <button
              className="secondary"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Suivant →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const thStyle = { padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }
const tdStyle = { padding: '12px 16px', fontSize: 14 }
