# Validación de correcciones — Frontend (dvj-frontend)

Este documento es independiente del análisis inicial: los archivos `../nuclei-results.jsonl` y `../README.md` se conservan sin cambios.

## Metodología

Para cada hallazgo, en un commit independiente:

1. Se aplicó la corrección en el código o la configuración.
2. Se reconstruyó y recreó **solo** el contenedor afectado (`docker compose up -d --build --no-deps`), sin tocar `dvj-openldap`, `dvj-ldap-fail2ban` ni los volúmenes.
3. Se comprobó la conectividad desde un contenedor Nuclei conectado a la red bridge `security-stack_appnet` (`http://frontend:80`).
4. Se ejecutaron las pruebas: compilación de la imagen (incluye `tsc`/`vite build` en los servicios Node) y 12 pruebas funcionales de extremo a extremo a través del proxy (frontend, rutas SPA, login LDAP válido/incorrecto → JWT, `/api/games` con y sin token, validación 400, preflight CORS).
5. Se volvió a ejecutar Nuclei contra el servicio con la plantilla del hallazgo y se comprobó que el hallazgo desapareció **antes** de hacer el commit.

La evidencia de cada paso (salida de Nuclei y JSONL con los hallazgos que quedaban en ese momento) está en esta carpeta.

## Resultado por hallazgo

| # | Hallazgo original (Nuclei) | Severidad | Estado | Commit | Evidencia | Re-escaneo final |
|---|---|---|---|---|---|---|
| 1 | `waf-detect:nginxgeneric` | info | Corregido y verificado | `c2d6236` | [`14-waf-detect-nginxgeneric.nuclei-output.txt`](14-waf-detect-nginxgeneric.nuclei-output.txt) | No detectado |
| 2 | `nginx-version` | info | Corregido y verificado | `6f0c174` | [`02-nginx-version.nuclei-output.txt`](02-nginx-version.nuclei-output.txt) | No detectado |
| 3 | `http-missing-security-headers:strict-transport-security` | info | Corregido y verificado | `8af70bc` | [`03-http-missing-security-headers-strict-transport-security.nuclei-output.txt`](03-http-missing-security-headers-strict-transport-security.nuclei-output.txt) | No detectado |
| 4 | `http-missing-security-headers:content-security-policy` | info | Corregido y verificado | `645d95b` | [`04-http-missing-security-headers-content-security-policy.nuclei-output.txt`](04-http-missing-security-headers-content-security-policy.nuclei-output.txt) | No detectado |
| 5 | `http-missing-security-headers:permissions-policy` | info | Corregido y verificado | `878dcd6` | [`05-http-missing-security-headers-permissions-policy.nuclei-output.txt`](05-http-missing-security-headers-permissions-policy.nuclei-output.txt) | No detectado |
| 6 | `http-missing-security-headers:x-frame-options` | info | Corregido y verificado | `cdcfc5d` | [`06-http-missing-security-headers-x-frame-options.nuclei-output.txt`](06-http-missing-security-headers-x-frame-options.nuclei-output.txt) | No detectado |
| 7 | `http-missing-security-headers:x-content-type-options` | info | Corregido y verificado | `b6645f5` | [`07-http-missing-security-headers-x-content-type-options.nuclei-output.txt`](07-http-missing-security-headers-x-content-type-options.nuclei-output.txt) | No detectado |
| 8 | `http-missing-security-headers:referrer-policy` | info | Corregido y verificado | `0a7f168` | [`08-http-missing-security-headers-referrer-policy.nuclei-output.txt`](08-http-missing-security-headers-referrer-policy.nuclei-output.txt) | No detectado |
| 9 | `http-missing-security-headers:cross-origin-opener-policy` | info | Corregido y verificado | `11035b9` | [`09-http-missing-security-headers-cross-origin-opener-policy.nuclei-output.txt`](09-http-missing-security-headers-cross-origin-opener-policy.nuclei-output.txt) | No detectado |
| 10 | `http-missing-security-headers:x-permitted-cross-domain-policies` | info | Corregido y verificado | `1921d9b` | [`10-http-missing-security-headers-x-permitted-cross-domain-policies.nuclei-output.txt`](10-http-missing-security-headers-x-permitted-cross-domain-policies.nuclei-output.txt) | No detectado |
| 11 | `http-missing-security-headers:cross-origin-embedder-policy` | info | Corregido y verificado | `599d2b2` | [`11-http-missing-security-headers-cross-origin-embedder-policy.nuclei-output.txt`](11-http-missing-security-headers-cross-origin-embedder-policy.nuclei-output.txt) | No detectado |
| 12 | `http-missing-security-headers:cross-origin-resource-policy` | info | Corregido y verificado | `a7054e0` | [`12-http-missing-security-headers-cross-origin-resource-policy.nuclei-output.txt`](12-http-missing-security-headers-cross-origin-resource-policy.nuclei-output.txt) | No detectado |
| 13 | `nginx-eol` | info | Corregido y verificado | `31ca0e6` | [`01-nginx-eol.nuclei-output.txt`](01-nginx-eol.nuclei-output.txt) | No detectado |
| 14 | `tech-detect:nginx` | info | Corregido y verificado | `8d5e254` | [`13-tech-detect-nginx.nuclei-output.txt`](13-tech-detect-nginx.nuclei-output.txt) | No detectado |

