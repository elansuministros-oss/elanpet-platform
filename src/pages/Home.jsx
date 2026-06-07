import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, PackageCheck, QrCode, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categoriasHome } from '../data/productos';

export default function Home({ setPage }) {
  const { configuracion, banners, trabajos } = useApp();
  const slides = banners.filter((b) => b.ubicacion === 'slider-home' && b.activo);
  const promos = banners.filter((b) => b.ubicacion === 'home' && b.activo).slice(0, 2);
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = useMemo(() => slides[slideIndex % Math.max(slides.length, 1)], [slides, slideIndex]);

  const nombreSitio = configuracion.nombreSitio || 'PET.ELANKAV.COM';
  const tituloHero = configuracion.textoHero || 'Tu mascota merece más';
  const descripcionHero =
    configuracion.descripcionHero ||
    'Todo para tu mascota en un solo lugar. Compra productos funcionales, resistentes y listos para mejorar la vida de perros y gatos.';
  const imagenHero = slide?.imagen || '/productos/producto-04.jpg';

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setSlideIndex((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <main className="home-page">
      {slide && (
        <section className="main-slider" onClick={() => setPage(slide.link || 'catalogo')}>
          <div className="slider-copy">
            <span className="badge">{nombreSitio}</span>
            <h1>{slide.titulo}</h1>
            <p>{slide.subtitulo}</p>
            <button>
              Ver catálogo <ArrowRight size={17} />
            </button>
          </div>
          <div className="slider-image">
            <img src={slide.imagen || '/productos/producto-04.jpg'} alt={slide.titulo} />
          </div>
          <div className="slider-dots">
            {slides.map((s, i) => (
              <span key={s.id} className={i === slideIndex ? 'active' : ''} />
            ))}
          </div>
        </section>
      )}

      <section className="elanpet-hero">
        <div className="elanpet-hero-copy">
          <span className="badge">{nombreSitio}</span>
          <h1>{tituloHero}</h1>
          <p>{descripcionHero}</p>

          <div className="hero-actions">
            <button onClick={() => setPage('catalogo')}>
              Ver catálogo <ArrowRight size={17} />
            </button>
            <button className="btn-outline" onClick={() => setPage('contacto')}>
              Pedir por WhatsApp
            </button>
          </div>

          <div className="trust-row elanpet-trust-row">
            <span>
              <BadgeCheck size={17} /> Productos funcionales
            </span>
            <span>
              <Truck size={17} /> Entrega coordinada
            </span>
            <span>
              <PackageCheck size={17} /> Seguimiento de pedido
            </span>
          </div>
        </div>

        <div className="elanpet-hero-media">
          <img src={imagenHero} alt="ELANPET productos para mascotas" />
          <div className="elanpet-hero-card">
            <b>Compra fácil</b>
            <span>Productos para mascotas con atención personalizada.</span>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-title">
          <span>Catálogo</span>
          <h2>Productos principales</h2>
        </div>
        <div className="category-grid">
          {categoriasHome.map((cat) => (
            <button className="category-card" key={cat.nombre} onClick={() => setPage('catalogo')}>
              <span>{cat.icono}</span>
              <b>{cat.nombre}</b>
            </button>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-title">
          <span>Prueba real</span>
          <h2>Trabajos entregados</h2>
        </div>
        <div className="work-grid home-work">
          {trabajos
            .filter((t) => t.activo)
            .slice(0, 3)
            .map((t) => (
              <article className="work-card" key={t.id}>
                <img src={t.imagen} alt={t.titulo} />
                <div>
                  <small>{t.tipo}</small>
                  <b>{t.titulo}</b>
                  <p>{t.descripcion}</p>
                </div>
              </article>
            ))}
        </div>
        <button className="btn-more" onClick={() => setPage('trabajos')}>
          Ver más trabajos <ArrowRight size={17} />
        </button>
      </section>

      {promos.length > 0 && (
        <section className="section-block">
          <div className="section-title">
            <span>Campañas</span>
            <h2>Promociones destacadas</h2>
          </div>
          <div className="promo-grid">
            {promos.map((b) => (
              <article className="promo-card" key={b.id} onClick={() => setPage(b.link || 'catalogo')}>
                <b>{b.titulo}</b>
                <p>{b.subtitulo}</p>
                <ArrowRight />
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="steps-grid">
        <article>
          <QrCode />
          <b>1. Escanea QR</b>
          <p>El cliente entra desde el código de su veterinaria.</p>
        </article>
        <article>
          <ArrowRight />
          <b>2. Ver catálogo</b>
          <p>Selecciona productos y cantidades.</p>
        </article>
        <article>
          <PackageCheck />
          <b>3. Confirmar pedido</b>
          <p>El pedido queda listo para seguimiento.</p>
        </article>
        <article>
          <BadgeCheck />
          <b>4. Compra segura</b>
          <p>Datos organizados por cliente, producto y origen.</p>
        </article>
      </section>
    </main>
  );
}
