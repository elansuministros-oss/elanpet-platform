import React from 'react';
import { ArrowRight, BadgeCheck, HeartHandshake, PackageCheck, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categoriasHome } from '../data/productos';

export default function Home({ setPage }) {
  const { configuracion, trabajos } = useApp();

  const nombreSitio = configuracion.nombreSitio || 'PET.ELANKAV.COM';

  return (
    <main className="home-page">

      <section className="elanpet-hero">
        <div className="elanpet-hero-copy">
          <span className="badge">🐾 TODO PARA TU MASCOTA</span>

          <h1>Tu mascota merece más</h1>

          <p>
            Muebles funcionales, resistentes y fabricados para el bienestar
            de perros y gatos.
            <br /><br />
            <strong>Compra fácil desde tu celular.</strong>
          </p>

          <div className="trust-row elanpet-trust-row">
            <span><BadgeCheck size={18}/> Productos de calidad</span>
            <span><HeartHandshake size={18}/> Fabricados con amor</span>
            <span><PackageCheck size={18}/> Diseñados para su bienestar</span>
            <span><Truck size={18}/> Entrega rápida y segura</span>
          </div>

          <div className="hero-actions">
            <button onClick={() => setPage('catalogo')}>
              Ver catálogo <ArrowRight size={18} />
            </button>

            <button
              className="btn-outline"
              onClick={() => setPage('contacto')}
            >
              Pedir por WhatsApp
            </button>
          </div>
        </div>

        <div className="elanpet-hero-media">
          <img
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1600&auto=format&fit=crop"
            alt="ELANPET"
          />

          <div className="elanpet-hero-card">
            <b>{nombreSitio}</b>
            <span>
              Todo para tu mascota en un solo lugar.
            </span>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-title">
          <span>CATÁLOGO</span>
          <h2>Productos principales</h2>
        </div>

        <div className="category-grid">
          {categoriasHome.map((cat) => (
            <button
              key={cat.nombre}
              className="category-card"
              onClick={() => setPage('catalogo')}
            >
              <span>{cat.icono}</span>
              <b>{cat.nombre}</b>
            </button>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-title">
          <span>PRUEBA REAL</span>
          <h2>Trabajos entregados</h2>
        </div>

        <div className="work-grid">
          {trabajos.slice(0, 6).map((trabajo) => (
            <article key={trabajo.id} className="work-card">
              <img src={trabajo.imagen} alt={trabajo.nombre} />
              <div>
                <small>Foto</small>
                <b>{trabajo.nombre}</b>
                <p>{trabajo.descripcion}</p>
              </div>
            </article>
          ))}
        </div>

        <button
          className="btn-more"
          onClick={() => setPage('trabajos')}
        >
          Ver más trabajos
        </button>
      </section>

    </main>
  );
}
