import type { AuthHeaders } from '../types/api'

// Construye los headers de cualquier request protegido al backend.
export function createAuthHeaders(token: string): AuthHeaders {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}
