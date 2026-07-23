function AuthCard({ title, subtitle, children }) {
  return (
    <section className="mx-auto mt-8 w-full max-w-md rounded border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </section>
  )
}

export default AuthCard
