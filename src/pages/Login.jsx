import React, { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login({ setPage, destino }) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');

  const entrar = (e) => {
    e.preventDefault();

    const res = login({ email, password });

    if (!res.ok) {
      return setError('Usuario o contraseña incorrectos.');
    }

    setError('');
    setPage(destino || (res.rol === 'admin' ? 'admin' : 'vet'));
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <span className="badge">
          <ShieldCheck size={15} /> Acceso privado
        </span>

        <h1>Portal ELANPET</h1>
        <p>Este acceso es solo para administrador ELAN y veterinarias afiliadas.</p>

        <form onSubmit={entrar}>
          <label>Usuario o correo</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin, vetdemo o correo"
          />

          <label>Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input
              type={mostrarPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              style={{ paddingRight: '46px' }}
            />

            <button
              type="button"
              onClick={() => setMostrarPassword((prev) => !prev)}
              aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              title={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#555',
              }}
            >
              {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <small className="error-text">{error}</small>}

          <button type="submit">
            <LockKeyhole size={18} /> Entrar
          </button>
        </form>
      </section>
    </main>
  );
}