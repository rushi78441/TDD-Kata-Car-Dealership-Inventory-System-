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

/**
 * Retrieves the saved authentication object from local storage.
 * Handles parsing errors and automatically purges expired tokens on application load.
 * 
 * @returns {Object|null} The saved authentication object, or null if missing/expired/invalid.
 */
function getSavedAuth() {
  try {
    const savedAuthStr = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!savedAuthStr) return null

    const savedAuth = JSON.parse(savedAuthStr)

    // Automatically check if token is expired (exp is in seconds, Date.now() in ms)
    if (savedAuth?.expiresAt && savedAuth.expiresAt * 1000 < Date.now()) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }

    return savedAuth
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

/**
 * App Component
 * 
 * The root application component that sets up routing and global state (authentication).
 * Manages the top-level layout (Shell) and page routes based on user role.
 * 
 * @returns {JSX.Element} The App component.
 */
function App() {
  const [auth, setAuth] = useState(getSavedAuth)

  /**
   * Updates the authentication state in React and local storage.
   * 
   * @param {Object} nextAuth - The new authentication object containing the token and user details.
   */
  function saveAuth(nextAuth) {
    setAuth(nextAuth)
    if (nextAuth) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  /**
   * Clears the authentication state and removes it from local storage, logging the user out.
   */
  function logout() {
    setAuth(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-slate-900 selection:bg-slate-900 selection:text-white">
      <Shell auth={auth} onLogout={logout} />
      
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Routes>
          {/* Public Catalog */}
          <Route path="/" element={<CatalogPage auth={auth} />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage auth={auth} onLogin={saveAuth} />} />
          <Route path="/register" element={<RegisterPage auth={auth} onLogin={saveAuth} />} />
          
          {/* Protected Customer Route */}
          <Route
            path="/profile"
            element={auth ? <ProfilePage auth={auth} /> : <Navigate to="/login" replace />}
          />
          
          {/* Protected Admin Route */}
          <Route
            path="/admin"
            element={auth?.role === 'admin' ? <AdminPage auth={auth} /> : <Navigate to="/" replace />}
          />
          
          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App