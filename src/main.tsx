import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import ReplicationPage from './pages/ReplicationPage.tsx'


function MainRoutes() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<App />} />
      <Route path="/replication" element={<ReplicationPage />} />
    </Routes>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  </StrictMode>,
)
