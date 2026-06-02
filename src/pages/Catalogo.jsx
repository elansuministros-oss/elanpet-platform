import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { formatoC$ } from '../lib/calculos';

export default function Catalogo() {
  const { productos, resumen, banners } = useApp();
  const bannerCatalogo = banners.find(b => b.ubicacion === 'catalogo' && b.activo);
  const cats = ['Todos', ...new Set(productos.map(p => p.categoria))];
  const [cat, setCat] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const lista = useMemo(() => {
    return productos.filter((p) => {
      const coincideCategoria = cat === 'Todos' || p.categoria === cat;
      const texto = `${p.nombre} ${p.descripcion} ${p.medidas}`.toLowerCase();
      const coincideBusqueda = texto.includes(busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
  }, [productos, cat, busqueda]);

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <div>
          <span className="badge">ELAN PET · Catálogo V1</span>
          <h1>Catálogo de muebles para mascotas</h1>
          <p>Casas, camas, comederos, escaleras, organizadores y torres para gatos.</p>
        </div>
        <aside className="cart-summary-mini">
          <b>Carrito actual</b>
          <span>{resumen.cantidad} producto(s)</span>
          <strong>{formatoC$(resumen.total)}</strong>
        </aside>
      </section>

      <section className="catalog-tools">
        <div className="search-box"><Search size={18} /><input placeholder="Buscar producto, medida o categoría..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></div>
        <div className="filter-label"><SlidersHorizontal size={18} /> Filtrar por categoría</div>
      </section>

      <div className="chips">
        {cats.map(c => <button key={c} className={cat === c ? 'active' : ''} onClick={() => setCat(c)}>{c}</button>)}
      </div>

      {bannerCatalogo && (
        <section className="ad-banner catalog-ad">
          <div><b>{bannerCatalogo.titulo}</b><span>{bannerCatalogo.subtitulo}</span></div>
        </section>
      )}

      <div className="product-grid">
        {lista.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </main>
  );
}
