function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xl font-bold text-slate-950">{value}</p>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  )
}

export default Stat
