import { useEffect, useState } from 'react'
import Input from '../components/Input'
import Notice from '../components/Notice'
import Stat from '../components/Stat'
import { apiRequest, emptyVehicle, formatCurrency } from '../lib/api.jsx'

function AdminPage({ auth }) {
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState(emptyVehicle)
  const [editingId, setEditingId] = useState(null)
  const [restock, setRestock] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const authHeaders = { Authorization: `Bearer ${auth.token}` }

  async function loadVehicles() {
    try {
      setVehicles(await apiRequest('/api/vehicles'))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    const fetchTimer = window.setTimeout(() => {
      loadVehicles()
    }, 0)

    return () => window.clearTimeout(fetchTimer)
  }, [])

  function updateForm(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function vehiclePayload(source) {
    return {
      brand: source.brand,
      model: source.model,
      category: source.category,
      price: Number(source.price),
      quantity: Number(source.quantity),
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      if (editingId) {
        await apiRequest(`/api/vehicles/${editingId}`, {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify(vehiclePayload(form)),
        })
        setMessage('Vehicle updated successfully.')
      } else {
        await apiRequest('/api/vehicles', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify(vehiclePayload(form)),
        })
        setMessage('Vehicle added successfully.')
      }
      setForm(emptyVehicle)
      setEditingId(null)
      setIsModalOpen(false)
      loadVehicles()
    } catch (err) {
      setError(err.message)
    }
  }

  function startEdit(vehicle) {
    setEditingId(vehicle.id)
    setIsModalOpen(true)
    setForm({
      brand: vehicle.brand,
      model: vehicle.model,
      category: vehicle.category,
      price: String(vehicle.price),
      quantity: String(vehicle.quantity),
    })
  }

  async function handleDelete(vehicleId) {
    setMessage('')
    setError('')

    try {
      await apiRequest(`/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: authHeaders,
      })
      setMessage('Vehicle deleted successfully.')
      loadVehicles()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleRestock(vehicleId) {
    const quantity = Number(restock[vehicleId] || 0)
    if (quantity <= 0) {
      setError('Restock quantity must be greater than 0')
      return
    }

    setMessage('')
    setError('')

    try {
      await apiRequest(`/api/vehicles/${vehicleId}/restock?quantity=${quantity}`, {
        method: 'POST',
        headers: authHeaders,
      })
      setRestock((current) => ({ ...current, [vehicleId]: '' }))
      setMessage('Vehicle restocked successfully.')
      loadVehicles()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fade-in">
          <section className="w-full max-w-md rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md animate-scale-in">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-950">{editingId ? 'Edit vehicle' : 'Add vehicle'}</h1>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingId(null)
                  setForm(emptyVehicle)
                }}
              >
                ✕
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-500">Admin-only inventory controls.</p>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <Input label="Brand" name="brand" value={form.brand} onChange={updateForm} placeholder="e.g. Honda" required />
              <Input label="Model" name="model" value={form.model} onChange={updateForm} placeholder="e.g. Civic" required />
              <Input label="Category" name="category" value={form.category} onChange={updateForm} placeholder="e.g. Sedan" required />
              <Input label="Price" name="price" type="number" min="1" value={form.price} onChange={updateForm} placeholder="e.g. 25000" required />
              <Input label="Quantity" name="quantity" type="number" min="0" value={form.quantity} onChange={updateForm} placeholder="e.g. 5" required />
              <button className="w-full rounded bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800" type="submit">
                {editingId ? 'Save changes' : 'Add vehicle'}
              </button>
              {editingId && (
                <button
                  className="w-full rounded border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingId(null)
                    setForm(emptyVehicle)
                  }}
                >
                  Cancel edit
                </button>
              )}
            </form>
          </section>
        </div>
      )}

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Admin Panel — Inventory Control</h2>
            <p className="mt-1 text-sm text-slate-500">Update, restock, or remove vehicles.</p>
          </div>
          <button
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Vehicle
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 rounded-2xl border border-white bg-white/60 p-4 shadow-sm backdrop-blur-md animate-slide-up">
          <Stat label="Total Vehicles" value={vehicles.length} />
          <Stat label="In Stock" value={vehicles.reduce((sum, vehicle) => sum + vehicle.quantity, 0)} />
          <Stat label="Total Value" value={formatCurrency(vehicles.reduce((sum, vehicle) => sum + (vehicle.price * vehicle.quantity), 0))} />
          <Stat label="Out of Stock" value={vehicles.filter(v => v.quantity <= 0).length} />
        </div>

        <Notice error={error} message={message} />
        
        <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white/60 shadow-sm backdrop-blur-sm animate-fade-in">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200/60 text-left text-sm">
              <thead className="bg-slate-50/50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Restock</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60">
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                      No vehicles in inventory.
                    </td>
                  </tr>
                ) : null}
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="group transition-colors hover:bg-slate-50/80">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{vehicle.brand} {vehicle.model}</div>
                      <div className="text-xs text-slate-500">{vehicle.category}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${vehicle.quantity > 0 ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'}`}>
                        {vehicle.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600 whitespace-nowrap">{formatCurrency(vehicle.price)}</td>
                    <td className="px-4 py-4 text-slate-600 whitespace-nowrap">{vehicle.quantity}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 opacity-60 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                        <input
                          className="h-8 w-16 rounded-md border border-slate-300/80 bg-white/50 px-2 text-sm outline-none transition-colors focus:border-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900"
                          min="1"
                          type="number"
                          placeholder="Qty"
                          value={restock[vehicle.id] || ''}
                          onChange={(event) => setRestock((current) => ({ ...current, [vehicle.id]: event.target.value }))}
                        />
                        <button className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow disabled:opacity-50" type="button" onClick={() => handleRestock(vehicle.id)} disabled={!restock[vehicle.id]} title="Restock">
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-60 transition-opacity group-hover:opacity-100">
                        <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" type="button" onClick={() => startEdit(vehicle)}>
                          Edit
                        </button>
                        <button className="text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors" type="button" onClick={() => handleDelete(vehicle.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminPage
