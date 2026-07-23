/**
 * Notice Component
 * 
 * Displays a dismissible or static alert message (either an error or a success message).
 * Renders nothing if neither error nor message is provided.
 * 
 * @param {Object} props - Component properties.
 * @param {string} [props.error] - The error message to display (styled red).
 * @param {string} [props.message] - The success or informational message to display (styled green).
 * @returns {JSX.Element|null} The Notice component, or null if no message/error.
 */
function Notice({ error, message }) {
  if (!error && !message) return null

  return (
    <div className={`rounded px-4 py-3 text-sm ${error ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
      {error || message}
    </div>
  )
}

export default Notice
