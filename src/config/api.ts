// Configuración centralizada de las APIs externas.
// Las URLs se leen de variables de entorno de Vite (ver .env.example).
// Si no están definidas, los servicios lanzan un error indicando que falta configurarlas.

export const LDAP_API_URL: string = import.meta.env.VITE_LDAP_API_URL ?? ''

export const BACKEND_API_URL: string = import.meta.env.VITE_BACKEND_API_URL ?? ''
