import React, { useState } from 'react';
import { X, ExternalLink, Navigation, BedDouble, Bath, Maximize2, Sun, Car, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

export default function PropertyDetailModal({ property, onClose }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [poiFilter, setPoiFilter] = useState('all');

  if (!property) return null;

  const photos = property.photos || [];
  const services = property.nearby_services || [];

  const filteredServices = poiFilter === 'all'
    ? services
    : services.filter(s => s.category === poiFilter);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="tag-zone-badge">{property.zone}</span>
              {property.is_new_this_week && (
                <span className="tag-new-badge">
                  <Sparkles size={11} style={{ display: 'inline', marginRight: '3px' }} />
                  Nueva esta semana
                </span>
              )}
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                Portal: {property.portal}
              </span>
            </div>
            <h2 className="modal-title">{property.title}</h2>
          </div>

          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar ficha">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Galería de fotos */}
          <div className="modal-gallery">
            <div className="modal-gallery-main">
              <img
                src={photos[selectedPhotoIndex] || photos[0]}
                alt={property.title}
              />
            </div>
            {photos.length > 1 && (
              <div className="modal-gallery-thumbs">
                {photos.slice(0, 4).map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`Foto ${idx + 1}`}
                    style={{
                      border: selectedPhotoIndex === idx ? '2px solid #0f766e' : 'none'
                    }}
                    onClick={() => setSelectedPhotoIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Precio y Ubicación */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                {property.price.toLocaleString('es-ES')} €
              </div>
              <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
                {property.price_per_m2?.toLocaleString('es-ES')} €/m² · {property.full_address || property.zone}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a
                href={property.portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-card-details"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
              >
                <span>Ver en {property.portal}</span>
                <ExternalLink size={14} />
              </a>

              <a
                href={property.gmaps_location_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-card-map-route"
                style={{ textDecoration: 'none' }}
                title="Abrir en Google Maps"
              >
                <Navigation size={16} />
              </a>
            </div>
          </div>

          {/* Cuadrícula de especificaciones */}
          <div className="prop-specs-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
            <div className="prop-spec-item">
              <span className="prop-spec-val"><Maximize2 size={15} /> {property.plot_m2} m²</span>
              <span>Parcela privada</span>
            </div>
            <div className="prop-spec-item">
              <span className="prop-spec-val">{property.built_m2} m²</span>
              <span>Construidos</span>
            </div>
            <div className="prop-spec-item">
              <span className="prop-spec-val"><BedDouble size={15} /> {property.bedrooms}</span>
              <span>Habitaciones</span>
            </div>
            <div className="prop-spec-item">
              <span className="prop-spec-val"><Bath size={15} /> {property.bathrooms}</span>
              <span>Baños</span>
            </div>
            <div className="prop-spec-item">
              <span className="prop-spec-val"><Car size={15} /> {property.garage_spots || 2} plazas</span>
              <span>Garaje</span>
            </div>
            <div className="prop-spec-item">
              <span className="prop-spec-val">{property.energy_class || 'B'}</span>
              <span>Calificación energ.</span>
            </div>
          </div>

          {/* Sección de Porche & Parcela */}
          <div style={{
            backgroundColor: '#fefce8',
            border: '1px solid #fef08a',
            borderRadius: '12px',
            padding: '1rem 1.25rem'
          }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.92rem', fontWeight: 700, color: '#713f12', marginBottom: '0.4rem' }}>
              <Sun size={18} color="#ca8a04" />
              Porche y Zona Exterior de la Vivienda
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#854d0e', lineHeight: 1.5 }}>
              {property.porch_description}
            </p>
          </div>

          {/* Descripción general */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
              Descripción de la propiedad
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {property.description}
            </p>
          </div>

          {/* Tabla interactiva de Servicios y Distancias Google Maps */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                  Servicios Cercanos y Distancias (Google Maps)
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Tiempos calculados desde la vivienda en Oleiros a puntos estratégicos
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                <button
                  className={`poi-toggle-btn ${poiFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setPoiFilter('all')}
                >
                  Todos
                </button>
                <button
                  className={`poi-toggle-btn ${poiFilter === 'playas' ? 'active' : ''}`}
                  onClick={() => setPoiFilter('playas')}
                >
                  Playas
                </button>
                <button
                  className={`poi-toggle-btn ${poiFilter === 'supermercados' ? 'active' : ''}`}
                  onClick={() => setPoiFilter('supermercados')}
                >
                  Supermercados
                </button>
                <button
                  className={`poi-toggle-btn ${poiFilter === 'colegios' ? 'active' : ''}`}
                  onClick={() => setPoiFilter('colegios')}
                >
                  Colegios
                </button>
                <button
                  className={`poi-toggle-btn ${poiFilter === 'transporte' ? 'active' : ''}`}
                  onClick={() => setPoiFilter('transporte')}
                >
                  Conexión Coruña
                </button>
              </div>
            </div>

            <div className="services-table-box">
              <table className="services-table">
                <thead>
                  <tr>
                    <th>Servicio / Punto Clave</th>
                    <th>Categoría</th>
                    <th>Distancia</th>
                    <th>En Coche</th>
                    <th>A Pie</th>
                    <th>Google Maps</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map(srv => (
                    <tr key={srv.poi_id}>
                      <td>
                        <strong>{srv.name}</strong>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{srv.description}</div>
                      </td>
                      <td>
                        <span style={{ textTransform: 'capitalize', color: '#0f766e', fontWeight: 600 }}>
                          {srv.category}
                        </span>
                      </td>
                      <td><strong>{srv.distance_km} km</strong></td>
                      <td>
                        <span style={{ color: '#059669', fontWeight: 700 }}>
                          🚗 ~{srv.drive_mins} min
                        </span>
                      </td>
                      <td>
                        <span style={{ color: '#64748b' }}>
                          🚶 ~{srv.walk_mins} min
                        </span>
                      </td>
                      <td>
                        <a
                          href={srv.gmaps_route_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: '#0f766e',
                            fontWeight: 600,
                            fontSize: '0.78rem'
                          }}
                        >
                          <span>Ruta</span>
                          <Navigation size={12} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
