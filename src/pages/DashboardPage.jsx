import { LogOut, UserCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CategoryPanel } from '../components/dashboard/CategoryPanel.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { buildWeekSummary, deleteEntry, listEntries, upsertEntry } from '../lib/entriesRepository.js'
import { validateEntry } from '../lib/validation.js'

export function DashboardPage() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [entries, setEntries] = useState([])
  const [activeDays, setActiveDays] = useState({
    allenamento: 0,
    alimentazione: 0,
  })
  const [panelState, setPanelState] = useState({
    allenamento: { open: false, entry: null, errors: {} },
    alimentazione: { open: false, entry: null, errors: {} },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    listEntries(user.id)
      .then((data) => {
        if (active) {
          setEntries(data)
        }
      })
      .catch((caughtError) => {
        if (active) {
          setError(caughtError.message)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [user.id])

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  async function handleSubmit(category, formState) {
    const payload = {
      ...formState,
      user_id: user.id,
      day_index: activeDays[category],
    }
    const nextErrors = validateEntry(payload)

    if (Object.keys(nextErrors).length) {
      setPanelState((current) => ({
        ...current,
        [category]: {
          ...current[category],
          errors: nextErrors,
        },
      }))
      return
    }

    const updatedEntries = await upsertEntry(payload)
    setEntries(updatedEntries)
    setPanelState((current) => ({
      ...current,
      [category]: { open: false, entry: null, errors: {} },
    }))
  }

  async function handleDelete(category, entryId) {
    const updatedEntries = await deleteEntry(user.id, entryId)
    setEntries(updatedEntries)
    setPanelState((current) => ({
      ...current,
      [category]: { open: false, entry: null, errors: {} },
    }))
  }

  const summary = buildWeekSummary(entries)
  const displayName = user.user_metadata?.full_name ?? user.email ?? 'Atleta'

  return (
    <main className="dashboard-page app-shell">
      <section className="dashboard-shell">
        <header className="topbar card-surface">
          <div>
            <p className="eyebrow">Panoramica</p>
            <h1>Settimana attiva</h1>
            <p className="subtle-text">Organizza allenamento e alimentazione in due pannelli allineati.</p>
          </div>

          <div className="topbar__actions">
            <div className="profile-chip">
              <UserCircle2 size={20} />
              <span>{displayName}</span>
            </div>
            <button type="button" className="button button--ghost" onClick={handleLogout}>
              <LogOut size={18} />
              Esci
            </button>
          </div>
        </header>

        <section className="summary-grid">
          {summary.map((item) => (
            <article key={item.category} className="summary-card card-surface">
              <p className="eyebrow">{item.category}</p>
              <strong>{item.total}</strong>
              <span>{item.scheduledDays} giorni pianificati</span>
            </article>
          ))}
        </section>

        {error ? <p className="error-banner">{error}</p> : null}

        {loading ? (
          <div className="state-screen compact">
            <div className="state-card">
              <h2>Carico i tuoi dati</h2>
              <p>Recupero le voci della settimana corrente.</p>
            </div>
          </div>
        ) : (
          <section className="dashboard-grid">
            {['allenamento', 'alimentazione'].map((category) => (
              <CategoryPanel
                key={category}
                activeDay={activeDays[category]}
                category={category}
                entries={entries}
                editingEntry={panelState[category].entry}
                errors={panelState[category].errors}
                isFormOpen={panelState[category].open}
                onCreate={() =>
                  setPanelState((current) => ({
                    ...current,
                    [category]: { open: true, entry: null, errors: {} },
                  }))
                }
                onDelete={(entryId) => handleDelete(category, entryId)}
                onEdit={(entry) =>
                  setPanelState((current) => ({
                    ...current,
                    [category]: { open: true, entry, errors: {} },
                  }))
                }
                onFormCancel={() =>
                  setPanelState((current) => ({
                    ...current,
                    [category]: { open: false, entry: null, errors: {} },
                  }))
                }
                onFormSubmit={(formState) => handleSubmit(category, formState)}
                onTabChange={(dayIndex) =>
                  setActiveDays((current) => ({
                    ...current,
                    [category]: dayIndex,
                  }))
                }
              />
            ))}
          </section>
        )}
      </section>
    </main>
  )
}