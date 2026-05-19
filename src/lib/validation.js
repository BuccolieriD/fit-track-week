import { ENTRY_TYPE_OPTIONS } from './constants.js'

export function validateEntry(entry) {
  const errors = {}

  if (!entry.title.trim()) {
    errors.title = 'Inserisci un titolo.'
  }

  if (!ENTRY_TYPE_OPTIONS[entry.category]?.includes(entry.entry_type)) {
    errors.entry_type = 'Seleziona un tipo valido.'
  }

  if (entry.metrics.duration && Number(entry.metrics.duration) < 0) {
    errors.duration = 'La durata deve essere positiva.'
  }

  if (entry.metrics.calories && Number(entry.metrics.calories) < 0) {
    errors.calories = 'Le calorie devono essere positive.'
  }

  return errors
}