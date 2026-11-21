import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle, Clock, ShieldCheck, Terminal, ExternalLink, Key } from 'lucide-react';

export default function SyncModal({ isOpen, onClose, onTriggerSync, isSyncing, syncStatus, syncLog }) {
  const [ghToken, setGhToken] = useState(() => localStorage.getItem('gh_token') || '');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [syncMethod, setSyncMethod] = useState('local'); // 'local' | 'github_action'

  if (!isOpen) return null;

  const handleSaveToken = () => {
    localStorage.setItem('gh_token', ghToken);
    alert('Token de GitHub guardado en tu navegador para lanzar la GitHub Action directamente.');
  };

  const handleExecuteSync = () => {
    onTriggerSync({ method: syncMethod, token: ghToken });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: '620px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#ccfbf1',
              color: '#0f766e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <RefreshCw size={17} />
            </div>
            <div>
              <h3 className="modal-title">Actualización y Rastreo de Viviendas</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Monitoreo automático periódico y rastreo bajo demanda
              </p>
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: '1.25rem' }}>
          {/* Card del Action periódico */}
          <div style={{
            backgroundColor: '#f0fdfa',
            border: '1px solid #ccfbf1',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <Clock size={22} color="#0f766e" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#0f766e', fontSize: '0.92rem', display: 'block', marginBottom: '0.2rem' }}>
                Actualización Automática Periódica (GitHub Action)
              </strong>
              <p style={{ fontSize: '0.82rem', color: '#134e4a', lineHeight: 1.45 }}>
                Configurado mediante <code>.github/workflows/update_listings.yml</code> con cron <code>0 */6 * * *</code> (cada 6 horas). Rastrea portales, filtra por parcela ≥ 500m² y porche, recalcula distancias de Google Maps y archiva novedades.
              </p>
            </div>
          </div>

          {/* Selector de método */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.5rem' }}>
              Método de actualización al pulsar el botón:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div
                onClick={() => setSyncMethod('local')}
                style={{
                  padding: '0.85rem',
                  borderRadius: '10px',
                  border: syncMethod === 'local' ? '2px solid #0f766e' : '1px solid #cbd5e1',
                  backgroundColor: syncMethod === 'local' ? '#f0fdfa' : '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                  ⚡ Rastreo Local Inmediato
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Ejecuta el scraper directamente y recarga el listado en vivo.
                </div>
              </div>

              <div
                onClick={() => setSyncMethod('github_action')}
                style={{
                  padding: '0.85rem',
                  borderRadius: '10px',
                  border: syncMethod === 'github_action' ? '2px solid #0f766e' : '1px solid #cbd5e1',
                  backgroundColor: syncMethod === 'github_action' ? '#f0fdfa' : '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                  🚀 Lanzar GitHub Action
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Dispara el workflow en la nube y hace commit de los datos.
                </div>
              </div>
            </div>
          </div>

          {/* Token input for GitHub Action dispatch */}
          {syncMethod === 'github_action' && (
            <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Personal Access Token de GitHub (opcional):</span>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo,workflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.75rem', color: '#0f766e', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  Crear token <ExternalLink size={11} />
                </a>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxx"
                  value={ghToken}
                  onChange={(e) => setGhToken(e.target.value)}
                  style={{
                    flexGrow: 1,
                    padding: '0.45rem 0.65rem',
                    fontSize: '0.82rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1'
                  }}
                />
                <button
                  onClick={handleSaveToken}
                  style={{
                    backgroundColor: '#0f766e',
                    color: '#ffffff',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  Guardar
                </button>
              </div>
            </div>
          )}

          {/* Portales monitorizados */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Portales Monitorizados
            </div>
            <div className="sync-status-list">
              {[
                { name: 'Idealista (Oleiros)', count: 'Monitoreando Santa Cruz, Montrove, Perillo, Liáns' },
                { name: 'Fotocasa (Oleiros)', count: 'Filtro parcela ≥ 500m² y chalets' },
                { name: 'Habitaclia & Pisos.com', count: 'Detección automática de porche' },
                { name: 'Inmobiliarias locales de Oleiros', count: 'Engel & Völkers, Urbenorte, etc.' }
              ].map(p => (
                <div key={p.name} className="sync-item">
                  <div>
                    <strong>{p.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.count}</div>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#059669',
                    backgroundColor: '#ecfdf5',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '999px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <CheckCircle size={12} /> Activo
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Consola de logs si está sincronizando o hay logs */}
          {syncLog && (
            <div style={{
              backgroundColor: '#0f172a',
              color: '#38bdf8',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              maxHeight: '120px',
              overflowY: 'auto',
              lineHeight: 1.4
            }}>
              <div style={{ color: '#94a3b8', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Terminal size={12} /> Registro de ejecución:
              </div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{syncLog}</pre>
            </div>
          )}

          {/* Botón de acción */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
            <button
              onClick={onClose}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#475569'
              }}
            >
              Cerrar
            </button>

            <button
              onClick={handleExecuteSync}
              disabled={isSyncing}
              className="btn-update-data"
              style={{ padding: '0.6rem 1.25rem' }}
            >
              <RefreshCw size={15} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
              {isSyncing ? 'Rastreando portales...' : 'Actualizar Datos Ahora'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
