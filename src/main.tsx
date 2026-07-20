import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import ProjectDetail from './pages/ProjectDetail.tsx'
import { useVisitorTracking } from './hooks/useVisitorTracking'
import './index.css'
import './utils/palette'

function AppRoutes() {
  useVisitorTracking();

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>,
)
