import React from 'react';
import { CheckCircle2, SlidersHorizontal, MapPin, Maximize2, Sun, BedDouble, Bath } from 'lucide-react';

export default function CriteriaBanner({ totalResults }) {
  return (
    <aside className="criteria-banner">
      <div className="criteria-inner">
        <div className="criteria-title">
          <SlidersHorizontal size={14} />
          <span>Filtros Estrictos Aplicados:</span>
        </div>

        <div className="criteria-badges-list">
          <span className="crit-tag">
            <CheckCircle2 size={13} />
            Vivienda Unifamiliar (Aislada o Urbanización)
          </span>

          <span className="crit-tag">
            <Maximize2 size={13} />
            Parcela ≥ 500 m²
          </span>

          <span className="crit-tag">
            <Sun size={13} />
            Porche Verificado
          </span>

          <span className="crit-tag">
            <BedDouble size={13} />
            ≥ 4 Habitaciones
          </span>

          <span className="crit-tag">
            <Bath size={13} />
            ≥ 2 Baños
          </span>

          <span className="crit-tag">
            <MapPin size={13} />
            Oleiros: Santa Cruz · Montrove · Perillo · Liáns
          </span>

          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f766e', marginLeft: 'auto' }}>
            {totalResults} viviendas activas
          </span>
        </div>
      </div>
    </aside>
  );
}
