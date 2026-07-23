import { formatCurrency } from '../lib/api.jsx'

function VehicleCard({ vehicle, onPurchase }) {
  const isOutOfStock = vehicle.quantity <= 0

  return (
    <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{vehicle.category}</p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">
            {vehicle.brand} {vehicle.model}
          </h2>
        </div>
        <span className={`rounded px-3 py-1 text-sm font-semibold ${isOutOfStock ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {isOutOfStock ? 'Out' : `${vehicle.quantity} left`}
        </span>
      </div>
      <div className="mt-5 flex items-end justify-between gap-4">
        <p className="text-2xl font-bold text-slate-950">{formatCurrency(vehicle.price)}</p>
        <button
          className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
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
