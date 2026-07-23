function Stat({ label, value }) {
  return (
    <div className="group rounded-lg p-3 transition-all duration-300 hover:bg-slate-50 hover:shadow-sm hover:scale-105">
      <p className="text-xl font-extrabold text-slate-900 transition-colors group-hover:text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
    </div>
  )
}

export default Stat
