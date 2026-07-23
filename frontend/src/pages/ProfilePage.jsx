import { useEffect, useState } from 'react'
import { getDisplayName, getSessionDuration } from '../lib/api'

/**
 * ProfilePage Component
 * 
 * Displays the current user's profile information, including their role,
 * email, and remaining session duration.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.auth - The current user authentication object.
 * @returns {JSX.Element} The ProfilePage component.
 */
function ProfilePage({ auth }) {
  const [duration, setDuration] = useState(() => getSessionDuration(auth?.expiresAt))
  const displayName = getDisplayName(auth?.email)
  
  // Robust initials extraction (up to 2 capital letters)
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  // Update session duration counter every second for real-time accuracy
  useEffect(() => {
    setDuration(getSessionDuration(auth?.expiresAt))
    
    const timer = window.setInterval(() => {
      setDuration(getSessionDuration(auth?.expiresAt))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [auth?.expiresAt])

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr] animate-fade-in">
      <aside className="rounded-2xl border border-slate-200/60 bg-white/60 p-6 shadow-sm backdrop-blur-md animate-slide-up">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-white shadow-md">
          {initials}
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-950">{displayName}</h1>
        <p className="mt-1 break-all text-sm text-slate-500">{auth?.email}</p>
        
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            {auth?.role || 'Customer'}
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-500/10">
            Session {duration}
          </span>
        </div>
      </aside>

      <section className="rounded-2xl border border-slate-200/60 bg-white/60 p-6 shadow-sm backdrop-blur-md animate-slide-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-xl font-bold text-slate-950">Profile Information</h2>
        <p className="mt-1 text-sm text-slate-500">Overview of your active account details and authentication state.</p>
        
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ProfileField label="Name" value={displayName} />
          <ProfileField label="Role" value={auth?.role} />
          <ProfileField label="Email" value={auth?.email} />
          <ProfileField label="Token type" value={auth?.tokenType || 'Bearer'} />
        </div>
      </section>
    </div>
  )
}

/**
 * ProfileField Component
 * 
 * A simple display component for a key-value pair in the profile section.
 * 
 * @param {Object} props - Component properties.
 * @param {string} props.label - The label for the field.
 * @param {string} [props.value] - The value to display.
 * @returns {JSX.Element} The ProfileField component.
 */
function ProfileField({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200/60 bg-white/50 p-4 transition-colors hover:bg-white/80">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 break-all text-sm font-semibold text-slate-900">{value || '-'}</p>
    </div>
  )
}

export default ProfilePage