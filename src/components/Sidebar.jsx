import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div style={{
      width: 240,
      minHeight: '100vh',
      borderRight: '1px solid var(--border)',
      padding: '24px 16px',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--primary)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 15,
        }}>
          S
        </div>
        <strong style={{ fontSize: 18 }}>Signix</strong>
      </div>

      <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        <NavLink to="/" label="Dashboard" active={isActive('/')} />
        <NavLink to="/upload" label="Nouveau document" active={isActive('/upload')} />
      </nav>

      <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 8px', marginBottom: 12,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#e0e7ff', color: '#3730a3',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 600, fontSize: 13, flexShrink: 0,
        }}>
          {user?.fullName?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.fullName}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.email}
          </p>
        </div>
      </div>

      <button onClick={handleLogout} className="logout" style={{ width: '100%' }}>
        Déconnexion
      </button>
    </div>
  )
}

function NavLink({ to, label, active }) {
  return (
    <Link
      to={to}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 12px',
        borderRadius: 8,
        color: active ? 'var(--primary-dark)' : '#374151',
        background: active ? '#eff6ff' : 'transparent',
        textDecoration: 'none',
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        transition: 'background-color 0.15s ease',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#f3f4f6' }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      {label}
    </Link>
  )
}