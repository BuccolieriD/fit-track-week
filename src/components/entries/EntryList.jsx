import { PencilLine, Trash2 } from 'lucide-react'

export function EntryList({ entries, emptyLabel, onDelete, onEdit }) {
  if (!entries.length) {
    return (
      <div className="entry-empty">
        <p>{emptyLabel}</p>
      </div>
    )
  }

  return (
    <div className="entry-list">
      {entries.map((entry) => (
        <article key={entry.id} className="entry-card-item">
          <div className="entry-card-item__header">
            <div>
              <span className="entry-badge">{entry.entry_type}</span>
              <h3>{entry.title}</h3>
            </div>
            <div className="entry-actions">
              <button type="button" onClick={() => onEdit(entry)} aria-label="Modifica voce">
                <PencilLine size={16} />
              </button>
              <button type="button" onClick={() => onDelete(entry.id)} aria-label="Elimina voce">
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="metric-grid">
            {Object.entries(entry.metrics || {})
              .filter(([, value]) => value)
              .map(([key, value]) => (
                <div key={key}>
                  <span>{formatMetricLabel(key)}</span>
                  <strong>{value}</strong>
                </div>
              ))}
          </div>

          {entry.notes ? <p className="entry-notes">{entry.notes}</p> : null}
        </article>
      ))}
    </div>
  )
}

function formatMetricLabel(key) {
  const map = {
    sets: 'Serie',
    reps: 'Ripetizioni',
    weight: 'Peso',
    duration: 'Durata',
    calories: 'Calorie',
    protein: 'Proteine',
    carbs: 'Carboidrati',
    fats: 'Grassi',
    quantity: 'Porzione',
  }

  return map[key] ?? key
}