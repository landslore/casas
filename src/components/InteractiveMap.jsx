import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

export default function InteractiveMap({ properties, onSelectProperty, activePoiCategory, setActivePoiCategory }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const poisLayerRef = useRef(null);

  const [mapType, setMapType] = useState('streets'); // 'streets' | 'satellite'

  // Lista de POIs clave
  const POIS_DATA = [
    { id: 'bastiagueiro', name: 'Playa de Bastiagueiro', category: 'playas', lat: 43.3486, lng: -8.3512, icon: '🏖️' },
    { id: 'santacruz', name: 'Castillo y Playa de Santa Cruz', category: 'playas', lat: 43.3511, lng: -8.3490, icon: '🏰' },
    { id: 'santacristina', name: 'Playa de Santa Cristina', category: 'playas', lat: 43.3392, lng: -8.3755, icon: '🏖️' },
    { id: 'mercadona', name: 'Mercadona Santa Cruz', category: 'supermercados', lat: 43.3445, lng: -8.3421, icon: '🛒' },
    { id: 'gadis', name: 'Gadis Híper Perillo', category: 'supermercados', lat: 43.3328, lng: -8.3688, icon: '🛒' },
    { id: 'carrefour', name: 'Carrefour Montrove', category: 'supermercados', lat: 43.3375, lng: -8.3560, icon: '🛒' },
    { id: 'miraflores', name: 'Colegio Miraflores (Montrove)', category: 'colegios', lat: 43.3361, lng: -8.3519, icon: '🎓' },
    { id: 'parga', name: 'CEIP Parga Pondal (Santa Cruz)', category: 'colegios', lat: 43.3490, lng: -8.3420, icon: '🏫' },
    { id: 'salud_sc', name: 'Centro de Saúde Santa Cruz', category: 'salud', lat: 43.3475, lng: -8.3465, icon: '🏥' },
    { id: 'puente', name: 'Puente Pasaje (Entrada A Coruña)', category: 'transporte', lat: 43.3342, lng: -8.3808, icon: '🚗' },
  ];

  // Inicializar Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centro geográfico de Oleiros (Santa Cruz - Montrove - Liáns)
    const map = L.map(mapContainerRef.current, {
      center: [43.342, -8.352],
      zoom: 13,
      zoomControl: true,
    });

    const streetLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19
    });

    streetLayer.addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    poisLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Actualizar capa de mapa (Calles vs Satélite)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Eliminar tiles anteriores
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (mapType === 'satellite') {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri &copy; DigitalGlobe &copy; GeoEye',
        maxZoom: 19
      }).addTo(map);
    } else {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(map);
    }
  }, [mapType]);

  // Actualizar marcadores de viviendas
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    properties.forEach(prop => {
      const icon = L.divIcon({
        className: 'custom-house-marker',
        html: `
          <div style="
            background: #0f766e;
            color: #ffffff;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 700;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            white-space: nowrap;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>🏡</span>
            <span>${Math.round(prop.price / 1000)}k€</span>
          </div>
        `,
        iconSize: [60, 26],
        iconAnchor: [30, 13]
      });

      const marker = L.marker([prop.lat, prop.lng], { icon });

      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; width: 220px;">
          <img src="${prop.photos?.[0]}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <div style="font-size: 11px; color: #0f766e; font-weight: 700; text-transform: uppercase;">${prop.zone} · ${prop.setting}</div>
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">${prop.price.toLocaleString('es-ES')} €</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${prop.bedrooms} hab · ${prop.bathrooms} baños · ${prop.plot_m2}m² parcela</div>
          <div style="font-size: 11px; color: #854d0e; background: #fefce8; padding: 4px 6px; border-radius: 4px; margin-bottom: 8px;">
            <strong>Porche:</strong> ${prop.porch_description ? prop.porch_description.slice(0, 75) + '...' : 'Sí'}
          </div>
          <div style="display: flex; gap: 4px;">
            <a href="${prop.gmaps_location_url}" target="_blank" rel="noopener noreferrer" style="flex: 1; background: #f1f5f9; color: #0f766e; text-align: center; padding: 5px; font-size: 11px; border-radius: 6px; font-weight: 600; text-decoration: none;">
              Google Maps
            </a>
            <a href="${prop.portal_url}" target="_blank" rel="noopener noreferrer" style="flex: 1; background: #0f766e; color: #ffffff; text-align: center; padding: 5px; font-size: 11px; border-radius: 6px; font-weight: 600; text-decoration: none;">
              Ver Anuncio
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        if (onSelectProperty) onSelectProperty(prop);
      });

      markersLayerRef.current.addLayer(marker);
    });
  }, [properties, onSelectProperty]);

  // Actualizar marcadores de POIs (Servicios)
  useEffect(() => {
    if (!mapInstanceRef.current || !poisLayerRef.current) return;
    poisLayerRef.current.clearLayers();

    const filteredPois = activePoiCategory === 'todas'
      ? POIS_DATA
      : POIS_DATA.filter(p => p.category === activePoiCategory);

    filteredPois.forEach(poi => {
      const poiIcon = L.divIcon({
        className: 'custom-poi-marker',
        html: `
          <div style="
            background: #d97706;
            color: #ffffff;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          ">
            ${poi.icon}
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker([poi.lat, poi.lng], { icon: poiIcon });
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px;">
          <strong style="color: #0f172a;">${poi.name}</strong>
          <div style="color: #64748b; font-size: 11px; text-transform: uppercase; margin-top: 2px;">${poi.category}</div>
          <a href="https://www.google.com/maps/search/?api=1&query=${poi.lat},${poi.lng}" target="_blank" rel="noopener noreferrer" style="display: block; margin-top: 6px; color: #0f766e; font-weight: 600;">
            Abrir en Google Maps &rarr;
          </a>
        </div>
      `);

      poisLayerRef.current.addLayer(marker);
    });
  }, [activePoiCategory]);

  return (
    <div className="map-wrapper">
      <div className="map-header">
        <div className="map-poi-toggles">
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
            Servicios Google Maps:
          </span>
          <button
            className={`poi-toggle-btn ${activePoiCategory === 'todas' ? 'active' : ''}`}
            onClick={() => setActivePoiCategory('todas')}
          >
            Todos
          </button>
          <button
            className={`poi-toggle-btn ${activePoiCategory === 'playas' ? 'active' : ''}`}
            onClick={() => setActivePoiCategory('playas')}
          >
            🏖️ Playas
          </button>
          <button
            className={`poi-toggle-btn ${activePoiCategory === 'supermercados' ? 'active' : ''}`}
            onClick={() => setActivePoiCategory('supermercados')}
          >
            🛒 Supermercados
          </button>
          <button
            className={`poi-toggle-btn ${activePoiCategory === 'colegios' ? 'active' : ''}`}
            onClick={() => setActivePoiCategory('colegios')}
          >
            🎓 Colegios
          </button>
          <button
            className={`poi-toggle-btn ${activePoiCategory === 'salud' ? 'active' : ''}`}
            onClick={() => setActivePoiCategory('salud')}
          >
            🏥 Salud
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            className={`poi-toggle-btn ${mapType === 'streets' ? 'active' : ''}`}
            onClick={() => setMapType('streets')}
          >
            Callejero
          </button>
          <button
            className={`poi-toggle-btn ${mapType === 'satellite' ? 'active' : ''}`}
            onClick={() => setMapType('satellite')}
          >
            Satélite
          </button>
        </div>
      </div>

      <div id="map-container" ref={mapContainerRef} />
    </div>
  );
}
