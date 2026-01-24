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
    weightHistory[weightHistory.length - 1]?.value

  const firstWeight = weightHistory[0]?.value
  const diff =
    firstWeight && lastWeight
      ? (lastWeight - firstWeight).toFixed(1)
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
          value={
            lastWeight ? `${lastWeight} kg` : '—'
          }
        />
        <KPI
          label="Cambio"
          value={
            diff
              ? `${diff > 0 ? '+' : ''}${diff} kg`
              : '—'
          }
          accent={
            diff < 0
              ? 'green'
              : diff > 0
              ? 'red'
              : null
          }
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
            🍽️{' '}
            {todayData.menu.lunch ||
              'Plan alimenticio disponible'}
          </p>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <div style={styles.actions}>
        <Action label="Calendario" />
        <Action label="Progreso" />
        <Action label="Entrenos" />
      </div>
    </div>
  )
}

/* ======================
   COMPONENTS
====================== */

function KPI({ label, value, accent }) {
  return (
    <div style={styles.kpi}>
      <span style={styles.kpiLabel}>{label}</span>
      <strong
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
        {value}
      </strong>
    </div>
  )
}

function Action({ label }) {
  return (
    <div style={styles.action}>
      <strong>{label}</strong>
    </div>
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
  gap: '4px'
},
  kpiLabel: {
    fontSize: '0.75rem',
    color: 'var(--muted)'
  },
  kpiValue: {
    fontSize: '1.4rem'
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
  },
  action: {
    background: 'var(--surface-3)',
    borderRadius: '16px',
    padding: '16px',
    textAlign: 'center'
  },
  
}
