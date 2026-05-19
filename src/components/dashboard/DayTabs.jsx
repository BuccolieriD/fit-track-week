import clsx from 'clsx'
import { DAYS, DAY_LABELS } from '../../lib/constants.js'

export function DayTabs({ activeDay, onChange, accent }) {
  return (
    <div className="day-tabs" role="tablist" aria-label="Giorni della settimana">
      {DAYS.map((day, index) => (
        <button
          key={day}
          type="button"
          role="tab"
          aria-selected={activeDay === index}
          className={clsx('day-tab', activeDay === index && 'day-tab--active')}
          style={activeDay === index ? { '--tab-accent': accent } : undefined}
          title={DAY_LABELS[index]}
          onClick={() => onChange(index)}
        >
          {day}
        </button>
      ))}
    </div>
  )
}