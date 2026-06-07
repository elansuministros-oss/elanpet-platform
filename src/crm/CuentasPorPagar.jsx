import React, { useMemo, useState } from 'react';
import { useCore } from '../core/context/CoreContext';

const UNIDADES_NEGOCIO = [
  'ELANPET',
  'ELANKAV VISUAL',
  'ELANKAV CENTER',
  'ELANKAV SOLAR',
  'ELAN AI',
];

const ESTADOS_CXP = ['Pendiente', 'Parcial', 'Pagada', 'Anulada'];

const hoy = () => new Date().toISOString().slice(0, 10);

const sumarDias = (dias) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return fecha.toISOString().slice(0, 10);
};

const formInicial = {
  codigo: '',
  proveedorId: '',
  proveedor: '',
  compraId: '',
  factura: '',
  fechaEmision: hoy(),
  fechaVencimiento: sumarDias(15),
  unidadNegocio: 'ELANKAV VISUAL',
  monto: '',
  abonado: '',
  saldo: '',
  estado: 'Pendiente',
  observaciones: '',
};

const formatoMoneda = (valor) => {
  const numero = Number(valor) || 0;
  return `C$ ${numero.toFixed(2)}`;
};

const fechaVencida = (fecha, estado) => {
  if (!fecha || estado === 'Pagada' || estado === 'Anulada') return false;
  return new Date(fecha) < new Date(hoy());
};

const fechaPorVencer = (fecha, estado) => {
  if (!fecha || estado === 'Pagada' || estado === 'Anulada') return false;

  const ahora = new Date(hoy());
  const vencimiento = new Date(fecha);
  const diferencia = Math.ceil((vencimiento - ahora) / (1000 * 60 * 60 * 24));

  return diferencia >= 0 && diferencia <= 7;
};

export default function CuentasPorPagar() {
  const {
    proveedores = [],
    compras = [],
    cuentasPorPagar = [],
    crearCuentaPorPagar,
    actualizarCuentaPorPagar,
    eliminarCuentaPorPagar,
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

      if (name === 'compraId') {
        const compraSeleccionada = compras.find((item) => item.id === value);

        if (compraSeleccionada) {
          nuevo.proveedorId = compraSeleccionada.proveedorId || '';
          nuevo.proveedor = compraSeleccionada.proveedor || '';
          nuevo.factura = compraSeleccionada.factura || '';
          nuevo.unidadNegocio = compraSeleccionada.unidadNegocio || 'ELANKAV VISUAL';
          nuevo.monto = String(compraSeleccionada.total || '');
          nuevo.abonado = String(compraSeleccionada.estado === 'Pagada' ? compraSeleccionada.total || 0 : 0);
          nuevo.saldo = String(
            Math.max(
              (Number(compraSeleccionada.total) || 0) -
                (compraSeleccionada.estado === 'Pagada' ? Number(compraSeleccionada.total) || 0 : 0),
              0
            ).toFixed(2)
          );
          nuevo.estado = compraSeleccionada.estado === 'Pagada' ? 'Pagada' : 'Pendiente';
        }
      }

      const monto = Number(nuevo.monto) || 0;
      const abonado = Number(nuevo.abonado) || 0;

      if (name === 'monto' || name === 'abonado') {
        const saldo = Math.max(monto - abonado, 0);
        nuevo.saldo = saldo.toFixed(2);

        if (saldo <= 0 && monto > 0) {
          nuevo.estado = 'Pagada';
        } else if (abonado > 0 && saldo > 0) {
          nuevo.estado = 'Parcial';
        } else if (monto > 0) {
          nuevo.estado = 'Pendiente';
        }
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
    const compraSeleccionada = compras.find((item) => item.id === form.compraId);

    const monto = Number(form.monto) || 0;
    const abonado = Number(form.abonado) || 0;
    const saldo = Math.max(monto - abonado, 0);

    const datos = {
      ...form,
      id: editandoId || `cxp-${Date.now()}`,
      codigo: form.codigo.trim() || `CXP-${Date.now()}`,
      proveedorId: form.proveedorId,
      proveedor: proveedorSeleccionado?.nombre || form.proveedor.trim(),
      compraId: form.compraId,
      compraCodigo: compraSeleccionada?.codigo || '',
      factura: form.factura.trim(),
      fechaEmision: form.fechaEmision || hoy(),
      fechaVencimiento: form.fechaVencimiento || sumarDias(15),
      unidadNegocio: form.unidadNegocio || 'ELANKAV VISUAL',
      monto,
      abonado,
      saldo,
      estado: saldo <= 0 && monto > 0 ? 'Pagada' : form.estado || 'Pendiente',
      observaciones: form.observaciones.trim(),
      actualizado: new Date().toISOString(),
    };

    if (editandoId) {
      actualizarCuentaPorPagar(editandoId, datos);
    } else {
      crearCuentaPorPagar(datos);
    }

    limpiar();
  };

  const editar = (item) => {
    setEditandoId(item.id);

    setForm({
      codigo: item.codigo || '',
      proveedorId: item.proveedorId || '',
      proveedor: item.proveedor || '',
      compraId: item.compraId || '',
      factura: item.factura || '',
      fechaEmision: item.fechaEmision || hoy(),
      fechaVencimiento: item.fechaVencimiento || sumarDias(15),
      unidadNegocio: item.unidadNegocio || 'ELANKAV VISUAL',
      monto: String(item.monto || ''),
      abonado: String(item.abonado || ''),
      saldo: String(item.saldo || ''),
      estado: item.estado || 'Pendiente',
      observaciones: item.observaciones || '',
    });
  };

  const eliminar = (id) => {
    eliminarCuentaPorPagar(id);
    if (editandoId === id) limpiar();
  };

  const resumen = useMemo(() => {
    const totalPendiente = cuentasPorPagar.reduce(
      (acc, item) => acc + (Number(item.saldo) || 0),
      0
    );

    const totalPagado = cuentasPorPagar.reduce(
      (acc, item) => acc + (Number(item.abonado) || 0),
      0
    );

    const vencidas = cuentasPorPagar.filter((item) =>
      fechaVencida(item.fechaVencimiento, item.estado)
    ).length;

    const porVencer = cuentasPorPagar.filter((item) =>
      fechaPorVencer(item.fechaVencimiento, item.estado)
    ).length;

    return {
      registros: cuentasPorPagar.length,
      totalPendiente,
      totalPagado,
      vencidas,
      porVencer,
    };
  }, [cuentasPorPagar]);

  const cuentasPorUnidad = useMemo(() => {
    return UNIDADES_NEGOCIO.map((unidad) => {
      const registros = cuentasPorPagar.filter((item) => item.unidadNegocio === unidad);
      const pendiente = registros.reduce((acc, item) => acc + (Number(item.saldo) || 0), 0);

      return {
        unidad,
        cantidad: registros.length,
        pendiente,
      };
    });
  }, [cuentasPorPagar]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Cuentas por Pagar</h2>
          <p>Control financiero de obligaciones con proveedores, facturas pendientes, pagos parciales y vencimientos.</p>
        </div>
      </div>

      <div className="crm-resumen">
        <div className="crm-card">
          <span>Registros</span>
          <strong>{resumen.registros}</strong>
        </div>

        <div className="crm-card">
          <span>Total pendiente</span>
          <strong>{formatoMoneda(resumen.totalPendiente)}</strong>
        </div>

        <div className="crm-card">
          <span>Total abonado</span>
          <strong>{formatoMoneda(resumen.totalPagado)}</strong>
        </div>

        <div className="crm-card">
          <span>Vencidas</span>
          <strong>{resumen.vencidas}</strong>
        </div>

        <div className="crm-card">
          <span>Por vencer</span>
          <strong>{resumen.porVencer}</strong>
        </div>
      </div>

      <form className="crm-form" onSubmit={guardar}>
        <h3>{editandoId ? 'Editar cuenta por pagar' : 'Nueva cuenta por pagar'}</h3>

        <div className="form-grid">
          <label>
            Código
            <input
              name="codigo"
              value={form.codigo}
              onChange={cambiar}
              placeholder="CXP-0001"
            />
          </label>

          <label>
            Compra relacionada
            <select name="compraId" value={form.compraId} onChange={cambiar}>
              <option value="">Seleccionar compra</option>
              {compras.map((compra) => (
                <option key={compra.id} value={compra.id}>
                  {compra.codigo || compra.factura || compra.proveedor} - {formatoMoneda(compra.total)}
                </option>
              ))}
            </select>
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
            Fecha emisión
            <input
              name="fechaEmision"
              type="date"
              value={form.fechaEmision}
              onChange={cambiar}
            />
          </label>

          <label>
            Fecha vencimiento
            <input
              name="fechaVencimiento"
              type="date"
              value={form.fechaVencimiento}
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
            Monto
            <input
              name="monto"
              type="number"
              step="0.01"
              min="0"
              value={form.monto}
              onChange={cambiar}
              placeholder="0.00"
            />
          </label>

          <label>
            Abonado
            <input
              name="abonado"
              type="number"
              step="0.01"
              min="0"
              value={form.abonado}
              onChange={cambiar}
              placeholder="0.00"
            />
          </label>

          <label>
            Saldo
            <input
              name="saldo"
              type="number"
              step="0.01"
              min="0"
              value={form.saldo}
              onChange={cambiar}
              placeholder="0.00"
            />
          </label>

          <label>
            Estado
            <select name="estado" value={form.estado} onChange={cambiar}>
              {ESTADOS_CXP.map((estado) => (
                <option key={estado}>{estado}</option>
              ))}
            </select>
          </label>

          <label className="form-full">
            Observaciones
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={cambiar}
              placeholder="Condiciones de crédito, abonos, acuerdos de pago o notas internas"
              rows="3"
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit">
            {editandoId ? 'Actualizar cuenta' : 'Guardar cuenta'}
          </button>

          {editandoId && (
            <button type="button" className="secondary" onClick={limpiar}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <div className="crm-resumen">
        {cuentasPorUnidad.map((item) => (
          <div className="crm-card" key={item.unidad}>
            <span>{item.unidad}</span>
            <strong>{formatoMoneda(item.pendiente)}</strong>
            <small>{item.cantidad} cuentas</small>
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
              <th>Vencimiento</th>
              <th>Unidad</th>
              <th>Monto</th>
              <th>Abonado</th>
              <th>Saldo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cuentasPorPagar.length === 0 ? (
              <tr>
                <td colSpan="10">No hay cuentas por pagar registradas.</td>
              </tr>
            ) : (
              cuentasPorPagar.map((item) => (
                <tr key={item.id}>
                  <td>{item.codigo}</td>
                  <td>
                    <strong>{item.proveedor || '-'}</strong>
                    <br />
                    <small>{item.compraCodigo ? `Compra: ${item.compraCodigo}` : 'Sin compra vinculada'}</small>
                  </td>
                  <td>{item.factura || '-'}</td>
                  <td>
                    {item.fechaVencimiento || '-'}
                    {fechaVencida(item.fechaVencimiento, item.estado) && (
                      <>
                        <br />
                        <small>Vencida</small>
                      </>
                    )}
                  </td>
                  <td>{item.unidadNegocio || '-'}</td>
                  <td>{formatoMoneda(item.monto)}</td>
                  <td>{formatoMoneda(item.abonado)}</td>
                  <td>{formatoMoneda(item.saldo)}</td>
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
