import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'
import App from './App.tsx'
import ProjectDetail from './pages/ProjectDetail.tsx'
import NotFound from './pages/NotFound.tsx'
import { useVisitorTracking } from './hooks/useVisitorTracking'
import { startSmoothScroll } from './lib/smoothScroll'
import './index.css'

startSmoothScroll()

function AppRoutes() {
  useVisitorTracking();

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Honour the OS "reduce motion" setting for every framer-motion animation */}
      <MotionConfig reducedMotion="user">
        <AppRoutes />
      </MotionConfig>
      <Analytics />
    </BrowserRouter>
  </React.StrictMode>,
)
