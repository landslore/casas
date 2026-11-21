import React from 'react';
import { BedDouble, Bath, Maximize2, Sparkles, Sun, ExternalLink, Navigation, MapPin } from 'lucide-react';

export default function PropertyCard({ property, onSelect, isHighlighted }) {
  // Encontrar POIs clave para el preview (playa, supermercado, o Coruña)
  const nearbyPlayas = property.nearby_services?.filter(s => s.category === 'playas') || [];
  const nearbySupers = property.nearby_services?.filter(s => s.category === 'supermercados') || [];
  const corunaPoi = property.nearby_services?.find(s => s.poi_id === 'obelisco_coruna');

  const closestPlaya = nearbyPlayas[0];
  const closestSuper = nearbySupers[0];

  return (
    <article className={`prop-card ${isHighlighted ? 'highlighted' : ''}`} id={`card-${property.id}`}>
      <div className="prop-card-media" onClick={() => onSelect(property)} style={{ cursor: 'pointer' }}>
        <img
          src={property.photos?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="prop-card-img"
          loading="lazy"
        />

        <div className="prop-tag-floating">
          {property.is_new_this_week && (
            <span className="tag-new-badge">
              <Sparkles size={11} style={{ display: 'inline', marginRight: '3px' }} />
              Nueva esta semana
            </span>
          )}
          <span className="tag-zone-badge">{property.zone}</span>
        </div>

        <span className="prop-portal-badge">{property.portal}</span>
      </div>

      <div className="prop-card-body">
        <div className="prop-price-row">
          <span className="prop-price">
            {property.price.toLocaleString('es-ES')} €
          </span>
          <span className="prop-price-m2">
            {property.price_per_m2?.toLocaleString('es-ES')} €/m²
          </span>
        </div>

        <h3 className="prop-title" title={property.title} onClick={() => onSelect(property)} style={{ cursor: 'pointer' }}>
          {property.title}
        </h3>

        <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <MapPin size={13} style={{ color: '#0f766e', flexShrink: 0 }} />
          <span>{property.setting} · {property.zone}</span>
        </div>

        <div className="prop-specs-grid">
          <div className="prop-spec-item">
            <span className="prop-spec-val">
              <BedDouble size={14} />
              {property.bedrooms}
            </span>
            <span>Habitaciones</span>
          </div>

          <div className="prop-spec-item">
            <span className="prop-spec-val">
              <Bath size={14} />
              {property.bathrooms}
            </span>
            <span>Baños</span>
          </div>

          <div className="prop-spec-item">
            <span className="prop-spec-val">
              <Maximize2 size={14} />
              {property.plot_m2} m²
            </span>
            <span>Parcela</span>
          </div>

          <div className="prop-spec-item">
            <span className="prop-spec-val">
              {property.built_m2} m²
            </span>
            <span>Construidos</span>
          </div>
        </div>

        {property.has_porch && (
          <div className="prop-porch-highlight">
            <Sun size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Porche: </strong>
              <span>{property.porch_description || 'Porche verificado con acceso al jardín.'}</span>
            </div>
          </div>
        )}

        <div className="prop-poi-preview">
          <div className="prop-poi-title">
            <span>Servicios Cercanos (Google Maps)</span>
            {corunaPoi && <span>A Coruña: ~{corunaPoi.drive_mins} min</span>}
          </div>

          <div className="prop-poi-chips">
            {closestPlaya && (
              <span className="poi-chip" title={`${closestPlaya.name} a ${closestPlaya.distance_km} km`}>
                🏖️ {closestPlaya.name.split(' ')[2] || closestPlaya.name}: {closestPlaya.drive_mins}m ({closestPlaya.distance_km}km)
              </span>
            )}
            {closestSuper && (
              <span className="poi-chip" title={`${closestSuper.name} a ${closestSuper.distance_km} km`}>
                🛒 {closestSuper.name.split(' ')[0]}: {closestSuper.drive_mins}m
              </span>
            )}
          </div>
        </div>

        <div className="prop-card-actions">
          <button
            className="btn-card-details"
            onClick={() => onSelect(property)}
          >
            Ver Ficha y Servicios
          </button>

          <a
            href={property.gmaps_location_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-card-map-route"
            title="Abrir ubicación en Google Maps"
          >
            <Navigation size={15} />
          </a>

          <a
            href={property.portal_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-card-map-route"
            title={`Abrir en ${property.portal}`}
          >
            <ExternalLink size={15} />
          </a>
        </div>
      </div>
    </article>
  );
}
