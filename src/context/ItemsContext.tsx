import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { videoGamesService } from '../services/videoGamesService'
import type { NewVideoGame, VideoGame, VideoGamesContextValue } from '../types/videoGame'
import { useAuth } from './AuthContext'

const VideoGamesContext = createContext<VideoGamesContextValue | null>(null)

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Error desconocido'
}

// Se monta dentro del área protegida (ver App.tsx), así que al cerrar sesión
// su estado se descarta y al volver a entrar se carga de nuevo desde el backend.
export function VideoGamesProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  const [games, setGames] = useState<VideoGame[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadCount, setReloadCount] = useState(0)

  // Carga el listado cuando hay token y cada vez que se pide reintentar.
  // loading empieza en true y reloadGames lo reactiva antes de cada reintento.
  useEffect(() => {
    if (!token) return

    let cancelled = false
    videoGamesService
      .getGames(token)
      .then((data) => {
        if (!cancelled) setGames(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(getErrorMessage(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    // Evita actualizar el estado con una respuesta que ya no corresponde.
    return () => {
      cancelled = true
    }
  }, [token, reloadCount])

  const reloadGames = useCallback(() => {
    setLoading(true)
    setError(null)
    setReloadCount((count) => count + 1)
  }, [])

  // Lanza el error para que la página que llama decida cómo mostrarlo.
  const addGame = useCallback(
    async (game: NewVideoGame) => {
      if (!token) {
        throw new Error('No hay una sesión activa.')
      }
      const created = await videoGamesService.createGame(token, game)
      setGames((current) => [...current, created])
    },
    [token],
  )

  const value = useMemo<VideoGamesContextValue>(
    () => ({ games, loading, error, addGame, reloadGames }),
    [games, loading, error, addGame, reloadGames],
  )

  return <VideoGamesContext.Provider value={value}>{children}</VideoGamesContext.Provider>
}

// El hook vive junto al Provider para mantener todo el contexto en un solo archivo.
// oxlint-disable-next-line react/only-export-components
export function useVideoGames(): VideoGamesContextValue {
  const context = useContext(VideoGamesContext)
  if (!context) {
    throw new Error('useVideoGames debe usarse dentro de VideoGamesProvider')
  }
  return context
}
