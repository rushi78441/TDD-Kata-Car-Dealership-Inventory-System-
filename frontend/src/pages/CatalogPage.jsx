import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import Notice from '../components/Notice'
import Stat from '../components/Stat'
import VehicleCard from '../components/VehicleCard'
import { apiRequest, getDisplayName } from '../lib/api.jsx'

const emptyFilters = {
  brand: '',
  model: '',
  category: '',
  min_price: '',
  max_price: '',
}

function CatalogPage({ auth }) {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadVehicles(nextFilters = filters) {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      Object.entries(nextFilters).forEach(([key, value]) => {
        if (value !== '') params.set(key, value)
      })
      const path = params.toString() ? `/api/vehicles/search?${params.toString()}` : '/api/vehicles'
      setVehicles(await apiRequest(path))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchTimer = window.setTimeout(() => {
      loadVehicles()
    }, 0)

    return () => window.clearTimeout(fetchTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handlePurchase(vehicleId) {
    if (!auth) {
      navigate('/login')
      return
    }

    setMessage('')
    setError('')
    try {
      const result = await apiRequest(`/api/vehicles/${vehicleId}/purchase`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      setMessage(`${result.message}. Remaining stock: ${result.quantity}`)
      loadVehicles()
    } catch (err) {
      setError(err.message)
    }
  }

  function handleFilterChange(event) {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function clearFilters() {
    setFilters(emptyFilters)
    loadVehicles(emptyFilters)
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 border-b border-slate-200 pb-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Inventory</p>
          {auth && (
            <p className="mt-2 text-sm font-semibold text-emerald-700">
              Welcome {auth.role === 'admin' ? 'Admin' : 'Customer'} {getDisplayName(auth.email)}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">Find available vehicles</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Browse stock, filter by make or price, and purchase directly when signed in.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 rounded border border-slate-200 bg-white p-4 text-center">
          <Stat label="Vehicles" value={vehicles.length} />
          <Stat label="In Stock" value={vehicles.reduce((sum, vehicle) => sum + vehicle.quantity, 0)} />
          <Stat label="Admin" value={auth?.role === 'admin' ? 'Yes' : 'No'} />
        </div>
      </section>

      <section className="rounded border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-5">
          <Input label="Brand" name="brand" value={filters.brand} onChange={handleFilterChange} />
          <Input label="Model" name="model" value={filters.model} onChange={handleFilterChange} />
          <Input label="Category" name="category" value={filters.category} onChange={handleFilterChange} />
          <Input label="Min price" name="min_price" type="number" value={filters.min_price} onChange={handleFilterChange} />
          <Input label="Max price" name="max_price" type="number" value={filters.max_price} onChange={handleFilterChange} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" type="button" onClick={() => loadVehicles()}>
            Search
          </button>
          <button className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" type="button" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </section>

      <Notice error={error} message={message} />

      {loading ? (
        <div className="rounded border border-slate-200 bg-white p-8 text-center text-slate-500">Loading vehicles...</div>
      ) : vehicles.length === 0 ? (
        <div className="rounded border border-slate-200 bg-white p-8 text-center text-slate-500">No vehicles found.</div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} onPurchase={handlePurchase} />
          ))}
        </section>
      )}
    </div>
  )
}

export default CatalogPage
