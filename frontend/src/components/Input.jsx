function Input({ label, ...props }) {
  return (
    <label className="block group">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 transition-colors group-focus-within:text-slate-900">{label}</span>
      <input
        className="h-11 w-full rounded-lg border border-slate-300/80 bg-white/50 backdrop-blur-sm px-4 text-slate-900 outline-none transition-all duration-200 hover:border-slate-400 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:shadow-sm"
        {...props}
      />
    </label>
  )
}

export default Input
