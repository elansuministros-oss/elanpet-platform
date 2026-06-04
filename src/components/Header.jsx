import React from 'react';
import { PawPrint, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header({ page, setPage }) {
  const { resumen, usuario, logout, configuracion } = useApp();

  const go = (p) => {
    setPage(p);
  };

  const salir = () => {
    logout();
    go('home');
  };

  return (
    <header className="desktop-header">
      <div className="brand" onClick={() => go('home')}>
        <span className="brand-mark">
          <PawPrint size={20} />
        </span>
        <strong>{configuracion.logoTexto || 'ELANPET.COM'}</strong>
      </div>

      <nav className="desktop-nav">
        <button className={page === 'home' ? 'nav-active' : ''} onClick={() => go('home')}>Inicio</button>
        <button className={page === 'catalogo' ? 'nav-active' : ''} onClick={() => go('catalogo')}>Catálogo</button>
        <button className={page === 'trabajos' ? 'nav-active' : ''} onClick={() => go('trabajos')}>Trabajos</button>
        <button className={page === 'seguimiento' ? 'nav-active' : ''} onClick={() => go('seguimiento')}>Seguimiento</button>
        <button className={page === 'contacto' ? 'nav-active' : ''} onClick={() => go('contacto')}>Contacto</button>

        {usuario?.rol === 'admin' && (
          <button className={page === 'admin' ? 'nav-active' : ''} onClick={() => go('admin')}>
            Panel Admin
          </button>
        )}

        {usuario?.rol === 'veterinaria' && (
          <button className={page === 'vet' ? 'nav-active' : ''} onClick={() => go('vet')}>
            Mi Panel
          </button>
        )}

        {usuario ? (
          <button onClick={salir}>Salir</button>
        ) : (
          <button className={page === 'login' ? 'nav-active' : ''} onClick={() => go('login')}>
            Portal
          </button>
        )}

        <button className="cart" onClick={() => go('carrito')}>
          <ShoppingCart size={18} /> {resumen.cantidad}
        </button>
      </nav>
    </header>
  );
}