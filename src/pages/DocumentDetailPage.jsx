import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'
import Sidebar from '../components/Sidebar'
import StatusBadge from '../components/StatusBadge'

export default function DocumentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [docData, setDocData] = useState(null)
  const [history, setHistory] = useState([])
  const [signerEmail, setSignerEmail] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const loadDocument = () => {
    api.get(`/documents?page=0&size=100`)
      .then((res) => {
        const doc = res.data.content.find((d) => d.id === Number(id))
        setDocData(doc)
      })
  }

  useEffect(() => {
    loadDocument()
    api.get(`/documents/${id}/history?page=0&size=20`)
      .then((res) => setHistory(res.data.content))
  }, [id])

  const handleSend = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post(`/documents/${id}/send`, { signerEmail })
      loadDocument()
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'envoi')
    }
  }

  const handleDownload = async () => {
    const res = await api.get(`/documents/${id}/download`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = window.document.createElement('a')
    link.href = url
    link.setAttribute('download', 'document.pdf')
    window.document.body.appendChild(link)
    link.click()
  }

  const handleDelete = async () => {
    await api.delete(`/documents/${id}`)
    navigate('/')
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/sign/${docData.signingToken}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!docData) return <p style={{ padding: 32 }}>Chargement...</p>

  const actionLabels = {
    DOCUMENT_CREATED: 'Document créé',
    DOCUMENT_SENT: 'Document envoyé',
    DOCUMENT_VIEWED: 'Document consulté',
    DOCUMENT_SIGNED: 'Document signé',
    DOCUMENT_EXPIRED: 'Lien expiré',
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 32, maxWidth: 900 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <button className="secondary" onClick={() => navigate('/')}>← Retour aux documents</button>
          <StatusBadge status={docData.status} />
        </div>

        <h2 style={{ margin: '0 0 4px' }}>{docData.title}</h2>
        <p style={{ color: 'var(--text-muted)', margin: '0 0 24px' }}>
          {docData.sentAt ? `Envoyé le ${new Date(docData.sentAt).toLocaleString()}` : 'Non encore envoyé'}
        </p>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <div className="card" style={{ flex: 1, minHeight: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>📄</div>
              <p>Aperçu du document PDF</p>
            </div>
          </div>

          <div style={{ width: 260, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <p style={detailLabel}>Signataire</p>
              <p style={detailValue}>{docData.signerEmail || '—'}</p>

              <p style={detailLabel}>Statut</p>
              <p style={detailValue}><StatusBadge status={docData.status} /></p>

              <p style={detailLabel}>Créé le</p>
              <p style={detailValue}>{new Date(docData.createdAt).toLocaleString()}</p>

              {docData.sentAt && (
                <>
                  <p style={detailLabel}>Envoyé le</p>
                  <p style={detailValue}>{new Date(docData.sentAt).toLocaleString()}</p>
                </>
              )}

              {docData.signedAt && (
                <>
                  <p style={detailLabel}>Signé le</p>
                  <p style={detailValue}>{new Date(docData.signedAt).toLocaleString()}</p>
                </>
              )}
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {docData.status === 'SENT' && docData.signingToken && (
                <button onClick={handleCopyLink}>
                  {copied ? 'Lien copié !' : 'Copier le lien de signature'}
                </button>
              )}

              {(docData.status === 'SENT' || docData.status === 'SIGNED') && (
                <button className="secondary" onClick={handleDownload}>
                  Télécharger le PDF
                </button>
              )}

              {docData.status === 'DRAFT' && (
                <button className="danger" onClick={handleDelete}>
                  Supprimer
                </button>
              )}
              {docData.status !== 'DRAFT' && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                  La suppression n'est possible que si le document est en brouillon.
                </p>
              )}
            </div>
          </div>
        </div>

        {docData.status === 'DRAFT' && (
          <form onSubmit={handleSend} className="card" style={{ marginTop: 20 }}>
            <label>Email du signataire</label>
            <input
              type="email"
              value={signerEmail}
              onChange={(e) => setSignerEmail(e.target.value)}
              placeholder="client@email.com"
              required
            />
            <button type="submit">Envoyer pour signature</button>
            {error && <p style={{ color: '#dc2626', fontSize: 13 }}>{error}</p>}
          </form>
        )}

        <h3 style={{ marginTop: 24 }}>Historique</h3>
        <div className="card">
          {history.map((log, i) => (
            <div key={log.timestamp} style={{
              display: 'flex', gap: 12,
              paddingBottom: i < history.length - 1 ? 16 : 0,
              marginBottom: i < history.length - 1 ? 16 : 0,
              borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginTop: 6 }} />
              <div>
                <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>
                  {actionLabels[log.action] || log.action}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
                  par {log.actor} — {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const detailLabel = { fontSize: 12, color: 'var(--text-muted)', margin: '0 0 2px' }
const detailValue = { fontSize: 14, margin: '0 0 12px' }