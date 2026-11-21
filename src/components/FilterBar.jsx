import React from 'react';
import { LayoutGrid, Map, Columns, ArrowUpDown } from 'lucide-react';

const ZONES = ['Todas', 'Santa Cruz', 'Montrove', 'Perillo', 'Liáns'];

export default function FilterBar({
  selectedZone,
  setSelectedZone,
  minPlot,
  setMinPlot,
  minRooms,
  setMinRooms,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode
}) {
  return (
    <div className="filter-bar">
      <div className="filter-top-row">
        <div className="zone-filter-group">
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginRight: '0.25rem' }}>
            Zona Oleiros:
          </span>
          {ZONES.map(zone => (
            <button
              key={zone}
              className={`zone-btn ${selectedZone === zone ? 'active' : ''}`}
              onClick={() => setSelectedZone(zone)}
            >
              {zone}
            </button>
          ))}
        </div>

        <div className="view-toggle-group">
          <button
            className={`view-btn ${viewMode === 'split' ? 'active' : ''}`}
            onClick={() => setViewMode('split')}
            title="Vista dividida (Listado + Mapa)"
          >
            <Columns size={15} />
            Dividida
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Solo listado de viviendas"
          >
            <LayoutGrid size={15} />
            Tarjetas
          </button>
          <button
            className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
            title="Solo mapa interactivo"
          >
            <Map size={15} />
            Mapa
          </button>
        </div>
      </div>

      <div className="filter-controls-row">
        <div className="filter-select-group">
          <label htmlFor="filter-plot">Parcela mínima:</label>
          <select
            id="filter-plot"
            className="filter-select"
            value={minPlot}
            onChange={(e) => setMinPlot(Number(e.target.value))}
          >
            <option value={500}>≥ 500 m² (Requisito)</option>
            <option value={750}>≥ 750 m²</option>
            <option value={1000}>≥ 1.000 m²</option>
            <option value={1500}>≥ 1.500 m²</option>
          </select>
        </div>

        <div className="filter-select-group">
          <label htmlFor="filter-rooms">Habitaciones:</label>
          <select
            id="filter-rooms"
            className="filter-select"
            value={minRooms}
            onChange={(e) => setMinRooms(Number(e.target.value))}
          >
            <option value={4}>≥ 4 habitaciones</option>
            <option value={5}>≥ 5 habitaciones</option>
            <option value={6}>≥ 6 habitaciones</option>
          </select>
        </div>

        <div className="filter-select-group">
          <label htmlFor="filter-price">Precio máximo:</label>
          <select
            id="filter-price"
            className="filter-select"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            <option value="all">Sin límite</option>
            <option value={500000}>Hasta 500.000 €</option>
            <option value={600000}>Hasta 600.000 €</option>
            <option value={750000}>Hasta 750.000 €</option>
            <option value={900000}>Hasta 900.000 €</option>
          </select>
        </div>

        <div className="filter-select-group" style={{ marginLeft: 'auto' }}>
          <ArrowUpDown size={14} style={{ color: '#64748b' }} />
          <label htmlFor="filter-sort">Ordenar por:</label>
          <select
            id="filter-sort"
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Más recientes / Nuevas primero</option>
            <option value="price_asc">Precio: de menor a mayor</option>
            <option value="price_desc">Precio: de mayor a menor</option>
            <option value="plot_desc">Mayor parcela (m²)</option>
            <option value="built_desc">Mayor superficie construida</option>
          </select>
        </div>
      </div>
    </div>
  );
}
