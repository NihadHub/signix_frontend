import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'
import Sidebar from '../components/Sidebar'

export default function UploadPage() {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!file) {
      setError('Veuillez sélectionner un fichier PDF')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('file', file)

    try {
      const res = await api.post('/documents', formData)
      navigate(`/documents/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'upload')
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 32, maxWidth: 600 }}>
        <button className="secondary" onClick={() => navigate('/')} style={{ marginBottom: 16 }}>
          ← Retour
        </button>

        <h2 style={{ margin: '0 0 4px' }}>Créer un nouveau document</h2>
        <p style={{ color: 'var(--text-muted)', margin: '0 0 24px' }}>
          Téléchargez un document PDF et envoyez-le pour signature.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Document PDF</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
            style={{
              border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 10,
              padding: '40px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: 20,
              background: isDragging ? '#eff6ff' : '#fafafa',
            }}
          >
            <input
              id="fileInput"
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
            {file ? (
              <p style={{ margin: 0, fontWeight: 500 }}>{file.name}</p>
            ) : (
              <>
                <p style={{ margin: '0 0 4px' }}>
                  Glissez-déposez votre PDF ici ou{' '}
                  <span style={{ color: 'var(--primary)' }}>cliquez pour parcourir</span>
                </p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
                  PDF uniquement · Max 10 Mo
                </p>
              </>
            )}
          </div>

          <label>Titre du document</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contrat Client X"
            required
          />

          {error && <p style={{ color: '#dc2626', fontSize: 13 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button type="button" className="secondary" onClick={() => navigate('/')}>
              Annuler
            </button>
            <button type="submit">Créer le document</button>
          </div>
        </form>
      </div>
    </div>
  )
}