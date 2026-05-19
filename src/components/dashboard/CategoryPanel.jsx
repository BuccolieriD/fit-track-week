import { Plus } from 'lucide-react'
import { CATEGORY_META, DAY_LABELS } from '../../lib/constants.js'
import { DayTabs } from './DayTabs.jsx'
import { EntryList } from '../entries/EntryList.jsx'
import { EntryForm } from '../entries/EntryForm.jsx'

export function CategoryPanel({
  activeDay,
  category,
  entries,
  editingEntry,
  errors,
  isFormOpen,
  onCreate,
  onDelete,
  onEdit,
  onFormCancel,
  onFormSubmit,
  onTabChange,
}) {
  const meta = CATEGORY_META[category]
  const activeEntries = entries.filter((entry) => entry.category === category && entry.day_index === activeDay)

  return (
    <section className="category-panel" style={{ '--category-accent': meta.accent }}>
      <header className="category-panel__header">
        <div>
          <p className="eyebrow">{meta.title}</p>
          <h2>{DAY_LABELS[activeDay]}</h2>
          <p>{meta.description}</p>
        </div>
        <button type="button" className="button button--secondary" onClick={onCreate}>
          <Plus size={18} />
          Nuova voce
        </button>
      </header>

      <DayTabs activeDay={activeDay} onChange={onTabChange} accent={meta.accent} />

      {isFormOpen ? (
        <EntryForm
          category={category}
          entry={editingEntry}
          errors={errors}
          onCancel={onFormCancel}
          onSubmit={onFormSubmit}
        />
      ) : null}

      <EntryList
        entries={activeEntries}
        emptyLabel={meta.empty}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </section>
  )
}