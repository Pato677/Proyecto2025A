import React, { useState, useEffect } from 'react';
import './Estilos/CarruselImagenes.css';

// Importar imágenes locales
import Imagen1 from '../Recursos/Imagenes/Imagen1.jpg';
import Imagen2 from '../Recursos/Imagenes/Imagen2.jpg';
import Imagen3 from '../Recursos/Imagenes/Imagen3.jpg';
import Imagen4 from '../Recursos/Imagenes/Imagen4.jpg';
import Imagen5 from '../Recursos/Imagenes/Imagen5.jpg';

const CarruselImagenes = ({ intervalo = 5000 }) => {
  const [imagenes, setImagenes] = useState([]);
  const [imagenActual, setImagenActual] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // Imágenes locales con información
  const imagenesTransporte = [
    {
      url: Imagen1,
      alt: 'Transporte Ecuador - Bus Moderno',
      titulo: 'Comodidad en cada viaje'
    },
    {
      url: Imagen2,
      alt: 'Transporte Ecuador - Bus Premium',
      titulo: 'Viaja con estilo y seguridad'
    },
    {
      url: Imagen3,
      alt: 'Transporte Ecuador - Terminal',
      titulo: 'Conectamos todo el país'
    },
    {
      url: Imagen4,
      alt: 'Transporte Ecuador - Ruta Panorámica',
      titulo: 'Descubre paisajes únicos'
    },
    {
      url: Imagen5,
      alt: 'Transporte Ecuador - Servicio Premium',
      titulo: 'Tu próximo destino te espera'
    }
  ];

  // SVG fallback en caso de error
  const svgFallback = `data:image/svg+xml;base64,${btoa(`
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)"/>
      <g transform="translate(400,200)">
        <!-- Bus Icon -->
        <rect x="-120" y="-30" width="240" height="60" rx="15" fill="white" opacity="0.9"/>
        <rect x="-100" y="-20" width="200" height="40" rx="8" fill="#4a5568"/>
        <circle cx="-80" cy="20" r="15" fill="white"/>
        <circle cx="80" cy="20" r="15" fill="white"/>
        <circle cx="-80" cy="20" r="8" fill="#2d3748"/>
        <circle cx="80" cy="20" r="8" fill="#2d3748"/>
        <!-- Windows -->
        <rect x="-90" y="-15" width="25" height="20" rx="3" fill="#e2e8f0"/>
        <rect x="-60" y="-15" width="25" height="20" rx="3" fill="#e2e8f0"/>
        <rect x="-30" y="-15" width="25" height="20" rx="3" fill="#e2e8f0"/>
        <rect x="0" y="-15" width="25" height="20" rx="3" fill="#e2e8f0"/>
        <rect x="30" y="-15" width="25" height="20" rx="3" fill="#e2e8f0"/>
        <rect x="60" y="-15" width="25" height="20" rx="3" fill="#e2e8f0"/>
      </g>
      <text x="400" y="350" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="32" font-weight="bold">
        ¡Cada viaje es una experiencia única!
      </text>
      <text x="400" y="390" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" opacity="0.9">
        Conectamos destinos por todo Ecuador
      </text>
      <text x="400" y="450" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" opacity="0.7">
        Imagen no disponible - Modo offline
      </text>
    </svg>
  `)}`;

  const imagenFallback = {
    url: svgFallback,
    alt: 'Transporte Ecuador - Imagen no disponible',
    titulo: '¡Cada viaje es una experiencia única!'
  };

  useEffect(() => {
    cargarImagenes();
  }, []);

  // Efecto para cambiar imagen automáticamente
  useEffect(() => {
    if (imagenes.length <= 1) return;

    const intervalId = setInterval(() => {
      setImagenActual(prev => (prev + 1) % imagenes.length);
    }, intervalo);

    return () => clearInterval(intervalId);
  }, [imagenes.length, intervalo]);

  const cargarImagenes = async () => {
    setCargando(true);
    const imagenesValidas = [];

    for (const img of imagenesTransporte) {
      try {
        await verificarImagen(img.url);
        imagenesValidas.push(img);
      } catch (error) {
        console.warn(`No se pudo cargar la imagen: ${img.alt}`);
      }
    }

    if (imagenesValidas.length === 0) {
      // Si no se pudo cargar ninguna imagen, usar SVG fallback
      setImagenes([imagenFallback]);
      setError(true);
    } else {
      setImagenes(imagenesValidas);
      setError(false);
    }

    setCargando(false);
  };

  const verificarImagen = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`Failed to load image`));
      img.src = url;
      // Timeout más corto para imágenes locales
      setTimeout(() => reject(new Error(`Timeout loading image`)), 2000);
    });
  };


  if (cargando) {
    return (
      <div className="carrusel-container">
        <div className="carrusel-loading">
          <div className="loading-spinner"></div>
          <p>Cargando imágenes...</p>
        </div>
      </div>
    );
  }

  const imagenMostrar = imagenes[imagenActual] || imagenFallback;

  return (
    <div className="carrusel-container">
      <div className="carrusel-imagen-wrapper">
        <img
          src={imagenMostrar.url}
          alt={imagenMostrar.alt}
          className="carrusel-imagen"
          onError={(e) => {
            // Si hay error al cargar la imagen, usar SVG fallback
            console.warn('Error cargando imagen, usando fallback SVG');
            e.target.src = svgFallback;
            setError(true);
          }}
        />
        
        {/* Overlay con información */}
        <div className="carrusel-overlay">
          <h3 className="carrusel-titulo">{imagenMostrar.titulo}</h3>
          {error && (
            <p className="carrusel-error-msg">
              <span className="error-icon">⚠️</span>
              Modo offline - Usando imagen generada
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarruselImagenes;