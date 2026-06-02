import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { estadosProduccion, etiquetasEstado, useApp } from '../context/AppContext';
import { formatoC$ } from '../lib/calculos';

export default function Seguimiento() {
  const { buscarPedidoSeguimiento } = useApp();
  const [form, setForm] = useState({ codigo: '', whatsapp: '' });
  const [pedido, setPedido] = useState(null);
  const [buscado, setBuscado] = useState(false);

  function consultar(e) {
    e.preventDefault();
    const encontrado = buscarPedidoSeguimiento(form);
    setPedido(encontrado || null);
    setBuscado(true);
  }

  const indiceActual = pedido ? estadosProduccion.indexOf(pedido.estadoProduccion) : -1;

  return (
    <main className="tracking-page">
      <section className="panel tracking-card">
        <span className="badge">Seguimiento de pedido</span>
        <h1>Consulta cómo va tu producto</h1>
        <p className="note">Ingresa el código que ELANPET te envió por WhatsApp después de confirmar tu anticipo.</p>
        <form className="form-grid" onSubmit={consultar}>
          <input placeholder="Código. Ej: EP-2026-000123" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
          <input placeholder="WhatsApp usado en el pedido" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          <button><Search size={18} /> Consultar pedido</button>
        </form>
      </section>

      {buscado && !pedido && <section className="panel"><p>No encontramos un pedido con esos datos. Revisá el código o el número de WhatsApp.</p></section>}

      {pedido && <section className="panel">
        <h2>{pedido.codigoSeguimiento}</h2>
        <div className="tracking-summary">
          <div><b>Cliente</b><span>{pedido.cliente?.nombre}</span></div>
          <div><b>Total</b><span>{formatoC$(pedido.resumen?.total || 0)}</span></div>
          <div><b>Anticipo recibido</b><span>{formatoC$(pedido.anticipoRecibido || 0)}</span></div>
          <div><b>Saldo pendiente</b><span>{formatoC$(pedido.saldoPendiente || 0)}</span></div>
        </div>
        <h3>Estado actual: {etiquetasEstado[pedido.estadoProduccion] || pedido.estadoProduccion}</h3>
        <div className="timeline">
          {estadosProduccion.map((estado, idx) => (
            <div key={estado} className={idx <= indiceActual ? 'timeline-step done' : 'timeline-step'}>
              <span>{idx < indiceActual ? '✓' : idx === indiceActual ? '●' : '○'}</span>
              <b>{etiquetasEstado[estado]}</b>
            </div>
          ))}
        </div>
      </section>}
    </main>
  );
}
