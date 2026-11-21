# Oleiros Hábitat 🏡
### Monitor Inteligente y Recopilador de Viviendas Unifamiliares en Oleiros

Aplicación web interactiva y motor de rastreo automatizado para encontrar viviendas unifamiliares que cumplan con criterios rigurosos en las zonas más cotizadas del municipio de Oleiros (A Coruña): **Santa Cruz**, **Montrove**, **Perillo** y **Liáns**.

---

## 🎯 Criterios Estrictos de Búsqueda
1. **Tipo de vivienda**: Unifamiliar (chalet independiente, pareado o adosado en urbanización o aislado).
2. **Parcela privada**: Mínimo **500 m²**.
3. **Porche**: Verificado en descripción y memoria de calidades (cubierto, acristalado o bioclimático).
4. **Capacidad**: **4 o más habitaciones**.
5. **Comodidad**: **2 o más baños**.
6. **Zonas delimitadas**: Oleiros (Santa Cruz, Montrove, Perillo y Liáns).

---

## ✨ Características Principales

### 1. 🗺️ Vinculación con Google Maps y Servicios Cercanos
- **Cálculo de Distancias y Tiempos**: Cada vivienda calcula automáticamente su distancia vial exacta (km) y tiempos estimados en **coche** y **caminando** a servicios fundamentales:
  - **Playas**: Bastiagueiro, Santa Cruz, Santa Cristina.
  - **Supermercados**: Mercadona Santa Cruz, Gadis Híper Perillo, Carrefour Express Montrove.
  - **Colegios e Institutos**: Colegio Miraflores, CEIP Isidro Parga Pondal, IES Miraflores.
  - **Sanidad**: Centro de Saúde de Santa Cruz, Farmacia Montrove.
  - **Accesos clave**: Enlace Puente del Pasaje (Alfonso Molina / A Coruña a 10 min) y Obelisco / Centro de A Coruña.
- **Rutas directas**: Botón con un clic para abrir la ruta directa en Google Maps (`origin -> destination`).

### 2. 📅 Página Específica de Resumen Semanal (`/semanal`)
- Resumen ejecutivo de todas las nuevas viviendas publicadas en los últimos 7 días.
- Métricas clave: Nuevas viviendas detectadas, precio medio de las novedades, parcela media y zonas con mayor movimiento.
- Gráficos de distribución de novedades por zona (Santa Cruz, Montrove, Perillo, Liáns) y portales inmobiliarios de origen.
- Dossier con tarjetas destacando porche, parcela y fotos.
- Botón **"Copiar para WhatsApp / Email"** para compartir el resumen con un solo clic.

### 3. 🔄 Actualización Bajo Demanda (Botón "Actualizar Datos")
- Disponible en la cabecera de la web.
- Ejecución directa local (ejecuta el script de rastreo en caliente) o despacho del workflow de GitHub Actions.
- Consola de logs en vivo mostrando el proceso de rastreo, validación de criterios y enriquecimiento geoespacial.

### 4. ⏰ Actualización Periódica Automática (GitHub Actions cada 6 Horas)
- Archivo `.github/workflows/update_listings.yml` configurado con cron `0 */6 * * *` (00:00, 06:00, 12:00, 18:00 UTC).
- Ejecuta `scripts/scraper.py`, detecta nuevas viviendas, actualiza `public/data/listings.json` y `public/data/weekly_digest.json`, comitea los cambios a `main` y despliega la versión actualizada a **GitHub Pages**.

---

## 🚀 Puesta en Marcha Local

### Requisitos
- Node.js (v18+)
- Python 3.10+

### Instalación y Ejecución
```bash
# 1. Clonar el repositorio
git clone https://github.com/landslore/casas.git
cd casas

# 2. Instalar dependencias
npm install

# 3. Ejecutar el rastreador inicial (genera public/data/listings.json)
python3 scripts/scraper.py

# 4. Iniciar el servidor de desarrollo
npm run dev
```

Abre tu navegador en `http://localhost:5173/`.

---

## 📁 Estructura del Proyecto

```
casas/
├── .github/workflows/
│   └── update_listings.yml       # Cron cada 6 horas y deploy a GitHub Pages
├── public/
│   └── data/
│       ├── listings.json         # Base de datos de viviendas activas con distancias
│       ├── weekly_digest.json    # Datos del informe semanal de novedades
│       └── sync_status.json      # Metadata del último escaneo
├── scripts/
│   └── scraper.py                # Motor de rastreo, validación de criterios y distancias
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Barra superior con navegación y botón de actualización
│   │   ├── CriteriaBanner.jsx    # Indicadores visuales de los criterios del usuario
│   │   ├── FilterBar.jsx         # Filtros por zona, parcela, habitaciones, precio y vista
│   │   ├── PropertyCard.jsx      # Tarjeta de vivienda con porche y servicios clave
│   │   ├── InteractiveMap.jsx    # Mapa interactivo Leaflet con satélite y POIs
│   │   ├── PropertyDetailModal.jsx # Ficha detallada, galería y tabla Google Maps
│   │   ├── WeeklyDigestView.jsx  # Página específica del resumen semanal
│   │   ├── ServicesDirectoryView.jsx # Directorio de servicios de Oleiros
│   │   └── SyncModal.jsx         # Modal de rastreo manual y estado de Actions
│   ├── App.jsx                   # Orquestador principal de estado y vistas
│   └── index.css                 # Sistema de diseño bespoke (sin Tailwind genérico)
├── index.html
├── package.json
└── vite.config.js                # Configuración de Vite con plugin API para rastreo
```