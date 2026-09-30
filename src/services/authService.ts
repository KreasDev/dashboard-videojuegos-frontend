import { LDAP_API_URL } from '../config/api'
import type { LoginResponse } from '../types/api'

const LOGIN_PATH = '/login'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

// Traduce la respuesta de error del API LDAP ({ detail }) a un mensaje para el usuario.
async function readLoginError(response: Response): Promise<string> {
  if (response.status === 401) {
    return 'Usuario o contraseña incorrectos.'
  }

  let detail: string | null = null
  try {
    const data: unknown = await response.json()
    if (isRecord(data) && typeof data.detail === 'string') {
      detail = data.detail
    }
  } catch {
    // La respuesta de error no era JSON.
  }

  if (response.status === 400) {
    return 'Usuario y contraseña son obligatorios.'
  }
  return detail
    ? `${detail} (HTTP ${response.status})`
    : `El servicio de autenticación respondió con un error (HTTP ${response.status}).`
}

// Única función que conoce el API LDAP: envía las credenciales a
// POST ${LDAP_API_URL}/login y devuelve solo el JWT del campo `token`.
async function login(username: string, password: string): Promise<string> {
  if (!username || !password) {
    throw new Error('Usuario y contraseña son obligatorios.')
  }
  if (!LDAP_API_URL) {
    throw new Error('VITE_LDAP_API_URL no está configurada. Revisa el archivo .env.')
  }

  let response: Response
  try {
    response = await fetch(`${LDAP_API_URL.replace(/\/+$/, '')}${LOGIN_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
  } catch {
    throw new Error('No se pudo conectar con el servicio de autenticación.')
  }

  if (!response.ok) {
    throw new Error(await readLoginError(response))
  }

  const data = (await response.json()) as Partial<LoginResponse>
  if (typeof data.token !== 'string' || data.token === '') {
    throw new Error('El servicio de autenticación no devolvió un token.')
  }
  return data.token
}

export const authService = { login }
