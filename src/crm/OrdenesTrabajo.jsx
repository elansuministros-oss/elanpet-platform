import React, { useMemo, useState } from 'react';
import { useCore } from '../core/context/CoreContext';

const UNIDADES_NEGOCIO = [
  'ELANPET',
  'ELANKAV VISUAL',
  'ELANKAV CENTER',
  'ELANKAV SOLAR',
  'ELAN AI',
];

const fechaActual = () => new Date().toISOString().slice(0, 10);

const formInicial = () => ({
  codigo: '',
  pedidoId: '',
  pedidoCodigo: '',
  cotizacionId: '',
  cotizacionCodigo: '',
  empresaId: '',
  empresaNombre: '',
  contactoId: '',
  contactoNombre: '',
  cliente: '',
  telefono: '',
  producto: '',
  unidadNegocio: 'ELANKAV VISUAL',
  cantidad: '',
  total: '',
  responsable: '',
  area: 'Producción',
  prioridad: 'Media',
  estado: 'Pendiente',
  fechaInicio: fechaActual(),
  fechaEntrega: '',
  descripcion: '',
  materiales: '',
  medidas: '',
  observaciones: '',
});

export default function OrdenesTrabajo() {
  const {
    pedidos,
    ordenesTrabajo,
    crearOrdenTrabajo,
    actualizarOrdenTrabajo,
    eliminarOrdenTrabajo,
  } = useCore();

  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formInicial());

  const pedidosDisponibles = useMemo(() => {
    return pedidos.filter((pedido) => {
      const estado = pedido.estado || '';
      return estado !== 'Cancelado' && estado !== 'Anulado';
    });
  }, [pedidos]);

  const obtenerEmpresaNombre = (pedido) => {
    return pedido.empresaNombre || pedido.cliente || pedido.empresa || '';
  };

  const obtenerContactoNombre = (pedido) => {
    return pedido.contactoNombre || pedido.contacto || '';
  };

  const cambiar = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === 'pedidoId') {
        const pedidoSeleccionado = pedidos.find((pedido) => pedido.id === value);

        if (!pedidoSeleccionado) {
          return {
            ...prev,
            pedidoId: '',
            pedidoCodigo: '',
            cotizacionId: '',
            cotizacionCodigo: '',
            empresaId: '',
            empresaNombre: '',
            contactoId: '',
            contactoNombre: '',
            cliente: '',
            telefono: '',
            producto: '',
            cantidad: '',
            total: '',
            descripcion: '',
            observaciones: prev.observaciones,
          };
        }

        const empresaNombre = obtenerEmpresaNombre(pedidoSeleccionado);
        const contactoNombre = obtenerContactoNombre(pedidoSeleccionado);

        return {
          ...prev,
          pedidoId: pedidoSeleccionado.id,
          pedidoCodigo: pedidoSeleccionado.codigo || '',
          cotizacionId: pedidoSeleccionado.cotizacionId || '',
          cotizacionCodigo: pedidoSeleccionado.cotizacionCodigo || '',
          empresaId: pedidoSeleccionado.empresaId || '',
          empresaNombre,
          contactoId: pedidoSeleccionado.contactoId || '',
          contactoNombre,
          cliente: empresaNombre,
          telefono: pedidoSeleccionado.telefono || '',
          producto: pedidoSeleccionado.producto || '',
          unidadNegocio: pedidoSeleccionado.unidadNegocio || 'ELANKAV VISUAL',
          cantidad: String(pedidoSeleccionado.cantidad || ''),
          total: String(pedidoSeleccionado.total || ''),
          descripcion: pedidoSeleccionado.producto || '',
          observaciones:
            prev.observaciones ||
            pedidoSeleccionado.observaciones ||
            '',
        };
      }

      return { ...prev, [name]: value };
    });
  };

  const limpiar = () => {
    setForm(formInicial());
    setEditandoId(null);
  };

  const guardar = (e) => {
    e.preventDefault();

    if (!form.pedidoId && !form.cliente.trim()) {
      alert('Debés seleccionar un pedido o indicar el cliente.');
      return;
    }

    if (!form.producto.trim() && !form.descripcion.trim()) {
      alert('Debés indicar el producto, trabajo o descripción.');
      return;
    }

    const pedidoSeleccionado = pedidos.find((pedido) => pedido.id === form.pedidoId);

    const datos = {
      codigo: form.codigo.trim() || `OT-${Date.now()}`,
      pedidoId: form.pedidoId,
      pedidoCodigo: form.pedidoCodigo || pedidoSeleccionado?.codigo || '',
      cotizacionId: form.cotizacionId || pedidoSeleccionado?.cotizacionId || '',
      cotizacionCodigo:
        form.cotizacionCodigo || pedidoSeleccionado?.cotizacionCodigo || '',
      empresaId: form.empresaId || pedidoSeleccionado?.empresaId || '',
      empresaNombre:
        form.empresaNombre ||
        (pedidoSeleccionado ? obtenerEmpresaNombre(pedidoSeleccionado) : ''),
      contactoId: form.contactoId || pedidoSeleccionado?.contactoId || '',
      contactoNombre:
        form.contactoNombre ||
        (pedidoSeleccionado ? obtenerContactoNombre(pedidoSeleccionado) : ''),
      cliente:
        form.cliente.trim() ||
        form.empresaNombre ||
        (pedidoSeleccionado ? obtenerEmpresaNombre(pedidoSeleccionado) : ''),
      telefono: form.telefono.trim(),
      producto: form.producto.trim(),
      unidadNegocio: form.unidadNegocio,
      cantidad: Number(form.cantidad) || 0,
      total: Number(form.total) || 0,
      responsable: form.responsable.trim(),
      area: form.area,
      prioridad: form.prioridad,
      estado: form.estado,
      fechaInicio: form.fechaInicio,
      fechaEntrega: form.fechaEntrega,
      descripcion: form.descripcion.trim(),
      materiales: form.materiales.trim(),
      medidas: form.medidas.trim(),
      observaciones: form.observaciones.trim(),
      actualizado: new Date().toISOString(),
    };

    if (editandoId) {
      actualizarOrdenTrabajo(editandoId, datos);
    } else {
      crearOrdenTrabajo(datos);
    }

    limpiar();
  };

  const editar = (item) => {
    setEditandoId(item.id);

    const pedido = pedidos.find((pedidoItem) => pedidoItem.id === item.pedidoId);

    setForm({
      codigo: item.codigo || '',
      pedidoId: item.pedidoId || '',
      pedidoCodigo: item.pedidoCodigo || pedido?.codigo || '',
      cotizacionId: item.cotizacionId || pedido?.cotizacionId || '',
      cotizacionCodigo: item.cotizacionCodigo || pedido?.cotizacionCodigo || '',
      empresaId: item.empresaId || pedido?.empresaId || '',
      empresaNombre:
        item.empresaNombre ||
        (pedido ? obtenerEmpresaNombre(pedido) : '') ||
        item.empresa ||
        item.cliente ||
        '',
      contactoId: item.contactoId || pedido?.contactoId || '',
      contactoNombre:
        item.contactoNombre ||
        (pedido ? obtenerContactoNombre(pedido) : '') ||
        item.contacto ||
        '',
      cliente:
        item.cliente ||
        item.empresaNombre ||
        (pedido ? obtenerEmpresaNombre(pedido) : '') ||
        '',
      telefono: item.telefono || pedido?.telefono || '',
      producto: item.producto || pedido?.producto || '',
      unidadNegocio: item.unidadNegocio || pedido?.unidadNegocio || 'ELANKAV VISUAL',
      cantidad: String(item.cantidad || pedido?.cantidad || ''),
      total: String(item.total || pedido?.total || ''),
      responsable: item.responsable || '',
      area: item.area || 'Producción',
      prioridad: item.prioridad || 'Media',
      estado: item.estado || 'Pendiente',
      fechaInicio: item.fechaInicio || fechaActual(),
      fechaEntrega: item.fechaEntrega || '',
      descripcion: item.descripcion || item.producto || pedido?.producto || '',
      materiales: item.materiales || '',
      medidas: item.medidas || '',
      observaciones: item.observaciones || '',
    });
  };

  const eliminar = (id) => {
    const confirmar = window.confirm('¿Seguro que querés eliminar esta orden de trabajo?');
    if (!confirmar) return;

    eliminarOrdenTrabajo(id);
    if (editandoId === id) limpiar();
  };

  const resumen = useMemo(() => {
    return {
      total: ordenesTrabajo.length,
      pendientes: ordenesTrabajo.filter((item) => item.estado === 'Pendiente').length,
      proceso: ordenesTrabajo.filter((item) => item.estado === 'En Proceso').length,
      terminadas: ordenesTrabajo.filter((item) => item.estado === 'Finalizada').length,
    };
  }, [ordenesTrabajo]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Órdenes de Trabajo</h2>
          <p>Control operativo conectado a pedidos, cotizaciones, empresas y contactos.</p>
        </div>
      </div>

      <div className="crm-resumen">
        <div className="crm-card">
          <span>Total órdenes</span>
          <strong>{resumen.total}</strong>
        </div>

        <div className="crm-card">
          <span>Pendientes</span>
          <strong>{resumen.pendientes}</strong>
        </div>

        <div className="crm-card">
          <span>En proceso</span>
          <strong>{resumen.proceso}</strong>
        </div>

        <div className="crm-card">
          <span>Terminadas</span>
          <strong>{resumen.terminadas}</strong>
        </div>
      </div>

      <form className="crm-form" onSubmit={guardar}>
        <h3>{editandoId ? 'Editar orden de trabajo' : 'Nueva orden de trabajo'}</h3>

        <div className="form-grid">
          <label>
            Pedido
            <select name="pedidoId" value={form.pedidoId} onChange={cambiar}>
              <option value="">Seleccionar pedido</option>
              {pedidosDisponibles.map((pedido) => (
                <option key={pedido.id} value={pedido.id}>
                  {pedido.codigo || 'Sin código'} - {obtenerEmpresaNombre(pedido) || 'Sin cliente'} - {pedido.producto || 'Sin producto'}
                </option>
              ))}
            </select>
          </label>

          <label>
            Código OT
            <input
              name="codigo"
              value={form.codigo}
              onChange={cambiar}
              placeholder="OT-0001"
            />
          </label>

          <label>
            Empresa / Cliente
            <input
              name="cliente"
              value={form.cliente}
              onChange={cambiar}
              placeholder="Se completa desde el pedido"
              readOnly={Boolean(form.pedidoId)}
            />
          </label>

          <label>
            Contacto
            <input
              name="contactoNombre"
              value={form.contactoNombre}
              onChange={cambiar}
              placeholder="Contacto relacionado"
              readOnly={Boolean(form.pedidoId)}
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
            Teléfono / WhatsApp
            <input
              name="telefono"
              value={form.telefono}
              onChange={cambiar}
              placeholder="Número de contacto"
            />
          </label>

          <label>
            Producto / Trabajo
            <input
              name="producto"
              value={form.producto}
              onChange={cambiar}
              placeholder="Trabajo a producir"
              readOnly={Boolean(form.pedidoId)}
            />
          </label>

          <label>
            Cantidad
            <input
              name="cantidad"
              type="number"
              min="0"
              value={form.cantidad}
              onChange={cambiar}
              placeholder="0"
            />
          </label>

          <label>
            Total pedido
            <input
              name="total"
              type="number"
              min="0"
              step="0.01"
              value={form.total}
              onChange={cambiar}
              placeholder="0.00"
              readOnly={Boolean(form.pedidoId)}
            />
          </label>

          <label>
            Responsable
            <input
              name="responsable"
              value={form.responsable}
              onChange={cambiar}
              placeholder="Responsable interno"
            />
          </label>

          <label>
            Área
            <select name="area" value={form.area} onChange={cambiar}>
              <option value="Producción">Producción</option>
              <option value="Diseño">Diseño</option>
              <option value="Impresión">Impresión</option>
              <option value="Corte">Corte</option>
              <option value="Instalación">Instalación</option>
              <option value="Administración">Administración</option>
            </select>
          </label>

          <label>
            Prioridad
            <select name="prioridad" value={form.prioridad} onChange={cambiar}>
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
              <option value="Urgente">Urgente</option>
            </select>
          </label>

          <label>
            Estado
            <select name="estado" value={form.estado} onChange={cambiar}>
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Finalizada">Finalizada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </label>

          <label>
            Fecha inicio
            <input
              name="fechaInicio"
              type="date"
              value={form.fechaInicio}
              onChange={cambiar}
            />
          </label>

          <label>
            Fecha entrega
            <input
              name="fechaEntrega"
              type="date"
              value={form.fechaEntrega}
              onChange={cambiar}
            />
          </label>
        </div>

        <label>
          Descripción del trabajo
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={cambiar}
            placeholder="Detalle técnico del trabajo a producir"
            rows="3"
          />
        </label>

        <label>
          Materiales
          <textarea
            name="materiales"
            value={form.materiales}
            onChange={cambiar}
            placeholder="Materiales requeridos"
            rows="3"
          />
        </label>

        <label>
          Medidas
          <textarea
            name="medidas"
            value={form.medidas}
            onChange={cambiar}
            placeholder="Medidas, cantidades, acabados o detalles físicos"
            rows="3"
          />
        </label>

        <label>
          Observaciones
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={cambiar}
            placeholder="Notas internas"
            rows="3"
          />
        </label>

        <div className="form-actions">
          <button type="submit">
            {editandoId ? 'Actualizar orden' : 'Guardar orden'}
          </button>

          {editandoId && (
            <button type="button" className="btn-secundario" onClick={limpiar}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <div className="crm-table-wrap">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Código OT</th>
              <th>Pedido</th>
              <th>Empresa</th>
              <th>Contacto</th>
              <th>Trabajo</th>
              <th>Responsable</th>
              <th>Prioridad</th>
              <th>Unidad</th>
              <th>Estado</th>
              <th>Entrega</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {ordenesTrabajo.map((item) => (
              <tr key={item.id}>
                <td>{item.codigo || 'Sin código'}</td>
                <td>{item.pedidoCodigo || item.pedido || 'Sin pedido'}</td>
                <td>{item.empresaNombre || item.empresa || item.cliente || 'Sin empresa'}</td>
                <td>{item.contactoNombre || item.contacto || 'Sin contacto'}</td>
                <td>{item.producto || item.descripcion || 'Sin descripción'}</td>
                <td>{item.responsable || 'Sin responsable'}</td>
                <td>{item.prioridad || 'Media'}</td>
                <td>{item.unidadNegocio || 'ELANKAV VISUAL'}</td>
                <td>{item.estado || 'Pendiente'}</td>
                <td>{item.fechaEntrega || 'Sin fecha'}</td>
                <td>
                  <button type="button" onClick={() => editar(item)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => eliminar(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {ordenesTrabajo.length === 0 && (
              <tr>
                <td colSpan="11">No hay órdenes de trabajo registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
