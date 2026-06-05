import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { etiquetasEstado, useApp } from '../context/AppContext';
import { formatoC$ } from '../lib/calculos';

export default function VeterinariaPanel() {
  const { veterinaria, pedidos, usuario } = useApp();

  if (!usuario || usuario.rol !== 'veterinaria') {
    return (
      <main>
        <section className="panel">
          <h1>Acceso restringido</h1>
          <p>Este panel es solo para usuarios de veterinaria.</p>
        </section>
      </main>
    );
  }

  if (!veterinaria?.id) {
    return (
      <main>
        <section className="panel">
          <h1>Veterinaria no asignada</h1>
          <p>Este usuario no tiene una veterinaria activa asignada.</p>
        </section>
      </main>
    );
  }

  const url = `https://elanpet.com/v/${veterinaria.codigo}`;
  const misPedidos = pedidos.filter((p) => p.veterinaria?.id === veterinaria.id);
  const entregados = misPedidos.filter((p) => p.estado === 'entregado');
  const comisionesPendientes = entregados.filter(
    (p) => p.comisionEstado === 'pendiente'
  );
  const comisionesPagadas = entregados.filter(
    (p) => p.comisionEstado === 'pagada'
  );
  const totalVendido = entregados.reduce(
    (a, p) => a + (p.resumen?.total || 0),
    0
  );
  const totalComisionPendiente = comisionesPendientes.reduce(
    (a, p) => a + (p.resumen?.comision || 0),
    0
  );
  const totalComisionPagada = comisionesPagadas.reduce(
    (a, p) => a + (p.resumen?.comision || 0),
    0
  );

  return (
    <main>
      <h1>Mi Panel Veterinaria</h1>

      <div className="dashboard">
        <section className="panel">
          <h2>{veterinaria.nombre}</h2>
          <p>
            Código: <b>{veterinaria.codigo}</b>
          </p>
          <QRCodeCanvas value={url} size={180} />
          <p>{url}</p>
        </section>

        <section className="panel">
          <h2>Mis resultados</h2>
          <div className="stats">
            <b>{misPedidos.length}</b>
            <span>Pedidos generados</span>

            <b>{entregados.length}</b>
            <span>Ventas entregadas</span>

            <b>{formatoC$(totalVendido)}</b>
            <span>Total vendido entregado</span>

            <b>{formatoC$(totalComisionPendiente)}</b>
            <span>Comisión pendiente</span>

            <b>{formatoC$(totalComisionPagada)}</b>
            <span>Comisión pagada</span>
          </div>
          <p className="note">
            La comisión se muestra como pendiente únicamente cuando el pedido fue
            entregado.
          </p>
        </section>
      </div>

      <section className="panel section-block">
        <h2>Pedidos referidos</h2>

        {misPedidos.length === 0 ? (
          <p>No hay pedidos generados por este QR todavía.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Comisión</th>
              </tr>
            </thead>
            <tbody>
              {misPedidos.map((p) => (
                <tr key={p.id}>
                  <td>{p.codigoSeguimiento || p.numero}</td>
                  <td>{p.cliente?.nombre}</td>
                  <td>{formatoC$(p.resumen?.total || 0)}</td>
                  <td>
                    {etiquetasEstado[p.estadoProduccion] ||
                      etiquetasEstado[p.estado] ||
                      p.estado}
                  </td>
                  <td>
                    {p.comisionEstado === 'pendiente' ||
                    p.comisionEstado === 'pagada'
                      ? formatoC$(p.resumen?.comision || 0)
                      : 'No generada'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
