import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import SignatureCanvas from '../components/SignatureCanvas'
import ExpiredPage from './ExpiredPage'

const api = axios.create({ baseURL: 'http://localhost:8080' })

export default function SignPage() {
  const { token } = useParams()
  const [signingRequest, setSigningRequest] = useState(null)
  const [signature, setSignature] = useState(null)
  const [accepted, setAccepted] = useState(false)
  const [step, setStep] = useState('consult')
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState(false)
  const [signedAt, setSignedAt] = useState(null)

  useEffect(() => {
    api.get(`/sign/${token}`)
      .then((res) => setSigningRequest(res.data))
      .catch(() => setLoadError(true))
  }, [token])

  const handleSign = async () => {
    if (!signature) {
      setError('Veuillez signer avant de valider')
      return
    }
    if (!accepted) {
      setError('Veuillez accepter le contenu du document')
      return
    }
    try {
      await api.post(`/sign/${token}`, { signatureImageBase64: signature })
      setSignedAt(new Date())
      setStep('done')
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la signature')
    }
  }

  if (loadError) return <ExpiredPage />
  if (!signingRequest) return <p style={{ padding: 32 }}>Chargement...</p>

  if (step === 'done') {
    return (
      <div style={{ maxWidth: 420, margin: '80px auto', padding: '0 20px' }}>
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16, color: '#16a34a' }}>✓</div>
          <h2 style={{ margin: '0 0 8px' }}>Merci !</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 20px' }}>
            Le document a été signé avec succès.
          </p>
          <div style={{ background: '#f0fdf4', borderRadius: 8, padding: 16, marginBottom: 20 }}>
            <p style={{ fontWeight: 500, margin: 0 }}>{signingRequest.documentTitle}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Signé le {signedAt.toLocaleString()}
            </p>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Vous pouvez fermer cette fenêtre.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <strong style={{ fontSize: 18 }}>Signix</strong>
      </div>

      {step === 'consult' && (
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
          <h2 style={{ margin: '0 0 4px' }}>Document à signer</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 20px' }}>
            Veuillez consulter le document avant de le signer.
          </p>
          <div style={{ background: '#eff6ff', borderRadius: 8, padding: 14, marginBottom: 20 }}>
            <p style={{ fontWeight: 500, margin: 0 }}>{signingRequest.documentTitle}</p>
          </div>
          <div style={{
            minHeight: 200, border: '1px solid var(--border)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', marginBottom: 20,
          }}>
            Aperçu du document PDF
          </div>
          <button onClick={() => setStep('sign')}>Signer le document</button>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
            En signant, vous acceptez le contenu du document.
          </p>
        </div>
      )}

      {step === 'sign' && (
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ margin: '0 0 4px' }}>Signez le document</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 20px' }}>
            Lisez le document et signez ci-dessous.
          </p>

          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{
              flex: 1, minHeight: 200, border: '1px solid var(--border)', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
            }}>
              Aperçu du document PDF
            </div>

            <div style={{ width: 260 }}>
              <p style={{ fontSize: 13, fontWeight: 500, margin: '0 0 8px' }}>Votre signature</p>
              <SignatureCanvas onSignatureChange={setSignature} />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '20px 0', fontWeight: 400 }}>
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              style={{ width: 'auto', margin: 0 }}
            />
            J'ai lu le document et j'accepte d'apposer ma signature.
          </label>

          {error && <p style={{ color: '#dc2626', fontSize: 13 }}>{error}</p>}

          <button onClick={handleSign}>Valider la signature</button>
        </div>
      )}
    </div>
  )
}