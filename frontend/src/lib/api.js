/**
 * The base URL for API requests.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

/**
 * The key used to store authentication data in local storage.
 */
export const AUTH_STORAGE_KEY = 'dealership-auth'

/**
 * A default empty vehicle object template.
 */
export const emptyVehicle = {
  brand: '',
  model: '',
  category: '',
  price: '',
  quantity: '',
}

/**
 * Formats a numerical value as a US Dollar currency string.
 * 
 * @param {number|string} value - The numeric value to format.
 * @returns {string} The formatted currency string.
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

/**
 * Decodes a JWT token to extract its payload.
 * 
 * @param {string} token - The JWT token.
 * @returns {Object} The decoded payload object, or an empty object if decoding fails.
 */
export function decodeTokenPayload(token) {
  try {
    const payload = token.split('.')[1]
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(window.atob(normalized))
  } catch {
    return {}
  }
}

/**
 * Generates a human-readable display name from an email address.
 * 
 * @param {string} [email=''] - The user's email address.
 * @returns {string} The formatted display name.
 */
export function getDisplayName(email = '') {
  const name = email.split('@')[0] || 'User'
  return name
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

/**
 * Calculates a human-readable remaining session duration based on an expiration timestamp.
 * 
 * @param {number} expirySeconds - The expiration timestamp in seconds (epoch).
 * @returns {string} A formatted string showing remaining hours and/or minutes.
 */
export function getSessionDuration(expirySeconds) {
  if (!expirySeconds) return 'Unknown'

  const remainingMs = expirySeconds * 1000 - Date.now()
  if (remainingMs <= 0) return 'Expired'

  const totalMinutes = Math.ceil(remainingMs / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours <= 0) return `${minutes} min`
  if (minutes === 0) return `${hours} hr`
  return `${hours} hr ${minutes} min`
}

/**
 * Makes an HTTP request to the API.
 * Automatically prepends the API base URL and handles JSON serialization/parsing.
 * 
 * @param {string} path - The API endpoint path (e.g., '/api/vehicles').
 * @param {RequestInit} [options={}] - Standard fetch options.
 * @returns {Promise<any>} The parsed JSON response data.
 * @throws {Error} If the request fails or returns a non-OK status.
 */
export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || 'Request failed')
  }

  return data
}
