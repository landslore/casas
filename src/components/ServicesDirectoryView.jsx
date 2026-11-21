import React, { useState } from 'react';
import { MapPin, Navigation, School, Waves, ShoppingCart, HeartPulse, Car, Trees, Compass } from 'lucide-react';

const SERVICES_DATA = [
  {
    id: "playa_bastiagueiro",
    name: "Playa de Bastiagueiro",
    category: "playas",
    lat: 43.3486,
    lng: -8.3512,
    description: "Playa de arena fina y oleaje idóneo para surf y paseos costeros con amplia zona verde.",
    icon: <Waves size={20} />
  },
  {
    id: "playa_santa_cruz",
    name: "Castillo y Playa de Santa Cruz",
    category: "playas",
    lat: 43.3511,
    lng: -8.3490,
    description: "Emblemático islote y fortaleza histórica accesible por pasarela de madera con calas resguardadas.",
    icon: <Waves size={20} />
  },
  {
    id: "playa_santa_cristina",
    name: "Playa de Santa Cristina",
    category: "playas",
    lat: 43.3392,
    lng: -8.3755,
    description: "Gran arenal semiurbano en Perillo, deportes náuticos y paseo con restaurantes frente a la ría.",
    icon: <Waves size={20} />
  },
  {
    id: "mercadona_santacruz",
    name: "Mercadona Santa Cruz",
    category: "supermercados",
    lat: 43.3445,
    lng: -8.3421,
    description: "Supermercado de referencia en Santa Cruz con aparcamiento gratuito y sección de frescos.",
    icon: <ShoppingCart size={20} />
  },
  {
    id: "gadis_hiper_perillo",
    name: "Gadis Híper Perillo",
    category: "supermercados",
    lat: 43.3328,
    lng: -8.3688,
    description: "Hipermercado gallego de gran formato con carnicería, pescadería de lonja y productos locales.",
    icon: <ShoppingCart size={20} />
  },
  {
    id: "carrefour_oleiros",
    name: "Carrefour Express Montrove",
    category: "supermercados",
    lat: 43.3375,
    lng: -8.3560,
    description: "Tienda de proximidad y compras diarias con panadería en el corazón residencial de Montrove.",
    icon: <ShoppingCart size={20} />
  },
  {
    id: "colegio_miraflores",
    name: "Colegio Miraflores (Montrove)",
    category: "colegios",
    lat: 43.3361,
    lng: -8.3519,
    description: "Prestigioso centro bilingüe concertado (infantil, primaria y secundaria) con instalaciones deportivas.",
    icon: <School size={20} />
  },
  {
    id: "ceip_isidro_parga",
    name: "CEIP Isidro Parga Pondal (Santa Cruz)",
    category: "colegios",
    lat: 43.3490,
    lng: -8.3420,
    description: "Colegio público de educación infantil y primaria en el centro de Santa Cruz.",
    icon: <School size={20} />
  },
  {
    id: "ies_miraflores",
    name: "IES Miraflores / Polideportivo",
    category: "colegios",
    lat: 43.3340,
    lng: -8.3530,
    description: "Instituto público de Educación Secundaria y Bachillerato con pabellón polideportivo cubierto.",
    icon: <School size={20} />
  },
  {
    id: "centro_salud_santacruz",
    name: "Centro de Saúde de Santa Cruz",
    category: "salud",
    lat: 43.3475,
    lng: -8.3465,
    description: "Atención primaria médica del Sergas, pediatría, enfermería y urgencias locales.",
    icon: <HeartPulse size={20} />
  },
  {
    id: "farmacia_montrove",
    name: "Farmacia Liáns / Montrove",
    category: "salud",
    lat: 43.3398,
    lng: -8.3480,
    description: "Servicio farmacéutico de proximidad para residentes de Liáns y Montrove.",
    icon: <HeartPulse size={20} />
  },
  {
    id: "puente_pasaje",
    name: "Puente del Pasaje (Acceso directo A Coruña)",
    category: "transporte",
    lat: 43.3342,
    lng: -8.3808,
    description: "Arteria principal de conexión entre Oleiros y Alfonso Molina (llegada al centro de A Coruña en 10-12 min).",
    icon: <Car size={20} />
  },
  {
    id: "obelisco_coruna",
    name: "Centro A Coruña (Obelisco / Cantones)",
    category: "transporte",
    lat: 43.3688,
    lng: -8.4042,
    description: "Distrito financiero, comercial y cultural de A Coruña.",
    icon: <Navigation size={20} />
  },
  {
    id: "parque_trece_rosas",
    name: "Parque das Trece Rosas (Liáns)",
    category: "ocio",
    lat: 43.3385,
    lng: -8.3390,
    description: "Espacio natural municipal protegido con senderos peatonales, praderas y zonas de descanso.",
    icon: <Trees size={20} />
  },
  {
    id: "club_golf_zapateira",
    name: "Real Club de Golf de La Coruña",
    category: "ocio",
    lat: 43.3150,
    lng: -8.3750,
    description: "Club deportivo histórico de 18 hoyos, pistas de tenis, pádel, piscinas y restaurante social.",
    icon: <Compass size={20} />
  }
];

export default function ServicesDirectoryView() {
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = categoryFilter === 'all'
    ? SERVICES_DATA
    : SERVICES_DATA.filter(s => s.category === categoryFilter);

  return (
    <div className="services-page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Directorio de Servicios e Infraestructuras en Oleiros
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Puntos estratégicos para calcular la distancia a las viviendas de Santa Cruz, Montrove, Perillo y Liáns.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['all', 'playas', 'supermercados', 'colegios', 'salud', 'transporte', 'ocio'].map(cat => (
            <button
              key={cat}
              className={`poi-toggle-btn ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === 'all' ? 'Todos los servicios' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="services-grid">
        {filtered.map(srv => (
          <div key={srv.id} className="service-card">
            <div className="service-card-header">
              <div className="service-icon-box">
                {srv.icon}
              </div>
              <div>
                <h3 className="service-title">{srv.name}</h3>
                <span className="service-badge">{srv.category}</span>
              </div>
            </div>

            <p className="service-desc">{srv.description}</p>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${srv.lat},${srv.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="service-btn-gmaps"
            >
              <Navigation size={14} />
              <span>Ver Ubicación en Google Maps</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
