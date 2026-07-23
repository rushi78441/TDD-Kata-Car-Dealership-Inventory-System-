import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import Notice from '../components/Notice'
import Stat from '../components/Stat'
import VehicleCard from '../components/VehicleCard'
import { apiRequest, getDisplayName } from '../lib/api'

const emptyFilters = {
  brand: '',
  model: '',
  category: '',
  min_price: '',
  max_price: '',
}

/**
 * CatalogPage Component
 * 
 * Displays the vehicle catalog for customers.
 * Includes search and filtering capabilities, and allows logged-in customers to purchase vehicles.
 * Uses optimistic UI updates for instant purchase feedback.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.auth - Authentication object containing the user token and role.
 * @returns {JSX.Element} The CatalogPage component.
 */
function CatalogPage({ auth }) {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [filters, setFilters] = useState(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  /**
   * Fetches vehicles from the API, optionally applying filters.
   * 
   * @param {Object} [nextFilters=filters] - The filters to apply to the search.
   */
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
    loadVehicles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Handles the purchase of a vehicle with Optimistic State Updates.
   * Redirects to the login page if the user is not authenticated.
   * 
   * @param {string} vehicleId - The ID of the vehicle to purchase.
   */
  async function handlePurchase(vehicleId) {
    if (!auth) {
      navigate('/login')
      return
    }

    setMessage('')
    setError('')

    const previousVehicles = [...vehicles]

    // 1. Optimistically decrement quantity in local state immediately
    setVehicles((prevVehicles) =>
      prevVehicles.map((v) => {
        if (v.id === vehicleId) {
          return { ...v, quantity: Math.max(0, v.quantity - 1) }
        }
        return v
      })
    )

    // 2. Send API purchase request in the background
    try {
      const result = await apiRequest(`/api/vehicles/${vehicleId}/purchase`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.token}` },
      })

      // Sync remaining stock directly with server response if needed
      if (typeof result.quantity === 'number') {
        setVehicles((prevVehicles) =>
          prevVehicles.map((v) => (v.id === vehicleId ? { ...v, quantity: result.quantity } : v))
        )
      }

      setMessage(`${result.message}. Remaining stock: ${result.quantity}`)
    } catch (err) {
      // Rollback to original state if purchase failed
      setVehicles(previousVehicles)
      setError(err.message)
      setMessage('')
    }
  }

  /**
   * Updates the filter state when a filter input changes.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  function handleFilterChange(event) {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  /**
   * Clears all filters and reloads the full vehicle list.
   */
  function clearFilters() {
    setFilters(emptyFilters)
    loadVehicles(emptyFilters)
  }

  return (
    <div className="space-y-8 pb-12">
      <section className="grid gap-8 border-b border-slate-200/60 pb-10 pt-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end animate-fade-in">
        <div className="animate-slide-up">
          <p className="inline-block rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 shadow-sm ring-1 ring-inset ring-slate-900/10">
            Inventory Catalog
          </p>
          {auth && (
            <p className="mt-4 text-sm font-semibold text-emerald-700">
              Welcome {getDisplayName(auth.email)}
            </p>
          )}
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-linear-to-br from-slate-900 to-slate-500">
            Find your perfect vehicle.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600 leading-relaxed">
            Browse our premium stock, filter by make or price, and purchase directly when signed in.
          </p>
        </div>
        <div
          className="grid grid-cols-3 gap-3 rounded-2xl border border-white bg-white/60 p-4 text-center shadow-sm backdrop-blur-md animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <Stat label="Vehicles" value={vehicles.length} />
          <Stat label="In Stock" value={vehicles.reduce((sum, vehicle) => sum + vehicle.quantity, 0)} />
          <Stat label="Admin" value={auth?.role === 'admin' ? 'Yes' : 'No'} />
        </div>
      </section>

      <section
        className="rounded-xl border border-slate-200/60 bg-white/60 p-5 shadow-sm backdrop-blur-sm animate-fade-in"
        style={{ animationDelay: '200ms' }}
      >
        <div className="grid gap-3 md:grid-cols-5">
          <Input label="Brand" name="brand" value={filters.brand} onChange={handleFilterChange} placeholder="e.g. Toyota" />
          <Input label="Model" name="model" value={filters.model} onChange={handleFilterChange} placeholder="e.g. Camry" />
          <Input label="Category" name="category" value={filters.category} onChange={handleFilterChange} placeholder="e.g. Sedan" />
          <Input label="Min price" name="min_price" type="number" value={filters.min_price} onChange={handleFilterChange} placeholder="10000" />
          <Input label="Max price" name="max_price" type="number" value={filters.max_price} onChange={handleFilterChange} placeholder="50000" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow cursor-pointer"
            type="button"
            onClick={() => loadVehicles()}
          >
            Search
          </button>
          <button
            className="rounded-lg border border-slate-300/80 bg-white/50 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            type="button"
            onClick={clearFilters}
          >
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
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} onPurchase={handlePurchase} />
          ))}
        </section>
      )}
    </div>
  )
}

export default CatalogPage