/// <reference types="vite/client" />

// Variables VITE_* expuestas al frontend. Son públicas: nunca deben contener secretos.
interface ImportMetaEnv {
  readonly VITE_LDAP_API_URL?: string
  readonly VITE_BACKEND_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
