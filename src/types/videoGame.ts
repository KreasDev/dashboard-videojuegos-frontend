export interface VideoGame {
  id: string
  name: string
  platform: string
  genre: string
  rating: number
}

export type NewVideoGame = Omit<VideoGame, 'id'>

export interface VideoGamesContextValue {
  games: VideoGame[]
  loading: boolean
  error: string | null
  addGame: (game: NewVideoGame) => Promise<void>
  reloadGames: () => void
}

export const MIN_RATING = 1
export const MAX_RATING = 10
