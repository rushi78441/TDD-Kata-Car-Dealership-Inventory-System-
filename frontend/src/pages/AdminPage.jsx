import { useEffect, useState } from 'react'
import Input from '../components/Input'
import Notice from '../components/Notice'
import { apiRequest, emptyVehicle, formatCurrency } from '../lib/api.jsx'

function AdminPage({ auth }) {
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState(emptyVehicle)
  const [editingId, setEditingId] = useState(null)
  const [restock, setRestock] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

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
      loadVehicles()
    } catch (err) {
      setError(err.message)
    }
  }

  function startEdit(vehicle) {
    setEditingId(vehicle.id)
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
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <section className="rounded border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold text-slate-950">{editingId ? 'Edit vehicle' : 'Add vehicle'}</h1>
        <p className="mt-1 text-sm text-slate-500">Admin-only inventory controls.</p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <Input label="Brand" name="brand" value={form.brand} onChange={updateForm} required />
          <Input label="Model" name="model" value={form.model} onChange={updateForm} required />
          <Input label="Category" name="category" value={form.category} onChange={updateForm} required />
          <Input label="Price" name="price" type="number" min="1" value={form.price} onChange={updateForm} required />
          <Input label="Quantity" name="quantity" type="number" min="0" value={form.quantity} onChange={updateForm} required />
          <button className="w-full rounded bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800" type="submit">
            {editingId ? 'Save changes' : 'Add vehicle'}
          </button>
          {editingId && (
            <button
              className="w-full rounded border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm(emptyVehicle)
              }}
            >
              Cancel edit
            </button>
          )}
        </form>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Inventory records</h2>
          <p className="mt-1 text-sm text-slate-500">Update, restock, or remove vehicles.</p>
        </div>
        <Notice error={error} message={message} />
        <div className="overflow-hidden rounded border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Restock</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {vehicle.brand} {vehicle.model}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{vehicle.category}</td>
                    <td className="px-4 py-3 text-slate-600">{formatCurrency(vehicle.price)}</td>
                    <td className="px-4 py-3 text-slate-600">{vehicle.quantity}</td>
                    <td className="px-4 py-3">
                      <div className="flex min-w-36 gap-2">
                        <input
                          className="h-9 w-20 rounded border border-slate-300 px-2 outline-none focus:border-slate-900"
                          min="1"
                          type="number"
                          value={restock[vehicle.id] || ''}
                          onChange={(event) => setRestock((current) => ({ ...current, [vehicle.id]: event.target.value }))}
                        />
                        <button className="rounded border border-slate-300 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50" type="button" onClick={() => handleRestock(vehicle.id)}>
                          Add
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="rounded border border-slate-300 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50" type="button" onClick={() => startEdit(vehicle)}>
                          Edit
                        </button>
                        <button className="rounded bg-rose-600 px-3 py-2 font-semibold text-white hover:bg-rose-700" type="button" onClick={() => handleDelete(vehicle.id)}>
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
