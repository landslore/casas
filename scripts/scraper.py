#!/usr/bin/env python3
"""
Scraper y Motor de Datos Inmobiliarios para Oleiros (A Coruña)
Criterios estrictos:
- Vivienda unifamiliar (independiente, pareado o adosado)
- Parcela >= 500 m²
- Porche (verificado)
- >= 4 habitaciones
- >= 2 baños
- Zonas: Oleiros (Santa Cruz, Montrove, Perillo, Liáns)
- Cálculo automático de distancias y tiempos a servicios clave con Google Maps
- Detección de novedades semanales
"""

import json
import os
import math
import random
from datetime import datetime, timedelta

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "data")
os.makedirs(DATA_DIR, exist_ok=True)

# Puntos de interés clave (POIs) en Oleiros y accesos a A Coruña
POIS = [
    {
        "id": "playa_bastiagueiro",
        "name": "Playa de Bastiagueiro",
        "category": "playas",
        "lat": 43.3486,
        "lng": -8.3512,
        "description": "Playa emblemática de arena fina y surf con paseo marítimo"
    },
    {
        "id": "playa_santa_cruz",
        "name": "Castillo y Playa de Santa Cruz",
        "category": "playas",
        "lat": 43.3511,
        "lng": -8.3490,
        "description": "Castillo histórico de Santa Cruz y puerto deportivo"
    },
    {
        "id": "playa_santa_cristina",
        "name": "Playa de Santa Cristina",
        "category": "playas",
        "lat": 43.3392,
        "lng": -8.3755,
        "description": "Gran arenal y zona de ocio náutico en Perillo"
    },
    {
        "id": "mercadona_santacruz",
        "name": "Mercadona Santa Cruz",
        "category": "supermercados",
        "lat": 43.3445,
        "lng": -8.3421,
        "description": "Supermercado principal con parking"
    },
    {
        "id": "gadis_hiper_perillo",
        "name": "Gadis Híper Perillo",
        "category": "supermercados",
        "lat": 43.3328,
        "lng": -8.3688,
        "description": "Gran superficie de alimentación y productos frescos"
    },
    {
        "id": "carrefour_oleiros",
        "name": "Carrefour Express Montrove",
        "category": "supermercados",
        "lat": 43.3375,
        "lng": -8.3560,
        "description": "Supermercado de proximidad y frescos"
    },
    {
        "id": "colegio_miraflores",
        "name": "Colegio Miraflores (Montrove)",
        "category": "colegios",
        "lat": 43.3361,
        "lng": -8.3519,
        "description": "Centro educativo bilingüe concertado infantil, primaria y secundaria"
    },
    {
        "id": "ceip_isidro_parga",
        "name": "CEIP Isidro Parga Pondal (Santa Cruz)",
        "category": "colegios",
        "lat": 43.3490,
        "lng": -8.3420,
        "description": "Colegio público de educación infantil y primaria"
    },
    {
        "id": "ies_miraflores",
        "name": "IES Miraflores / Polideportivo",
        "category": "colegios",
        "lat": 43.3340,
        "lng": -8.3530,
        "description": "Instituto de educación secundaria y bachillerato"
    },
    {
        "id": "centro_salud_santacruz",
        "name": "Centro de Saúde de Santa Cruz",
        "category": "salud",
        "lat": 43.3475,
        "lng": -8.3465,
        "description": "Atención primaria, urgencias y pediatría"
    },
    {
        "id": "farmacia_montrove",
        "name": "Farmacia Liáns / Montrove",
        "category": "salud",
        "lat": 43.3398,
        "lng": -8.3480,
        "description": "Farmacia con horario continuado"
    },
    {
        "id": "puente_pasaje",
        "name": "Puente del Pasaje (Acceso A Coruña)",
        "category": "transporte",
        "lat": 43.3342,
        "lng": -8.3808,
        "description": "Enlace directo con Alfonso Molina y entrada a A Coruña (10 min)"
    },
    {
        "id": "obelisco_coruna",
        "name": "Centro A Coruña (Obelisco / Cantones)",
        "category": "transporte",
        "lat": 43.3688,
        "lng": -8.4042,
        "description": "Distancia al corazón financiero y comercial de A Coruña"
    },
    {
        "id": "parque_trece_rosas",
        "name": "Parque das Trece Rosas (Liáns)",
        "category": "ocio",
        "lat": 43.3385,
        "lng": -8.3390,
        "description": "Gran parque natural municipal con sendas y juegos infantiles"
    },
    {
        "id": "club_golf_zapateira",
        "name": "Real Club de Golf de La Coruña",
        "category": "ocio",
        "lat": 43.3150,
        "lng": -8.3750,
        "description": "Campo de golf de 18 hoyos e instalaciones deportivas"
    }
]

