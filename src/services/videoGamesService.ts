import { BACKEND_API_URL } from '../config/api'
import type { NewVideoGame, VideoGame } from '../types/videoGame'
import { createAuthHeaders, logAuthHeader } from './authHeaders'

export interface VideoGamesService {
  getGames: (token: string) => Promise<VideoGame[]>
  createGame: (token: string, game: NewVideoGame) => Promise<VideoGame>
}

const GAMES_PATH = '/api/games'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

// Intenta usar el { message } que devuelve el backend; si no, un mensaje genérico.
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json()
    if (isRecord(data) && typeof data.message === 'string') {
      return `${data.message} (HTTP ${response.status})`
    }
  } catch {
    // La respuesta de error no era JSON.
  }
  return `El backend respondió con un error (HTTP ${response.status})`
}

// Request protegido al backend: añade Authorization: Bearer <JWT>, lo muestra
// en consola y convierte la respuesta JSON o lanza un Error entendible.
async function protectedRequest<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
  if (!BACKEND_API_URL) {
    throw new Error('VITE_BACKEND_API_URL no está configurada. Revisa el archivo .env.')
  }

  const headers = createAuthHeaders(token)
  logAuthHeader(headers)

  let response: Response
  try {
    response = await fetch(`${BACKEND_API_URL.replace(/\/+$/, '')}${path}`, { ...init, headers })
  } catch {
    throw new Error('No se pudo conectar con el backend. Verifica que esté en ejecución.')
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }
  return (await response.json()) as T
}

export const videoGamesService: VideoGamesService = {
  // GET /api/games  (Authorization: Bearer <JWT>)
  getGames: (token) => protectedRequest<VideoGame[]>(token, GAMES_PATH),

  // POST /api/games (Authorization: Bearer <JWT>, Content-Type: application/json)
  createGame: (token, game) =>
    protectedRequest<VideoGame>(token, GAMES_PATH, { method: 'POST', body: JSON.stringify(game) }),
}
