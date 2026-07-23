/**
 * AuthCard Component
 * 
 * A wrapper component for authentication-related forms (Login, Register).
 * Provides a consistent card layout with a title and subtitle.
 * 
 * @param {Object} props - Component properties.
 * @param {string} props.title - The main heading for the card.
 * @param {string} props.subtitle - A secondary descriptive text below the title.
 * @param {React.ReactNode} props.children - The form or content to render inside the card.
 * @returns {JSX.Element} The AuthCard component.
 */
function AuthCard({ title, subtitle, children }) {
  return (
    <section className="mx-auto mt-8 w-full max-w-md rounded border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </section>
  )
}

export default AuthCard
