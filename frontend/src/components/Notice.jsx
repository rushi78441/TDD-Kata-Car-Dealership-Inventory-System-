function Notice({ error, message }) {
  if (!error && !message) return null

  return (
    <div className={`rounded px-4 py-3 text-sm ${error ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
      {error || message}
    </div>
  )
}

export default Notice