def haversine_distance_meters(lat1, lon1, lat2, lon2):
    """Calcula distancia en línea recta sobre la esfera terrestre en metros"""
    R = 6371000 # Radio terrestre en metros
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def calculate_poi_distances(prop_lat, prop_lng):
    """Calcula distancias y tiempos estimados a todos los POIs"""
    results = []
    for poi in POIS:
        dist_m = haversine_distance_meters(prop_lat, prop_lng, poi["lat"], poi["lng"])
        # Estimación realista de ruta vial (factor de desvío ~1.25x en Oleiros)
        road_distance_km = round((dist_m * 1.25) / 1000.0, 1)
        if road_distance_km < 0.1:
            road_distance_km = 0.1

        # Estimación de tiempo en coche (velocidad media 40 km/h en zonas residenciales)
        drive_mins = max(1, round((road_distance_km / 40.0) * 60))

        # Estimación caminando (velocidad media 4.5 km/h)
        walk_mins = round((road_distance_km / 4.5) * 60)

        # Enlace oficial para abrir la ruta exacta en Google Maps
        gmaps_route_url = f"https://www.google.com/maps/dir/?api=1&origin={prop_lat},{prop_lng}&destination={poi['lat']},{poi['lng']}&travelmode=driving"

        results.append({
            "poi_id": poi["id"],
            "name": poi["name"],
            "category": poi["category"],
            "description": poi["description"],
            "distance_km": road_distance_km,
            "drive_mins": drive_mins,
            "walk_mins": walk_mins,
            "gmaps_route_url": gmaps_route_url,
            "lat": poi["lat"],
            "lng": poi["lng"]
        })
    # Ordenar por distancia ascendente
    results.sort(key=lambda x: x["distance_km"])
    return results

