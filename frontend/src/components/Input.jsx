function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-slate-900"
        {...props}
      />
    </label>
  )
}

export default Input
