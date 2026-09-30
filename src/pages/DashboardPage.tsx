import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useVideoGames } from '../context/ItemsContext'
import { MAX_RATING } from '../types/videoGame'

function DashboardPage() {
  const { logout } = useAuth()
  const { games, loading, error, reloadGames } = useVideoGames()

  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <div className="mx-auto max-w-4xl py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard de videojuegos</h1>
          <div className="flex gap-2">
            <Link
              to="/dashboard/nuevo"
              className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
            >
              Agregar videojuego
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-6 shadow-md">
            <p className="text-slate-500">Cargando videojuegos...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-white p-6 shadow-md">
            <p className="font-medium text-red-700">No se pudieron cargar los videojuegos.</p>
            <p className="mt-1 text-sm text-slate-500">{error}</p>
            <button
              type="button"
              onClick={reloadGames}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
            >
              Reintentar
            </button>
          </div>
        ) : games.length === 0 ? (
          <div className="rounded-xl bg-white p-6 shadow-md">
            <p className="text-slate-500">No hay videojuegos registrados.</p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <li key={game.id} className="rounded-xl bg-white p-5 shadow-md">
                <h2 className="mb-3 text-lg font-semibold text-slate-800">{game.name}</h2>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Plataforma</dt>
                    <dd className="text-right text-slate-700">{game.platform}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Género</dt>
                    <dd className="text-right text-slate-700">{game.genre}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Calificación</dt>
                    <dd className="font-semibold text-indigo-600">
                      {game.rating}/{MAX_RATING}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}

export default DashboardPage
