import React, { useState } from 'react';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login({ setPage, destino }) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
          />

          {error && <small className="error-text">{error}</small>}

          <button type="submit">
            <LockKeyhole size={18} /> Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
