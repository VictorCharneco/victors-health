import { useEffect } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import calendarData from '../data/calendarData.json'

export default function Home() {
  const today = new Date()
  const todayStr = normalizeDate(today)

  const todayData = calendarData.days.find(
    d => d.date === todayStr
  )

  const weightHistory =
    JSON.parse(localStorage.getItem('weightHistory')) || []

  const lastWeight =
    weightHistory[weightHistory.length - 1]?.value ?? null

  const firstWeight = weightHistory[0]?.value ?? null

  const diff =
    firstWeight !== null && lastWeight !== null
      ? Number((lastWeight - firstWeight).toFixed(1))
      : null

  const workoutsThisWeek = countWeeklyWorkouts()

  return (
    <div className="view">
      <h1>Victor’s Health</h1>
      <p>Resumen de hoy</p>

      {/* KPIs */}
      <div style={styles.kpis}>
        <KPI
          label="Peso actual"
          value={lastWeight}
          suffix=" kg"
        />
        <KPI
          label="Cambio"
          value={diff}
          suffix=" kg"
          signed
        />
        <KPI
          label="Entrenos (7d)"
          value={workoutsThisWeek}
        />
      </div>

      {/* TODAY */}
      <div style={styles.todayCard}>
        <strong>
          {todayData?.type === 'training'
            ? '🏋️ Día de entrenamiento'
            : '😴 Día de descanso'}
        </strong>

        {todayData?.menu && (
          <p style={styles.todayText}>
            🍽️ {todayData.menu.lunch}
          </p>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <div style={styles.actions}>
        <button>Calendario</button>
        <button>Progreso</button>
        <button>Entrenos</button>
      </div>
    </div>
  )
}

/* ======================
   COMPONENTS
====================== */

function KPI({ label, value, suffix = '', signed }) {
  let accent = null
  if (signed && typeof value === 'number') {
    accent = value < 0 ? 'green' : value > 0 ? 'red' : null
  }

  return (
    <div style={styles.kpi}>
      <span style={styles.kpiLabel}>{label}</span>

      {value === null || value === undefined ? (
        <strong style={styles.kpiValue}>—</strong>
      ) : (
        <AnimatedNumber
          value={value}
          suffix={suffix}
          accent={accent}
          signed={signed}
        />
      )}
    </div>
  )
}

function AnimatedNumber({
  value,
  suffix,
  accent,
  signed
}) {
  const motionValue = useMotionValue(value)

  useEffect(() => {
    animate(motionValue, value, {
      duration: 0.35,
      ease: 'easeOut'
    })
  }, [value, motionValue])

  return (
    <motion.strong
      style={{
        ...styles.kpiValue,
        color:
          accent === 'green'
            ? 'var(--success)'
            : accent === 'red'
            ? 'var(--danger)'
            : 'var(--text)'
      }}
    >
      {motionValue
        .get()
        .toFixed(1)
        .replace(/\.0$/, '')}
      {suffix}
    </motion.strong>
  )
}

/* ======================
   HELPERS
====================== */

function normalizeDate(d) {
  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, '0')}-${String(d.getDate()).padStart(
    2,
    '0'
  )}`
}

function countWeeklyWorkouts() {
  const now = new Date()
  const weekAgo = new Date()
  weekAgo.setDate(now.getDate() - 6)

  return calendarData.days.filter(d => {
    const date = new Date(d.date)
    return (
      d.type === 'training' &&
      date >= weekAgo &&
      date <= now
    )
  }).length
}

/* ======================
   STYLES
====================== */

const styles = {
  kpis: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: '14px',
    marginTop: '16px'
  },
  kpi: {
    background: 'var(--surface-3)',
    borderRadius: '18px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  kpiLabel: {
    fontSize: '0.75rem',
    color: 'var(--muted)'
  },
  kpiValue: {
    fontSize: '1.4rem',
    fontWeight: 700
  },
  todayCard: {
    marginTop: '24px',
    background: 'var(--surface-2)',
    borderRadius: '20px',
    padding: '16px'
  },
  todayText: {
    marginTop: '6px'
  },
  actions: {
    marginTop: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: '12px'
  }
}
