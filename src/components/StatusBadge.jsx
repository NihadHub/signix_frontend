const statusMap = {
  DRAFT: { label: 'Brouillon', bg: 'var(--draft-bg)', text: 'var(--draft-text)' },
  SENT: { label: 'Envoyé', bg: 'var(--sent-bg)', text: 'var(--sent-text)' },
  SIGNED: { label: 'Signé', bg: 'var(--signed-bg)', text: 'var(--signed-text)' },
  EXPIRED: { label: 'Expiré', bg: 'var(--expired-bg)', text: 'var(--expired-text)' },
}

export default function StatusBadge({ status }) {
  const s = statusMap[status]
  return (
    <span className="badge" style={{ backgroundColor: s.bg, color: s.text }}>
      {s.label}
    </span>
  )
}