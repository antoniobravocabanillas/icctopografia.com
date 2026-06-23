# ICC Topografia

Sitio publico para `icctopografia.com`, preparado para despliegue estatico en Netlify.

## Estructura

- `index.html`: pagina principal.
- `styles.css`: sistema visual, tipografias y responsive.
- `terraqo-data.js`: datos iniciales de servicios y casos de exito, listo para reemplazarse por consumo desde Terraqo.
- `app.js`: render dinamico de tarjetas en la home.
- `detail.js`: render dinamico de paginas individuales de servicios y proyectos.
- `public/`: logo e imagenes optimizadas para la web.
- `servicios/`: rutas SEO para verticales topograficas.
- `casos-exito/`: casos topograficos medibles.
- `metodo-icc/`, `nosotros/`, `contacto/`, `tienda/`: rutas principales del sitemap.
- `_redirects`: redirecciones 301 para URLs podadas.

## Sitemap

- `/`
- `/servicios/`
- `/servicios/topografia-convencional-y-automatizada/`
- `/servicios/escaneo-laser-3d-lidar-terrestre/`
- `/servicios/control-geometrico-de-obras/`
- `/servicios/geodesia-satelital-gnss-rtk/`
- `/servicios/gestion-geoespacial-sig-gis/`
- `/casos-exito/`
- `/metodo-icc/`
- `/tienda/`
- `/tienda/estacion-total-robotica-rt500/`
- `/nosotros/`
- `/contacto/`

## Deploy Netlify

- Build command: vacio.
- Publish directory: `.`
- Dominio previsto: `icctopografia.com`.
