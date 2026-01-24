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
        <h1>Progreso</h1>
        <p>Aún no hay datos registrados</p>
      </div>
    )
  }

  const first = data[0].value
  const last = data[data.length - 1].value
  const totalDiff = (last - first).toFixed(1)

  const last7 = data.slice(-7)
  const weekDiff =
    last7.length > 1
      ? (last7[last7.length - 1].value -
          last7[0].value
        ).toFixed(1)
      : '—'

  const streak = calculateStreak(history)

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
        <KPI
          label="Últimos 7 días"
          value={
            weekDiff === '—'
              ? '—'
              : `${weekDiff > 0 ? '+' : ''}${weekDiff} kg`
          }
          accent={weekDiff < 0 ? 'green' : 'red'}
        />
        <KPI
          label="Racha"
          value={`${streak} días`}
        />
      </div>

      {/* CHART */}
      <div style={styles.chartCard}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="weightGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--primary)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              axisLine={false}
            />

            <YAxis
              domain={[
                min - padding,
                max + padding
              ]}
              tick={{ fontSize: 11 }}
              axisLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              strokeWidth={2.5}
              fill="url(#weightGradient)"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
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

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length)
    return null

  return (
    <div style={styles.tooltip}>
      <span>{label}</span>
      <strong>{payload[0].value} kg</strong>
    </div>
  )
}

/* ======================
   HELPERS
====================== */

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  })
}

function calculateStreak(history) {
  if (history.length === 0) return 0

  const dates = history
    .map(h => new Date(h.date))
    .sort((a, b) => b - a)

  let streak = 1

  for (let i = 1; i < dates.length; i++) {
    const diff =
      (dates[i - 1] - dates[i]) /
      (1000 * 60 * 60 * 24)

    if (diff === 1) streak++
    else break
  }

  return streak
}

/* ======================
   STYLES
====================== */

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
  padding: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
},

  kpiLabel: {
    fontSize: '0.75rem',
    color: 'var(--muted)'
  },
  kpiValue: {
    fontSize: '1.8rem',
    fontWeight: 700
  },
  chartCard: {
    marginTop: '24px',
    background: 'var(--surface-3)',
    borderRadius: '20px',
    padding: '16px'
  },
  tooltip: {
    background: 'var(--surface-2)',
    padding: '10px',
    borderRadius: '12px'
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
