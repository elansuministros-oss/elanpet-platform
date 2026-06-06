import React from 'react';
import { useCore } from '../core/context/CoreContext';

export default function DashboardCRM() {
  const {
    empresas,
    contactos,
    cotizaciones,
    pedidos,
    ordenesTrabajo,
    produccion,
    cobros,
    comisiones,
    inventario,
    materiales,
  } = useCore();

  const cards = [
    { titulo: 'Empresas', valor: empresas.length, icono: '🏢' },
    { titulo: 'Contactos', valor: contactos.length, icono: '👤' },
    { titulo: 'Cotizaciones', valor: cotizaciones.length, icono: '📄' },
    { titulo: 'Pedidos', valor: pedidos.length, icono: '🛒' },
    { titulo: 'Ordenes Trabajo', valor: ordenesTrabajo.length, icono: '🔧' },
    { titulo: 'Producción', valor: produccion.length, icono: '🏭' },
    { titulo: 'Cobros', valor: cobros.length, icono: '💰' },
    { titulo: 'Comisiones', valor: comisiones.length, icono: '💵' },
    { titulo: 'Inventario', valor: inventario.length, icono: '📦' },
    { titulo: 'Materiales', valor: materiales.length, icono: '🧱' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '10px' }}>CRM CENTRAL ELANKAV</h1>

      <p style={{ color: '#666', marginBottom: '25px' }}>Panel Ejecutivo</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
          gap: '15px',
          marginBottom: '30px',
        }}
      >
        {cards.map((card) => (
          <div
            key={card.titulo}
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ fontSize: '32px' }}>{card.icono}</div>

            <div
              style={{
                fontSize: '14px',
                color: '#666',
                marginTop: '10px',
              }}
            >
              {card.titulo}
            </div>

            <div
              style={{
                fontSize: '30px',
                fontWeight: 'bold',
                marginTop: '5px',
              }}
            >
              {card.valor}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          marginBottom: '20px',
        }}
      >
        <h2>Cadena Operativa</h2>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '15px',
          }}
        >
          <span>🏢 Empresa</span>
          <span>→</span>
          <span>👤 Contacto</span>
          <span>→</span>
          <span>📄 Cotización</span>
          <span>→</span>
          <span>🛒 Pedido</span>
          <span>→</span>
          <span>🔧 OT</span>
          <span>→</span>
          <span>🏭 Producción</span>
          <span>→</span>
          <span>💰 Cobro</span>
          <span>→</span>
          <span>💵 Comisión</span>
        </div>
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        }}
      >
        <h2>Resumen General</h2>

        <ul style={{ lineHeight: '2' }}>
          <li>Total Empresas: {empresas.length}</li>
          <li>Total Contactos: {contactos.length}</li>
          <li>Total Cotizaciones: {cotizaciones.length}</li>
          <li>Total Pedidos: {pedidos.length}</li>
          <li>Total OT: {ordenesTrabajo.length}</li>
          <li>Total Producción: {produccion.length}</li>
          <li>Total Cobros: {cobros.length}</li>
          <li>Total Comisiones: {comisiones.length}</li>
          <li>Total Inventario: {inventario.length}</li>
          <li>Total Materiales: {materiales.length}</li>
        </ul>
      </div>
    </div>
  );
}
