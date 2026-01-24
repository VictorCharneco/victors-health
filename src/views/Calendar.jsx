import { useState, useMemo, useEffect } from 'react'
import { CaretLeft, CaretRight, CheckCircle } from 'phosphor-react'
import calendarData from '../data/calendarData.json'

export default function Calendar() {
  const today = new Date()

  const [current, setCurrent] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )
  const [selectedDay, setSelectedDay] = useState(null)
  const [activeTab, setActiveTab] = useState('weight')
  const [weightHistory, setWeightHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('weightHistory')) || []
  })

  const year = current.getFullYear()
  const month = current.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayIndex =
    (new Date(year, month, 1).getDay() + 6) % 7

  const daysMap = useMemo(() => {
    const map = {}
    calendarData.days.forEach(d => {
      map[d.date] = d
    })
    return map
  }, [])

  const goPrev = () =>
    setCurrent(new Date(year, month - 1, 1))
  const goNext = () =>
    setCurrent(new Date(year, month + 1, 1))

  return (
    <div className="view">
      {/* CALENDAR */}
      <div style={styles.card}>
        <div style={styles.header}>
          <button style={styles.navBtn} onClick={goPrev}>
            <CaretLeft size={20} />
          </button>

          <h2 style={styles.title}>
            {current.toLocaleDateString('es-ES', {
              month: 'long',
              year: 'numeric'
            })}
          </h2>

          <button style={styles.navBtn} onClick={goNext}>
            <CaretRight size={20} />
          </button>
        </div>

        <div style={styles.weekdays}>
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div style={styles.grid}>
          {Array.from({ length: firstDayIndex }).map(
            (_, i) => <div key={`e-${i}`} />
          )}

          {Array.from({ length: daysInMonth }).map(
            (_, i) => {
              const day = i + 1
              const dateStr = normalizeDate(
                `${year}-${month + 1}-${day}`
              )

              const hasPlan = daysMap[dateStr]
              const weight = weightHistory.find(
                w => w.date === dateStr
              )

              return (
                <div
                  key={day}
                  style={{
                    ...styles.day,
                    ...(hasPlan && styles.hasData),
                    ...(selectedDay === dateStr &&
                      styles.selected)
                  }}
                  onClick={() => {
                    setSelectedDay(dateStr)
                    setActiveTab('weight')
                  }}
                >
                  <span>{day}</span>
                  {weight && (
                    <small style={styles.weight}>
                      {weight.value} kg
                    </small>
                  )}
                </div>
              )
            }
          )}
        </div>
      </div>

      {/* DAY PANEL */}
      {selectedDay && (
        <div style={styles.detailCard}>
          <h3 style={styles.detailTitle}>
            {new Date(selectedDay).toLocaleDateString(
              'es-ES',
              { day: 'numeric', month: 'long' }
            )}
          </h3>

          <div style={styles.tabs}>
            <Tab
              label="Peso"
              active={activeTab === 'weight'}
              onClick={() => setActiveTab('weight')}
            />
            <Tab
              label="Menú"
              active={activeTab === 'menu'}
              onClick={() => setActiveTab('menu')}
            />
            <Tab
              label="Ejercicios"
              active={activeTab === 'workout'}
              onClick={() => setActiveTab('workout')}
            />
          </div>

          <div style={styles.panelScroll}>
            {activeTab === 'weight' && (
              <WeightPanel
                date={selectedDay}
                onSave={newHistory => {
                  setWeightHistory(newHistory)
                  setSelectedDay(null)
                }}
              />
            )}

            {activeTab === 'menu' && (
              <MenuPanel data={daysMap[selectedDay]} />
            )}

            {activeTab === 'workout' && (
              <WorkoutPanel
                date={selectedDay}
                data={daysMap[selectedDay]}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ======================
   PANELS
====================== */

function WeightPanel({ date, onSave }) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const history =
      JSON.parse(localStorage.getItem('weightHistory')) ||
      []
    const existing = history.find(h => h.date === date)
    if (existing) setValue(existing.value)
  }, [date])

  const save = () => {
    if (!value) return
    const history =
      JSON.parse(localStorage.getItem('weightHistory')) ||
      []
    const filtered = history.filter(h => h.date !== date)
    filtered.push({ date, value: Number(value) })
    localStorage.setItem(
      'weightHistory',
      JSON.stringify(filtered)
    )
    onSave(filtered)
  }

  return (
    <div style={styles.panel}>
      <label>Peso (kg)</label>
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button style={styles.saveBtn} onClick={save}>
        Guardar
      </button>
    </div>
  )
}

function MenuPanel({ data }) {
  if (!data?.menu) return <p>No hay menú</p>

  const labels = {
    breakfast: { title: 'Desayuno', icon: '🍳' },
    lunch: { title: 'Comida', icon: '🍽️' },
    dinner: { title: 'Cena', icon: '🌙' },
    snack: { title: 'Snack', icon: '🍎' }
  }

  return (
    <div style={styles.menuGrid}>
      {Object.entries(data.menu).map(([k, text]) => {
        const isFree = text.toLowerCase().includes('libre')
        return (
          <div
            key={k}
            style={{
              ...styles.menuCard,
              ...(isFree && styles.menuFree)
            }}
          >
            <strong>
              {labels[k]?.icon} {labels[k]?.title}
            </strong>
            <p>{text}</p>
          </div>
        )
      })}
    </div>
  )
}

/* 🏋️ EJERCICIOS PRO */
function WorkoutPanel({ date, data }) {
  if (!data?.exercises)
    return <p>No hay ejercicios</p>

  const storageKey = `workout:${date}`
  const [done, setDone] = useState(() => {
    return JSON.parse(localStorage.getItem(storageKey)) || {}
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(done))
  }, [done, storageKey])

  const toggle = i =>
    setDone(prev => ({ ...prev, [i]: !prev[i] }))

  const total = data.exercises.length
  const completed = Object.values(done).filter(Boolean)
    .length

  return (
    <div>
      <div style={styles.workoutHeader}>
        <strong>
          Progreso: {completed} / {total}
        </strong>
      </div>

      <div style={styles.workout}>
        {data.exercises.map((e, i) => {
          const isDone = !!done[i]
          return (
            <div
              key={i}
              style={{
                ...styles.exerciseCard,
                ...(isDone && styles.exerciseDone)
              }}
              onClick={() => toggle(i)}
            >
              <img
                src={e.image}
                alt={e.name}
                style={styles.exerciseImg}
              />
              <div style={styles.exerciseInfo}>
                <strong>{e.name}</strong>
                <span>
                  {e.sets} × {e.reps}
                </span>
                {isDone && (
                  <CheckCircle
                    size={22}
                    color="var(--success)"
                    weight="fill"
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.tab,
        ...(active && styles.tabActive)
      }}
    >
      {label}
    </button>
  )
}

/* ======================
   HELPERS
====================== */

function normalizeDate(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, '0')}-${String(d.getDate()).padStart(
    2,
    '0'
  )}`
}

/* ======================
   STYLES
====================== */

const styles = {
  card: {
    background: 'var(--surface-3)',
    borderRadius: '22px',
    padding: '18px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px'
  },
  title: { textTransform: 'capitalize' },
  navBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--muted)'
  },
  weekdays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7,1fr)',
    fontSize: '0.7rem',
    textAlign: 'center'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7,1fr)',
    gap: '8px'
  },
  day: {
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  hasData: {
    background: 'rgba(56,189,248,0.15)'
  },
  selected: {
    outline: '2px solid var(--primary)'
  },
  weight: {
    fontSize: '0.65rem',
    color: 'var(--success)'
  },
  detailCard: {
    marginTop: '16px',
    background: 'var(--surface-2)',
    borderRadius: '20px',
    padding: '16px',
    maxHeight: '55vh',
    display: 'flex',
    flexDirection: 'column'
  },
  detailTitle: {
    marginBottom: '10px'
  },
  tabs: {
    display: 'flex',
    gap: '6px',
    background: 'var(--surface-1)',
    padding: '6px',
    borderRadius: '16px',
    marginBottom: '10px'
  },
  tab: {
    flex: 1,
    padding: '8px 0',
    border: 'none',
    background: 'transparent',
    color: 'var(--muted)',
    borderRadius: '12px'
  },
  tabActive: {
    background: 'var(--surface-3)',
    color: 'var(--text)'
  },
  panelScroll: {
    overflowY: 'auto',
    paddingBottom: '90px'
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  saveBtn: {
    marginTop: '6px',
    padding: '12px',
    borderRadius: '14px',
    border: 'none',
    background: 'var(--primary)',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer'
  },

  /* MENU */
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px'
  },
  menuCard: {
    background: 'var(--surface-3)',
    borderRadius: '16px',
    padding: '12px'
  },
  menuFree: {
    opacity: 0.7
  },

  /* WORKOUT */
  workoutHeader: {
    marginBottom: '8px'
  },
  workout: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  exerciseCard: {
    display: 'flex',
    gap: '12px',
    padding: '10px',
    borderRadius: '16px',
    background: 'var(--surface-3)',
    cursor: 'pointer'
  },
  exerciseDone: {
    opacity: 0.6
  },
  exerciseImg: {
    width: '520px',
    height: '520px',
    objectFit: 'cover',
    borderRadius: '14px'
  },
  exerciseInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  }
}
