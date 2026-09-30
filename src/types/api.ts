// Respuesta de POST /login del API LDAP cuando las credenciales son válidas.
export interface LoginResponse {
  authenticated: boolean
  username: string
  dn: string
  token: string
}

// Alias de tipo (no interface) para que sea asignable a HeadersInit de fetch.
export type AuthHeaders = {
  Authorization: string
  'Content-Type': 'application/json'
}
