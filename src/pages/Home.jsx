import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, PackageCheck, QrCode, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categoriasHome, productosIniciales } from '../data/productos';
import { formatoC$ } from '../lib/calculos';

export default function Home({ setPage }) {
  const { configuracion, banners, trabajos } = useApp();
  const destacados = productosIniciales.filter(p => ['casa-premium-terraza', 'comedero-doble', 'torre-gatos'].includes(p.id));
  const slides = banners.filter(b => b.ubicacion === 'slider-home' && b.activo);
  const promos = banners.filter(b => b.ubicacion === 'home' && b.activo).slice(0, 2);
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = useMemo(() => slides[slideIndex % Math.max(slides.length, 1)], [slides, slideIndex]);

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
            <span className="badge">{configuracion.nombreSitio}</span>
            <h1>{slide.titulo}</h1>
            <p>{slide.subtitulo}</p>
            <button>Ver catálogo <ArrowRight size={17} /></button>
          </div>
          <div className="slider-image"><img src={slide.imagen || '/productos/producto-04.jpg'} alt={slide.titulo} /></div>
          <div className="slider-dots">{slides.map((s, i) => <span key={s.id} className={i === slideIndex ? 'active' : ''} />)}</div>
        </section>
      )}

      <section className="hero-full compact-hero">
        <div className="hero-copy">
          <span className="badge">{configuracion.nombreSitio}</span>
          <h1>{configuracion.textoHero}</h1>
          <p>{configuracion.descripcionHero}</p>
          <div className="hero-actions">
            <button onClick={() => setPage('catalogo')}>Ver catálogo <ArrowRight size={17} /></button>
            <button className="btn-outline" onClick={() => setPage('contacto')}>Consultar</button>
          </div>
          <div className="trust-row"><span><BadgeCheck size={17} /> Productos funcionales</span><span><Truck size={17} /> Pedido por WhatsApp</span></div>
        </div>
        <div className="hero-showcase">
          {destacados.map((p) => <article key={p.id} className="mini-product"><img src={p.imagen} alt={p.nombre} /><div><b>{p.nombre}</b><span>{formatoC$(p.precio)}</span></div></article>)}
        </div>
      </section>

      <section className="section-block"><div className="section-title"><span>Catálogo</span><h2>Productos principales</h2></div><div className="category-grid">{categoriasHome.map((cat) => <button className="category-card" key={cat.nombre} onClick={() => setPage('catalogo')}><span>{cat.icono}</span><b>{cat.nombre}</b></button>)}</div></section>

      <section className="section-block"><div className="section-title"><span>Prueba real</span><h2>Trabajos entregados</h2></div><div className="work-grid home-work">{trabajos.filter(t => t.activo).slice(0, 3).map((t) => <article className="work-card" key={t.id}><img src={t.imagen} alt={t.titulo} /><div><small>{t.tipo}</small><b>{t.titulo}</b><p>{t.descripcion}</p></div></article>)}</div><button className="btn-more" onClick={() => setPage('trabajos')}>Ver más trabajos <ArrowRight size={17} /></button></section>

      {promos.length > 0 && <section className="section-block"><div className="section-title"><span>Campañas</span><h2>Promociones destacadas</h2></div><div className="promo-grid">{promos.map((b) => <article className="promo-card" key={b.id} onClick={() => setPage(b.link || 'catalogo')}><b>{b.titulo}</b><p>{b.subtitulo}</p><ArrowRight /></article>)}</div></section>}

      <section className="steps-grid"><article><QrCode /><b>1. Escanea QR</b><p>El cliente entra desde el código de su veterinaria.</p></article><article><ArrowRight /><b>2. Ver catálogo</b><p>Selecciona productos y cantidades.</p></article><article><PackageCheck /><b>3. Confirmar pedido</b><p>El pedido queda listo para seguimiento.</p></article><article><BadgeCheck /><b>4. Compra segura</b><p>Datos organizados por cliente, producto y origen.</p></article></section>
    </main>
  );
}
