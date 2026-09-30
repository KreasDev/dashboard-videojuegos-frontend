import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useVideoGames } from '../context/ItemsContext'
import { MAX_RATING, MIN_RATING } from '../types/videoGame'

interface GameFormValues {
  name: string
  platform: string
  genre: string
  rating: string
}

const EMPTY_FORM: GameFormValues = { name: '', platform: '', genre: '', rating: '' }

const TEXT_FIELDS: { name: Exclude<keyof GameFormValues, 'rating'>; label: string }[] = [
  { name: 'name', label: 'Nombre' },
  { name: 'platform', label: 'Plataforma' },
  { name: 'genre', label: 'Género' },
]

const INPUT_CLASS =
  'w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none'

function AddItemPage() {
  const { addGame } = useVideoGames()
  const navigate = useNavigate()
  const [values, setValues] = useState<GameFormValues>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  // El ref cambia al instante; el estado solo tras el siguiente render.
  // Así un segundo envío inmediato no genera otro POST.
  const savingRef = useRef(false)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (savingRef.current) return

    const name = values.name.trim()
    const platform = values.platform.trim()
    const genre = values.genre.trim()
    const rating = Number(values.rating)

    if (!name || !platform || !genre || values.rating.trim() === '') {
      setError('Todos los campos son obligatorios.')
      return
    }
    if (!Number.isInteger(rating) || rating < MIN_RATING || rating > MAX_RATING) {
      setError(`La calificación debe ser un número entero entre ${MIN_RATING} y ${MAX_RATING}.`)
      return
    }

    setError(null)
    savingRef.current = true
    setIsSaving(true)
    try {
      await addGame({ name, platform, genre, rating })
      navigate('/dashboard')
    } catch (err) {
      // Se conservan los datos del formulario para poder reintentar.
      setError(err instanceof Error ? err.message : 'No se pudo guardar el videojuego.')
      savingRef.current = false
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <div className="mx-auto max-w-xl py-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Agregar videojuego</h1>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-md">
          {TEXT_FIELDS.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-slate-700">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type="text"
                required
                value={values[field.name]}
                onChange={handleChange}
                className={INPUT_CLASS}
              />
            </div>
          ))}

          <div>
            <label htmlFor="rating" className="mb-1 block text-sm font-medium text-slate-700">
              Calificación ({MIN_RATING} a {MAX_RATING})
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              required
              min={MIN_RATING}
              max={MAX_RATING}
              step={1}
              value={values.rating}
              onChange={handleChange}
              className={INPUT_CLASS}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Link
              to="/dashboard"
              className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default AddItemPage
