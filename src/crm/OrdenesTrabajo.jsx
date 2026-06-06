import React, { useMemo, useState } from 'react';
import { useCore } from '../core/context/CoreContext';

export default function OrdenesTrabajo() {
  const {
    ordenesTrabajo,
    crearOrdenTrabajo,
    actualizarOrdenTrabajo,
    eliminarOrdenTrabajo,
  } = useCore();
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    codigo: '',
    pedido: '',
    cliente: '',
    empresa: '',
    responsable: '',
    area: 'Producción',
    prioridad: 'Media',
    estado: 'Pendiente',
    fechaInicio: new Date().toISOString().slice(0, 10),
    fechaEntrega: '',
    descripcion: '',
    materiales: '',
    medidas: '',
    observaciones: '',
  });

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const limpiar = () => {
    setForm({
      codigo: '',
      pedido: '',
      cliente: '',
      empresa: '',
      responsable: '',
      area: 'Producción',
      prioridad: 'Media',
      estado: 'Pendiente',
      fechaInicio: new Date().toISOString().slice(0, 10),
      fechaEntrega: '',
      descripcion: '',
      materiales: '',
      medidas: '',
      observaciones: '',
    });

    setEditandoId(null);
  };

  const guardar = (e) => {
    e.preventDefault();

    if (!form.cliente.trim() && !form.empresa.trim()) return;

    const datos = {
      ...form,
      id: editandoId || `ot-${Date.now()}`,
      codigo: form.codigo.trim() || `OT-${Date.now()}`,
      pedido: form.pedido.trim(),
      cliente: form.cliente.trim(),
      empresa: form.empresa.trim(),
      responsable: form.responsable.trim(),
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

    setForm({
      codigo: item.codigo || '',
      pedido: item.pedido || '',
      cliente: item.cliente || '',
      empresa: item.empresa || '',
      responsable: item.responsable || '',
      area: item.area || 'Producción',
      prioridad: item.prioridad || 'Media',
      estado: item.estado || 'Pendiente',
      fechaInicio: item.fechaInicio || new Date().toISOString().slice(0, 10),
      fechaEntrega: item.fechaEntrega || '',
      descripcion: item.descripcion || '',
      materiales: item.materiales || '',
      medidas: item.medidas || '',
      observaciones: item.observaciones || '',
    });
  };

  const eliminar = (id) => {
    eliminarOrdenTrabajo(id);
    if (editandoId === id) limpiar();
  };

  const resumen = useMemo(() => {
    return {
      total: ordenesTrabajo.length,
      pendientes: ordenes.filter((item) => item.estado === 'Pendiente').length,
      proceso: ordenes.filter((item) => item.estado === 'En proceso').length,
      terminadas: ordenes.filter((item) => item.estado === 'Terminada').length,
    };
  }, [ordenesTrabajo]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Órdenes de Trabajo</h2>
          <p>Control operativo de producción, instalación y entregas.</p>
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
            Código OT
            <input
              name="codigo"
              value={form.codigo}
              onChange={cambiar}
              placeholder="OT-0001"
            />
          </label>

          <label>
            Pedido relacionado
            <input
              name="pedido"
              value={form.pedido}
              onChange={cambiar}
              placeholder="PED-0001"
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
            Responsable
            <input
              name="responsable"
              value={form.responsable}
              onChange={cambiar}
              placeholder="Responsable del trabajo"
            />
          </label>

          <label>
            Área
            <select name="area" value={form.area} onChange={cambiar}>
              <option>Diseño</option>
              <option>Producción</option>
              <option>Corte CNC</option>
              <option>Corte láser</option>
              <option>Impresión</option>
              <option>Instalación</option>
              <option>Entrega</option>
              <option>Administración</option>
            </select>
          </label>

          <label>
            Prioridad
            <select name="prioridad" value={form.prioridad} onChange={cambiar}>
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
              <option>Urgente</option>
            </select>
          </label>

          <label>
            Estado
            <select name="estado" value={form.estado} onChange={cambiar}>
              <option>Pendiente</option>
              <option>En proceso</option>
              <option>Pausada</option>
              <option>Terminada</option>
              <option>Entregada</option>
              <option>Cancelada</option>
            </select>
          </label>

          <label>
            Fecha inicio
            <input
              type="date"
              name="fechaInicio"
              value={form.fechaInicio}
              onChange={cambiar}
            />
          </label>

          <label>
            Fecha entrega
            <input
              type="date"
              name="fechaEntrega"
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
            placeholder="Detalle del trabajo a fabricar, producir o instalar"
            rows="4"
          />
        </label>

        <label>
          Medidas
          <textarea
            name="medidas"
            value={form.medidas}
            onChange={cambiar}
            placeholder="Ejemplo: 1.20 m x 0.80 m, PVC 10 mm, acrílico 3 mm"
            rows="3"
          />
        </label>

        <label>
          Materiales
          <textarea
            name="materiales"
            value={form.materiales}
            onChange={cambiar}
            placeholder="Materiales asignados, cantidades, espesores y acabados"
            rows="3"
          />
        </label>

        <label>
          Observaciones
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={cambiar}
            placeholder="Notas internas, pendientes, restricciones o instrucciones especiales"
            rows="3"
          />
        </label>

        <div className="form-actions">
          <button type="submit">
            {editandoId ? 'Actualizar orden' : 'Guardar orden'}
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
              <th>Área</th>
              <th>Responsable</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Entrega</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {ordenesTrabajo.length === 0 ? (
              <tr>
                <td colSpan="8">No hay órdenes de trabajo registradas.</td>
              </tr>
            ) : (
              ordenesTrabajo.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.codigo}</strong>
                    <br />
                    <small>{item.pedido}</small>
                  </td>

                  <td>
                    <strong>{item.cliente || item.empresa}</strong>
                    <br />
                    <small>{item.empresa}</small>
                  </td>

                  <td>{item.area}</td>
                  <td>{item.responsable || 'Sin asignar'}</td>
                  <td>{item.prioridad}</td>
                  <td>{item.estado}</td>
                  <td>{item.fechaEntrega || 'Sin fecha'}</td>

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