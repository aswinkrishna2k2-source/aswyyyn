import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import ProjectDetail from './pages/ProjectDetail.tsx'
import './index.css'
import './utils/palette'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
