import { Activity, ArrowRight, Chrome, Mail, Sparkles } from 'lucide-react'
import { Navigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { isSupabaseConfigured } from '../lib/env.js'
import { useAuth } from '../context/AuthContext.jsx'

export function LoginPage() {
  const location = useLocation()
  const { login, loginWithEmail, user, enablePreview } = useAuth()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const redirectPath = location.state?.from?.pathname ?? '/dashboard'

  if (user) {
    return <Navigate to={redirectPath} replace />
  }

  async function handleProviderLogin(provider) {
    const { error } = await login(provider)
    if (error) {
      setMessage(error.message)
    }
  }

  async function handleEmailLogin(event) {
    event.preventDefault()
    setMessage('')

    const { error } = await loginWithEmail(email)
    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Controlla la tua email: ti ho inviato il link di accesso.')
  }

  return (
    <main className="login-page">
      <section className="login-hero card-surface">
        <div className="hero-copy">
          <span className="hero-pill">
            <Sparkles size={16} />
            Routine planner settimanale
          </span>
          <h1>Allena il corpo, organizza i pasti, tieni tutto sotto controllo.</h1>
          <p>
            Fit Track Week concentra allenamento e alimentazione in una sola dashboard elegante,
            con vista settimanale e dati separati per ogni giorno.
          </p>

          <div className="hero-stats">
            <article>
              <strong>2</strong>
              <span>Aree coordinate</span>
            </article>
            <article>
              <strong>7</strong>
              <span>Tab giornaliere</span>
            </article>
            <article>
              <strong>100%</strong>
              <span>Base gratuita MVP</span>
            </article>
          </div>
        </div>

        <aside className="login-card">
          <div className="login-card__header">
            <div className="logo-orb">
              <Activity size={22} />
            </div>
            <div>
              <p className="eyebrow">Accesso</p>
              <h2>Entra nella tua settimana</h2>
            </div>
          </div>

          <button type="button" className="button button--primary button--wide" onClick={() => handleProviderLogin('google')}>
            <Chrome size={18} />
            Continua con Google
          </button>

          <form className="email-login-form" onSubmit={handleEmailLogin}>
            <label htmlFor="email-login" className="eyebrow">
              Accesso email
            </label>
            <input
              id="email-login"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nome@email.com"
              required
            />
            <button type="submit" className="button button--dark button--wide">
              <Mail size={18} />
              Continua con email
            </button>
          </form>

          {!isSupabaseConfigured ? (
            <button type="button" className="button button--ghost button--wide" onClick={enablePreview}>
              <ArrowRight size={18} />
              Apri anteprima locale
            </button>
          ) : null}

          <div className="inline-note">
            {isSupabaseConfigured
              ? 'Login Google e accesso email attivi tramite Supabase.'
              : 'Modalita anteprima attiva: configura Supabase per usare Google o email reale.'}
          </div>

          {message ? <p className="error-text">{message}</p> : null}
        </aside>
      </section>
    </main>
  )
}