import React from 'react';
import { Home, Compass, Calendar, MapPin, RefreshCw, Layers } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenSync, isSyncing, lastSyncTime, newThisWeekCount }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-section">
          <div className="brand-icon-box">
            <Home size={22} strokeWidth={2.2} />
          </div>
          <div className="brand-titles">
            <h1>Oleiros Hábitat</h1>
            <p>Viviendas unifamiliares con parcela ≥ 500m² y porche</p>
          </div>
        </div>

        <nav className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'explorer' ? 'active' : ''}`}
            onClick={() => setActiveTab('explorer')}
          >
            <Compass size={16} />
            Explorador & Mapa
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            <Calendar size={16} />
            Resumen Semanal
            {newThisWeekCount > 0 && (
              <span style={{
                background: '#059669',
                color: '#fff',
                fontSize: '0.68rem',
                padding: '0.1rem 0.4rem',
                borderRadius: '999px',
                fontWeight: 700
              }}>
                +{newThisWeekCount}
              </span>
            )}
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <MapPin size={16} />
            Servicios Oleiros
          </button>
        </nav>

        <div className="header-actions">
          {lastSyncTime && (
            <div className="badge-sync-info" title="Última comprobación de portales">
              <span>Sincronizado:</span>
              <strong>{lastSyncTime}</strong>
            </div>
          )}

          <button
            className="btn-update-data"
            onClick={onOpenSync}
            disabled={isSyncing}
            id="btn-update-header"
          >
            <RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
            {isSyncing ? 'Actualizando...' : 'Actualizar datos'}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}
