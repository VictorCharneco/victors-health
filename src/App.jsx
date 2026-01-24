import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Home from './views/Home'
import Calendar from './views/Calendar'
import Progress from './views/Progress'
import BottomNav from './components/BottomNav'

export default function App() {
  const location = useLocation()

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={<Page><Home /></Page>}
          />
          <Route
            path="/calendar"
            element={<Page><Calendar /></Page>}
          />
          <Route
            path="/progress"
            element={<Page><Progress /></Page>}
          />
        </Routes>
      </AnimatePresence>

      <BottomNav />
    </div>
  )
}

/* ======================
   PAGE WRAPPER
====================== */

function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{
        duration: 0.28,
        ease: 'easeOut'
      }}
      style={{ flex: 1 }}
    >
      {children}
    </motion.div>
  )
}