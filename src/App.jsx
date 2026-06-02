import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import VeterinariaPanel from './pages/VeterinariaPanel';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Contacto from './pages/Contacto';
import Trabajos from './pages/Trabajos';
import LandingVeterinaria from './pages/LandingVeterinaria';
import Seguimiento from './pages/Seguimiento';
import { useApp } from './context/AppContext';
import './styles/global.css';

export default function App() {
  const [page, setPage] = useState('home');
  const { usuario, configuracion } = useApp();
  useEffect(() => {
    document.documentElement.style.setProperty('--azul', configuracion.colorPrincipal || '#1E5AA8');
    document.documentElement.style.setProperty('--teal', configuracion.colorSecundario || '#058B8C');
  }, [configuracion]);
  const ir = (destino) => setPage(destino);
  return <>
    <Header page={page} setPage={ir} />
    {page === 'home' && <Home setPage={ir} />}
    {page === 'catalogo' && <Catalogo />}
    {page === 'trabajos' && <Trabajos />}
    {page === 'carrito' && <Carrito />}
    {page === 'contacto' && <Contacto />}
    {page === 'seguimiento' && <Seguimiento />}
    {page === 'login' && <Login setPage={ir} />}
    {page === 'landing-vet' && <LandingVeterinaria setPage={ir} />}
    {page === 'vet' && (usuario?.rol === 'veterinaria' ? <VeterinariaPanel /> : <Login setPage={ir} destino="vet" />)}
    {page === 'admin' && (usuario?.rol === 'admin' ? <AdminPanel /> : <Login setPage={ir} destino="admin" />)}
  </>;
}
