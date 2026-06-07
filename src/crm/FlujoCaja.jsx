import React, { useMemo, useState } from 'react';
import { useCore } from '../core/context/CoreContext';

const UNIDADES_NEGOCIO = [
  'ELANPET',
  'ELANKAV VISUAL',
  'ELANKAV CENTER',
  'ELANKAV SOLAR',
  'ELAN AI',
];

const TIPOS_MOVIMIENTO = ['Ingreso', 'Egreso'];
const ESTADOS_MOVIMIENTO = ['Registrado', 'Pendiente', 'Anulado'];

const hoyISO = () => new Date().toISOString().slice(0, 10);

const formatoCordobas = (valor) =>
  new Intl.NumberFormat('es-NI', {
    style: 'currency',
    currency: 'NIO',
    minimumFractionDigits: 2,
  }).format(Number(valor) || 0);

const numero = (valor) => Number(valor) || 0;

const normalizarEstado = (valor = '') => valor.toString().trim().toLowerCase();

export default function FlujoCaja() {
  const {
    cobros = [],
    compras = [],
    cuentasPorCobrar = [],
    cuentasPorPagar = [],
    flujoCaja = [],
    crearMovimientoFlujoCaja,
    actualizarMovimientoFlujoCaja,
    eliminarMovimientoFlujoCaja,
  } = useCore();

  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({
    fecha: hoyISO(),
    tipo: 'Ingreso',
    concepto: '',
    unidadNegocio: 'ELANKAV VISUAL',
    monto: '',
    estado: 'Registrado',
    referencia: '',
    observaciones: '',
  });

  const resumen = useMemo(() => {
    const ingresosCobros = cobros.reduce(
      (total, item) => total + numero(item.montoCobrado || item.monto || item.total),
      0
    );

    const ingresosManuales = flujoCaja
      .filter((item) => item.tipo === 'Ingreso' && normalizarEstado(item.estado) !== 'anulado')
      .reduce((total, item) => total + numero(item.monto), 0);

    const egresosCompras = compras.reduce(
      (total, item) => total + numero(item.total || item.monto || item.subtotal),
      0
    );

    const egresosManuales = flujoCaja
      .filter((item) => item.tipo === 'Egreso' && normalizarEstado(item.estado) !== 'anulado')
      .reduce((total, item) => total + numero(item.monto), 0);

    const porCobrar = cuentasPorCobrar.reduce(
      (total, item) => total + numero(item.saldo || item.saldoPendiente || item.montoPendiente),
      0
    );

    const porPagar = cuentasPorPagar.reduce(
      (total, item) => total + numero(item.saldo || item.saldoPendiente || item.montoPendiente),
      0
    );

    const ingresosTotales = ingresosCobros + ingresosManuales;
    const egresosTotales = egresosCompras + egresosManuales;

    return {
      ingresosCobros,
      ingresosManuales,
      ingresosTotales,
      egresosCompras,
      egresosManuales,
      egresosTotales,
      porCobrar,
      porPagar,
      saldoOperativo: ingresosTotales - egresosTotales,
      posicionFinanciera: ingresosTotales + porCobrar - egresosTotales - porPagar,
    };
  }, [cobros, compras, cuentasPorCobrar, cuentasPorPagar, flujoCaja]);

  const resumenPorUnidad = useMemo(() => {
    return UNIDADES_NEGOCIO.map((unidad) => {
      const ingresosCobros = cobros
        .filter((item) => item.unidadNegocio === unidad)
        .reduce((total, item) => total + numero(item.montoCobrado || item.monto || item.total), 0);

      const ingresosManuales = flujoCaja
        .filter(
          (item) =>
            item.unidadNegocio === unidad &&
            item.tipo === 'Ingreso' &&
            normalizarEstado(item.estado) !== 'anulado'
        )
        .reduce((total, item) => total + numero(item.monto), 0);

      const egresosCompras = compras
        .filter((item) => item.unidadNegocio === unidad)
        .reduce((total, item) => total + numero(item.total || item.monto || item.subtotal), 0);

      const egresosManuales = flujoCaja
        .filter(
          (item) =>
            item.unidadNegocio === unidad &&
            item.tipo === 'Egreso' &&
            normalizarEstado(item.estado) !== 'anulado'
        )
        .reduce((total, item) => total + numero(item.monto), 0);

      const ingresos = ingresosCobros + ingresosManuales;
      const egresos = egresosCompras + egresosManuales;

      return {
        unidad,
        ingresos,
        egresos,
        saldo: ingresos - egresos,
      };
    });
  }, [cobros, compras, flujoCaja]);

  const movimientosSistema = useMemo(() => {
    const desdeCobros = cobros.map((item) => ({
      id: `cobro-${item.id}`,
      fecha: item.fecha || item.fechaRegistro || '',
      tipo: 'Ingreso',
      concepto: `Cobro ${item.factura || item.codigo || ''}`.trim(),
      unidadNegocio: item.unidadNegocio || 'Sin unidad',
      monto: numero(item.montoCobrado || item.monto || item.total),
      origen: 'Cobros',
      estado: item.estado || 'Registrado',
    }));

    const desdeCompras = compras.map((item) => ({
      id: `compra-${item.id}`,
      fecha: item.fecha || item.fechaRegistro || '',
      tipo: 'Egreso',
      concepto: `Compra ${item.factura || item.codigo || ''}`.trim(),
      unidadNegocio: item.unidadNegocio || 'Sin unidad',
      monto: numero(item.total || item.monto || item.subtotal),
      origen: 'Compras',
      estado: item.estado || 'Registrado',
    }));

    return [...desdeCobros, ...desdeCompras]
      .filter((item) => item.monto > 0)
      .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0))
      .slice(0, 12);
  }, [cobros, compras]);

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const limpiar = () => {
    setEditandoId(null);
    setForm({
      fecha: hoyISO(),
      tipo: 'Ingreso',
      concepto: '',
      unidadNegocio: 'ELANKAV VISUAL',
      monto: '',
      estado: 'Registrado',
      referencia: '',
      observaciones: '',
    });
  };

  const guardar = (e) => {
    e.preventDefault();

    if (!form.concepto.trim()) return;

    const datos = {
      ...form,
      concepto: form.concepto.trim(),
      referencia: form.referencia.trim(),
      observaciones: form.observaciones.trim(),
      monto: numero(form.monto),
    };

    if (editandoId) {
      actualizarMovimientoFlujoCaja(editandoId, datos);
    } else {
      crearMovimientoFlujoCaja(datos);
    }

    limpiar();
  };

  const editar = (item) => {
    setEditandoId(item.id);
    setForm({
      fecha: item.fecha || hoyISO(),
      tipo: item.tipo || 'Ingreso',
      concepto: item.concepto || '',
      unidadNegocio: item.unidadNegocio || 'ELANKAV VISUAL',
      monto: item.monto || '',
      estado: item.estado || 'Registrado',
      referencia: item.referencia || '',
      observaciones: item.observaciones || '',
    });
  };

  const eliminar = (id) => {
    const confirmar = window.confirm('¿Eliminar este movimiento manual de flujo de caja?');
    if (!confirmar) return;
    eliminarMovimientoFlujoCaja(id);
    if (editandoId === id) limpiar();
  };

  return (
    <div className="flujo-caja-page">
      <style>{`
        .flujo-caja-page {
          display: grid;
          gap: 18px;
        }

        .fc-header {
          background: linear-gradient(135deg, #0f766e, #0f3f62);
          color: #ffffff;
          border-radius: 20px;
          padding: 22px;
          box-shadow: 0 12px 28px rgba(15, 118, 110, 0.22);
        }

        .fc-header h2 {
          margin: 0;
          font-size: 26px;
        }

        .fc-header p {
          margin: 8px 0 0;
          color: rgba(255,255,255,0.82);
        }

        .fc-kpis {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .fc-card,
        .fc-panel {
          background: #ffffff;
          border-radius: 18px;
          padding: 18px;
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
          border: 1px solid #e5e7eb;
        }

        .fc-card span {
          display: block;
          color: #6b7280;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .4px;
        }

        .fc-card strong {
          display: block;
          margin-top: 8px;
          font-size: 24px;
          color: #111827;
        }

        .fc-positive strong { color: #047857; }
        .fc-negative strong { color: #b91c1c; }
        .fc-warning strong { color: #b45309; }

        .fc-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr);
          gap: 18px;
        }

        .fc-panel h3 {
          margin: 0 0 14px;
          color: #111827;
        }

        .fc-form {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .fc-field {
          display: grid;
          gap: 6px;
        }

        .fc-field.full {
          grid-column: 1 / -1;
        }

        .fc-field label {
          font-size: 13px;
          font-weight: 800;
          color: #374151;
        }

        .fc-field input,
        .fc-field select,
        .fc-field textarea {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 10px 12px;
          font: inherit;
          background: #ffffff;
          color: #111827;
        }

        .fc-field textarea {
          resize: vertical;
          min-height: 72px;
        }

        .fc-actions {
          grid-column: 1 / -1;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .fc-btn {
          border: 0;
          border-radius: 12px;
          padding: 11px 14px;
          font-weight: 900;
          cursor: pointer;
        }

        .fc-btn.primary {
          background: #0f766e;
          color: #ffffff;
        }

        .fc-btn.secondary {
          background: #e5e7eb;
          color: #111827;
        }

        .fc-btn.danger {
          background: #fee2e2;
          color: #991b1b;
        }

        .fc-table-wrap {
          overflow-x: auto;
        }

        .fc-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 780px;
        }

        .fc-table th,
        .fc-table td {
          padding: 11px 10px;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
          font-size: 13px;
          vertical-align: top;
        }

        .fc-table th {
          color: #374151;
          background: #f9fafb;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: .4px;
        }

        .fc-pill {
          display: inline-flex;
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
          background: #eef2ff;
          color: #3730a3;
        }

        .fc-income {
          color: #047857;
          font-weight: 900;
        }

        .fc-expense {
          color: #b91c1c;
          font-weight: 900;
        }

        .fc-unidades {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .fc-unidad {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 14px;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
        }

        .fc-unidad h4 {
          margin: 0 0 10px;
          font-size: 14px;
          color: #111827;
        }

        .fc-unidad p {
          margin: 4px 0;
          font-size: 13px;
          color: #4b5563;
        }

        .fc-empty {
          color: #6b7280;
          font-size: 14px;
          padding: 12px 0;
        }

        @media (max-width: 1100px) {
          .fc-kpis,
          .fc-unidades {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .fc-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .fc-kpis,
          .fc-unidades,
          .fc-form {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="fc-header">
        <h2>Flujo de Caja</h2>
        <p>Control de ingresos, egresos, cuentas por cobrar y cuentas por pagar de ELANKAV GROUP.</p>
      </section>

      <section className="fc-kpis">
        <div className="fc-card fc-positive">
          <span>Ingresos Totales</span>
          <strong>{formatoCordobas(resumen.ingresosTotales)}</strong>
        </div>
        <div className="fc-card fc-negative">
          <span>Egresos Totales</span>
          <strong>{formatoCordobas(resumen.egresosTotales)}</strong>
        </div>
        <div className={resumen.saldoOperativo >= 0 ? 'fc-card fc-positive' : 'fc-card fc-negative'}>
          <span>Saldo Operativo</span>
          <strong>{formatoCordobas(resumen.saldoOperativo)}</strong>
        </div>
        <div className="fc-card fc-warning">
          <span>Por Cobrar</span>
          <strong>{formatoCordobas(resumen.porCobrar)}</strong>
        </div>
        <div className="fc-card fc-warning">
          <span>Por Pagar</span>
          <strong>{formatoCordobas(resumen.porPagar)}</strong>
        </div>
        <div className={resumen.posicionFinanciera >= 0 ? 'fc-card fc-positive' : 'fc-card fc-negative'}>
          <span>Posición Financiera</span>
          <strong>{formatoCordobas(resumen.posicionFinanciera)}</strong>
        </div>
      </section>

      <section className="fc-panel">
        <h3>Resumen por Unidad de Negocio</h3>
        <div className="fc-unidades">
          {resumenPorUnidad.map((item) => (
            <div className="fc-unidad" key={item.unidad}>
              <h4>{item.unidad}</h4>
              <p>Ingresos: <strong className="fc-income">{formatoCordobas(item.ingresos)}</strong></p>
              <p>Egresos: <strong className="fc-expense">{formatoCordobas(item.egresos)}</strong></p>
              <p>Saldo: <strong>{formatoCordobas(item.saldo)}</strong></p>
            </div>
          ))}
        </div>
      </section>

      <section className="fc-grid">
        <div className="fc-panel">
          <h3>{editandoId ? 'Editar movimiento manual' : 'Movimiento manual'}</h3>
          <form className="fc-form" onSubmit={guardar}>
            <div className="fc-field">
              <label>Fecha</label>
              <input type="date" name="fecha" value={form.fecha} onChange={cambiar} />
            </div>

            <div className="fc-field">
              <label>Tipo</label>
              <select name="tipo" value={form.tipo} onChange={cambiar}>
                {TIPOS_MOVIMIENTO.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div className="fc-field full">
              <label>Concepto</label>
              <input
                name="concepto"
                value={form.concepto}
                onChange={cambiar}
                placeholder="Ej: Pago de cliente, compra de material, gasto operativo"
              />
            </div>

            <div className="fc-field">
              <label>Unidad de Negocio</label>
              <select name="unidadNegocio" value={form.unidadNegocio} onChange={cambiar}>
                {UNIDADES_NEGOCIO.map((unidad) => (
                  <option key={unidad} value={unidad}>{unidad}</option>
                ))}
              </select>
            </div>

            <div className="fc-field">
              <label>Monto</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="monto"
                value={form.monto}
                onChange={cambiar}
                placeholder="0.00"
              />
            </div>

            <div className="fc-field">
              <label>Estado</label>
              <select name="estado" value={form.estado} onChange={cambiar}>
                {ESTADOS_MOVIMIENTO.map((estado) => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            <div className="fc-field">
              <label>Referencia</label>
              <input
                name="referencia"
                value={form.referencia}
                onChange={cambiar}
                placeholder="Factura, recibo, transferencia"
              />
            </div>

            <div className="fc-field full">
              <label>Observaciones</label>
              <textarea
                name="observaciones"
                value={form.observaciones}
                onChange={cambiar}
                placeholder="Detalle adicional del movimiento"
              />
            </div>

            <div className="fc-actions">
              <button className="fc-btn primary" type="submit">
                {editandoId ? 'Actualizar movimiento' : 'Registrar movimiento'}
              </button>
              {editandoId && (
                <button className="fc-btn secondary" type="button" onClick={limpiar}>
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="fc-panel">
          <h3>Movimientos manuales</h3>
          <div className="fc-table-wrap">
            <table className="fc-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Concepto</th>
                  <th>Unidad</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {flujoCaja.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="fc-empty">No hay movimientos manuales registrados.</td>
                  </tr>
                ) : (
                  flujoCaja.map((item) => (
                    <tr key={item.id}>
                      <td>{item.fecha || '-'}</td>
                      <td>
                        <span className="fc-pill">{item.tipo}</span>
                      </td>
                      <td>
                        <strong>{item.concepto}</strong>
                        {item.referencia && <div>{item.referencia}</div>}
                      </td>
                      <td>{item.unidadNegocio || '-'}</td>
                      <td className={item.tipo === 'Ingreso' ? 'fc-income' : 'fc-expense'}>
                        {formatoCordobas(item.monto)}
                      </td>
                      <td>{item.estado}</td>
                      <td>
                        <button className="fc-btn secondary" type="button" onClick={() => editar(item)}>
                          Editar
                        </button>{' '}
                        <button className="fc-btn danger" type="button" onClick={() => eliminar(item.id)}>
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
      </section>

      <section className="fc-panel">
        <h3>Movimientos automáticos recientes</h3>
        <div className="fc-table-wrap">
          <table className="fc-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Origen</th>
                <th>Tipo</th>
                <th>Concepto</th>
                <th>Unidad</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {movimientosSistema.length === 0 ? (
                <tr>
                  <td colSpan="7" className="fc-empty">No hay cobros ni compras con monto registrado.</td>
                </tr>
              ) : (
                movimientosSistema.map((item) => (
                  <tr key={item.id}>
                    <td>{item.fecha ? item.fecha.toString().slice(0, 10) : '-'}</td>
                    <td>{item.origen}</td>
                    <td><span className="fc-pill">{item.tipo}</span></td>
                    <td>{item.concepto}</td>
                    <td>{item.unidadNegocio}</td>
                    <td className={item.tipo === 'Ingreso' ? 'fc-income' : 'fc-expense'}>
                      {formatoCordobas(item.monto)}
                    </td>
                    <td>{item.estado}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
