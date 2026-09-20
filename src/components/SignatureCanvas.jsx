import { useRef, useState } from 'react'

export default function SignatureCanvas({ onSignatureChange }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const startDrawing = (e) => {
    const ctx = canvasRef.current.getContext('2d')
    const rect = canvasRef.current.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#1a1a1a'
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing) return
    const ctx = canvasRef.current.getContext('2d')
    const rect = canvasRef.current.getBoundingClientRect()
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const dataUrl = canvasRef.current.toDataURL('image/png')
    onSignatureChange(dataUrl)
  }

  const clear = () => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    onSignatureChange(null)
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={340}
        height={160}
        style={{
          border: '1px dashed var(--border)',
          borderRadius: 8,
          cursor: 'crosshair',
          width: '100%',
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <button type="button" className="secondary" onClick={clear} style={{ marginTop: 8 }}>
        Effacer
      </button>
    </div>
  )
}