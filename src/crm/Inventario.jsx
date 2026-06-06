import React, { useMemo, useState } from 'react';
import { useCore } from '../core/context/CoreContext';

export default function Inventario() {
  const {
    inventario,
    crearInventario,
    actualizarInventario,
    eliminarInventario,
  } = useCore();
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    codigo: '',
    producto: '',
    categoria: 'Material',
    unidad: 'Unidad',
    cantidad: '',
    stockMinimo: '',
    costoUnitario: '',
    moneda: 'C$',
    proveedor: '',
    ubicacion: '',
    estado: 'Disponible',
    fechaIngreso: new Date().toISOString().slice(0, 10),
    observaciones: '',
  });

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const limpiar = () => {
    setForm({
      codigo: '',
      producto: '',
      categoria: 'Material',
      unidad: 'Unidad',
      cantidad: '',
      stockMinimo: '',
      costoUnitario: '',
      moneda: 'C$',
      proveedor: '',
      ubicacion: '',
      estado: 'Disponible',
      fechaIngreso: new Date().toISOString().slice(0, 10),
      observaciones: '',
    });

    setEditandoId(null);
  };

  const guardar = (e) => {
    e.preventDefault();

    if (!form.producto.trim()) return;

    const datos = {
      ...form,
      id: editandoId || `inv-${Date.now()}`,
      codigo: form.codigo.trim() || `INV-${Date.now()}`,
      producto: form.producto.trim(),
      proveedor: form.proveedor.trim(),
      ubicacion: form.ubicacion.trim(),
      observaciones: form.observaciones.trim(),
      cantidad: Number(form.cantidad) || 0,
      stockMinimo: Number(form.stockMinimo) || 0,
      costoUnitario: Number(form.costoUnitario) || 0,
      actualizado: new Date().toISOString(),
    };

    if (editandoId) {
      setInventario((prev) =>
        prev.map((item) => (item.id === editandoId ? datos : item))
      );
    } else {
      setInventario((prev) => [datos, ...prev]);
    }

    limpiar();
  };

  const editar = (item) => {
    setEditandoId(item.id);

    setForm({
      codigo: item.codigo || '',
      producto: item.producto || '',
      categoria: item.categoria || 'Material',
      unidad: item.unidad || 'Unidad',
      cantidad: String(item.cantidad || ''),
      stockMinimo: String(item.stockMinimo || ''),
      costoUnitario: String(item.costoUnitario || ''),
      moneda: item.moneda || 'C$',
      proveedor: item.proveedor || '',
      ubicacion: item.ubicacion || '',
      estado: item.estado || 'Disponible',
      fechaIngreso: item.fechaIngreso || new Date().toISOString().slice(0, 10),
      observaciones: item.observaciones || '',
    });
  };

  const eliminar = (id) => {
    setInventario((prev) => prev.filter((item) => item.id !== id));
    if (editandoId === id) limpiar();
  };

  const resumen = useMemo(() => {
    const valorTotal = inventario.reduce(
      (acc, item) =>
        acc + (Number(item.cantidad) || 0) * (Number(item.costoUnitario) || 0),
      0
    );

    const bajoStock = inventario.filter(
      (item) =>
        Number(item.stockMinimo) > 0 &&
        Number(item.cantidad) <= Number(item.stockMinimo)
    ).length;

    const disponibles = inventario.filter(
      (item) => item.estado === 'Disponible'
    ).length;

    return {
      totalItems: inventario.length,
      valorTotal,
      bajoStock,
      disponibles,
    };
  }, [inventario]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Inventario</h2>
          <p>Control de materiales, productos, herramientas e insumos.</p>
        </div>
      </div>

      <div className="crm-resumen">
        <div className="crm-card">
          <span>Total ítems</span>
          <strong>{resumen.totalItems}</strong>
        </div>

        <div className="crm-card">
          <span>Valor inventario</span>
          <strong>C$ {resumen.valorTotal.toFixed(2)}</strong>
        </div>

        <div className="crm-card">
          <span>Bajo stock</span>
          <strong>{resumen.bajoStock}</strong>
        </div>

        <div className="crm-card">
          <span>Disponibles</span>
          <strong>{resumen.disponibles}</strong>
        </div>
      </div>

      <form className="crm-form" onSubmit={guardar}>
        <h3>{editandoId ? 'Editar ítem' : 'Nuevo ítem de inventario'}</h3>

        <div className="form-grid">
          <label>
            Código
            <input
              name="codigo"
              value={form.codigo}
              onChange={cambiar}
              placeholder="INV-0001"
            />
          </label>

          <label>
            Producto / Material
            <input
              name="producto"
              value={form.producto}
              onChange={cambiar}
              placeholder="Ej: Acrílico transparente 3 mm"
            />
          </label>

          <label>
            Categoría
            <select name="categoria" value={form.categoria} onChange={cambiar}>
              <option>Material</option>
              <option>Producto terminado</option>
              <option>Herramienta</option>
              <option>Equipo</option>
              <option>Insumo</option>
              <option>Consumible</option>
              <option>Repuesto</option>
            </select>
          </label>

          <label>
            Unidad
            <select name="unidad" value={form.unidad} onChange={cambiar}>
              <option>Unidad</option>
              <option>Metro</option>
              <option>Metro cuadrado</option>
              <option>Metro lineal</option>
              <option>Lámina</option>
              <option>Rollo</option>
              <option>Galón</option>
              <option>Litro</option>
              <option>Caja</option>
              <option>Paquete</option>
            </select>
          </label>

          <label>
            Cantidad
            <input
              type="number"
              name="cantidad"
              value={form.cantidad}
              onChange={cambiar}
              placeholder="0"
            />
          </label>

          <label>
            Stock mínimo
            <input
              type="number"
              name="stockMinimo"
              value={form.stockMinimo}
              onChange={cambiar}
              placeholder="0"
            />
          </label>

          <label>
            Costo unitario
            <input
              type="number"
              name="costoUnitario"
              value={form.costoUnitario}
              onChange={cambiar}
              placeholder="0.00"
            />
          </label>

          <label>
            Moneda
            <select name="moneda" value={form.moneda} onChange={cambiar}>
              <option>C$</option>
              <option>$</option>
            </select>
          </label>

          <label>
            Proveedor
            <input
              name="proveedor"
              value={form.proveedor}
              onChange={cambiar}
              placeholder="Nombre del proveedor"
            />
          </label>

          <label>
            Ubicación
            <input
              name="ubicacion"
              value={form.ubicacion}
              onChange={cambiar}
              placeholder="Bodega, taller, estante"
            />
          </label>

          <label>
            Estado
            <select name="estado" value={form.estado} onChange={cambiar}>
              <option>Disponible</option>
              <option>Reservado</option>
              <option>En uso</option>
              <option>Agotado</option>
              <option>Dañado</option>
              <option>Descartado</option>
            </select>
          </label>

          <label>
            Fecha ingreso
            <input
              type="date"
              name="fechaIngreso"
              value={form.fechaIngreso}
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
            placeholder="Notas internas, medidas, espesores, marca, uso o condición"
            rows="3"
          />
        </label>

        <div className="form-actions">
          <button type="submit">
            {editandoId ? 'Actualizar ítem' : 'Guardar ítem'}
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
              <th>Producto / Material</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Costo</th>
              <th>Valor total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {inventario.length === 0 ? (
              <tr>
                <td colSpan="8">No hay ítems registrados en inventario.</td>
              </tr>
            ) : (
              inventario.map((item) => {
                const valorItem =
                  (Number(item.cantidad) || 0) *
                  (Number(item.costoUnitario) || 0);

                const bajoStock =
                  Number(item.stockMinimo) > 0 &&
                  Number(item.cantidad) <= Number(item.stockMinimo);

                return (
                  <tr key={item.id}>
                    <td>{item.codigo}</td>

                    <td>
                      <strong>{item.producto}</strong>
                      <br />
                      <small>{item.proveedor || 'Sin proveedor'}</small>
                    </td>

                    <td>{item.categoria}</td>

                    <td>
                      {item.cantidad} {item.unidad}
                      {bajoStock && (
                        <>
                          <br />
                          <small>Stock bajo</small>
                        </>
                      )}
                    </td>

                    <td>
                      {item.moneda} {Number(item.costoUnitario || 0).toFixed(2)}
                    </td>

                    <td>
                      {item.moneda} {valorItem.toFixed(2)}
                    </td>

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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}