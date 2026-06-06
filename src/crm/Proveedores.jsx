import React from 'react';
import { useCore } from '../core/context/CoreContext';

export default function Proveedores() {
  const { contactos } = useCore();

  const proveedores = contactos.filter((contacto) => contacto.rol === 'Proveedor');

  return (
    <div>
      <h2>Proveedores</h2>
      <p>Contactos clasificados como proveedores dentro del CRM Central.</p>

      {proveedores.length === 0 ? (
        <p>No hay proveedores registrados.</p>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {proveedores.map((proveedor) => (
            <div key={proveedor.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
              <strong>{proveedor.nombre}</strong>
              <p>{proveedor.cargo || 'Sin cargo'}</p>
              <small>
                WhatsApp: {proveedor.whatsapp || 'N/A'} | Correo: {proveedor.correo || 'N/A'}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}