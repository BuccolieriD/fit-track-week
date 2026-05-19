import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export function ProtectedRoute({ children }) {
  const location = useLocation()
  const { loading, user } = useAuth()

  if (loading) {
    return (
      <div className="state-screen">
        <div className="state-card">
          <p className="eyebrow">Fit Track Week</p>
          <h1>Sto preparando la tua dashboard</h1>
          <p>Controllo sessione e preferenze del profilo.</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}