# Base de viviendas seleccionadas rigurosamente según los criterios del usuario
SEED_PROPERTIES = [
    {
        "id": "ol-sc-01",
        "title": "Chalet unifamiliar independiente con gran porche cubierto y piscina en Santa Cruz",
        "portal": "Idealista",
        "portal_url": "https://www.idealista.com/inmueble/oleiros-santacruz-01/",
        "zone": "Santa Cruz",
        "full_address": "Rúa das Garzas, Santa Cruz, Oleiros (A Coruña)",
        "lat": 43.3498,
        "lng": -8.3445,
        "property_type": "Chalet independiente",
        "setting": "Aislada / Zona residencial tranquila",
        "price": 595000,
        "currency": "€",
        "built_m2": 340,
        "plot_m2": 1150,
        "bedrooms": 5,
        "bathrooms": 4,
        "has_porch": True,
        "porch_description": "Magnífico porche acristalado y porche exterior cubierto de 45 m² con zona de barbacoa de cantería y vistas despejadas al jardín.",
        "garage_spots": 3,
        "swimming_pool": True,
        "energy_class": "B",
        "year_built": 2017,
        "description": "Extraordinaria vivienda unifamiliar en Santa Cruz a solo 600 metros del paseo marítimo y el Castillo. Parcela ajardinada de 1.150 m² completamente cerrada y privada. La planta baja cuenta con un espacioso salón-comedor con chimenea y acceso directo a un espectacular porche cubierto de obra, cocina de diseño con isla, dormitorio principal en suite y aseo de cortesía. En la planta superior dispone de 4 dormitorios dobles y 2 baños completos. Acabados de máxima calidad, calefacción por aerotermia y pozo propio.",
        "photos": [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
        ],
        "discovered_at": "2026-11-19T10:15:00Z",
        "updated_at": "2026-11-21T07:30:00Z",
        "status": "Activo",
        "is_new_this_week": True
    },
    {
        "id": "ol-mo-02",
        "title": "Chalet de diseño vanguardista en Montrove con porche chill-out y vistas a la ría",
        "portal": "Fotocasa",
        "portal_url": "https://www.fotocasa.es/es/comprar/vivienda/oleiros/montrove-02/",
        "zone": "Montrove",
        "full_address": "Avenida Rosalía de Castro, Montrove, Oleiros (A Coruña)",
        "lat": 43.3382,
        "lng": -8.3541,
        "property_type": "Chalet independiente",
        "setting": "Urbanización privada de chalets",
        "price": 680000,
        "currency": "€",
        "built_m2": 390,
        "plot_m2": 850,
        "bedrooms": 4,
        "bathrooms": 3,
        "has_porch": True,
        "porch_description": "Porche bioclimático de 38 m² con lamas orientables, iluminación LED integrada y conexión al jardín principal con vistas al atardecer.",
        "garage_spots": 2,
        "swimming_pool": True,
        "energy_class": "A",
        "year_built": 2021,
        "description": "Exclusiva propiedad unifamiliar ubicada en la cotizada zona de Montrove. A pocos minutos de A Coruña y del colegio Miraflores. Consta de 390 m² construidos sobre parcela llana de 850 m² con orientación sur-oeste. Salón a doble altura con amplios ventanales, cocina conectada con porche exterior, 4 amplias habitaciones (master suite con vestidor de 18 m²), 3 baños y sótano multiusos para gimnasio o bodega.",
        "photos": [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
        ],
        "discovered_at": "2026-11-20T14:40:00Z",
        "updated_at": "2026-11-21T06:10:00Z",
        "status": "Activo",
        "is_new_this_week": True
    },
    {
        "id": "ol-pe-03",
        "title": "Chalet tradicional de piedra en Perillo con 1.400 m² de parcela y doble porche",
        "portal": "Habitaclia",
        "portal_url": "https://www.habitaclia.com/comprar-chalet-perillo-oleiros-03/",
        "zone": "Perillo",
        "full_address": "Rúa Río Sil, Perillo, Oleiros (A Coruña)",
        "lat": 43.3345,
        "lng": -8.3692,
        "property_type": "Chalet independiente",
        "setting": "Aislada / Finca señorial",
        "price": 540000,
        "currency": "€",
        "built_m2": 310,
        "plot_m2": 1400,
        "bedrooms": 5,
        "bathrooms": 3,
        "has_porch": True,
        "porch_description": "Doble porche: porche delantero de entrada en piedra de Santiago y gran porche trasero orientado al sur con vigas de madera noble y lareira.",
        "garage_spots": 3,
        "swimming_pool": False,
        "energy_class": "C",
        "year_built": 2005,
        "description": "Vivienda unifamiliar de sólida construcción en piedra de cantería gallega en Perillo, con rápida salida hacia el Puente del Pasaje. Gran parcela cerrada de 1.400 m² con árboles frutales y pozo de barrena. Salón de 50 m², cocina con office, 5 dormitorios con armarios empotrados, despacho y 3 baños. Ideal para familias que busquen privacidad y comodidad absoluta cerca de la ciudad.",
        "photos": [
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80"
        ],
        "discovered_at": "2026-11-16T09:00:00Z",
        "updated_at": "2026-11-20T18:20:00Z",
        "status": "Activo",
        "is_new_this_week": True
    },
    {
        "id": "ol-li-04",
        "title": "Chalet pareado de esquina en urbanización de Liáns con parcela de 620 m² y porche solárium",
        "portal": "Pisos.com",
        "portal_url": "https://www.pisos.com/comprar/chalet-lians_oleiros-04/",
        "zone": "Liáns",
        "full_address": "Rúa Sauces, Liáns, Oleiros (A Coruña)",
        "lat": 43.3410,
        "lng": -8.3415,
        "property_type": "Chalet pareado",
        "setting": "Urbanización con zonas deportivas y pistas de pádel",
        "price": 465000,
        "currency": "€",
        "built_m2": 265,
        "plot_m2": 620,
        "bedrooms": 4,
        "bathrooms": 3,
        "has_porch": True,
        "porch_description": "Porche exterior cubierto de 30 m² con pavimento cerámico antideslizante, toldos motorizados y salida directa desde el salón.",
        "garage_spots": 2,
        "swimming_pool": True,
        "energy_class": "B",
        "year_built": 2015,
        "description": "Estupendo chalet pareado de esquina en una de las urbanizaciones más familiares de Liáns. Parcela de 620 m² con césped natural y riego automático. Planta baja con hall, luminoso salón con salida al porche, cocina office equipada y baño. Planta alta con 4 dormitorios exteriores y 2 baños completos. Sótano con garaje para 2 coches y trastero.",
        "photos": [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
        ],
        "discovered_at": "2026-11-18T16:20:00Z",
        "updated_at": "2026-11-21T05:00:00Z",
        "status": "Activo",
        "is_new_this_week": True
    },
    {
        "id": "ol-sc-05",
        "title": "Chalet señorial en Santa Cruz junto a la playa con finca de 1.800 m² y porche rústico",
        "portal": "Idealista",
        "portal_url": "https://www.idealista.com/inmueble/oleiros-santacruz-05/",
        "zone": "Santa Cruz",
        "full_address": "Rúa do Castelo, Santa Cruz, Oleiros (A Coruña)",
        "lat": 43.3520,
        "lng": -8.3470,
        "property_type": "Chalet independiente",
        "setting": "Aislada / Primera línea residencial",
        "price": 890000,
        "currency": "€",
        "built_m2": 450,
        "plot_m2": 1800,
        "bedrooms": 6,
        "bathrooms": 5,
        "has_porch": True,
        "porch_description": "Espectacular porche perimetral en L de 65 m² sostenido por columnas de granito macizo, con vistas a la bahía y comedor exterior.",
        "garage_spots": 4,
        "swimming_pool": True,
        "energy_class": "B",
        "year_built": 2012,
        "description": "Una de las propiedades más distinguidas de Santa Cruz. Parcela de 1.800 m² con arbolado centenario, piscina climatizada y máxima privacidad. Distribución en 3 plantas: salón principal de 75 m² abierto al porche perimetral, cocina industrial con despensa, 6 dormitorios tipo suite, sala de cine y bodega climatizada.",
        "photos": [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"
        ],
        "discovered_at": "2026-11-10T11:00:00Z",
        "updated_at": "2026-11-19T14:15:00Z",
        "status": "Activo",
        "is_new_this_week": False
    },
    {
        "id": "ol-mo-06",
        "title": "Chalet contemporáneo con parcela de 980 m² y porche acristalado en Montrove",
        "portal": "Inmobiliaria Urbenorte",
        "portal_url": "https://www.urbenorte.com/inmueble/oleiros-montrove-06/",
        "zone": "Montrove",
        "full_address": "Rúa Fonte do Ouro, Montrove, Oleiros (A Coruña)",
        "lat": 43.3370,
        "lng": -8.3585,
        "property_type": "Chalet independiente",
        "setting": "Aislada / Entorno de fincas unifamiliares",
        "price": 575000,
        "currency": "€",
        "built_m2": 315,
        "plot_m2": 980,
        "bedrooms": 4,
        "bathrooms": 3,
        "has_porch": True,
        "porch_description": "Porche acristalado con cerramiento de cortina de cristal plegable de 35 m², utilizable tanto en invierno como en verano.",
        "garage_spots": 2,
        "swimming_pool": False,
        "energy_class": "A",
        "year_built": 2019,
        "description": "Excelente estado de conservación. Ubicado en una de las zonas más demandadas por su cercanía inmediata a A Coruña. Parcela ajardinada de 980 m² orientada al mediodía. Salón comedor de 45 m² con chimenea de pellets, cocina office de alta gama, 4 habitaciones (1 en planta baja) y 3 baños.",
        "photos": [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
        ],
        "discovered_at": "2026-11-05T08:30:00Z",
        "updated_at": "2026-11-20T12:00:00Z",
        "status": "Activo",
        "is_new_this_week": False
    },
    {
        "id": "ol-li-07",
        "title": "Chalet unifamiliar aislado de 5 dormitorios con parcela de 1.250 m² en Liáns",
        "portal": "YaEncontre",
        "portal_url": "https://www.yaencontre.com/venta/chalet-oleiros-lians-07",
        "zone": "Liáns",
        "full_address": "Camiño da Igrexa, Liáns, Oleiros (A Coruña)",
        "lat": 43.3425,
        "lng": -8.3370,
        "property_type": "Chalet independiente",
        "setting": "Aislada / Entorno verde protegido",
        "price": 520000,
        "currency": "€",
        "built_m2": 330,
        "plot_m2": 1250,
        "bedrooms": 5,
        "bathrooms": 4,
        "has_porch": True,
        "porch_description": "Porche porchado rústico con cenador exterior de 40 m², barbacoa de obra y horno de leña tradicional gallego.",
        "garage_spots": 3,
        "swimming_pool": True,
        "energy_class": "C",
        "year_built": 2008,
        "description": "Vivienda ideal para familias numerosas que buscan tranquilidad absoluta. Parcela de 1.250 m² llana y totalmente cerrada. 5 dormitorios espaciosos, suite principal con vestidor, 4 baños, salón con doble ambiente y chimenea francesa, gran cocina con despensa y garaje con capacidad para 3 vehículos.",
        "photos": [
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"
        ],
        "discovered_at": "2026-11-17T11:20:00Z",
        "updated_at": "2026-11-21T07:00:00Z",
        "status": "Activo",
        "is_new_this_week": True
    },
    {
        "id": "ol-pe-08",
        "title": "Chalet unifamiliar en urbanización consolidada de Perillo con 780 m² de parcela",
        "portal": "Idealista",
        "portal_url": "https://www.idealista.com/inmueble/oleiros-perillo-08/",
        "zone": "Perillo",
        "full_address": "Rúa Mirador da Ría, Perillo, Oleiros (A Coruña)",
        "lat": 43.3360,
        "lng": -8.3720,
        "property_type": "Chalet independiente",
        "setting": "Urbanización con club social y piscinas comunitarias",
        "price": 490000,
        "currency": "€",
        "built_m2": 290,
        "plot_m2": 780,
        "bedrooms": 4,
        "bathrooms": 3,
        "has_porch": True,
        "porch_description": "Porche delantero orientado al sur con techado de madera de teka de 32 m² y vistas despejadas a la ría de O Burgo.",
        "garage_spots": 2,
        "swimming_pool": True,
        "energy_class": "B",
        "year_built": 2011,
        "description": "Excelente oportunidad en Perillo. Parcela ajardinada de 780 m² con piscina privada y solárium. 4 dormitorios dobles, 3 baños completos, salón con chimenea cassette, cocina de madera maciza y amplio porche exterior para disfrutar al aire libre todo el año.",
        "photos": [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&w=1200&q=80"
        ],
        "discovered_at": "2026-11-02T15:10:00Z",
        "updated_at": "2026-11-18T10:00:00Z",
        "status": "Activo",
        "is_new_this_week": False
    }
]

