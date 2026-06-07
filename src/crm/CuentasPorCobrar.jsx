import React, { useMemo, useState } from 'react';
import { useCore } from '../core/context/CoreContext';

const UNIDADES_NEGOCIO = [
  'ELANPET',
  'ELANKAV VISUAL',
  'ELANKAV CENTER',
  'ELANKAV SOLAR',
  'ELAN AI',
];

const ESTADOS_CXC = ['Pendiente', 'Parcial', 'Pagada', 'Anulada'];

const hoy = () => new Date().toISOString().slice(0, 10);

const sumarDias = (dias) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return fecha.toISOString().slice(0, 10);
};

const formInicial = {
  codigo: '',
  cobroId: '',
  cliente: '',
  empresa: '',
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

export default function CuentasPorCobrar() {
  const {
    cobros = [],
    cuentasPorCobrar = [],
    crearCuentaPorCobrar,
    actualizarCuentaPorCobrar,
    eliminarCuentaPorCobrar,
  } = useCore();

  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formInicial);

  const cambiar = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const nuevo = { ...prev, [name]: value };

      if (name === 'cobroId') {
        const cobroSeleccionado = cobros.find((item) => item.id === value);

        if (cobroSeleccionado) {
          const monto = Number(cobroSeleccionado.montoFactura) || 0;
          const abonado = Number(cobroSeleccionado.montoCobrado) || 0;
          const saldo = Math.max(monto - abonado, 0);

          nuevo.cliente = cobroSeleccionado.cliente || '';
          nuevo.empresa = cobroSeleccionado.empresa || '';
          nuevo.factura = cobroSeleccionado.factura || '';
          nuevo.unidadNegocio = cobroSeleccionado.unidadNegocio || 'ELANKAV VISUAL';
          nuevo.monto = String(monto || '');
          nuevo.abonado = String(abonado || '');
          nuevo.saldo = saldo.toFixed(2);
          nuevo.estado = saldo <= 0 && monto > 0 ? 'Pagada' : abonado > 0 ? 'Parcial' : 'Pendiente';
        }
      }

      if (name === 'monto' || name === 'abonado') {
        const monto = Number(nuevo.monto) || 0;
        const abonado = Number(nuevo.abonado) || 0;
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

    if (!form.cliente.trim() && !form.empresa.trim()) return;

    const cobroSeleccionado = cobros.find((item) => item.id === form.cobroId);
    const monto = Number(form.monto) || 0;
    const abonado = Number(form.abonado) || 0;
    const saldo = Math.max(monto - abonado, 0);

    const datos = {
      ...form,
      id: editandoId || `cxc-${Date.now()}`,
      codigo: form.codigo.trim() || `CXC-${Date.now()}`,
      cobroId: form.cobroId,
      cobroCodigo: cobroSeleccionado?.codigo || '',
      cliente: form.cliente.trim(),
      empresa: form.empresa.trim(),
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
      actualizarCuentaPorCobrar(editandoId, datos);
    } else {
      crearCuentaPorCobrar(datos);
    }

    limpiar();
  };

  const editar = (item) => {
    setEditandoId(item.id);

    setForm({
      codigo: item.codigo || '',
      cobroId: item.cobroId || '',
      cliente: item.cliente || '',
      empresa: item.empresa || '',
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
    eliminarCuentaPorCobrar(id);
    if (editandoId === id) limpiar();
  };

  const resumen = useMemo(() => {
    const totalPorCobrar = cuentasPorCobrar.reduce(
      (acc, item) => acc + (Number(item.saldo) || 0),
      0
    );

    const totalCobrado = cuentasPorCobrar.reduce(
      (acc, item) => acc + (Number(item.abonado) || 0),
      0
    );

    const montoTotal = cuentasPorCobrar.reduce(
      (acc, item) => acc + (Number(item.monto) || 0),
      0
    );

    const vencidas = cuentasPorCobrar.filter((item) =>
      fechaVencida(item.fechaVencimiento, item.estado)
    ).length;

    const porVencer = cuentasPorCobrar.filter((item) =>
      fechaPorVencer(item.fechaVencimiento, item.estado)
    ).length;

    return {
      registros: cuentasPorCobrar.length,
      montoTotal,
      totalPorCobrar,
      totalCobrado,
      vencidas,
      porVencer,
    };
  }, [cuentasPorCobrar]);

  const cuentasPorUnidad = useMemo(() => {
    return UNIDADES_NEGOCIO.map((unidad) => {
      const registros = cuentasPorCobrar.filter((item) => item.unidadNegocio === unidad);
      const saldo = registros.reduce((acc, item) => acc + (Number(item.saldo) || 0), 0);

      return {
        unidad,
        cantidad: registros.length,
        saldo,
      };
    });
  }, [cuentasPorCobrar]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Cuentas por Cobrar</h2>
          <p>Control financiero de facturas pendientes, abonos, saldos y vencimientos de clientes.</p>
        </div>
      </div>

      <div className="crm-resumen">
        <div className="crm-card">
          <span>Registros</span>
          <strong>{resumen.registros}</strong>
        </div>

        <div className="crm-card">
          <span>Monto total</span>
          <strong>{formatoMoneda(resumen.montoTotal)}</strong>
        </div>

        <div className="crm-card">
          <span>Total cobrado</span>
          <strong>{formatoMoneda(resumen.totalCobrado)}</strong>
        </div>

        <div className="crm-card">
          <span>Saldo pendiente</span>
          <strong>{formatoMoneda(resumen.totalPorCobrar)}</strong>
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
        <h3>{editandoId ? 'Editar cuenta por cobrar' : 'Nueva cuenta por cobrar'}</h3>

        <div className="form-grid">
          <label>
            Código
            <input
              name="codigo"
              value={form.codigo}
              onChange={cambiar}
              placeholder="CXC-0001"
            />
          </label>

          <label>
            Cobro relacionado
            <select name="cobroId" value={form.cobroId} onChange={cambiar}>
              <option value="">Seleccionar cobro</option>
              {cobros.map((cobro) => (
                <option key={cobro.id} value={cobro.id}>
                  {cobro.codigo || cobro.factura || cobro.cliente || cobro.empresa} - {formatoMoneda(cobro.montoFactura)}
                </option>
              ))}
            </select>
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
              {ESTADOS_CXC.map((estado) => (
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
              placeholder="Condiciones de pago, acuerdos, abonos o notas internas"
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
            <strong>{formatoMoneda(item.saldo)}</strong>
            <small>{item.cantidad} cuentas</small>
          </div>
        ))}
      </div>

      <div className="crm-table-wrap">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente / Empresa</th>
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
            {cuentasPorCobrar.length === 0 ? (
              <tr>
                <td colSpan="10">No hay cuentas por cobrar registradas.</td>
              </tr>
            ) : (
              cuentasPorCobrar.map((item) => (
                <tr key={item.id}>
                  <td>{item.codigo}</td>
                  <td>
                    <strong>{item.cliente || item.empresa || '-'}</strong>
                    <br />
                    <small>{item.cobroCodigo ? `Cobro: ${item.cobroCodigo}` : item.empresa || 'Sin cobro vinculado'}</small>
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
