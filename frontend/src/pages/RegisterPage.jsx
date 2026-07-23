import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import Input from '../components/Input'
import { apiRequest, decodeTokenPayload } from '../lib/api'

/**
 * RegisterPage Component
 * 
 * Renders the registration form for new customers.
 * Handles account creation, automatically logs the user in, and updates auth state.
 * 
 * @param {Object} props - Component properties.
 * @param {Object|null} props.auth - The current user authentication object, if any.
 * @param {Function} props.onLogin - Callback function triggered upon successful registration and login.
 * @returns {JSX.Element} The RegisterPage component.
 */
function RegisterPage({ auth, onLogin }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (auth) navigate('/')
  }, [auth, navigate])

  /**
   * Handles the submission of the registration form.
   * 
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      const loginData = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const payload = decodeTokenPayload(loginData.access_token)
      onLogin({
        token: loginData.access_token,
        tokenType: loginData.token_type,
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
    <AuthCard title="Create account" subtitle="Create a customer account to purchase vehicles.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <Input label="Password" type="password" maxLength="30" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        {error && <p className="rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <button className="w-full rounded bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300" disabled={loading} type="submit">
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </AuthCard>
  )
}

export default RegisterPage
