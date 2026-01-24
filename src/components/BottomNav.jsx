import { NavLink } from 'react-router-dom'
import {
  House,
  CalendarBlank,
  ChartLineUp
} from 'phosphor-react'

export default function BottomNav() {
  return (
    <nav style={styles.nav}>
      <NavItem to="/" icon={House} label="Home" />
      <NavItem to="/calendar" icon={CalendarBlank} label="Calendar" />
      <NavItem to="/progress" icon={ChartLineUp} label="Stats" />
    </nav>
  )
}

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end
      style={({ isActive }) => ({
        ...styles.item,
        color: isActive
          ? 'var(--primary)'
          : 'var(--muted)'
      })}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={28}
            weight={isActive ? 'bold' : 'regular'}
          />
          <span style={styles.label}>{label}</span>
          {isActive && <span style={styles.dot} />}
        </>
      )}
    </NavLink>
  )
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 12,
    left: 12,
    right: 12,
    height: 64,
    background: 'var(--surface-3)',
    borderRadius: 'var(--radius-xl)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    boxShadow: 'var(--shadow-strong)',
    zIndex: 50
  },
  item: {
    flex: 1,
    height: '100%',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    position: 'relative',
    transition: 'color 0.2s ease'
  },
  label: {
    fontSize: '0.65rem',
    letterSpacing: '0.04em'
  },
  dot: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: 'var(--primary)'
  }
}