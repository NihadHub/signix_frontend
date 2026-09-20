import { Link } from 'react-router-dom'

const statusLabels = {
  DRAFT: 'Brouillon',
  SENT: 'Envoyé',
  SIGNED: 'Signé',
  EXPIRED: 'Expiré',
}

const statusColors = {
  DRAFT: '#999',
  SENT: '#2563eb',
  SIGNED: '#16a34a',
  EXPIRED: '#dc2626',
}

export default function DocumentCard({ document }) {
  return (
    <Link to={`/documents/${document.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>{document.title}</strong>
          <span style={{ color: statusColors[document.status] }}>
            {statusLabels[document.status]}
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#666' }}>
          {document.signerEmail && `Signataire: ${document.signerEmail}`}
        </p>
      </div>
    </Link>
  )
}