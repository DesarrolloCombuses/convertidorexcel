# Convertidor CSV a Excel (PWA)

Convierte los informes CSV de Data Studio en archivos .xlsx con números, moneda y fechas reales.

## Archivos
- index.html: la aplicación
- manifest.json: nombre, colores, íconos, "Compartir" y apertura de archivos
- sw.js: service worker (funciona sin internet y recibe archivos compartidos)
- xlsx.full.min.js: librería SheetJS 0.18.5 incluida localmente
- icons/: íconos de la app

## Publicar en GitHub Pages
1. Crea un repositorio (por ejemplo `csv-excel`) y sube todo el contenido de esta carpeta en la raíz.
2. En el repositorio: Settings > Pages > Source: "Deploy from a branch", rama `main`, carpeta `/ (root)`.
3. Espera 1 o 2 minutos. La app queda en `https://TU-USUARIO.github.io/csv-excel/`.

Funciona también en Netlify o Vercel arrastrando la carpeta. Requiere HTTPS (los tres lo dan).

## Instalar en el celular
- Android (Chrome): abre la URL y toca "Instalar en este celular", o menú ⋮ > "Instalar aplicación".
- iPhone (Safari): Compartir > "Agregar a pantalla de inicio".

## Convertir desde "Compartir" (Android)
Con la app instalada, en tus descargas mantén presionado el CSV > Compartir > "CSV a Excel".
La app se abre con el archivo ya convertido.

## Actualizar la app
Después de modificar cualquier archivo, cambia `VERSION` en sw.js (por ejemplo `csv-excel-v2`)
para que los celulares descarguen la versión nueva.
