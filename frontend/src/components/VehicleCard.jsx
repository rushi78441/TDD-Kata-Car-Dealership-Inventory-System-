import { formatCurrency } from '../lib/api.jsx'

function VehicleCard({ vehicle, onPurchase }) {
  const isOutOfStock = vehicle.quantity <= 0

  return (
    <article className="group relative rounded-xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-300/80 animate-scale-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 transition-colors group-hover:text-slate-700">{vehicle.category}</p>
          <h2 className="mt-1.5 text-xl font-bold text-slate-950 tracking-tight">
            {vehicle.brand} {vehicle.model}
          </h2>
        </div>
        <span className={`rounded-md px-2.5 py-1 text-xs font-bold tracking-wide uppercase shadow-sm ring-1 ring-inset ${isOutOfStock ? 'bg-rose-50/80 text-rose-700 ring-rose-600/20' : 'bg-emerald-50/80 text-emerald-700 ring-emerald-600/20'}`}>
          {isOutOfStock ? 'Out' : `${vehicle.quantity} left`}
        </span>
      </div>
      <div className="mt-6 flex items-end justify-between gap-4">
        <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{formatCurrency(vehicle.price)}</p>
        <button
          className="rounded-lg bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:from-slate-800 hover:to-slate-700 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:shadow-none"
          type="button"
          disabled={isOutOfStock}
          onClick={() => onPurchase(vehicle.id)}
        >
          Purchase
        </button>
      </div>
    </article>
  )
}

export default VehicleCard