## Análisis completo posterior a las correcciones

Misma configuración que el análisis inicial (severidades `info,low,medium,high,critical`; etiquetas excluidas `dos, intrusive, fuzz, fuzzing, bruteforce, brute-force, default-login`; interactsh desactivado; rate limit 50 req/s).

| Campo | Valor |
|---|---|
| Fecha | 2026-10-19 09:08:55 → 09:15:30 (-06:00) |
| Objetivo | `http://frontend:80` |
| Versión de Nuclei | v3.11.1 |
| Versión de plantillas | nuclei-templates v10.5.0 (la salida muestra la versión en blanco; ver Notas); 10160 plantillas cargadas |
| Código de salida | 0 |
| Resultado | Scan completed in 5m. 1 matches found. |
| Resultados completos | [`nuclei-results-after.jsonl`](nuclei-results-after.jsonl) · [salida de consola](nuclei-results-after.nuclei-output.txt) |

| Severidad | Antes | Después |
|---|---|---|
| critical | 0 | 0 |
| high | 0 | 0 |
| medium | 0 | 0 |
| low | 0 | 0 |
| info | 14 | 1 |
| **Total** | **14** | **1** |

Hallazgos que siguen presentes en el análisis posterior:

- `kafka-topics-list` (info) en `frontend:80`; hallazgo nuevo, no estaba en el análisis inicial — **falso positivo** (ver Notas)

## Notas

- **Versión de plantillas:** en la salida del análisis posterior la versión aparece en blanco con "(outdated)" porque la configuración de Nuclei (`~/.config/nuclei`) no persiste entre contenedores. Las plantillas son las del volumen descargado en el análisis inicial (nuclei-templates v10.5.0); `nuclei -ut` confirmó que la última versión publicada sigue siendo v10.5.0, y se cargaron las mismas 10160 plantillas que en el análisis inicial.
- **HSTS:** la cabecera `Strict-Transport-Security` está presente, pero los navegadores solo la aplican sobre HTTPS; en este laboratorio HTTP no tiene efecto práctico hasta que el servicio se publique con TLS.
- **Proxy:** los análisis se hicieron directamente contra el servicio, en la red interna. `dvj-proxy` (nginx con Fail2Ban) no se analizó y añade su propia cabecera `Server` a las respuestas que reenvía.
- **`kafka-topics-list` (info) en el análisis posterior: falso positivo.** Esta plantilla de red envía una petición del protocolo Kafka y marca coincidencia ante *cualquier* respuesta que contenga la palabra `localhost` o algo con forma de dirección IP. nginx responde a esos bytes con un `400 Bad Request` que ahora incluye la cabecera CSP, y su directiva `connect-src` contiene `http://localhost:8000 http://localhost:3000` (los orígenes de las APIs). No existe ningún servicio Kafka. El hallazgo aparece como efecto de la corrección `content-security-policy` y no se ha "corregido" eliminando la CSP, porque eso supondría quitar una medida de seguridad para que desaparezca un hallazgo. Queda documentado como falso positivo.
- **Imagen base:** para eliminar la cabecera `Server` (`tech-detect:nginx`) se pasó de la imagen oficial `nginx` a `alpine:3.24` con los paquetes oficiales de Alpine `nginx` (1.30.4, rama estable) y `nginx-mod-http-headers-more`. Se mantienen la configuración SPA, los logs en stdout/stderr y el resto de cabeceras.
- **Prueba en navegador:** tras las correcciones de CSP/COEP/COOP y tras el cambio de imagen se verificó en un navegador el flujo completo (login LDAP → JWT → listado de juegos → página "Agregar videojuego"), sin errores en consola, con los estilos aplicados y `crossOriginIsolated = true`.
