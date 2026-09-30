import type { AuthHeaders } from '../types/api'

// Construye los headers de cualquier request protegido al backend.
export function createAuthHeaders(token: string): AuthHeaders {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

// Punto único para demostrar que cada request lleva el JWT.
// Debe llamarse justo antes de enviar un request protegido real.
export function logAuthHeader(headers: AuthHeaders): void {
  console.log('Authorization:', headers.Authorization)
}
