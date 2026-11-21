import React, { useState } from 'react';
import { Calendar, Sparkles, TrendingUp, Maximize2, MapPin, Share2, Printer, Check, ExternalLink, BedDouble, Bath, Sun, Navigation } from 'lucide-react';

export default function WeeklyDigestView({ weeklyData, onSelectProperty }) {
  const [copied, setCopied] = useState(false);
  const [selectedHistoricalWeek, setSelectedHistoricalWeek] = useState(null);

  if (!weeklyData) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        Cargando informe semanal...
      </div>
    );
  }

  const {
    week_label,
    period_from,
    period_to,
    total_new_this_week,
    avg_price_new,
    avg_plot_m2_new,
    zones_breakdown = {},
    portals_breakdown = {},
    properties = [],
    historical_weeks = []
  } = weeklyData;

  const handleCopyReport = () => {
    let text = `🏡 *RESUMEN SEMANAL DE VIVIENDAS EN OLEIROS* (${week_label})\n`;
    text += `📅 Período: ${period_from} al ${period_to}\n`;
    text += `✨ Nuevas viviendas encontradas: ${total_new_this_week}\n`;
    text += `💰 Precio medio: ${avg_price_new.toLocaleString('es-ES')} €\n`;
    text += `🌳 Parcela media: ${avg_plot_m2_new} m²\n\n`;
    text += `📍 *Novedades destacadas:*\n`;

    properties.forEach((p, idx) => {
      text += `\n${idx + 1}. *${p.title}*\n`;
      text += `   - Zona: ${p.zone} (${p.setting})\n`;
      text += `   - Precio: ${p.price.toLocaleString('es-ES')} €\n`;
      text += `   - Parcela: ${p.plot_m2} m² | Hab: ${p.bedrooms} | Baños: ${p.bathrooms}\n`;
      text += `   - Porche: ${p.porch_description}\n`;
      text += `   - Enlace: ${p.portal_url}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="weekly-page">
      {/* Hero Card */}
      <section className="weekly-hero-card">
        <div className="weekly-hero-badge">
          <Calendar size={14} />
          <span>Informe Oficial Semanal · {week_label}</span>
        </div>
        <h2>Nuevas Viviendas Detectadas en Oleiros</h2>
        <p>
          Recopilación consolidada de todas las viviendas unifamiliares con parcela ≥ 500 m² y porche publicadas en la última semana en Idealista, Fotocasa, Habitaclia y portales inmobiliarios locales.
        </p>

        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleCopyReport}
            style={{
              background: '#ffffff',
              color: '#0f766e',
              padding: '0.55rem 1.1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}
          >
            {copied ? <Check size={16} color="#059669" /> : <Share2 size={16} />}
            {copied ? '¡Informe Copiado!' : 'Copiar para WhatsApp / Email'}
          </button>

          <button
            onClick={handlePrint}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '0.55rem 1.1rem',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <Printer size={16} />
            Imprimir / Guardar PDF
          </button>
        </div>
      </section>

      {/* KPI Stats */}
      <div className="weekly-stats-grid">
        <div className="stat-box">
          <div className="stat-box-title">Nuevos hallazgos esta semana</div>
          <div className="stat-box-value" style={{ color: '#0f766e' }}>
            {total_new_this_week}
          </div>
          <div className="stat-box-subtitle">
            Viviendas publicadas del {period_from} al {period_to}
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-title">Precio medio novedades</div>
          <div className="stat-box-value">
            {avg_price_new.toLocaleString('es-ES')} €
          </div>
          <div className="stat-box-subtitle">
            Rango: {Math.min(...properties.map(p => p.price)).toLocaleString('es-ES')} € - {Math.max(...properties.map(p => p.price)).toLocaleString('es-ES')} €
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-title">Parcela media novedades</div>
          <div className="stat-box-value">
            {avg_plot_m2_new} m²
          </div>
          <div className="stat-box-subtitle">
            Todas superan el mínimo de 500 m²
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-title">Zona con más novedades</div>
          <div className="stat-box-value" style={{ fontSize: '1.45rem', paddingTop: '0.2rem' }}>
            {Object.entries(zones_breakdown).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Oleiros'}
          </div>
          <div className="stat-box-subtitle">
            {Object.entries(zones_breakdown).sort((a, b) => b[1] - a[1])[0]?.[1] || 0} viviendas nuevas incorporadas
          </div>
        </div>
      </div>

      {/* Desglose por zona y portales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        <div className="weekly-breakdown-card">
          <h3 className="weekly-breakdown-title">
            <MapPin size={18} color="#0f766e" />
            Distribución de Nuevos Inmuebles por Zona
          </h3>
          <div className="zone-bars-list">
            {['Santa Cruz', 'Montrove', 'Perillo', 'Liáns'].map(zoneName => {
              const count = zones_breakdown[zoneName] || 0;
              const pct = total_new_this_week > 0 ? (count / total_new_this_week) * 100 : 0;
              return (
                <div key={zoneName} className="zone-bar-item">
                  <div className="zone-bar-header">
                    <span>{zoneName}</span>
                    <span style={{ color: '#0f766e', fontWeight: 700 }}>
                      {count} {count === 1 ? 'vivienda' : 'viviendas'} ({Math.round(pct)}%)
                    </span>
                  </div>
                  <div className="zone-bar-track">
                    <div className="zone-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="weekly-breakdown-card">
          <h3 className="weekly-breakdown-title">
            <TrendingUp size={18} color="#0f766e" />
            Portales Origen del Rastreo
          </h3>
          <div className="zone-bars-list">
            {Object.entries(portals_breakdown).map(([portal, count]) => {
              const pct = total_new_this_week > 0 ? (count / total_new_this_week) * 100 : 0;
              return (
                <div key={portal} className="zone-bar-item">
                  <div className="zone-bar-header">
                    <span>{portal}</span>
                    <span style={{ color: '#0f766e', fontWeight: 700 }}>{count}</span>
                  </div>
                  <div className="zone-bar-track">
                    <div className="zone-bar-fill" style={{ width: `${pct}%`, background: '#3b82f6' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dossier de viviendas nuevas */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Dossier Detallado de Nuevas Viviendas
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Publicadas durante los últimos 7 días con verificación de porche y parcela
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {properties.map(prop => (
            <div
              key={prop.id}
              className="prop-card"
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                borderRadius: '16px',
                border: '1px solid #cbd5e1'
              }}
            >
              <div style={{ flex: '1 1 280px', minHeight: '220px', position: 'relative' }}>
                <img
                  src={prop.photos?.[0]}
                  alt={prop.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span className="prop-portal-badge">{prop.portal}</span>
                <span className="tag-new-badge" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  Detectada recientemente
                </span>
              </div>

              <div style={{ flex: '2 1 360px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                    {prop.price.toLocaleString('es-ES')} €
                  </div>
                  <span className="tag-zone-badge">{prop.zone}</span>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.65rem' }}>
                  {prop.title}
                </h4>

                <div className="prop-specs-grid" style={{ marginBottom: '0.75rem' }}>
                  <div className="prop-spec-item">
                    <span className="prop-spec-val"><Maximize2 size={13} /> {prop.plot_m2} m²</span>
                    <span>Parcela</span>
                  </div>
                  <div className="prop-spec-item">
                    <span className="prop-spec-val">{prop.built_m2} m²</span>
                    <span>Construidos</span>
                  </div>
                  <div className="prop-spec-item">
                    <span className="prop-spec-val"><BedDouble size={13} /> {prop.bedrooms}</span>
                    <span>Habitaciones</span>
                  </div>
                  <div className="prop-spec-item">
                    <span className="prop-spec-val"><Bath size={13} /> {prop.bathrooms}</span>
                    <span>Baños</span>
                  </div>
                </div>

                <div className="prop-porch-highlight" style={{ marginBottom: '0.75rem' }}>
                  <Sun size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Porche verificado: </strong>
                    <span>{prop.porch_description}</span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    className="btn-card-details"
                    onClick={() => onSelectProperty(prop)}
                    style={{ flexGrow: 0, padding: '0.5rem 1rem' }}
                  >
                    Ver Ficha Completa y Distancias
                  </button>

                  <a
                    href={prop.gmaps_location_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-card-map-route"
                    style={{ textDecoration: 'none' }}
                  >
                    <Navigation size={14} style={{ marginRight: '4px' }} /> Google Maps
                  </a>

                  <a
                    href={prop.portal_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-card-map-route"
                    style={{ textDecoration: 'none' }}
                  >
                    <ExternalLink size={14} style={{ marginRight: '4px' }} /> Anuncio en {prop.portal}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Histórico de semanas */}
      {historical_weeks.length > 0 && (
        <div className="weekly-breakdown-card" style={{ marginTop: '1rem' }}>
          <h3 className="weekly-breakdown-title">
            <Calendar size={18} color="#0f766e" />
            Histórico de Informes Semanales
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {historical_weeks.map(item => (
              <div
                key={item.label}
                style={{
                  padding: '1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f766e', marginTop: '0.25rem' }}>
                  {item.count} viviendas nuevas
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Precio medio: {item.avg_price.toLocaleString('es-ES')} €
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