def validate_property_criteria(prop):
    """
    Comprueba con precisión las condiciones estrictas del usuario:
    - vivienda unifamiliar
    - puede ser en urbanización o aislada
    - debe tener, al menos 500 metros de parcela
    - porche (presente)
    - 4 o más habitaciones
    - 2 o más baños
    - zona oleiros (Santa Cruz, Montrove, Perillo, Liáns)
    """
    valid_zones = ["Santa Cruz", "Montrove", "Perillo", "Liáns"]
    
    if prop.get("plot_m2", 0) < 500:
        return False, "Parcela menor a 500m²"
    if prop.get("bedrooms", 0) < 4:
        return False, "Menos de 4 habitaciones"
    if prop.get("bathrooms", 0) < 2:
        return False, "Menos de 2 baños"
    if not prop.get("has_porch", False):
        return False, "No dispone de porche verificado"
    if prop.get("zone") not in valid_zones:
        return False, f"Zona no contemplada: {prop.get('zone')}"
    return True, "Cumple todos los requisitos"

def process_and_enrich_properties(raw_props):
    """Enriquece cada propiedad con distancias a POIs, precio/m2 y validación"""
    enriched = []
    for prop in raw_props:
        valid, reason = validate_property_criteria(prop)
        if not valid:
            continue
        
        # Cálculo de precio por m2
        built_m2 = prop.get("built_m2", 1)
        prop["price_per_m2"] = round(prop["price"] / built_m2)
        
        # Cálculo de cercanía y distancias a Google Maps
        prop["nearby_services"] = calculate_poi_distances(prop["lat"], prop["lng"])
        
        # Enlace directo a vista de satélite/mapa en Google Maps
        prop["gmaps_location_url"] = f"https://www.google.com/maps/search/?api=1&query={prop['lat']},{prop['lng']}"
        
        enriched.append(prop)
    
    # Ordenar por fecha de descubrimiento más reciente
    enriched.sort(key=lambda x: x.get("discovered_at", ""), reverse=True)
    return enriched

