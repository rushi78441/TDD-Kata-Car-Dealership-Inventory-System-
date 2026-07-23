import { Link, useNavigate } from 'react-router-dom'

/**
 * Shell Component
 * 
 * Renders the main application navigation and header.
 * Adapts links based on the user's authentication state and role.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.auth - The current user authentication object.
 * @param {Function} props.onLogout - Callback function to handle user logout.
 * @returns {JSX.Element} The Shell component.
 */
function Shell({ auth, onLogout }) {
  const navigate = useNavigate()
  const isAdmin = auth?.role === 'admin'

  /**
   * Handles the logout process and redirects to the login page.
   */
  function handleLogout() {
    onLogout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-left group">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-slate-800 to-slate-950 text-sm font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-105">
            CD
          </span>
          <span>
            <span className="block text-base font-semibold text-slate-950">Car Dealership</span>
            <span className="block text-sm text-slate-500 transition-colors group-hover:text-slate-700">Inventory System</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          <Link className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100/80 hover:text-slate-950" to="/">
            Vehicles
          </Link>
          {isAdmin && (
            <Link className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100/80 hover:text-slate-950" to="/admin">
              Admin
            </Link>
          )}
          {auth ? (
            <>
              <Link className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100/80 hover:text-slate-950" to="/profile">
                Profile
              </Link>
              <span className="rounded-md bg-emerald-50/80 px-3 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-600/20 ring-inset">
                {auth.role}
              </span>
              <button
                className="ml-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100/80 hover:text-slate-950" to="/login">
                Login
              </Link>
              <Link className="ml-1 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow hover:-translate-y-0.5" to="/register">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Shell
