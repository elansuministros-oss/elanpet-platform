import React, { useMemo, useState } from 'react';
import { useCore } from '../core/context/CoreContext';

export default function Materiales() {
  const {
    materiales,
    crearMaterial,
    actualizarMaterial,
    eliminarMaterial,
  } = useCore();
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    codigo: '',
    nombre: '',
    categoria: 'Acrílico',
    tipo: '',
    espesor: '',
    medida: '',
    unidad: 'Lámina',
    costo: '',
    moneda: 'C$',
    proveedor: '',
    uso: '',
    stock: '',
    stockMinimo: '',
    estado: 'Activo',
    observaciones: '',
  });

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const limpiar = () => {
    setForm({
      codigo: '',
      nombre: '',
      categoria: 'Acrílico',
      tipo: '',
      espesor: '',
      medida: '',
      unidad: 'Lámina',
      costo: '',
      moneda: 'C$',
      proveedor: '',
      uso: '',
      stock: '',
      stockMinimo: '',
      estado: 'Activo',
      observaciones: '',
    });

    setEditandoId(null);
  };

  const guardar = (e) => {
    e.preventDefault();

    if (!form.nombre.trim()) return;

    const datos = {
      ...form,
      id: editandoId || `mat-${Date.now()}`,
      codigo: form.codigo.trim() || `MAT-${Date.now()}`,
      nombre: form.nombre.trim(),
      tipo: form.tipo.trim(),
      espesor: form.espesor.trim(),
      medida: form.medida.trim(),
      proveedor: form.proveedor.trim(),
      uso: form.uso.trim(),
      observaciones: form.observaciones.trim(),
      costo: Number(form.costo) || 0,
      stock: Number(form.stock) || 0,
      stockMinimo: Number(form.stockMinimo) || 0,
      actualizado: new Date().toISOString(),
    };

    if (editandoId) {
      setMateriales((prev) =>
        prev.map((item) => (item.id === editandoId ? datos : item))
      );
    } else {
      setMateriales((prev) => [datos, ...prev]);
    }

    limpiar();
  };

  const editar = (item) => {
    setEditandoId(item.id);

    setForm({
      codigo: item.codigo || '',
      nombre: item.nombre || '',
      categoria: item.categoria || 'Acrílico',
      tipo: item.tipo || '',
      espesor: item.espesor || '',
      medida: item.medida || '',
      unidad: item.unidad || 'Lámina',
      costo: String(item.costo || ''),
      moneda: item.moneda || 'C$',
      proveedor: item.proveedor || '',
      uso: item.uso || '',
      stock: String(item.stock || ''),
      stockMinimo: String(item.stockMinimo || ''),
      estado: item.estado || 'Activo',
      observaciones: item.observaciones || '',
    });
  };

  const eliminar = (id) => {
    setMateriales((prev) => prev.filter((item) => item.id !== id));
    if (editandoId === id) limpiar();
  };

  const resumen = useMemo(() => {
    const activos = materiales.filter((item) => item.estado === 'Activo').length;

    const bajoStock = materiales.filter(
      (item) =>
        Number(item.stockMinimo) > 0 &&
        Number(item.stock) <= Number(item.stockMinimo)
    ).length;

    const valorTotal = materiales.reduce(
      (acc, item) => acc + (Number(item.stock) || 0) * (Number(item.costo) || 0),
      0
    );

    return {
      total: materiales.length,
      activos,
      bajoStock,
      valorTotal,
    };
  }, [materiales]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Materiales</h2>
          <p>Base técnica de materiales, medidas, espesores, costos y proveedores.</p>
        </div>
      </div>

      <div className="crm-resumen">
        <div className="crm-card">
          <span>Total materiales</span>
          <strong>{resumen.total}</strong>
        </div>

        <div className="crm-card">
          <span>Activos</span>
          <strong>{resumen.activos}</strong>
        </div>

        <div className="crm-card">
          <span>Bajo stock</span>
          <strong>{resumen.bajoStock}</strong>
        </div>

        <div className="crm-card">
          <span>Valor estimado</span>
          <strong>C$ {resumen.valorTotal.toFixed(2)}</strong>
        </div>
      </div>

      <form className="crm-form" onSubmit={guardar}>
        <h3>{editandoId ? 'Editar material' : 'Nuevo material'}</h3>

        <div className="form-grid">
          <label>
            Código
            <input
              name="codigo"
              value={form.codigo}
              onChange={cambiar}
              placeholder="MAT-0001"
            />
          </label>

          <label>
            Nombre del material
            <input
              name="nombre"
              value={form.nombre}
              onChange={cambiar}
              placeholder="Ej: Acrílico transparente"
            />
          </label>

          <label>
            Categoría
            <select name="categoria" value={form.categoria} onChange={cambiar}>
              <option>Acrílico</option>
              <option>PVC</option>
              <option>Vinil</option>
              <option>Lona</option>
              <option>Policarbonato</option>
              <option>Aluminio</option>
              <option>Hierro</option>
              <option>Acero inoxidable</option>
              <option>Madera</option>
              <option>LED / Iluminación</option>
              <option>Pintura</option>
              <option>Adhesivo</option>
              <option>Herraje</option>
              <option>Cuero</option>
              <option>Tela</option>
              <option>Otro</option>
            </select>
          </label>

          <label>
            Tipo / acabado
            <input
              name="tipo"
              value={form.tipo}
              onChange={cambiar}
              placeholder="Transparente, lechoso, espejo, mate"
            />
          </label>

          <label>
            Espesor
            <input
              name="espesor"
              value={form.espesor}
              onChange={cambiar}
              placeholder="Ej: 3 mm, 5 mm, 10 mm"
            />
          </label>

          <label>
            Medida comercial
            <input
              name="medida"
              value={form.medida}
              onChange={cambiar}
              placeholder="Ej: 1.22 x 2.44 m"
            />
          </label>

          <label>
            Unidad
            <select name="unidad" value={form.unidad} onChange={cambiar}>
              <option>Lámina</option>
              <option>Rollo</option>
              <option>Metro</option>
              <option>Metro cuadrado</option>
              <option>Metro lineal</option>
              <option>Unidad</option>
              <option>Caja</option>
              <option>Paquete</option>
              <option>Galón</option>
              <option>Litro</option>
            </select>
          </label>

          <label>
            Costo
            <input
              type="number"
              name="costo"
              value={form.costo}
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
              placeholder="Proveedor principal"
            />
          </label>

          <label>
            Stock
            <input
              type="number"
              name="stock"
              value={form.stock}
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
            Estado
            <select name="estado" value={form.estado} onChange={cambiar}>
              <option>Activo</option>
              <option>Inactivo</option>
              <option>Agotado</option>
              <option>Descontinuado</option>
            </select>
          </label>
        </div>

        <label>
          Uso recomendado
          <textarea
            name="uso"
            value={form.uso}
            onChange={cambiar}
            placeholder="Ej: letras 3D, fondos, cajas de luz, botones acrílicos, estructuras, impresión"
            rows="3"
          />
        </label>

        <label>
          Observaciones técnicas
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={cambiar}
            placeholder="Notas sobre corte, instalación, resistencia, iluminación, acabado o proveedor"
            rows="3"
          />
        </label>

        <div className="form-actions">
          <button type="submit">
            {editandoId ? 'Actualizar material' : 'Guardar material'}
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
              <th>Material</th>
              <th>Categoría</th>
              <th>Medida</th>
              <th>Stock</th>
              <th>Costo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {materiales.length === 0 ? (
              <tr>
                <td colSpan="8">No hay materiales registrados.</td>
              </tr>
            ) : (
              materiales.map((item) => {
                const bajoStock =
                  Number(item.stockMinimo) > 0 &&
                  Number(item.stock) <= Number(item.stockMinimo);

                return (
                  <tr key={item.id}>
                    <td>{item.codigo}</td>

                    <td>
                      <strong>{item.nombre}</strong>
                      <br />
                      <small>{item.tipo || 'Sin acabado definido'}</small>
                    </td>

                    <td>{item.categoria}</td>

                    <td>
                      {item.medida || 'Sin medida'}
                      <br />
                      <small>{item.espesor || 'Sin espesor'}</small>
                    </td>

                    <td>
                      {item.stock} {item.unidad}
                      {bajoStock && (
                        <>
                          <br />
                          <small>Stock bajo</small>
                        </>
                      )}
                    </td>

                    <td>
                      {item.moneda} {Number(item.costo || 0).toFixed(2)}
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