# Análisis de vulnerabilidades con Nuclei — Frontend (dvj-frontend)

## Datos del análisis

| Campo | Valor |
|---|---|
| Fecha | 2026-10-14 21:55:51 -06:00 → 22:01:59 |
| Objetivo analizado | `http://frontend:80` (URL interna de la red Docker bridge `security-stack_appnet`) |
| Herramienta | ProjectDiscovery Nuclei (imagen `projectdiscovery/nuclei:latest` del laboratorio) |
| Versión de Nuclei | v3.11.1 |
| Versión de plantillas | nuclei-templates v10.5.0 (actualizadas con `-ut` antes del análisis); 10160 plantillas cargadas |
| Severidades | `info,low,medium,high,critical` |
| Plantillas excluidas | etiquetas `dos, intrusive, fuzz, fuzzing, bruteforce, brute-force, default-login` |
| Otras opciones | interactsh desactivado (`-ni`), rate limit 50 req/s, timeout 10 s, 1 reintento |
| Código de salida | 0 (escaneo completado) |
| Errores de petición reportados | 236 (contador de peticiones fallidas de Nuclei; incluye plantillas que prueban otros puertos, p. ej. `:4040` y `:5814`, con conexión rechazada. No afectó al análisis: el puerto objetivo respondió y el escaneo terminó con código 0) |
| Resultados completos | [`nuclei-results.jsonl`](nuclei-results.jsonl) |

## Resumen por severidad

| Severidad | Hallazgos |
|---|---|
| critical | 0 |
| high | 0 |
| medium | 0 |
| low | 0 |
| info | 14 |
| **Total** | **14** |

Nuclei no reportó hallazgos de severidad low, medium, high ni critical; todos los resultados son informativos.

## Hallazgos reportados por Nuclei

| # | Severidad | Plantilla | Nombre | Detalle | Ubicación |
|---|---|---|---|---|---|
| 1 | info | `waf-detect` | WAF Detection | nginxgeneric | `http://frontend:80` |
| 2 | info | `nginx-version` | Nginx version detect | nginx/1.27.5 | `http://frontend:80` |
| 3 | info | `http-missing-security-headers` | HTTP Missing Security Headers | strict-transport-security | `http://frontend:80` |
| 4 | info | `http-missing-security-headers` | HTTP Missing Security Headers | content-security-policy | `http://frontend:80` |
| 5 | info | `http-missing-security-headers` | HTTP Missing Security Headers | permissions-policy | `http://frontend:80` |
| 6 | info | `http-missing-security-headers` | HTTP Missing Security Headers | x-frame-options | `http://frontend:80` |
| 7 | info | `http-missing-security-headers` | HTTP Missing Security Headers | x-content-type-options | `http://frontend:80` |
| 8 | info | `http-missing-security-headers` | HTTP Missing Security Headers | referrer-policy | `http://frontend:80` |
| 9 | info | `http-missing-security-headers` | HTTP Missing Security Headers | cross-origin-opener-policy | `http://frontend:80` |
| 10 | info | `http-missing-security-headers` | HTTP Missing Security Headers | x-permitted-cross-domain-policies | `http://frontend:80` |
| 11 | info | `http-missing-security-headers` | HTTP Missing Security Headers | cross-origin-embedder-policy | `http://frontend:80` |
| 12 | info | `http-missing-security-headers` | HTTP Missing Security Headers | cross-origin-resource-policy | `http://frontend:80` |
| 13 | info | `nginx-eol` | Nginx End-of-Life - Detect | 1.27.5 | `http://frontend:80` |
| 14 | info | `tech-detect` | Wappalyzer Technology Detection | nginx | `http://frontend:80` |

## Notas

- El escaneo se ejecutó contra el contenedor del servicio directamente por la red interna, no a través del proxy `dvj-proxy`, porque este aplica Fail2Ban (límite de peticiones por segundo) y habría bloqueado al escáner.
- Este informe solo documenta los resultados obtenidos; todavía no se ha corregido ninguna vulnerabilidad.
- Los resultados no incluyen credenciales, JWT ni tokens: el análisis se realizó sin autenticación.
