import React, { useState } from 'react';
import { PawPrint, ShoppingCart, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header({ page, setPage }) {
  const { resumen, usuario, logout, configuracion } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (p) => {
    setPage(p);
    setMenuOpen(false);
  };

  const salir = () => {
    logout();
    go('home');
  };

  return (
    <>
      {/* DESKTOP */}
      <header className="desktop-header">
        <div className="brand" onClick={() => go('home')}>
          <span className="brand-mark">
            <PawPrint size={20} />
          </span>
          <strong>{configuracion.logoTexto || 'ELANPET.COM'}</strong>
        </div>

        <nav className="desktop-nav">
          <button onClick={() => go('home')}>Inicio</button>
          <button onClick={() => go('catalogo')}>Catálogo</button>
          <button onClick={() => go('trabajos')}>Trabajos</button>
          <button onClick={() => go('seguimiento')}>Seguimiento</button>
          <button onClick={() => go('contacto')}>Contacto</button>

          {usuario?.rol === 'admin' && (
            <button onClick={() => go('admin')}>Admin</button>
          )}

          {usuario?.rol === 'veterinaria' && (
            <button onClick={() => go('vet')}>Mi Panel</button>
          )}

          {usuario ? (
            <button onClick={salir}>Salir</button>
          ) : (
            <button onClick={() => go('login')}>Portal</button>
          )}

          <button className="cart" onClick={() => go('carrito')}>
            <ShoppingCart size={18} />
            <span>{resumen?.cantidad || 0}</span>
          </button>
        </nav>
      </header>

      {/* MOBILE */}
      <header className="mobile-header">
        <div className="mobile-topbar">
          <div className="brand" onClick={() => go('home')}>
            <span className="brand-mark">
              <PawPrint size={18} />
            </span>
            <strong>{configuracion.logoTexto || 'ELANPET.COM'}</strong>
          </div>

          <div className="mobile-right">
            <button
              className="mobile-cart"
              onClick={() => go('carrito')}
            >
              <ShoppingCart size={18} />
              <span>{resumen?.cantidad || 0}</span>
            </button>

            <button
              className="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="mobile-nav">
            <button onClick={() => go('home')}>Inicio</button>
            <button onClick={() => go('catalogo')}>Catálogo</button>
            <button onClick={() => go('trabajos')}>Trabajos</button>
            <button onClick={() => go('seguimiento')}>Seguimiento</button>
            <button onClick={() => go('contacto')}>Contacto</button>

            {usuario?.rol === 'admin' && (
              <button onClick={() => go('admin')}>
                Panel Admin
              </button>
            )}

            {usuario?.rol === 'veterinaria' && (
              <button onClick={() => go('vet')}>
                Mi Panel
              </button>
            )}

            {usuario ? (
              <button onClick={salir}>Salir</button>
            ) : (
              <button onClick={() => go('login')}>
                Portal
              </button>
            )}
          </nav>
        )}
      </header>
    </>
  );
}