import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function Progress() {
  const history =
    JSON.parse(localStorage.getItem('weightHistory')) || []

  const data = useMemo(() => {
    return history
      .map(e => ({
        date: formatDate(e.date),
        rawDate: e.date,
        value: e.value
      }))
      .sort((a, b) =>
        a.rawDate.localeCompare(b.rawDate)
      )
  }, [history])

  if (data.length === 0) {
    return (
      <div className="view">
        <h1>PROGRESO</h1>
        <p>Aún no hay datos registrados</p>
      </div>
    )
  }

  const first = data[0].value
  const last = data[data.length - 1].value
  const totalDiff = (last - first).toFixed(1)

  const values = data.map(d => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const padding = Math.max(0.5, (max - min) * 0.4)

  return (
    <div className="view">
      <h1>Progreso</h1>
      <p>Evolución de tu peso</p>

      {/* KPIs */}
      <div style={styles.kpis}>
        <KPI label="Peso actual" value={`${last} kg`} />
        <KPI
          label="Cambio total"
          value={`${totalDiff > 0 ? '+' : ''}${totalDiff} kg`}
          accent={totalDiff < 0 ? 'green' : 'red'}
        />
      </div>

      {/* CHART */}
      <div style={styles.chartCard}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis domain={[min - padding, max + padding]} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              fill="rgba(10,132,255,0.2)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* HISTORY */}
      <div style={styles.history}>
        {data
          .slice()
          .reverse()
          .map((e, i) => (
            <div key={i} style={styles.row}>
              <span>{e.date}</span>
              <strong>{e.value} kg</strong>
            </div>
          ))}
      </div>
    </div>
  )
}

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

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  })
}

const styles = {
  kpis: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,1fr)',
    gap: '14px',
    marginTop: '16px'
  },
  kpi: {
    background: 'var(--surface-3)',
    borderRadius: '18px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  kpiLabel: {
    fontSize: '1.5rem',
    color: 'var(--muted)'
  },
  kpiValue: {
    fontSize: '1.6rem'
  },
  chartCard: {
    marginTop: '24px',
    background: 'var(--surface-3)',
    borderRadius: '20px',
    padding: '16px'
  },
  history: {
    marginTop: '26px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    background: 'var(--surface-2)',
    padding: '12px 14px',
    borderRadius: '14px'
  }
}
