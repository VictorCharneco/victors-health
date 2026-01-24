import { useEffect, useState } from 'react'

export default function DayDetail({ day, onClose }) {
  const [weight, setWeight] = useState('')
  const [trend, setTrend] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!day) return

    const history = getHistory()
    const todayWeight = history.find(e => e.date === day.date)
    const prev = getPreviousEntry(history, day.date)

    if (todayWeight) {
      setWeight(todayWeight.value.toString())
      if (prev) {
        setTrend(todayWeight.value - prev.value)
      } else {
        setTrend(null)
      }
    } else {
      setWeight('')
      setTrend(null)
    }

    setSaved(false)
  }, [day])

  if (!day) return null

  function saveWeight() {
    if (!weight) return

    const value = parseFloat(weight)
    saveWeightForDate(day.date, value)

    const history = getHistory()
    const prev = getPreviousEntry(history, day.date)
    if (prev) {
      setTrend(value - prev.value)
    }

    setSaved(true)

    setTimeout(() => {
      onClose()
    }, 700)
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <button onClick={onClose} style={styles.back}>
          ←
        </button>

        <h2>{formatFullDate(day.date)}</h2>
        <span style={styles.tag}>{day.type}</span>

        {/* PESO */}
        <section style={styles.section}>
          <h3>Peso</h3>

          <input
            type="number"
            step="0.1"
            placeholder="Peso (kg)"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            style={styles.input}
            disabled={saved}
          />

          {trend !== null && (
            <div style={styles.trend}>
              {trend > 0 && (
                <span style={{ color: '#f87171' }}>
                  ↑ +{trend.toFixed(1)} kg
                </span>
              )}
              {trend < 0 && (
                <span style={{ color: '#4ade80' }}>
                  ↓ {trend.toFixed(1)} kg
                </span>
              )}
              {trend === 0 && (
                <span style={{ color: 'var(--muted)' }}>
                  = sin cambios
                </span>
              )}
            </div>
          )}

          <button
            onClick={saveWeight}
            style={{
              ...styles.save,
              background: saved
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : styles.save.background
            }}
            disabled={saved}
          >
            {saved ? 'Guardado ✓' : 'Guardar peso'}
          </button>
        </section>

        {/* MENÚ */}
        {day.menu && (
          <section style={styles.section}>
            <h3>Menú</h3>
            {Object.entries(day.menu).map(([k, v]) => (
              <p key={k}>
                <strong>{k}:</strong> {v}
              </p>
            ))}
          </section>
        )}

        {/* EJERCICIOS */}
        {day.exercises && (
          <section style={styles.section}>
            <h3>Ejercicios</h3>
            {day.exercises.map((ex, i) => (
              <div key={i} style={styles.exercise}>
                <h4>{ex.name}</h4>
                <p>{ex.instructions}</p>
                <p>
                  {ex.sets} × {ex.reps}
                </p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}

/* ======================
   Helpers
====================== */

function getHistory() {
  const stored = localStorage.getItem('weightHistory')
  return stored ? JSON.parse(stored) : []
}

function getPreviousEntry(history, date) {
  const sorted = history
    .filter(e => e.date < date)
    .sort((a, b) => b.date.localeCompare(a.date))
  return sorted[0] || null
}

function saveWeightForDate(date, value) {
  const history = getHistory().filter(e => e.date !== date)
  history.push({ date, value })
  localStorage.setItem(
    'weightHistory',
    JSON.stringify(history)
  )
}

function formatFullDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}

/* ======================
   Styles
====================== */

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(2,6,23,0.88)',
    backdropFilter: 'blur(20px)',
    padding: '16px',
    zIndex: 20
  },
  card: {
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05))',
    borderRadius: '28px',
    padding: '22px',
    maxWidth: '560px',
    margin: '0 auto'
  },
  back: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '999px',
    width: '42px',
    height: '42px',
    fontSize: '1.2rem',
    color: 'var(--muted)',
    cursor: 'pointer',
    marginBottom: '12px'
  },
  tag: {
    display: 'inline-block',
    marginTop: '6px',
    fontSize: '0.75rem',
    color: 'var(--primary)'
  },
  section: {
    marginTop: '22px'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '14px',
    border: '1px solid var(--border)',
    background: 'rgba(0,0,0,0.35)',
    color: 'var(--text)',
    marginBottom: '8px'
  },
  trend: {
    fontSize: '0.8rem',
    marginBottom: '10px'
  },
  save: {
    width: '100%',
    padding: '12px',
    borderRadius: '14px',
    border: 'none',
    background:
      'linear-gradient(135deg, #4ade80, #22c55e)',
    color: '#020617',
    fontWeight: 600,
    cursor: 'pointer'
  },
  exercise: {
    marginTop: '14px',
    padding: '14px',
    borderRadius: '18px',
    background: 'rgba(0,0,0,0.35)'
  }
}
