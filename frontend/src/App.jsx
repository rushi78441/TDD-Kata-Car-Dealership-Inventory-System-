import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Shell from './components/Shell'
import { AUTH_STORAGE_KEY } from './lib/api'
import AdminPage from './pages/AdminPage'
import CatalogPage from './pages/CatalogPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import './App.css'

function getSavedAuth() {
  try {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
    return savedAuth ? JSON.parse(savedAuth) : null
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

function App() {
  const [auth, setAuth] = useState(getSavedAuth)

  function saveAuth(nextAuth) {
    setAuth(nextAuth)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth))
  }

  function logout() {
    setAuth(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <Shell auth={auth} onLogout={logout} />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<CatalogPage auth={auth} />} />
          <Route path="/login" element={<LoginPage auth={auth} onLogin={saveAuth} />} />
          <Route path="/register" element={<RegisterPage auth={auth} onLogin={saveAuth} />} />
          <Route
            path="/profile"
            element={auth ? <ProfilePage auth={auth} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/admin"
            element={auth?.role === 'admin' ? <AdminPage auth={auth} /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
