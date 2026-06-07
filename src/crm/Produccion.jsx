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
  ordenTrabajoId: '',
  ordenTrabajoCodigo: '',
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
  material: '',
  materiales: '',
  medidas: '',
  responsable: '',
  fechaInicio: fechaActual(),
  fechaEntrega: '',
  etapa: 'Pendiente',
  prioridad: 'Media',
  avance: '',
  nota: '',
});

export default function Produccion() {
  const {
    ordenesTrabajo,
    produccion,
    crearProduccion,
    actualizarProduccion,
    eliminarProduccion,
  } = useCore();

  const [formulario, setFormulario] = useState(formInicial());
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  const ordenesTrabajoDisponibles = useMemo(() => {
    return ordenesTrabajo.filter((orden) => {
      const estado = orden.estado || '';
      return estado !== 'Cancelada' && estado !== 'Anulada';
    });
  }, [ordenesTrabajo]);

  const obtenerEmpresaNombre = (orden) => {
    return orden.empresaNombre || orden.empresa || orden.cliente || '';
  };

  const obtenerContactoNombre = (orden) => {
    return orden.contactoNombre || orden.contacto || '';
  };

  const cambiarFormulario = (e) => {
    const { name, value } = e.target;

    setFormulario((prev) => {
      if (name === 'ordenTrabajoId') {
        const ordenSeleccionada = ordenesTrabajo.find((orden) => orden.id === value);

        if (!ordenSeleccionada) {
          return {
            ...prev,
            ordenTrabajoId: '',
            ordenTrabajoCodigo: '',
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
            material: '',
            materiales: '',
            medidas: '',
            nota: prev.nota,
          };
        }

        const empresaNombre = obtenerEmpresaNombre(ordenSeleccionada);
        const contactoNombre = obtenerContactoNombre(ordenSeleccionada);
        const materiales = ordenSeleccionada.materiales || ordenSeleccionada.material || '';

        return {
          ...prev,
          ordenTrabajoId: ordenSeleccionada.id,
          ordenTrabajoCodigo: ordenSeleccionada.codigo || '',
          pedidoId: ordenSeleccionada.pedidoId || '',
          pedidoCodigo: ordenSeleccionada.pedidoCodigo || '',
          cotizacionId: ordenSeleccionada.cotizacionId || '',
          cotizacionCodigo: ordenSeleccionada.cotizacionCodigo || '',
          empresaId: ordenSeleccionada.empresaId || '',
          empresaNombre,
          contactoId: ordenSeleccionada.contactoId || '',
          contactoNombre,
          cliente: empresaNombre,
          telefono: ordenSeleccionada.telefono || '',
          producto: ordenSeleccionada.producto || ordenSeleccionada.descripcion || '',
          unidadNegocio: ordenSeleccionada.unidadNegocio || 'ELANKAV VISUAL',
          cantidad: String(ordenSeleccionada.cantidad || ''),
          total: String(ordenSeleccionada.total || ''),
          material: materiales,
          materiales,
          medidas: ordenSeleccionada.medidas || '',
          nota: prev.nota || ordenSeleccionada.observaciones || '',
        };
      }

      return { ...prev, [name]: value };
    });
  };

  const limpiarFormulario = () => {
    setFormulario(formInicial());
    setEditandoId(null);
  };

  const guardarOrden = (e) => {
    e.preventDefault();

    if (!formulario.ordenTrabajoId && !formulario.cliente.trim()) {
      alert('Debés seleccionar una orden de trabajo o indicar el cliente.');
      return;
    }

    if (!formulario.producto.trim()) {
      alert('Debés indicar el producto o trabajo a producir.');
      return;
    }

    const ordenSeleccionada = ordenesTrabajo.find(
      (orden) => orden.id === formulario.ordenTrabajoId
    );

    const empresaNombre =
      formulario.empresaNombre ||
      (ordenSeleccionada ? obtenerEmpresaNombre(ordenSeleccionada) : '') ||
      formulario.cliente;

    const contactoNombre =
      formulario.contactoNombre ||
      (ordenSeleccionada ? obtenerContactoNombre(ordenSeleccionada) : '');

    const datosOrden = {
      codigo: formulario.codigo.trim() || `PROD-${Date.now()}`,
      ordenTrabajoId: formulario.ordenTrabajoId,
      ordenTrabajoCodigo:
        formulario.ordenTrabajoCodigo || ordenSeleccionada?.codigo || '',
      pedidoId: formulario.pedidoId || ordenSeleccionada?.pedidoId || '',
      pedidoCodigo: formulario.pedidoCodigo || ordenSeleccionada?.pedidoCodigo || '',
      cotizacionId: formulario.cotizacionId || ordenSeleccionada?.cotizacionId || '',
      cotizacionCodigo:
        formulario.cotizacionCodigo || ordenSeleccionada?.cotizacionCodigo || '',
      empresaId: formulario.empresaId || ordenSeleccionada?.empresaId || '',
      empresaNombre,
      contactoId: formulario.contactoId || ordenSeleccionada?.contactoId || '',
      contactoNombre,
      cliente: formulario.cliente.trim() || empresaNombre,
      telefono: formulario.telefono.trim(),
      producto: formulario.producto.trim(),
      unidadNegocio: formulario.unidadNegocio,
      cantidad: Number(formulario.cantidad) || 0,
      total: Number(formulario.total) || 0,
      material: formulario.material.trim(),
      materiales: formulario.materiales.trim(),
      medidas: formulario.medidas.trim(),
      responsable: formulario.responsable.trim(),
      fechaInicio: formulario.fechaInicio,
      fechaEntrega: formulario.fechaEntrega,
      etapa: formulario.etapa,
      prioridad: formulario.prioridad,
      avance: Number(formulario.avance || 0),
      nota: formulario.nota.trim(),
      actualizado: new Date().toISOString(),
    };

    if (editandoId) {
      actualizarProduccion(editandoId, datosOrden);
    } else {
      crearProduccion(datosOrden);
    }

    limpiarFormulario();
  };

  const editarOrden = (orden) => {
    const ordenTrabajo = ordenesTrabajo.find(
      (item) => item.id === orden.ordenTrabajoId
    );

    setFormulario({
      codigo: orden.codigo || '',
      ordenTrabajoId: orden.ordenTrabajoId || '',
      ordenTrabajoCodigo: orden.ordenTrabajoCodigo || ordenTrabajo?.codigo || '',
      pedidoId: orden.pedidoId || ordenTrabajo?.pedidoId || '',
      pedidoCodigo: orden.pedidoCodigo || ordenTrabajo?.pedidoCodigo || '',
      cotizacionId: orden.cotizacionId || ordenTrabajo?.cotizacionId || '',
      cotizacionCodigo:
        orden.cotizacionCodigo || ordenTrabajo?.cotizacionCodigo || '',
      empresaId: orden.empresaId || ordenTrabajo?.empresaId || '',
      empresaNombre:
        orden.empresaNombre ||
        (ordenTrabajo ? obtenerEmpresaNombre(ordenTrabajo) : '') ||
        orden.empresa ||
        orden.cliente ||
        '',
      contactoId: orden.contactoId || ordenTrabajo?.contactoId || '',
      contactoNombre:
        orden.contactoNombre ||
        (ordenTrabajo ? obtenerContactoNombre(ordenTrabajo) : '') ||
        orden.contacto ||
        '',
      cliente:
        orden.cliente ||
        orden.empresaNombre ||
        (ordenTrabajo ? obtenerEmpresaNombre(ordenTrabajo) : '') ||
        '',
      telefono: orden.telefono || ordenTrabajo?.telefono || '',
      producto: orden.producto || ordenTrabajo?.producto || '',
      unidadNegocio: orden.unidadNegocio || ordenTrabajo?.unidadNegocio || 'ELANKAV VISUAL',
      cantidad: String(orden.cantidad || ordenTrabajo?.cantidad || ''),
      total: String(orden.total || ordenTrabajo?.total || ''),
      material: orden.material || orden.materiales || ordenTrabajo?.materiales || '',
      materiales: orden.materiales || ordenTrabajo?.materiales || '',
      medidas: orden.medidas || ordenTrabajo?.medidas || '',
      responsable: orden.responsable || '',
      fechaInicio: orden.fechaInicio || fechaActual(),
      fechaEntrega: orden.fechaEntrega || '',
      etapa: orden.etapa || 'Pendiente',
      prioridad: orden.prioridad || 'Media',
      avance: String(orden.avance || ''),
      nota: orden.nota || orden.observaciones || '',
    });

    setEditandoId(orden.id);
  };

  const eliminarOrden = (id) => {
    const confirmar = window.confirm(
      '¿Seguro que querés eliminar esta orden de producción?'
    );
    if (!confirmar) return;

    eliminarProduccion(id);

    if (editandoId === id) {
      limpiarFormulario();
    }
  };

  const ordenesFiltradas = useMemo(() => {
    return produccion.filter((orden) =>
      `${orden.codigo} ${orden.ordenTrabajoCodigo} ${orden.pedidoCodigo} ${orden.cotizacionCodigo} ${orden.cliente} ${orden.empresaNombre} ${orden.contactoNombre} ${orden.producto} ${orden.material} ${orden.materiales} ${orden.responsable} ${orden.etapa} ${orden.prioridad}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  }, [produccion, busqueda]);

  const resumen = useMemo(() => {
    return {
      total: produccion.length,
      pendientes: produccion.filter((orden) => orden.etapa === 'Pendiente')
        .length,
      produccion: produccion.filter((orden) => orden.etapa === 'Fabricando')
        .length,
      listas: produccion.filter((orden) => orden.etapa === 'Completado').length,
      entregadas: produccion.filter((orden) => orden.etapa === 'Cancelado')
        .length,
    };
  }, [produccion]);

  return (
    <div className="crm-page">
      <div className="crm-page-header">
        <div>
          <h2>Producción</h2>
          <p>
            Control conectado a órdenes de trabajo, pedidos, cotizaciones,
            empresas y contactos.
          </p>
        </div>
      </div>

      <div className="crm-stats">
        <div className="crm-stat-card">
          <span>Órdenes</span>
          <strong>{resumen.total}</strong>
        </div>

        <div className="crm-stat-card">
          <span>Pendientes</span>
          <strong>{resumen.pendientes}</strong>
        </div>

        <div className="crm-stat-card">
          <span>Fabricando</span>
          <strong>{resumen.produccion}</strong>
        </div>

        <div className="crm-stat-card">
          <span>Completadas</span>
          <strong>{resumen.listas}</strong>
        </div>

        <div className="crm-stat-card">
          <span>Canceladas</span>
          <strong>{resumen.entregadas}</strong>
        </div>
      </div>

      <div className="crm-grid">
        <form className="crm-card" onSubmit={guardarOrden}>
          <h3>{editandoId ? 'Editar orden' : 'Nueva orden de producción'}</h3>

          <label>
            Orden de trabajo
            <select
              name="ordenTrabajoId"
              value={formulario.ordenTrabajoId}
              onChange={cambiarFormulario}
            >
              <option value="">Seleccionar orden de trabajo</option>
              {ordenesTrabajoDisponibles.map((orden) => (
                <option key={orden.id} value={orden.id}>
                  {orden.codigo || 'Sin código'} -{' '}
                  {obtenerEmpresaNombre(orden) || 'Sin cliente'} -{' '}
                  {orden.producto || orden.descripcion || 'Sin trabajo'}
                </option>
              ))}
            </select>
          </label>

          <label>
            Código producción
            <input
              name="codigo"
              value={formulario.codigo}
              onChange={cambiarFormulario}
              placeholder="Ej: PROD-0001"
            />
          </label>

          <label>
            Empresa / Cliente
            <input
              name="cliente"
              value={formulario.cliente}
              onChange={cambiarFormulario}
              placeholder="Se completa desde la OT"
              readOnly={Boolean(formulario.ordenTrabajoId)}
            />
          </label>

          <label>
            Contacto
            <input
              name="contactoNombre"
              value={formulario.contactoNombre}
              onChange={cambiarFormulario}
              placeholder="Contacto relacionado"
              readOnly={Boolean(formulario.ordenTrabajoId)}
            />
          </label>


          <label>
            Unidad de negocio
            <select
              name="unidadNegocio"
              value={formulario.unidadNegocio}
              onChange={cambiarFormulario}
            >
              {UNIDADES_NEGOCIO.map((unidad) => (
                <option key={unidad} value={unidad}>
                  {unidad}
                </option>
              ))}
            </select>
          </label>

          <label>
            Pedido relacionado
            <input
              name="pedidoCodigo"
              value={formulario.pedidoCodigo}
              onChange={cambiarFormulario}
              placeholder="Se completa desde la OT"
              readOnly={Boolean(formulario.ordenTrabajoId)}
            />
          </label>

          <label>
            Cotización relacionada
            <input
              name="cotizacionCodigo"
              value={formulario.cotizacionCodigo}
              onChange={cambiarFormulario}
              placeholder="Se completa desde la OT"
              readOnly={Boolean(formulario.ordenTrabajoId)}
            />
          </label>

          <label>
            Producto / Trabajo
            <input
              name="producto"
              value={formulario.producto}
              onChange={cambiarFormulario}
              placeholder="Ej: Rótulo luminoso, impresión, acrílico..."
              readOnly={Boolean(formulario.ordenTrabajoId)}
            />
          </label>

          <label>
            Cantidad
            <input
              name="cantidad"
              type="number"
              min="0"
              value={formulario.cantidad}
              onChange={cambiarFormulario}
              placeholder="0"
            />
          </label>

          <label>
            Total relacionado
            <input
              name="total"
              type="number"
              min="0"
              step="0.01"
              value={formulario.total}
              onChange={cambiarFormulario}
              placeholder="0.00"
              readOnly={Boolean(formulario.ordenTrabajoId)}
            />
          </label>

          <label>
            Material principal
            <input
              name="material"
              value={formulario.material}
              onChange={cambiarFormulario}
              placeholder="Ej: PVC, acrílico, vinil, lona..."
            />
          </label>

          <label>
            Responsable
            <input
              name="responsable"
              value={formulario.responsable}
              onChange={cambiarFormulario}
              placeholder="Ej: Erick Cano"
            />
          </label>

          <label>
            Fecha de inicio
            <input
              name="fechaInicio"
              type="date"
              value={formulario.fechaInicio}
              onChange={cambiarFormulario}
            />
          </label>

          <label>
            Fecha de entrega
            <input
              name="fechaEntrega"
              type="date"
              value={formulario.fechaEntrega}
              onChange={cambiarFormulario}
            />
          </label>

          <label>
            Etapa
            <select
              name="etapa"
              value={formulario.etapa}
              onChange={cambiarFormulario}
            >
              <option>Pendiente</option>
              <option>Fabricando</option>
              <option>Instalación</option>
              <option>Completado</option>
              <option>Cancelado</option>
            </select>
          </label>

          <label>
            Prioridad
            <select
              name="prioridad"
              value={formulario.prioridad}
              onChange={cambiarFormulario}
            >
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
              <option>Urgente</option>
            </select>
          </label>

          <label>
            Avance %
            <input
              name="avance"
              type="number"
              min="0"
              max="100"
              value={formulario.avance}
              onChange={cambiarFormulario}
              placeholder="Ej: 50"
            />
          </label>

          <label>
            Materiales requeridos
            <textarea
              name="materiales"
              rows="3"
              value={formulario.materiales}
              onChange={cambiarFormulario}
              placeholder="Materiales requeridos para producción..."
            />
          </label>

          <label>
            Medidas / Especificaciones
            <textarea
              name="medidas"
              rows="3"
              value={formulario.medidas}
              onChange={cambiarFormulario}
              placeholder="Medidas, acabados, cantidades o detalles físicos..."
            />
          </label>

          <label>
            Nota técnica
            <textarea
              name="nota"
              rows="4"
              value={formulario.nota}
              onChange={cambiarFormulario}
              placeholder="Detalles de producción, pendientes, instalación o control interno..."
            />
          </label>

          <div className="crm-actions">
            <button type="submit">
              {editandoId ? 'Guardar cambios' : 'Agregar orden'}
            </button>

            {editandoId && (
              <button type="button" onClick={limpiarFormulario}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>

        <div className="crm-card">
          <div className="crm-toolbar">
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por cliente, OT, pedido, producto, etapa..."
            />
          </div>

          <div className="crm-table-wrapper">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Producción</th>
                  <th>OT</th>
                  <th>Empresa</th>
                  <th>Contacto</th>
                  <th>Pedido</th>
                  <th>Producto</th>
                  <th>Material</th>
                  <th>Responsable</th>
                  <th>Entrega</th>
                  <th>Etapa</th>
                  <th>Unidad</th>
                  <th>Avance</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {ordenesFiltradas.length > 0 ? (
                  ordenesFiltradas.map((orden) => (
                    <tr key={orden.id}>
                      <td>{orden.codigo || 'Sin código'}</td>
                      <td>{orden.ordenTrabajoCodigo || 'Sin OT'}</td>
                      <td>
                        {orden.empresaNombre || orden.empresa || orden.cliente || 'Sin empresa'}
                      </td>
                      <td>{orden.contactoNombre || orden.contacto || 'Sin contacto'}</td>
                      <td>{orden.pedidoCodigo || orden.pedido || 'Sin pedido'}</td>
                      <td>{orden.producto || 'Sin producto'}</td>
                      <td>{orden.material || orden.materiales || 'Sin material'}</td>
                      <td>{orden.responsable || 'Sin asignar'}</td>
                      <td>{orden.fechaEntrega || 'Sin fecha'}</td>
                      <td>{orden.etapa || 'Pendiente'}</td>
                      <td>{orden.unidadNegocio || 'ELANKAV VISUAL'}</td>
                      <td>{orden.avance || 0}%</td>
                      <td>
                        <div className="crm-row-actions">
                          <button type="button" onClick={() => editarOrden(orden)}>
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => eliminarOrden(orden.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13">
                      No hay órdenes de producción registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="crm-note">
            Producción ya está conectada con órdenes de trabajo, pedidos,
            cotizaciones, empresas y contactos mediante IDs reales.
          </div>
        </div>
      </div>
    </div>
  );
}