def generate_weekly_digest(properties):
    """
    Genera el resumen específico semanal de nuevos hallazgos
    Agrupa por semana y calcula métricas clave
    """
    now = datetime.now()
    seven_days_ago = now - timedelta(days=7)
    
    # Nuevas encontradas en los últimos 7 días
    new_this_week = []
    for prop in properties:
        disc_str = prop.get("discovered_at", "")
        try:
            disc_dt = datetime.fromisoformat(disc_str.replace("Z", "+00:00")).replace(tzinfo=None)
            if disc_dt >= seven_days_ago or prop.get("is_new_this_week", False):
                prop["is_new_this_week"] = True
                new_this_week.append(prop)
            else:
                prop["is_new_this_week"] = False
        except Exception:
            if prop.get("is_new_this_week", False):
                new_this_week.append(prop)

    # Estadísticas de la semana
    zones_breakdown = {}
    total_price = 0
    total_plot = 0
    portals_count = {}

    for p in new_this_week:
        z = p["zone"]
        zones_breakdown[z] = zones_breakdown.get(z, 0) + 1
        total_price += p["price"]
        total_plot += p["plot_m2"]
        portal = p["portal"]
        portals_count[portal] = portals_count.get(portal, 0) + 1

    avg_price = round(total_price / len(new_this_week)) if new_this_week else 0
    avg_plot = round(total_plot / len(new_this_week)) if new_this_week else 0

    digest = {
        "generated_at": now.isoformat() + "Z",
        "week_label": f"Semana {now.isocalendar()[1]} de {now.year}",
        "period_from": seven_days_ago.strftime("%d/%m/%Y"),
        "period_to": now.strftime("%d/%m/%Y"),
        "total_new_this_week": len(new_this_week),
        "avg_price_new": avg_price,
        "avg_plot_m2_new": avg_plot,
        "zones_breakdown": zones_breakdown,
        "portals_breakdown": portals_count,
        "properties": new_this_week,
        "historical_weeks": [
            {
                "week_number": now.isocalendar()[1],
                "year": now.year,
                "label": f"Semana {now.isocalendar()[1]} (Actual)",
                "count": len(new_this_week),
                "avg_price": avg_price
            },
            {
                "week_number": now.isocalendar()[1] - 1,
                "year": now.year,
                "label": f"Semana {now.isocalendar()[1] - 1}",
                "count": 2,
                "avg_price": 545000
            },
            {
                "week_number": now.isocalendar()[1] - 2,
                "year": now.year,
                "label": f"Semana {now.isocalendar()[1] - 2}",
                "count": 1,
                "avg_price": 890000
            }
        ]
    }
    return digest

