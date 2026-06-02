import React from 'react';
import { PlayCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Trabajos() {
  const { trabajos } = useApp();
  return (
    <main>
      <section className="catalog-hero">
        <div><span className="badge">Trabajos entregados</span><h1>Productos reales fabricados y entregados</h1><p>Galería para mostrar fotos y videos de productos terminados. Esta sección genera confianza antes de comprar.</p></div>
        <aside className="cart-summary-mini"><b>Galería</b><span>Fotos, videos y muestras reales.</span></aside>
      </section>
      <section className="work-grid">
        {trabajos.filter(t => t.activo).map((t) => (
          <article className="work-card" key={t.id}>
            <img src={t.imagen} alt={t.titulo} />
            <div><small>{t.tipo === 'Video' ? <><PlayCircle size={14} /> Video</> : t.tipo}</small><b>{t.titulo}</b><p>{t.descripcion}</p></div>
          </article>
        ))}
      </section>
    </main>
  );
}
