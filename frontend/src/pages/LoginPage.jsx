import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import Input from '../components/Input'
import { apiRequest, decodeTokenPayload } from '../lib/api'

/**
 * LoginPage Component
 * 
 * Renders the login form for existing users.
 * Handles authentication and updates the application's auth state.
 * 
 * @param {Object} props - Component properties.
 * @param {Object|null} props.auth - The current user authentication object, if any.
 * @param {Function} props.onLogin - Callback function triggered upon successful login.
 * @returns {JSX.Element} The LoginPage component.
 */
function LoginPage({ auth, onLogin }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (auth) navigate('/')
  }, [auth, navigate])

  /**
   * Updates specific form field in local state.
   */
  function handleInputChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  /**
   * Handles the submission of the login form.
   * 
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      const payload = decodeTokenPayload(data.access_token)
      onLogin({
        token: data.access_token,
        tokenType: data.token_type,
        email: payload.sub || form.email,
        role: payload.role || 'customer',
        expiresAt: payload.exp,
      })
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Welcome back" subtitle="Login to purchase vehicles or manage inventory.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input 
          label="Email" 
          type="email" 
          name="email" 
          value={form.email} 
          onChange={handleInputChange} 
          disabled={loading}
          required 
        />
        <Input 
          label="Password" 
          type="password" 
          name="password" 
          value={form.password} 
          onChange={handleInputChange} 
          disabled={loading}
          required 
        />
        
        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-200/60 p-3 text-sm text-rose-700 animate-fade-in">
            {error}
          </div>
        )}

        <button 
          className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer" 
          disabled={loading} 
          type="submit"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Logging in...
            </span>
          ) : (
            'Login'
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        New here?{' '}
        <Link className="font-semibold text-slate-900 hover:underline" to="/register">
          Create an account
        </Link>
      </p>
    </AuthCard>
  )
}

export default LoginPage