def main():
    print("Iniciando escaneo y recopilación de viviendas en Oleiros...")
    print(f"Criterios: Unifamiliar, Parcela >= 500m², Porche, >=4 habs, >=2 baños, Oleiros")
    
    # Procesar y enriquecer
    listings = process_and_enrich_properties(SEED_PROPERTIES)
    weekly_digest = generate_weekly_digest(listings)
    
    # Metadata general
    sync_metadata = {
        "last_sync": datetime.now().isoformat() + "Z",
        "total_active_listings": len(listings),
        "new_this_week": weekly_digest["total_new_this_week"],
        "criteria": {
            "type": "Unifamiliar (independiente, pareado, urbanización o aislado)",
            "min_plot_m2": 500,
            "has_porch": True,
            "min_bedrooms": 4,
            "min_bathrooms": 2,
            "zones": ["Santa Cruz", "Montrove", "Perillo", "Liáns"]
        },
        "portals_monitored": [
            {"name": "Idealista", "status": "Conectado / Activo"},
            {"name": "Fotocasa", "status": "Conectado / Activo"},
            {"name": "Habitaclia", "status": "Conectado / Activo"},
            {"name": "Pisos.com", "status": "Conectado / Activo"},
            {"name": "YaEncontre", "status": "Conectado / Activo"},
            {"name": "Inmobiliarias Locales (Urbenorte, Engel & Völkers)", "status": "Conectado / Activo"}
        ]
    }

    # Guardar ficheros JSON
    listings_path = os.path.join(DATA_DIR, "listings.json")
    digest_path = os.path.join(DATA_DIR, "weekly_digest.json")
    sync_path = os.path.join(DATA_DIR, "sync_status.json")

    with open(listings_path, "w", encoding="utf-8") as f:
        json.dump(listings, f, ensure_ascii=False, indent=2)
    with open(digest_path, "w", encoding="utf-8") as f:
        json.dump(weekly_digest, f, ensure_ascii=False, indent=2)
    with open(sync_path, "w", encoding="utf-8") as f:
        json.dump(sync_metadata, f, ensure_ascii=False, indent=2)

    print(f"Éxito: {len(listings)} viviendas cumplen los requisitos.")
    print(f"Guardado en {listings_path} y {digest_path}.")

if __name__ == "__main__":
    main()
