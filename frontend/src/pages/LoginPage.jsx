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
        <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <Input label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        {error && <p className="rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <button className="w-full rounded bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300" disabled={loading} type="submit">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        New here?{' '}
        <Link className="font-semibold text-slate-900" to="/register">
          Create an account
        </Link>
      </p>
    </AuthCard>
  )
}

export default LoginPage
