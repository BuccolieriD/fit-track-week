export const DAYS = [
  'Lun',
  'Mar',
  'Mer',
  'Gio',
  'Ven',
  'Sab',
  'Dom',
]

export const DAY_LABELS = [
  'Lunedi',
  'Martedi',
  'Mercoledi',
  'Giovedi',
  'Venerdi',
  'Sabato',
  'Domenica',
]

export const CATEGORY_META = {
  allenamento: {
    title: 'Allenamento',
    accent: 'var(--accent-workout)',
    description: 'Programma, esercizi, carichi e note del giorno.',
    empty: 'Nessuna sessione salvata per questo giorno.',
  },
  alimentazione: {
    title: 'Alimentazione',
    accent: 'var(--accent-nutrition)',
    description: 'Pasti, macro, calorie e osservazioni della giornata.',
    empty: 'Nessun pasto salvato per questo giorno.',
  },
}

export const ENTRY_TYPE_OPTIONS = {
  allenamento: ['Forza', 'Cardio', 'Mobilita', 'Recupero'],
  alimentazione: ['Colazione', 'Pranzo', 'Cena', 'Snack'],
}

export const PREVIEW_USER = {
  id: 'preview-user',
  email: 'preview@fittrack.week',
  user_metadata: {
    full_name: 'Preview Athlete',
  },
}