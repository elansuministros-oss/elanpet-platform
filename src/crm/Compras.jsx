import React, { useMemo, useState } from 'react';
import { useCore } from '../core/context/CoreContext';

const UNIDADES_NEGOCIO = [
  'ELANPET',
  'ELANKAV VISUAL',
  'ELANKAV CENTER',
  'ELANKAV SOLAR',
  'ELAN AI',
];

const ESTADOS_COMPRA = ['Pendiente', 'Parcial', 'Pagada', 'Anulada'];

const formInicial = {
  codigo: '',
  proveedorId: '',
  proveedor: '',
  factura: '',
  fecha: new Date().toISOString().slice(0, 10),
  unidadNegocio: 'ELANKAV VISUAL',
  subtotal: '',
  iva: '',
  total: '',
  estado: 'Pendiente',
  categoria: 'Materiales',
  observaciones: '',
};

const formatoMoneda = (valor) => {
  const numero = Number(valor) || 0;
  return `C$ ${numero.toFixed(2)}`;
};

export default function Compras() {
  const {
    proveedores = [],
    compras = [],
    crearCompra,
    actualizarCompra,
    eliminarCompra,
  } = useCore();

  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formInicial);

  const cambiar = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const nuevo = { ...prev, [name]: value };

      if (name === 'proveedorId') {
        const proveedorSeleccionado = proveedores.find((item) => item.id === value);
        nuevo.proveedor = proveedorSeleccionado?.nombre || '';
      }

      const subtotal = Number(nuevo.subtotal) || 0;
      const iva = Number(nuevo.iva) || 0;

      if (name === 'subtotal' || name === 'iva') {
        nuevo.total = (subtotal + iva).toFixed(2);
      }

      return nuevo;
    });
  };

  const limpiar = () => {
    setForm(formInicial);
    setEditandoId(null);
  };

  const guardar = (e) => {
    e.preventDefault();

    if (!form.proveedor.trim() && !form.proveedorId) return;

    const proveedorSeleccionado = proveedores.find((item) => item.id === form.proveedorId);
    const subtotal = Number(form.subtotal) || 0;
    const iva = Number(form.iva) || 0;
    const total = Number(form.total) || subtotal + iva;

    const datos = {
      ...form,
      id: editandoId || `compra-${Date.now()}`,
      codigo: form.codigo.trim() || `COMPR-${Date.now()}`,
      proveedorId: form.proveedorId,
      proveedor: proveedorSeleccionado?.nombre || form.proveedor.trim(),
      factura: form.factura.trim(),
      fecha: form.fecha || new Date().toISOString().slice(0, 10),
      unidadNegocio: form.unidadNegocio || 'ELANKAV VISUAL',
      subtotal,
      iva,
      total,
      estado: form.estado || 'Pendiente',
      categoria: form.categoria.trim() || 'Materiales',
      observaciones: form.observaciones.trim(),
      actualizado: new Date().toISOString(),
    };

    if (editandoId) {
      actualizarCompra(editandoId, datos);
    } else {
      crearCompra(datos);
    }

    limpiar();
  };

  const editar = (item) => {
    setEditandoId(item.id);

    setForm({
      codigo: item.codigo || '',
      proveedorId: item.proveedorId || '',
      proveedor: item.proveedor || '',
      factura: item.factura || '',
      fecha: item.fecha || new Date().toISOString().slice(0, 10),
      unidadNegocio: item.unidadNegocio || 'ELANKAV VISUAL',
      subtotal: String(item.subtotal || ''),
      iva: String(item.iva || ''),
      total: String(item.total || ''),
      estado: item.estado || 'Pendiente',
      categoria: item.categoria || 'Materiales',
      observaciones: item.observaciones || '',
    });
  };

  const eliminar = (id) => {
    eliminarCompra(id);
    if (editandoId === id) limpiar();
  };

  const resumen = useMemo(() => {
    const totalComprado = compras.reduce(
      (acc, item) => acc + (Number(item.total) || 0),
      0
    );

    const pendientes = compras.filter((item) => item.estado === 'Pendiente').length;
    const parciales = compras.filter((item) => item.estado === 'Parcial').length;
    const pagadas = compras.filter((item) => item.estado === 'Pagada').length;

    return {
      registros: compras.length,
      pendientes,
      parciales,
      pagadas,
      totalComprado,
    };
  }, [compras]);

  const comprasPorUnidad = useMemo(() => {
    return UNIDADES_NEGOCIO.map((unidad) => {
      const registros = compras.filter((item) => item.unidadNegocio === unidad);
      const total = registros.reduce((acc, item) => acc + (Number(item.total) || 0), 0);

      return {
        unidad,
        cantidad: registros.length,
        total,
      };
    });
  }, [compras]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Compras</h2>
          <p>Registro de compras, facturas de proveedores, costos y control inicial de cuentas por pagar.</p>
        </div>
      </div>

      <div className="crm-resumen">
        <div className="crm-card">
          <span>Compras registradas</span>
          <strong>{resumen.registros}</strong>
        </div>

        <div className="crm-card">
          <span>Pendientes</span>
          <strong>{resumen.pendientes}</strong>
        </div>

        <div className="crm-card">
          <span>Parciales</span>
          <strong>{resumen.parciales}</strong>
        </div>

        <div className="crm-card">
          <span>Total comprado</span>
          <strong>{formatoMoneda(resumen.totalComprado)}</strong>
        </div>
      </div>

      <form className="crm-form" onSubmit={guardar}>
        <h3>{editandoId ? 'Editar compra' : 'Nueva compra'}</h3>

        <div className="form-grid">
          <label>
            Código
            <input
              name="codigo"
              value={form.codigo}
              onChange={cambiar}
              placeholder="COMPR-0001"
            />
          </label>

          <label>
            Proveedor registrado
            <select name="proveedorId" value={form.proveedorId} onChange={cambiar}>
              <option value="">Seleccionar proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Proveedor manual
            <input
              name="proveedor"
              value={form.proveedor}
              onChange={cambiar}
              placeholder="Usar si no está registrado"
            />
          </label>

          <label>
            Factura / Referencia
            <input
              name="factura"
              value={form.factura}
              onChange={cambiar}
              placeholder="Número de factura o recibo"
            />
          </label>

          <label>
            Fecha
            <input
              name="fecha"
              type="date"
              value={form.fecha}
              onChange={cambiar}
            />
          </label>

          <label>
            Unidad de negocio
            <select name="unidadNegocio" value={form.unidadNegocio} onChange={cambiar}>
              {UNIDADES_NEGOCIO.map((unidad) => (
                <option key={unidad}>{unidad}</option>
              ))}
            </select>
          </label>

          <label>
            Categoría
            <input
              name="categoria"
              value={form.categoria}
              onChange={cambiar}
              placeholder="Materiales, impresión, ferretería, transporte..."
            />
          </label>

          <label>
            Estado
            <select name="estado" value={form.estado} onChange={cambiar}>
              {ESTADOS_COMPRA.map((estado) => (
                <option key={estado}>{estado}</option>
              ))}
            </select>
          </label>

          <label>
            Subtotal
            <input
              name="subtotal"
              type="number"
              step="0.01"
              min="0"
              value={form.subtotal}
              onChange={cambiar}
              placeholder="0.00"
            />
          </label>

          <label>
            IVA
            <input
              name="iva"
              type="number"
              step="0.01"
              min="0"
              value={form.iva}
              onChange={cambiar}
              placeholder="0.00"
            />
          </label>

          <label>
            Total
            <input
              name="total"
              type="number"
              step="0.01"
              min="0"
              value={form.total}
              onChange={cambiar}
              placeholder="0.00"
            />
          </label>

          <label className="form-full">
            Observaciones
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={cambiar}
              placeholder="Detalle de materiales, condiciones, crédito, vencimiento o notas internas"
              rows="3"
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit">
            {editandoId ? 'Actualizar compra' : 'Guardar compra'}
          </button>

          {editandoId && (
            <button type="button" className="secondary" onClick={limpiar}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <div className="crm-resumen">
        {comprasPorUnidad.map((item) => (
          <div className="crm-card" key={item.unidad}>
            <span>{item.unidad}</span>
            <strong>{formatoMoneda(item.total)}</strong>
            <small>{item.cantidad} compras</small>
          </div>
        ))}
      </div>

      <div className="crm-table-wrap">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Proveedor</th>
              <th>Factura</th>
              <th>Fecha</th>
              <th>Unidad</th>
              <th>Subtotal</th>
              <th>IVA</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {compras.length === 0 ? (
              <tr>
                <td colSpan="10">No hay compras registradas.</td>
              </tr>
            ) : (
              compras.map((item) => (
                <tr key={item.id}>
                  <td>{item.codigo}</td>
                  <td>
                    <strong>{item.proveedor || '-'}</strong>
                    <br />
                    <small>{item.categoria || 'Sin categoría'}</small>
                  </td>
                  <td>{item.factura || '-'}</td>
                  <td>{item.fecha || '-'}</td>
                  <td>{item.unidadNegocio || '-'}</td>
                  <td>{formatoMoneda(item.subtotal)}</td>
                  <td>{formatoMoneda(item.iva)}</td>
                  <td>{formatoMoneda(item.total)}</td>
                  <td>{item.estado || '-'}</td>
                  <td>
                    <div className="table-actions">
                      <button type="button" onClick={() => editar(item)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => eliminar(item.id)}
                      >
                        Eliminar
                      </button>
                    </div>
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
