import { useEffect, useState } from 'react'
import { ENTRY_TYPE_OPTIONS } from '../../lib/constants.js'

const DEFAULT_METRICS = {
  allenamento: {
    sets: '',
    reps: '',
    weight: '',
    duration: '',
  },
  alimentazione: {
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    quantity: '',
  },
}

export function EntryForm({ category, entry, errors, onCancel, onSubmit }) {
  const [formState, setFormState] = useState(createInitialState(category, entry))

  useEffect(() => {
    setFormState(createInitialState(category, entry))
  }, [category, entry])

  return (
    <form
      className="entry-form"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(formState)
      }}
    >
      <div className="form-grid">
        <label>
          Titolo
          <input
            value={formState.title}
            onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
            placeholder={category === 'allenamento' ? 'Upper body focus' : 'Cena ad alto contenuto proteico'}
          />
          {errors.title ? <small>{errors.title}</small> : null}
        </label>

        <label>
          Tipo
          <select
            value={formState.entry_type}
            onChange={(event) => setFormState((current) => ({ ...current, entry_type: event.target.value }))}
          >
            {ENTRY_TYPE_OPTIONS[category].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.entry_type ? <small>{errors.entry_type}</small> : null}
        </label>
      </div>

      <div className="form-grid">
        {Object.keys(DEFAULT_METRICS[category]).map((metric) => (
          <label key={metric}>
            {metricLabel(metric)}
            <input
              value={formState.metrics[metric]}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  metrics: {
                    ...current.metrics,
                    [metric]: event.target.value,
                  },
                }))
              }
            />
            {errors[metric] ? <small>{errors[metric]}</small> : null}
          </label>
        ))}
      </div>

      <label>
        Note
        <textarea
          rows="3"
          value={formState.notes}
          onChange={(event) => setFormState((current) => ({ ...current, notes: event.target.value }))}
          placeholder="Indicazioni, percezioni, timing, digestione, recupero..."
        />
      </label>

      <div className="form-actions">
        <button type="button" className="button button--ghost" onClick={onCancel}>
          Annulla
        </button>
        <button type="submit" className="button button--primary">
          {entry ? 'Salva modifiche' : 'Aggiungi voce'}
        </button>
      </div>
    </form>
  )
}

function createInitialState(category, entry) {
  return {
    id: entry?.id,
    category,
    title: entry?.title ?? '',
    entry_type: entry?.entry_type ?? ENTRY_TYPE_OPTIONS[category][0],
    notes: entry?.notes ?? '',
    metrics: {
      ...DEFAULT_METRICS[category],
      ...(entry?.metrics ?? {}),
    },
  }
}

function metricLabel(metric) {
  const labels = {
    sets: 'Serie',
    reps: 'Ripetizioni',
    weight: 'Peso kg',
    duration: 'Durata min',
    calories: 'Calorie',
    protein: 'Proteine g',
    carbs: 'Carboidrati g',
    fats: 'Grassi g',
    quantity: 'Quantita',
  }

  return labels[metric]
}