import React, { useMemo, useState } from 'react';
import { useCore } from '../core/context/CoreContext';

const UNIDADES_NEGOCIO = [
  'ELANPET',
  'ELANKAV VISUAL',
  'ELANKAV CENTER',
  'ELANKAV SOLAR',
  'ELAN AI',
];

export default function Cobros() {
  const {
    cobros,
    crearCobro,
    actualizarCobro,
    eliminarCobro,
  } = useCore();
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    codigo: '',
    cliente: '',
    empresa: '',
    factura: '',
    unidadNegocio: 'ELANKAV VISUAL',
    montoFactura: '',
    montoCobrado: '',
    saldoPendiente: '',
    metodoPago: 'Transferencia',
    estado: 'Pendiente',
    fechaCobro: new Date().toISOString().slice(0, 10),
    observaciones: '',
  });

  const cambiar = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const nuevo = { ...prev, [name]: value };

      const factura = Number(nuevo.montoFactura) || 0;
      const cobrado = Number(nuevo.montoCobrado) || 0;

      return {
        ...nuevo,
        saldoPendiente: (factura - cobrado).toFixed(2),
      };
    });
  };

  const limpiar = () => {
    setForm({
      codigo: '',
      cliente: '',
      empresa: '',
      factura: '',
      unidadNegocio: 'ELANKAV VISUAL',
      montoFactura: '',
      montoCobrado: '',
      saldoPendiente: '',
      metodoPago: 'Transferencia',
      estado: 'Pendiente',
      fechaCobro: new Date().toISOString().slice(0, 10),
      observaciones: '',
    });

    setEditandoId(null);
  };

  const guardar = (e) => {
    e.preventDefault();

    if (!form.cliente.trim() && !form.empresa.trim()) return;

    const datos = {
      ...form,
      id: editandoId || `cob-${Date.now()}`,
      codigo: form.codigo.trim() || `COB-${Date.now()}`,
      cliente: form.cliente.trim(),
      empresa: form.empresa.trim(),
      factura: form.factura.trim(),
      unidadNegocio: form.unidadNegocio,
      observaciones: form.observaciones.trim(),
      montoFactura: Number(form.montoFactura) || 0,
      montoCobrado: Number(form.montoCobrado) || 0,
      saldoPendiente: Number(form.saldoPendiente) || 0,
      actualizado: new Date().toISOString(),
    };

    if (editandoId) {
      actualizarCobro(datos);
    } else {
      crearCobro(datos);
    }

    limpiar();
  };

  const editar = (item) => {
    setEditandoId(item.id);

    setForm({
      codigo: item.codigo || '',
      cliente: item.cliente || '',
      empresa: item.empresa || '',
      factura: item.factura || '',
      unidadNegocio: item.unidadNegocio || 'ELANKAV VISUAL',
      montoFactura: String(item.montoFactura || ''),
      montoCobrado: String(item.montoCobrado || ''),
      saldoPendiente: String(item.saldoPendiente || ''),
      metodoPago: item.metodoPago || 'Transferencia',
      estado: item.estado || 'Pendiente',
      fechaCobro: item.fechaCobro || '',
      observaciones: item.observaciones || '',
    });
  };

  const eliminar = (id) => {
    eliminarCobro(id);

    if (editandoId === id) limpiar();
  };

  const resumen = useMemo(() => {
    const facturado = cobros.reduce(
      (acc, item) => acc + (Number(item.montoFactura) || 0),
      0
    );

    const cobrado = cobros.reduce(
      (acc, item) => acc + (Number(item.montoCobrado) || 0),
      0
    );

    return {
      totalCobros: cobros.length,
      facturado,
      cobrado,
      pendiente: facturado - cobrado,
    };
  }, [cobros]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Cobros</h2>
          <p>Control de facturas, anticipos, pagos y saldos pendientes.</p>
        </div>
      </div>

      <div className="crm-resumen">
        <div className="crm-card">
          <span>Total registros</span>
          <strong>{resumen.totalCobros}</strong>
        </div>

        <div className="crm-card">
          <span>Facturado</span>
          <strong>C$ {resumen.facturado.toFixed(2)}</strong>
        </div>

        <div className="crm-card">
          <span>Cobrado</span>
          <strong>C$ {resumen.cobrado.toFixed(2)}</strong>
        </div>

        <div className="crm-card">
          <span>Pendiente</span>
          <strong>C$ {resumen.pendiente.toFixed(2)}</strong>
        </div>
      </div>

      <form className="crm-form" onSubmit={guardar}>
        <h3>{editandoId ? 'Editar cobro' : 'Nuevo cobro'}</h3>

        <div className="form-grid">
          <label>
            Código
            <input
              name="codigo"
              value={form.codigo}
              onChange={cambiar}
              placeholder="COB-0001"
            />
          </label>

          <label>
            Cliente
            <input
              name="cliente"
              value={form.cliente}
              onChange={cambiar}
            />
          </label>

          <label>
            Empresa
            <input
              name="empresa"
              value={form.empresa}
              onChange={cambiar}
            />
          </label>

          <label>
            Factura
            <input
              name="factura"
              value={form.factura}
              onChange={cambiar}
              placeholder="FAC-001"
            />
          </label>


          <label>
            Unidad de negocio
            <select name="unidadNegocio" value={form.unidadNegocio} onChange={cambiar}>
              {UNIDADES_NEGOCIO.map((unidad) => (
                <option key={unidad} value={unidad}>
                  {unidad}
                </option>
              ))}
            </select>
          </label>

          <label>
            Monto factura
            <input
              type="number"
              name="montoFactura"
              value={form.montoFactura}
              onChange={cambiar}
            />
          </label>

          <label>
            Monto cobrado
            <input
              type="number"
              name="montoCobrado"
              value={form.montoCobrado}
              onChange={cambiar}
            />
          </label>

          <label>
            Saldo pendiente
            <input
              type="number"
              name="saldoPendiente"
              value={form.saldoPendiente}
              readOnly
            />
          </label>

          <label>
            Método de pago
            <select
              name="metodoPago"
              value={form.metodoPago}
              onChange={cambiar}
            >
              <option>Transferencia</option>
              <option>Efectivo</option>
              <option>Cheque</option>
              <option>Tarjeta</option>
              <option>POS</option>
            </select>
          </label>

          <label>
            Estado
            <select
              name="estado"
              value={form.estado}
              onChange={cambiar}
            >
              <option>Pendiente</option>
              <option>Parcial</option>
              <option>Pagado</option>
              <option>Anulado</option>
            </select>
          </label>

          <label>
            Fecha cobro
            <input
              type="date"
              name="fechaCobro"
              value={form.fechaCobro}
              onChange={cambiar}
            />
          </label>
        </div>

        <label>
          Observaciones
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={cambiar}
            rows="3"
          />
        </label>

        <div className="form-actions">
          <button type="submit">
            {editandoId ? 'Actualizar cobro' : 'Guardar cobro'}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={limpiar}
              className="btn-secundario"
            >
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
              <th>Cliente</th>
              <th>Factura</th>
              <th>Unidad</th>
              <th>Facturado</th>
              <th>Cobrado</th>
              <th>Saldo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cobros.length === 0 ? (
              <tr>
                <td colSpan="9">No hay cobros registrados.</td>
              </tr>
            ) : (
              cobros.map((item) => (
                <tr key={item.id}>
                  <td>{item.codigo}</td>
                  <td>{item.cliente || item.empresa}</td>
                  <td>{item.factura}</td>
                  <td>{item.unidadNegocio || 'ELANKAV VISUAL'}</td>
                  <td>C$ {Number(item.montoFactura).toFixed(2)}</td>
                  <td>C$ {Number(item.montoCobrado).toFixed(2)}</td>
                  <td>C$ {Number(item.saldoPendiente).toFixed(2)}</td>
                  <td>{item.estado}</td>
                  <td>
                    <button onClick={() => editar(item)}>
                      Editar
                    </button>

                    <button
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