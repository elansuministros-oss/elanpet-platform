import React, { useMemo, useState } from 'react';
import { useCore } from '../core/context/CoreContext';

export default function Produccion() {
  const {
    produccion,
    crearProduccion,
    actualizarProduccion,
    eliminarProduccion,
  } = useCore();

  const ordenes = produccion;

  const [formulario, setFormulario] = useState({
    codigo: '',
    cliente: '',
    pedido: '',
    producto: '',
    material: '',
    responsable: '',
    fechaInicio: '',
    fechaEntrega: '',
    etapa: 'Pendiente',
    prioridad: 'Media',
    avance: '',
    nota: '',
  });

  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  const limpiarFormulario = () => {
    setFormulario({
      codigo: '',
      cliente: '',
      pedido: '',
      producto: '',
      material: '',
      responsable: '',
      fechaInicio: '',
      fechaEntrega: '',
      etapa: 'Pendiente',
      prioridad: 'Media',
      avance: '',
      nota: '',
    });

    setEditandoId(null);
  };

  const guardarOrden = (e) => {
    e.preventDefault();

    if (!formulario.cliente.trim() || !formulario.producto.trim()) {
      alert('Debés ingresar cliente y producto.');
      return;
    }

    const datosOrden = {
      ...formulario,
      codigo: formulario.codigo || `OT-${Date.now()}`,
      avance: Number(formulario.avance || 0),
    };

    if (editandoId) {
      setOrdenes((prev) =>
        prev.map((orden) =>
          orden.id === editandoId ? { ...datosOrden, id: editandoId } : orden
        )
      );
    } else {
      setOrdenes((prev) => [{ ...datosOrden, id: Date.now() }, ...prev]);
    }

    limpiarFormulario();
  };

  const editarOrden = (orden) => {
    setFormulario({
      codigo: orden.codigo || '',
      cliente: orden.cliente || '',
      pedido: orden.pedido || '',
      producto: orden.producto || '',
      material: orden.material || '',
      responsable: orden.responsable || '',
      fechaInicio: orden.fechaInicio || '',
      fechaEntrega: orden.fechaEntrega || '',
      etapa: orden.etapa || 'Pendiente',
      prioridad: orden.prioridad || 'Media',
      avance: orden.avance || '',
      nota: orden.nota || '',
    });

    setEditandoId(orden.id);
  };

  const eliminarOrden = (id) => {
    if (!window.confirm('¿Seguro que querés eliminar esta orden de producción?')) {
      return;
    }

    setOrdenes((prev) => prev.filter((orden) => orden.id !== id));

    if (editandoId === id) {
      limpiarFormulario();
    }
  };

  const ordenesFiltradas = useMemo(() => {
    return ordenes.filter((orden) =>
      `${orden.codigo} ${orden.cliente} ${orden.pedido} ${orden.producto} ${orden.material} ${orden.responsable} ${orden.etapa} ${orden.prioridad}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  }, [ordenes, busqueda]);

  const resumen = useMemo(() => {
    return {
      total: ordenes.length,
      pendientes: ordenes.filter((orden) => orden.etapa === 'Pendiente')
        .length,
      produccion: ordenes.filter((orden) => orden.etapa === 'En producción')
        .length,
      listas: ordenes.filter((orden) => orden.etapa === 'Lista').length,
      entregadas: ordenes.filter((orden) => orden.etapa === 'Entregada')
        .length,
    };
  }, [ordenes]);

  return (
    <div className="crm-page">
      <div className="crm-page-header">
        <div>
          <h2>Producción</h2>
          <p>
            Control de órdenes de trabajo, etapas de producción, responsables y
            fechas de entrega.
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
          <span>En producción</span>
          <strong>{resumen.produccion}</strong>
        </div>

        <div className="crm-stat-card">
          <span>Listas</span>
          <strong>{resumen.listas}</strong>
        </div>

        <div className="crm-stat-card">
          <span>Entregadas</span>
          <strong>{resumen.entregadas}</strong>
        </div>
      </div>

      <div className="crm-grid">
        <form className="crm-card" onSubmit={guardarOrden}>
          <h3>{editandoId ? 'Editar orden' : 'Nueva orden de producción'}</h3>

          <label>
            Código OT
            <input
              value={formulario.codigo}
              onChange={(e) =>
                setFormulario({ ...formulario, codigo: e.target.value })
              }
              placeholder="Ej: OT-0001"
            />
          </label>

          <label>
            Cliente
            <input
              value={formulario.cliente}
              onChange={(e) =>
                setFormulario({ ...formulario, cliente: e.target.value })
              }
              placeholder="Ej: COMEX"
            />
          </label>

          <label>
            Pedido relacionado
            <input
              value={formulario.pedido}
              onChange={(e) =>
                setFormulario({ ...formulario, pedido: e.target.value })
              }
              placeholder="Ej: Pedido #001"
            />
          </label>

          <label>
            Producto / Trabajo
            <input
              value={formulario.producto}
              onChange={(e) =>
                setFormulario({ ...formulario, producto: e.target.value })
              }
              placeholder="Ej: Rótulo luminoso, impresión, acrílico..."
            />
          </label>

          <label>
            Material principal
            <input
              value={formulario.material}
              onChange={(e) =>
                setFormulario({ ...formulario, material: e.target.value })
              }
              placeholder="Ej: PVC, acrílico, vinil, lona..."
            />
          </label>

          <label>
            Responsable
            <input
              value={formulario.responsable}
              onChange={(e) =>
                setFormulario({ ...formulario, responsable: e.target.value })
              }
              placeholder="Ej: Erick Cano"
            />
          </label>

          <label>
            Fecha de inicio
            <input
              type="date"
              value={formulario.fechaInicio}
              onChange={(e) =>
                setFormulario({ ...formulario, fechaInicio: e.target.value })
              }
            />
          </label>

          <label>
            Fecha de entrega
            <input
              type="date"
              value={formulario.fechaEntrega}
              onChange={(e) =>
                setFormulario({ ...formulario, fechaEntrega: e.target.value })
              }
            />
          </label>

          <label>
            Etapa
            <select
              value={formulario.etapa}
              onChange={(e) =>
                setFormulario({ ...formulario, etapa: e.target.value })
              }
            >
              <option>Pendiente</option>
              <option>Diseño</option>
              <option>Materiales</option>
              <option>Corte</option>
              <option>Impresión</option>
              <option>Armado</option>
              <option>Instalación</option>
              <option>En producción</option>
              <option>Lista</option>
              <option>Entregada</option>
              <option>Detenida</option>
              <option>Cancelada</option>
            </select>
          </label>

          <label>
            Prioridad
            <select
              value={formulario.prioridad}
              onChange={(e) =>
                setFormulario({ ...formulario, prioridad: e.target.value })
              }
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
              type="number"
              min="0"
              max="100"
              value={formulario.avance}
              onChange={(e) =>
                setFormulario({ ...formulario, avance: e.target.value })
              }
              placeholder="Ej: 50"
            />
          </label>

          <label>
            Nota técnica
            <textarea
              rows="4"
              value={formulario.nota}
              onChange={(e) =>
                setFormulario({ ...formulario, nota: e.target.value })
              }
              placeholder="Detalles de producción, materiales, medidas o pendientes..."
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
              placeholder="Buscar por cliente, OT, producto, etapa..."
            />
          </div>

          <div className="crm-table-wrapper">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>OT</th>
                  <th>Cliente</th>
                  <th>Pedido</th>
                  <th>Producto</th>
                  <th>Material</th>
                  <th>Responsable</th>
                  <th>Entrega</th>
                  <th>Etapa</th>
                  <th>Avance</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {ordenesFiltradas.length > 0 ? (
                  ordenesFiltradas.map((orden) => (
                    <tr key={orden.id}>
                      <td>{orden.codigo}</td>
                      <td>{orden.cliente}</td>
                      <td>{orden.pedido || 'Sin pedido'}</td>
                      <td>{orden.producto}</td>
                      <td>{orden.material || 'Sin material'}</td>
                      <td>{orden.responsable || 'Sin asignar'}</td>
                      <td>{orden.fechaEntrega || 'Sin fecha'}</td>
                      <td>{orden.etapa}</td>
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
                    <td colSpan="10">
                      No hay órdenes de producción registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="crm-note">
            Este módulo será conectado después con pedidos, materiales,
            inventario y órdenes de trabajo reales.
          </div>
        </div>
      </div>
    </div>
  );
}