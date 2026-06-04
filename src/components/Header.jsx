import React, { useState } from 'react';
import { Menu, PawPrint, ShoppingCart, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header({ page, setPage }) {
  const { resumen, usuario, logout, configuracion } = useApp();
  const [open, setOpen] = useState(false);
  const go = (p) => { setPage(p); setOpen(false); };
  return (
    <header className="header">
      <div className="brand" onClick={() => go('home')}><span className="brand-mark"><PawPrint size={20} /></span><strong>{configuracion.logoTexto || 'ELANPET.COM'}</strong></div>
<button
  className="menu-toggle"
  onClick={() => setOpen(!open)}
  aria-label="Abrir menú"
>
  {open ? <X size={24} /> : <Menu size={24} />}
  <span>{open ? 'Cerrar' : 'Menú'}</span>
</button>
      <nav className={open ? 'nav-open' : ''}>
        <button className={page === 'home' ? 'nav-active' : ''} onClick={() => go('home')}>Inicio</button>
        <button className={page === 'catalogo' ? 'nav-active' : ''} onClick={() => go('catalogo')}>Catálogo</button>
        <button className={page === 'trabajos' ? 'nav-active' : ''} onClick={() => go('trabajos')}>Trabajos</button>
        <button className={page === 'seguimiento' ? 'nav-active' : ''} onClick={() => go('seguimiento')}>Seguimiento</button>
        <button className={page === 'contacto' ? 'nav-active' : ''} onClick={() => go('contacto')}>Contacto</button>
        {usuario?.rol === 'admin' && <button className={page === 'admin' ? 'nav-active' : ''} onClick={() => go('admin')}>Panel Admin</button>}
        {usuario?.rol === 'veterinaria' && <button className={page === 'vet' ? 'nav-active' : ''} onClick={() => go('vet')}>Mi Panel</button>}
        {usuario ? <button onClick={() => { logout(); go('home'); }}>Salir</button> : <button className={page === 'login' ? 'nav-active' : ''} onClick={() => go('login')}>Portal</button>}
        <button className="cart" onClick={() => go('carrito')}><ShoppingCart size={18} /> {resumen.cantidad}</button>
      </nav>
    </header>
  );
}
