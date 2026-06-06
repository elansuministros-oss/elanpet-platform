import React, { useMemo, useState } from 'react';
import { useCore } from '../core/context/CoreContext';

export default function Cotizaciones() {
  const {
    cotizaciones,
    crearCotizacion,
    actualizarCotizacion,
    eliminarCotizacion,
  } = useCore();

  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    codigo: '',
    cliente: '',
    empresa: '',
    contacto: '',
    descripcion: '',
    categoria: 'Rotulación',
    moneda: 'C$',
    subtotal: '',
    iva: '15',
    descuento: '',
    total: '',
    estado: 'Borrador',
    fecha: new Date().toISOString().slice(0, 10),
    vencimiento: '',
    observaciones: '',
  });

  const cambiar = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const nuevo = { ...prev, [name]: value };

      const subtotal = Number(nuevo.subtotal) || 0;
      const iva = Number(nuevo.iva) || 0;
      const descuento = Number(nuevo.descuento) || 0;
      const totalCalculado = subtotal + subtotal * (iva / 100) - descuento;

      return {
        ...nuevo,
        total: totalCalculado > 0 ? totalCalculado.toFixed(2) : '',
      };
    });
  };

  const limpiar = () => {
    setForm({
      codigo: '',
      cliente: '',
      empresa: '',
      contacto: '',
      descripcion: '',
      categoria: 'Rotulación',
      moneda: 'C$',
      subtotal: '',
      iva: '15',
      descuento: '',
      total: '',
      estado: 'Borrador',
      fecha: new Date().toISOString().slice(0, 10),
      vencimiento: '',
      observaciones: '',
    });

    setEditandoId(null);
  };

  const guardar = (e) => {
    e.preventDefault();

    if (!form.cliente.trim() && !form.empresa.trim()) return;

    const datos = {
      codigo: form.codigo.trim() || `COT-${Date.now()}`,
      cliente: form.cliente.trim(),
      empresa: form.empresa.trim(),
      contacto: form.contacto.trim(),
      descripcion: form.descripcion.trim(),
      categoria: form.categoria,
      moneda: form.moneda,
      subtotal: Number(form.subtotal) || 0,
      iva: Number(form.iva) || 0,
      descuento: Number(form.descuento) || 0,
      total: Number(form.total) || 0,
      estado: form.estado,
      fecha: form.fecha,
      vencimiento: form.vencimiento,
      observaciones: form.observaciones.trim(),
    };

    if (editandoId) {
      actualizarCotizacion(editandoId, datos);
    } else {
      crearCotizacion(datos);
    }

    limpiar();
  };

  const editar = (item) => {
    setEditandoId(item.id);

    setForm({
      codigo: item.codigo || '',
      cliente: item.cliente || '',
      empresa: item.empresa || '',
      contacto: item.contacto || '',
      descripcion: item.descripcion || '',
      categoria: item.categoria || 'Rotulación',
      moneda: item.moneda || 'C$',
      subtotal: String(item.subtotal || ''),
      iva: String(item.iva || '15'),
      descuento: String(item.descuento || ''),
      total: String(item.total || ''),
      estado: item.estado || 'Borrador',
      fecha: item.fecha || new Date().toISOString().slice(0, 10),
      vencimiento: item.vencimiento || '',
      observaciones: item.observaciones || '',
    });
  };

  const eliminar = (id) => {
    eliminarCotizacion(id);
    if (editandoId === id) limpiar();
  };

  const resumen = useMemo(() => {
    const totalGeneral = cotizaciones.reduce(
      (acc, item) => acc + (Number(item.total) || 0),
      0
    );

    const aprobadas = cotizaciones.filter(
      (item) => item.estado === 'Aprobada'
    ).length;

    const pendientes = cotizaciones.filter(
      (item) => item.estado === 'Enviada' || item.estado === 'En revisión'
    ).length;

    return {
      cantidad: cotizaciones.length,
      totalGeneral,
      aprobadas,
      pendientes,
    };
  }, [cotizaciones]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Cotizaciones</h2>
          <p>Registro y control de cotizaciones del CRM Central ELANKAV.</p>
        </div>
      </div>

      <div className="crm-resumen">
        <div className="crm-card">
          <span>Total cotizaciones</span>
          <strong>{resumen.cantidad}</strong>
        </div>

        <div className="crm-card">
          <span>Monto cotizado</span>
          <strong>C$ {resumen.totalGeneral.toFixed(2)}</strong>
        </div>

        <div className="crm-card">
          <span>Aprobadas</span>
          <strong>{resumen.aprobadas}</strong>
        </div>

        <div className="crm-card">
          <span>Pendientes</span>
          <strong>{resumen.pendientes}</strong>
        </div>
      </div>

      <form className="crm-form" onSubmit={guardar}>
        <h3>{editandoId ? 'Editar cotización' : 'Nueva cotización'}</h3>

        <div className="form-grid">
          <label>
            Código
            <input
              name="codigo"
              value={form.codigo}
              onChange={cambiar}
              placeholder="COT-0001"
            />
          </label>

          <label>
            Cliente
            <input
              name="cliente"
              value={form.cliente}
              onChange={cambiar}
              placeholder="Nombre del cliente"
            />
          </label>

          <label>
            Empresa
            <input
              name="empresa"
              value={form.empresa}
              onChange={cambiar}
              placeholder="Empresa relacionada"
            />
          </label>

          <label>
            Contacto
            <input
              name="contacto"
              value={form.contacto}
              onChange={cambiar}
              placeholder="Persona de contacto"
            />
          </label>

          <label>
            Categoría
            <select name="categoria" value={form.categoria} onChange={cambiar}>
              <option>Rotulación</option>
              <option>Impresión digital</option>
              <option>Arquitectura comercial</option>
              <option>ELANPET</option>
              <option>ELAN Suministros</option>
              <option>ELANKAV Solar</option>
              <option>ABADON</option>
              <option>Proyecto especial</option>
            </select>
          </label>

          <label>
            Moneda
            <select name="moneda" value={form.moneda} onChange={cambiar}>
              <option>C$</option>
              <option>$</option>
            </select>
          </label>

          <label>
            Subtotal
            <input
              type="number"
              name="subtotal"
              value={form.subtotal}
              onChange={cambiar}
              placeholder="0.00"
            />
          </label>

          <label>
            IVA %
            <input
              type="number"
              name="iva"
              value={form.iva}
              onChange={cambiar}
              placeholder="15"
            />
          </label>

          <label>
            Descuento
            <input
              type="number"
              name="descuento"
              value={form.descuento}
              onChange={cambiar}
              placeholder="0.00"
            />
          </label>

          <label>
            Total
            <input
              type="number"
              name="total"
              value={form.total}
              onChange={cambiar}
              placeholder="0.00"
            />
          </label>

          <label>
            Fecha
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={cambiar}
            />
          </label>

          <label>
            Vencimiento
            <input
              type="date"
              name="vencimiento"
              value={form.vencimiento}
              onChange={cambiar}
            />
          </label>

          <label>
            Estado
            <select name="estado" value={form.estado} onChange={cambiar}>
              <option>Borrador</option>
              <option>Enviada</option>
              <option>En revisión</option>
              <option>Aprobada</option>
              <option>Rechazada</option>
              <option>Convertida a pedido</option>
            </select>
          </label>
        </div>

        <label>
          Descripción del trabajo
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={cambiar}
            placeholder="Detalle técnico, medidas, materiales, instalación o alcance del proyecto"
            rows="4"
          />
        </label>

        <label>
          Observaciones
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={cambiar}
            placeholder="Condiciones de pago, tiempos de entrega, notas internas"
            rows="3"
          />
        </label>

        <div className="form-actions">
          <button type="submit">
            {editandoId ? 'Actualizar cotización' : 'Guardar cotización'}
          </button>

          {editandoId && (
            <button type="button" onClick={limpiar} className="btn-secundario">
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <div className="crm-table-wrap">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente / Empresa</th>
              <th>Categoría</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cotizaciones.length === 0 ? (
              <tr>
                <td colSpan="7">No hay cotizaciones registradas.</td>
              </tr>
            ) : (
              cotizaciones.map((item) => (
                <tr key={item.id}>
                  <td>{item.codigo}</td>
                  <td>
                    <strong>{item.cliente || item.empresa}</strong>
                    <br />
                    <small>{item.empresa}</small>
                  </td>
                  <td>{item.categoria}</td>
                  <td>
                    {item.moneda} {Number(item.total || 0).toFixed(2)}
                  </td>
                  <td>{item.fecha}</td>
                  <td>{item.estado}</td>
                  <td>
                    <button type="button" onClick={() => editar(item)}>
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => eliminar(item.id)}
                      className="btn-danger"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}