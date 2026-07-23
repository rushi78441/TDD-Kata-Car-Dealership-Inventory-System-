import { useEffect, useState } from 'react'
import { getDisplayName, getSessionDuration } from '../lib/api.jsx'

function ProfilePage({ auth }) {
  const [duration, setDuration] = useState(() => getSessionDuration(auth?.expiresAt))
  const displayName = getDisplayName(auth?.email)
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDuration(getSessionDuration(auth?.expiresAt))
    }, 30000)

    return () => window.clearInterval(timer)
  }, [auth?.expiresAt])

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-24 w-24 items-center justify-center rounded bg-slate-900 text-3xl font-bold text-white">
          {initials}
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-950">{displayName}</h1>
        <p className="mt-1 break-all text-sm text-slate-500">{auth?.email}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">{auth?.role}</span>
          <span className="rounded bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">Session {duration}</span>
        </div>
      </aside>

      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Profile</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <ProfileField label="Name" value={displayName} />
          <ProfileField label="Role" value={auth?.role} />
          <ProfileField label="Email" value={auth?.email} />
          <ProfileField label="Token type" value={auth?.tokenType || 'Bearer'} />
        </div>
      </section>
    </div>
  )
}

function ProfileField({ label, value }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-all text-sm font-semibold text-slate-900">{value || '-'}</p>
    </div>
  )
}

export default ProfilePage
