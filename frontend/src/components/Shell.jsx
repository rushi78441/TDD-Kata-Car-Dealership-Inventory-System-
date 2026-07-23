import { Link, useNavigate } from 'react-router-dom'

function Shell({ auth, onLogout }) {
  const navigate = useNavigate()
  const isAdmin = auth?.role === 'admin'

  function handleLogout() {
    onLogout()
    navigate('/login')
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-left">
          <span className="flex h-10 w-10 items-center justify-center rounded bg-slate-900 text-sm font-bold text-white">
            CD
          </span>
          <span>
            <span className="block text-base font-semibold text-slate-950">Car Dealership</span>
            <span className="block text-sm text-slate-500">Inventory System</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          <Link className="rounded px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100" to="/">
            Vehicles
          </Link>
          {isAdmin && (
            <Link className="rounded px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100" to="/admin">
              Admin
            </Link>
          )}
          {auth ? (
            <>
              <Link className="rounded px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100" to="/profile">
                Profile
              </Link>
              <span className="rounded bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                {auth.role}
              </span>
              <button
                className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-800"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="rounded px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100" to="/login">
                Login
              </Link>
              <Link className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-800" to="/register">
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
