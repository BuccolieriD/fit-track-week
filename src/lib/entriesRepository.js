import { CATEGORY_META, DAY_LABELS } from './constants.js'
import { isFirebaseConfigured } from './env.js'
import { firestoreDb } from './firebase.js'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore'

const previewStorageKey = 'fit-track-preview-entries'

function createSeedEntries(userId) {
  return [
    {
      id: crypto.randomUUID(),
      user_id: userId,
      category: 'allenamento',
      day_index: 0,
      title: 'Push day in palestra',
      entry_type: 'Forza',
      notes: 'Punta su tecnica controllata e recupero di 90 secondi.',
      metrics: {
        sets: '4',
        reps: '8',
        weight: '55',
        duration: '50',
      },
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      user_id: userId,
      category: 'alimentazione',
      day_index: 0,
      title: 'Pranzo recovery bowl',
      entry_type: 'Pranzo',
      notes: 'Riso basmati, pollo, avocado e verdure croccanti.',
      metrics: {
        calories: '720',
        protein: '42',
        carbs: '68',
        fats: '22',
        quantity: '1 bowl',
      },
      created_at: new Date().toISOString(),
    },
  ]
}

function readPreviewEntries(userId) {
  const rawEntries = window.localStorage.getItem(previewStorageKey)

  if (!rawEntries) {
    const seedEntries = createSeedEntries(userId)
    window.localStorage.setItem(previewStorageKey, JSON.stringify(seedEntries))
    return seedEntries
  }

  return JSON.parse(rawEntries)
}

function writePreviewEntries(entries) {
  window.localStorage.setItem(previewStorageKey, JSON.stringify(entries))
}

export async function listEntries(userId) {
  if (!isFirebaseConfigured || !firestoreDb) {
    return readPreviewEntries(userId)
  }

  const entriesRef = collection(firestoreDb, 'entries')
  const entriesQuery = query(
    entriesRef,
    where('user_id', '==', userId),
    orderBy('created_at', 'asc'),
  )
  const snapshot = await getDocs(entriesQuery)

  return snapshot.docs.map((entryDoc) => ({
    id: entryDoc.id,
    ...entryDoc.data(),
  }))
}

export async function upsertEntry(entry) {
  if (!isFirebaseConfigured || !firestoreDb) {
    const entries = readPreviewEntries(entry.user_id)
    const updatedEntries = entry.id
      ? entries.map((currentEntry) =>
          currentEntry.id === entry.id ? { ...currentEntry, ...entry } : currentEntry,
        )
      : [
          ...entries,
          {
            ...entry,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
          },
        ]

    writePreviewEntries(updatedEntries)
    return updatedEntries
  }

  const entryId = entry.id || crypto.randomUUID()
  const payload = {
    ...entry,
    id: entryId,
    created_at: entry.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  await setDoc(doc(firestoreDb, 'entries', entryId), payload, { merge: true })

  return listEntries(entry.user_id)
}

export async function deleteEntry(userId, entryId) {
  if (!isFirebaseConfigured || !firestoreDb) {
    const entries = readPreviewEntries(userId).filter((entry) => entry.id !== entryId)
    writePreviewEntries(entries)
    return entries
  }

  await deleteDoc(doc(firestoreDb, 'entries', entryId))

  return listEntries(userId)
}

export function buildWeekSummary(entries) {
  return Object.keys(CATEGORY_META).map((category) => ({
    category,
    total: entries.filter((entry) => entry.category === category).length,
    scheduledDays: DAY_LABELS.filter((_, index) =>
      entries.some((entry) => entry.category === category && entry.day_index === index),
    ).length,
  }))
}