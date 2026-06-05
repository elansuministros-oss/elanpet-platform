import React, { useMemo, useState } from 'react';
import { Camera, ClipboardList, PackageCheck, Save } from 'lucide-react';
import { estadosProduccion, etiquetasEstado, useApp } from '../context/AppContext';

const evidenciaLabels = {
  inicial: 'Foto inicial',
  proceso: 'Foto proceso',
  terminado: 'Foto terminado',
  entrega: 'Foto entrega',
};

const estadoDefault = 'pendiente';

function estadoPedido(pedido) {
  return pedido.estadoProduccion || pedido.ordenTrabajo?.estadoProduccion || estadoDefault;
}

function crearOTBase(pedido) {
  const items = pedido.items || [];
  return {
    codigoOT:
      pedido.ordenTrabajo?.codigoOT ||
      `OT-${String(pedido.codigoSeguimiento || pedido.numero || pedido.id || Date.now()).replace(/[^0-9]/g, '').slice(-6)}`,
    pedido: pedido.codigoSeguimiento || pedido.numero || '',
    cliente: pedido.cliente?.nombre || '',
    veterinaria: pedido.veterinaria?.nombre || '',
    producto: items.map((item) => item.nombre).join(', '),
    cantidad: items.reduce((total, item) => total + Number(item.cantidad || 0), 0),
    responsable: pedido.ordenTrabajo?.responsable || '',
    observaciones: pedido.ordenTrabajo?.observaciones || '',
    fecha: pedido.ordenTrabajo?.fecha || pedido.createdAt || new Date().toISOString(),
    estadoProduccion: estadoPedido(pedido),
    evidencias: {
      inicial: '',
      proceso: '',
      terminado: '',
      entrega: '',
      ...(pedido.ordenTrabajo?.evidencias || {}),
    },
  };
}

function leerArchivoComoBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProduccionPanel() {
  const {
    usuario,
    pedidos,
    cambiarEstadoProduccion,
    actualizarOrdenTrabajo,
    guardarEvidenciaProduccion,
  } = useApp();

  const [pedidoActivoId, setPedidoActivoId] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');

  const tieneAcceso = usuario?.rol === 'admin' || usuario?.rol === 'produccion';

  const pedidosProduccion = useMemo(() => {
    return pedidos
      .filter((pedido) => pedido.estado !== 'cancelado')
      .filter((pedido) => {
        const texto = `${pedido.codigoSeguimiento || ''} ${pedido.numero || ''} ${pedido.cliente?.nombre || ''} ${pedido.veterinaria?.nombre || ''}`.toLowerCase();
        return texto.includes(busqueda.toLowerCase().trim());
      })
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [pedidos, busqueda]);

  const conteos = useMemo(() => {
    return estadosProduccion.reduce((acc, estado) => {
      acc[estado] = pedidos.filter((pedido) => estadoPedido(pedido) === estado).length;
      return acc;
    }, {});
  }, [pedidos]);

  const pedidoActivo = pedidosProduccion.find((pedido) => pedido.id === pedidoActivoId) || pedidosProduccion[0];
  const ot = pedidoActivo ? crearOTBase(pedidoActivo) : null;

  const guardarCampoOT = (campo, valor) => {
    if (!pedidoActivo) return;
    actualizarOrdenTrabajo(pedidoActivo, { ...ot, [campo]: valor });
    setMensaje('Orden de trabajo actualizada.');
  };

  const cambiarEstado = (estado) => {
    if (!pedidoActivo) return;
    cambiarEstadoProduccion(pedidoActivo, estado);
    setMensaje(`Estado actualizado: ${etiquetasEstado[estado] || estado}.`);
  };

  const subirEvidencia = async (tipo, file) => {
    if (!pedidoActivo || !file) return;

    try {
      const imagen = await leerArchivoComoBase64(file);
      guardarEvidenciaProduccion(pedidoActivo, tipo, imagen);
      setMensaje(`${evidenciaLabels[tipo]} guardada.`);
    } catch {
      setMensaje('No se pudo cargar la imagen.');
    }
  };

  if (!tieneAcceso) {
    return (
      <main>
        <section className="panel">
          <h1>Acceso restringido</h1>
          <p>Este panel es solo para administración y producción.</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <h1>Producción ELANPET</h1>

      <section className="dashboard produccion-dashboard">
        {estadosProduccion.map((estado) => (
          <article className="panel stat-card" key={estado}>
            <span>{etiquetasEstado[estado] || estado}</span>
            <b>{conteos[estado] || 0}</b>
          </article>
        ))}
      </section>

      <section className="panel section-block">
        <h2>
          <ClipboardList size={20} /> Órdenes de trabajo
        </h2>

        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por pedido, cliente o veterinaria"
        />

        {pedidosProduccion.length === 0 ? (
          <p>No hay pedidos para producción todavía.</p>
        ) : (
          <div className="produccion-layout">
            <div className="produccion-lista">
              {pedidosProduccion.map((pedido) => (
                <button
                  type="button"
                  key={pedido.id}
                  className={`produccion-item ${pedidoActivo?.id === pedido.id ? 'active' : ''}`}
                  onClick={() => setPedidoActivoId(pedido.id)}
                >
                  <strong>{pedido.codigoSeguimiento || pedido.numero}</strong>
                  <span>{pedido.cliente?.nombre || 'Cliente sin nombre'}</span>
                  <small>{etiquetasEstado[estadoPedido(pedido)] || estadoPedido(pedido)}</small>
                </button>
              ))}
            </div>

            {pedidoActivo && ot && (
              <div className="produccion-detalle">
                <div className="ot-header">
                  <div>
                    <span className="badge">Orden de Trabajo</span>
                    <h2>{ot.codigoOT}</h2>
                  </div>
                  <PackageCheck size={32} />
                </div>

                <div className="form-grid">
                  <label>
                    Código OT
                    <input value={ot.codigoOT} onChange={(e) => guardarCampoOT('codigoOT', e.target.value)} />
                  </label>

                  <label>
                    Pedido
                    <input value={ot.pedido} readOnly />
                  </label>

                  <label>
                    Cliente
                    <input value={ot.cliente} readOnly />
                  </label>

                  <label>
                    Veterinaria
                    <input value={ot.veterinaria} readOnly />
                  </label>

                  <label>
                    Producto
                    <input value={ot.producto} readOnly />
                  </label>

                  <label>
                    Cantidad
                    <input value={ot.cantidad} readOnly />
                  </label>

                  <label>
                    Responsable
                    <input value={ot.responsable} onChange={(e) => guardarCampoOT('responsable', e.target.value)} placeholder="Nombre del responsable" />
                  </label>

                  <label>
                    Fecha
                    <input type="date" value={String(ot.fecha || '').slice(0, 10)} onChange={(e) => guardarCampoOT('fecha', e.target.value)} />
                  </label>

                  <label className="full-row">
                    Observaciones
                    <textarea value={ot.observaciones} onChange={(e) => guardarCampoOT('observaciones', e.target.value)} placeholder="Notas internas de producción" rows={3} />
                  </label>
                </div>

                <div className="estado-produccion-bar">
                  {estadosProduccion.map((estado) => (
                    <button
                      type="button"
                      key={estado}
                      className={estadoPedido(pedidoActivo) === estado ? 'active' : ''}
                      onClick={() => cambiarEstado(estado)}
                    >
                      {etiquetasEstado[estado] || estado}
                    </button>
                  ))}
                </div>

                <section className="evidencias-grid">
                  {Object.entries(evidenciaLabels).map(([tipo, label]) => (
                    <article className="evidencia-card" key={tipo}>
                      <h3>
                        <Camera size={17} /> {label}
                      </h3>
                      {ot.evidencias?.[tipo] ? (
                        <img src={ot.evidencias[tipo]} alt={label} />
                      ) : (
                        <div className="evidencia-placeholder">Sin imagen</div>
                      )}
                      <input type="file" accept="image/*" onChange={(e) => subirEvidencia(tipo, e.target.files?.[0])} />
                    </article>
                  ))}
                </section>

                {mensaje && (
                  <p className="success-msg">
                    <Save size={16} /> {mensaje}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
