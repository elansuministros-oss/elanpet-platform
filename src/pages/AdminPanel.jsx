import { QRCodeCanvas } from 'qrcode.react';
import MediaLibrary from '../components/MediaLibrary';
import React, { useState } from 'react';
import { CreditCard, ImagePlus, Megaphone, Plus, Save, Settings, Store } from 'lucide-react';
import { estadosProduccion, etiquetasEstado, useApp } from '../context/AppContext';
import { formatoC$ } from '../lib/calculos';
import ImageUploader from '../components/ImageUploader';

export default function AdminPanel() {
  const {imagenes, crearImagen, eliminarImagen,
    productos, crearProducto, actualizarProducto,
    veterinarias, crearVeterinaria, eliminarVeterinaria,
actualizarVeterinaria, 
    banners, crearBanner, actualizarBanner,
    trabajos, crearTrabajo, actualizarTrabajo,
    configuracion, setConfiguracion,
    cuentasBancarias, crearCuentaBancaria, actualizarCuentaBancaria,
    pedidos, actualizarPedido, confirmarAnticipo, cambiarEstadoProduccion,
  } = useApp();

  const [tab, setTab] = useState('dashboard');
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', categoria: 'Casas para perros', descripcion: '', medidas: '', precio: '', imagen: '' });
const [productoEditando, setProductoEditando] = useState(null);
  const [nuevoBanner, setNuevoBanner] = useState({ titulo: '', subtitulo: '', ubicacion: 'slider-home', link: 'catalogo', imagen: '', activo: true });
  const [nuevoTrabajo, setNuevoTrabajo] = useState({ titulo: '', tipo: 'Foto', descripcion: '', imagen: '/productos/producto-01.jpg' });
  const [nuevaCuenta, setNuevaCuenta] = useState({ banco: '', titular: '', numero: '', moneda: 'Córdobas' });
  const [nuevaVeterinaria, setNuevaVeterinaria] = useState({
  nombre: '',
  responsable: '',
  whatsapp: '',
  email: '',
  direccion: '',
  comisionPorcentaje: 10,
  logo: '',
  activa: true,
});
const [busquedaVeterinaria, setBusquedaVeterinaria] = useState('');
const [veterinariaEditando, setVeterinariaEditando] = useState(null);

  const guardarConfig = (campo, valor) => setConfiguracion({ ...configuracion, [campo]: valor });
const tabs = [
  'dashboard',
  'productos',
  'banners',
  'trabajos',
  'multimedia',
  'identidad',
  'cuentas',
  'pedidos',
  'produccion',
  'veterinarias',
];
  const agregarProducto = (e) => {
    e.preventDefault();
    if (!nuevoProducto.nombre || !nuevoProducto.precio) return;
    crearProducto({ ...nuevoProducto, precio: Number(nuevoProducto.precio), imagen: nuevoProducto.imagen || '/productos/producto-01.jpg' });
    setNuevoProducto({ nombre: '', categoria: 'Casas para perros', descripcion: '', medidas: '', precio: '', imagen: '' });
  };

  const agregarBanner = (e) => {
    e.preventDefault();
    if (!nuevoBanner.titulo) return;
    crearBanner(nuevoBanner);
    setNuevoBanner({ titulo: '', subtitulo: '', ubicacion: 'slider-home', link: 'catalogo', imagen: '', activo: true });
  };

  const agregarCuenta = (e) => {
    e.preventDefault();
    if (!nuevaCuenta.banco || !nuevaCuenta.numero) return;
    crearCuentaBancaria(nuevaCuenta);
    setNuevaCuenta({ banco: '', titular: '', numero: '', moneda: 'Córdobas' });
  };
const agregarVeterinaria = (e) => {
  e.preventDefault();

  if (!nuevaVeterinaria.nombre) return;

  const datosVeterinaria = {
    ...nuevaVeterinaria,
    comisionPorcentaje: Number(nuevaVeterinaria.comisionPorcentaje) || 10,
  };

  if (veterinariaEditando) {
    actualizarVeterinaria({
      ...veterinariaEditando,
      ...datosVeterinaria,
    });

    setVeterinariaEditando(null);
  } else {
    crearVeterinaria(datosVeterinaria);
  }

  setNuevaVeterinaria({
    nombre: '',
    responsable: '',
    whatsapp: '',
    email: '',
    direccion: '',
    comisionPorcentaje: 10,
    logo: '',
    activa: true,
  });
};
  
  const marcarComisionPagada = (pedido) => actualizarPedido({ ...pedido, comisionEstado: 'pagada' });

  function mensajeSeguimiento(pedido, codigo) {
    return `Hola ${pedido.cliente?.nombre}.\n\nConfirmamos la recepción de tu ${pedido.pagoTipo === 'total' ? 'pago total' : 'anticipo'}.\n\nTu pedido ya fue ingresado a producción.\n\nCódigo de seguimiento:\n${codigo}\n\nConsulta el avance en:\nhttps://elanpet.com/seguimiento\n\nGracias por confiar en ELAN PET.`;
  }

  function confirmarYPedirSeguimiento(pedido) {
    const codigo = confirmarAnticipo(pedido, pedido.pagoTipo);
    const tel = String(pedido.cliente?.whatsapp || '').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${tel}?text=${encodeURIComponent(mensajeSeguimiento(pedido, codigo))}`, '_blank');
  }

  return (
    <main>
      <div className="admin-head">
        <div>
          <span className="badge">Acceso administrador</span>
          <h1>Panel Maestro ELANPET</h1>
        </div>
        <div className="admin-tabs">
          {tabs.map((t) => <button key={t} className={tab === t ? 'nav-active' : ''} onClick={() => setTab(t)}>{t}</button>)}
        </div>
      </div>

      {tab === 'dashboard' && <>
        <div className="cards">
          <div className="kpi"><b>{veterinarias.length}</b><span>Veterinarias</span></div>
          <div className="kpi"><b>{productos.length}</b><span>Productos</span></div>
          <div className="kpi"><b>{pedidos.filter(p => p.estado === 'pendiente_pago').length}</b><span>Pendientes de pago</span></div>
          <div className="kpi"><b>{pedidos.filter(p => p.estadoProduccion && p.estadoProduccion !== 'entregado').length}</b><span>En proceso</span></div>
          <div className="kpi"><b>{formatoC$(pedidos.filter(p => p.comisionEstado === 'pendiente').reduce((a,p)=>a+(p.resumen?.comision||0),0))}</b><span>Comisiones por pagar</span></div>
        </div>
        <section className="panel"><h2>Control comercial</h2><p className="note">Los pedidos quedan como clientes potenciales al presionar “Enviar pedido”. El código de seguimiento se genera al confirmar anticipo o pago total.</p></section>
      </>}

      {tab === 'multimedia' && (
  <section className="panel">
    <h2>Gestor Multimedia</h2>

    <MediaLibrary
      imagenes={imagenes}
      onAdd={crearImagen}
      onRemove={eliminarImagen}
      onSelect={(img) => console.log('Imagen seleccionada', img)}
    />
  </section>
)}
      {tab === 'identidad' && <section className="panel">
        <h2><Settings size={20} /> Identidad del sitio</h2>
        <div className="form-grid">
          <label>Nombre del sitio<input value={configuracion.nombreSitio} onChange={(e) => guardarConfig('nombreSitio', e.target.value)} /></label>
<div className="span-2">
  <ImageUploader
    label="Logo principal del sitio"
    value={configuracion.logo}
    onChange={(img) => guardarConfig('logo', img)}
  />
</div>
<label>Slogan<input value={configuracion.slogan} onChange={(e) => guardarConfig('slogan', e.target.value)} /></label>
          <label>WhatsApp<input value={configuracion.whatsapp} onChange={(e) => guardarConfig('whatsapp', e.target.value)} /></label>
          <label>Correo<input value={configuracion.correo} onChange={(e) => guardarConfig('correo', e.target.value)} /></label>
          <label>Instagram<input value={configuracion.instagram} onChange={(e) => guardarConfig('instagram', e.target.value)} /></label>
          <label>Anticipo %<input type="number" value={configuracion.anticipoPorcentaje} onChange={(e) => guardarConfig('anticipoPorcentaje', e.target.value)} /></label>
          <label>Color principal<input type="color" value={configuracion.colorPrincipal} onChange={(e) => guardarConfig('colorPrincipal', e.target.value)} /></label>
          <label>Color secundario<input type="color" value={configuracion.colorSecundario} onChange={(e) => guardarConfig('colorSecundario', e.target.value)} /></label>
          <label>Texto hero<input value={configuracion.textoHero} onChange={(e) => guardarConfig('textoHero', e.target.value)} /></label>
          <label className="span-2">Descripción hero<input value={configuracion.descripcionHero} onChange={(e) => guardarConfig('descripcionHero', e.target.value)} /></label>
        </div>
        <button><Save size={18} /> Cambios aplicados</button>
      </section>}

      {tab === 'productos' && <section className="panel">
        <h2><Store size={20} /> Productos</h2>
        <form className="form-grid" onSubmit={agregarProducto}>
          <input placeholder="Nombre" value={nuevoProducto.nombre} onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })} />
          <input placeholder="Categoría" value={nuevoProducto.categoria} onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })} />
          <input placeholder="Medidas" value={nuevoProducto.medidas} onChange={(e) => setNuevoProducto({ ...nuevoProducto, medidas: e.target.value })} />
          <input placeholder="Precio" type="number" value={nuevoProducto.precio} onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })} />
<div className="span-2">
  <ImageUploader
    label="Imagen principal del producto"
    value={nuevoProducto.imagen}
    onChange={(img) =>
      setNuevoProducto({
        ...nuevoProducto,
        imagen: img,
      })
    }
  />
</div>
          <input className="span-2" placeholder="Descripción" value={nuevoProducto.descripcion} onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })} />
          <button><Plus size={18} /> Nuevo producto</button>
        </form>
<div className="admin-list">
  {productos.map((p) => (
    <article key={p.id} className="admin-row">
      <img src={p.imagen} alt={p.nombre} />

      <div>
        <b>{p.nombre}</b>
        <span>{p.categoria} · {p.medidas}</span>
      </div>

      <strong>{formatoC$(p.precio)}</strong>

      <button
        className="btn-outline"
        type="button"
        onClick={() => setProductoEditando(p)}
      >
        Editar
      </button>

      <button
        className="btn-outline"
        type="button"
        onClick={() => actualizarProducto({ ...p, activo: !p.activo })}
      >
        {p.activo === false ? 'Activar' : 'Ocultar'}
      </button>

      {productoEditando?.id === p.id && (
        <div className="edit-box span-2">
          <h3>Editar producto</h3>

          <ImageUploader
            label="Reemplazar imagen"
            value={productoEditando.imagen}
            onChange={(img) =>
              setProductoEditando({
                ...productoEditando,
                imagen: img,
              })
            }
          />

          <input
            placeholder="Nombre"
            value={productoEditando.nombre}
            onChange={(e) =>
              setProductoEditando({
                ...productoEditando,
                nombre: e.target.value,
              })
            }
          />

          <input
            placeholder="Categoría"
            value={productoEditando.categoria}
            onChange={(e) =>
              setProductoEditando({
                ...productoEditando,
                categoria: e.target.value,
              })
            }
          />

          <input
            placeholder="Medidas"
            value={productoEditando.medidas}
            onChange={(e) =>
              setProductoEditando({
                ...productoEditando,
                medidas: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Precio"
            value={productoEditando.precio}
            onChange={(e) =>
              setProductoEditando({
                ...productoEditando,
                precio: Number(e.target.value),
              })
            }
          />

          <textarea
            placeholder="Descripción"
            value={productoEditando.descripcion}
            onChange={(e) =>
              setProductoEditando({
                ...productoEditando,
                descripcion: e.target.value,
              })
            }
          />

          <input
            placeholder="Etiqueta"
            value={productoEditando.etiqueta || ''}
            onChange={(e) =>
              setProductoEditando({
                ...productoEditando,
                etiqueta: e.target.value,
              })
            }
          />

          <div className="edit-actions">
            <button
              type="button"
              onClick={() => {
                actualizarProducto(productoEditando);
                setProductoEditando(null);
              }}
            >
              Guardar cambios
            </button>

            <button
              className="btn-outline"
              type="button"
              onClick={() => setProductoEditando(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </article>
  ))}
</div> 
     </section>}

      {tab === 'banners' && <section className="panel">
        <h2><Megaphone size={20} /> Banners</h2>
        <p className="note">Usar como promociones destacadas o campañas de marcas aliadas, sin presentarlo públicamente como venta de publicidad.</p>
        <form className="form-grid" onSubmit={agregarBanner}>
          <input placeholder="Título" value={nuevoBanner.titulo} onChange={(e) => setNuevoBanner({ ...nuevoBanner, titulo: e.target.value })} />
          <input placeholder="Subtítulo" value={nuevoBanner.subtitulo} onChange={(e) => setNuevoBanner({ ...nuevoBanner, subtitulo: e.target.value })} />
          <div className="span-2">
  <ImageUploader
    label="Imagen del banner"
    value={nuevoBanner.imagen}
    onChange={(img) =>
      setNuevoBanner({
        ...nuevoBanner,
        imagen: img,
      })
    }
  />
</div>
          <select value={nuevoBanner.ubicacion} onChange={(e) => setNuevoBanner({ ...nuevoBanner, ubicacion: e.target.value })}><option value="slider-home">Slider principal</option><option value="home">Promociones destacadas</option><option value="catalogo">Catálogo</option></select>
          <select value={nuevoBanner.link} onChange={(e) => setNuevoBanner({ ...nuevoBanner, link: e.target.value })}><option value="catalogo">Catálogo</option><option value="contacto">Contacto</option><option value="home">Inicio</option></select>
          <button><ImagePlus size={18} /> Crear banner</button>
        </form>
        <div className="admin-list">{banners.map((b) => <article key={b.id} className="admin-row no-image"><div><b>{b.titulo}</b><span>{b.subtitulo}</span></div><strong>{b.ubicacion}</strong><label className="switch-row"><input type="checkbox" checked={b.activo} onChange={(e) => actualizarBanner({ ...b, activo: e.target.checked })} /> Activo</label></article>)}</div>
      </section>}

      {tab === 'trabajos' && <section className="panel">
        <h2><ImagePlus size={20} /> Trabajos entregados</h2>
        <form className="form-grid" onSubmit={(e) => { e.preventDefault(); if (!nuevoTrabajo.titulo) return; crearTrabajo(nuevoTrabajo); setNuevoTrabajo({ titulo: '', tipo: 'Foto', descripcion: '', imagen: '/productos/producto-01.jpg' }); }}>
          <input placeholder="Título del trabajo" value={nuevoTrabajo.titulo} onChange={(e) => setNuevoTrabajo({ ...nuevoTrabajo, titulo: e.target.value })} />
          <select value={nuevoTrabajo.tipo} onChange={(e) => setNuevoTrabajo({ ...nuevoTrabajo, tipo: e.target.value })}><option>Foto</option><option>Video</option></select>
<div className="span-2">
  <ImageUploader
    label="Foto del trabajo realizado"
    value={nuevoTrabajo.imagen}
    onChange={(img) =>
      setNuevoTrabajo({
        ...nuevoTrabajo,
        imagen: img,
      })
    }
  />
</div>
          <input className="span-2" placeholder="Descripción" value={nuevoTrabajo.descripcion} onChange={(e) => setNuevoTrabajo({ ...nuevoTrabajo, descripcion: e.target.value })} />
          <button><Plus size={18} /> Publicar trabajo</button>
        </form>
        <div className="admin-list">{trabajos.map((t) => <article key={t.id} className="admin-row"><img src={t.imagen} alt={t.titulo} /><div><b>{t.titulo}</b><span>{t.tipo} · {t.descripcion}</span></div><strong>{t.activo ? 'Activo' : 'Oculto'}</strong><label className="switch-row"><input type="checkbox" checked={t.activo} onChange={(e) => actualizarTrabajo({ ...t, activo: e.target.checked })} /> Mostrar</label></article>)}</div>
      </section>}

      {tab === 'cuentas' && <section className="panel">
        <h2><CreditCard size={20} /> Cuentas bancarias oficiales</h2>
        <form className="form-grid" onSubmit={agregarCuenta}>
          <input placeholder="Banco" value={nuevaCuenta.banco} onChange={(e) => setNuevaCuenta({ ...nuevaCuenta, banco: e.target.value })} />
          <input placeholder="Número de cuenta" value={nuevaCuenta.numero} onChange={(e) => setNuevaCuenta({ ...nuevaCuenta, numero: e.target.value })} />
          <input placeholder="Titular" value={nuevaCuenta.titular} onChange={(e) => setNuevaCuenta({ ...nuevaCuenta, titular: e.target.value })} />
          <select value={nuevaCuenta.moneda} onChange={(e) => setNuevaCuenta({ ...nuevaCuenta, moneda: e.target.value })}><option>Córdobas</option><option>Dólares</option></select>
          <button><Plus size={18} /> Agregar cuenta</button>
        </form>
        <div className="admin-list">{cuentasBancarias.map((c) => <article key={c.id} className="admin-row no-image"><div><b>{c.banco}</b><span>{c.numero} · {c.titular} · {c.moneda}</span></div><strong>{c.activa ? 'Activa' : 'Oculta'}</strong><label className="switch-row"><input type="checkbox" checked={c.activa} onChange={(e) => actualizarCuentaBancaria({ ...c, activa: e.target.checked })} /> Mostrar</label></article>)}</div>
      </section>}

      {tab === 'pedidos' && <section className="panel">
        <h2>Pedidos / clientes potenciales</h2>
        <p className="note">Aquí aparecen los clientes que presionaron “Enviar pedido”. Si no depositan, se les puede dar seguimiento.</p>
        {pedidos.length === 0 ? <p>No hay pedidos registrados todavía.</p> : <div className="admin-list">{pedidos.map((p) => <article key={p.id} className="admin-row no-image"><div><b>{p.numero} · {p.cliente?.nombre}</b><span>{p.cliente?.whatsapp} · {p.veterinaria?.nombre} · {etiquetasEstado[p.estado] || p.estado}</span><span>Monto solicitado: {formatoC$(p.montoSolicitado || 0)} · Saldo: {formatoC$(p.saldoPendiente || 0)}</span></div><strong>{formatoC$(p.resumen?.total || 0)}</strong>{p.estado === 'pendiente_pago' ? <button className="btn-outline" onClick={() => confirmarYPedirSeguimiento(p)}>Confirmar pago</button> : <span className="badge">{p.codigoSeguimiento}</span>}</article>)}</div>}
      </section>}

      {tab === 'produccion' && <section className="panel">
        <h2>Producción y seguimiento</h2>
        <p className="note">Actualizá el estado de fabricación. El cliente lo verá con su código de seguimiento.</p>
        {pedidos.filter(p => p.codigoSeguimiento).length === 0 ? <p>No hay pedidos con seguimiento activo.</p> : <div className="admin-list">{pedidos.filter(p => p.codigoSeguimiento).map((p) => <article key={p.id} className="admin-row no-image"><div><b>{p.codigoSeguimiento} · {p.cliente?.nombre}</b><span>{p.items?.map(i => i.nombre).join(', ')}</span><span>Estado actual: {etiquetasEstado[p.estadoProduccion]}</span></div><strong>{formatoC$(p.saldoPendiente || 0)} saldo</strong><select value={p.estadoProduccion} onChange={(e) => cambiarEstadoProduccion(p, e.target.value)}>{estadosProduccion.map(e => <option value={e} key={e}>{etiquetasEstado[e]}</option>)}</select>{p.comisionEstado === 'pendiente' && <button className="btn-outline" onClick={() => marcarComisionPagada(p)}>Comisión pagada</button>}</article>)}</div>}
      </section>}

      {tab === 'veterinarias' && (
  <section className="panel">
    <h2>Veterinarias afiliadas</h2>
    <input
  type="text"
  placeholder="Buscar veterinaria..."
  value={busquedaVeterinaria}
  onChange={(e) => setBusquedaVeterinaria(e.target.value)}
  className="span-2"
/>
    <form className="form-grid" onSubmit={agregarVeterinaria}>
  <input
    placeholder="Nombre de la veterinaria"
    value={nuevaVeterinaria.nombre}
    onChange={(e) =>
      setNuevaVeterinaria({ ...nuevaVeterinaria, nombre: e.target.value })
    }
  />

  <input
    placeholder="Responsable"
    value={nuevaVeterinaria.responsable}
    onChange={(e) =>
      setNuevaVeterinaria({ ...nuevaVeterinaria, responsable: e.target.value })
    }
  />

  <input
    placeholder="WhatsApp"
    value={nuevaVeterinaria.whatsapp}
    onChange={(e) =>
      setNuevaVeterinaria({ ...nuevaVeterinaria, whatsapp: e.target.value })
    }
  />

  <input
    placeholder="Correo"
    value={nuevaVeterinaria.email}
    onChange={(e) =>
      setNuevaVeterinaria({ ...nuevaVeterinaria, email: e.target.value })
    }
  />

  <input
    className="span-2"
    placeholder="Dirección"
    value={nuevaVeterinaria.direccion}
    onChange={(e) =>
      setNuevaVeterinaria({ ...nuevaVeterinaria, direccion: e.target.value })
    }
  />

  <input
    type="number"
    placeholder="Comisión %"
    value={nuevaVeterinaria.comisionPorcentaje}
    onChange={(e) =>
      setNuevaVeterinaria({
        ...nuevaVeterinaria,
        comisionPorcentaje: e.target.value,
      })
    }
  />

  <div className="span-2">
    <ImageUploader
      label="Logo de la veterinaria"
      value={nuevaVeterinaria.logo}
      onChange={(img) =>
        setNuevaVeterinaria({ ...nuevaVeterinaria, logo: img })
      }
    />
  </div>

  <button type="submit">
  {veterinariaEditando ? 'Guardar cambios' : 'Nueva veterinaria'}
</button>

</form>

    <p className="note">
      Cada veterinaria tiene un enlace único y un QR para referir clientes.
    </p>

    <div className="admin-list">
      {veterinarias
  .filter((v) => {
    const texto = busquedaVeterinaria.toLowerCase();

    return (
      v.nombre?.toLowerCase().includes(texto) ||
      v.codigo?.toLowerCase().includes(texto) ||
      v.responsable?.toLowerCase().includes(texto) ||
      v.whatsapp?.toLowerCase().includes(texto) ||
      v.email?.toLowerCase().includes(texto) ||
      v.direccion?.toLowerCase().includes(texto)
    );
  })
  .map((v) => {
  const pedidosVeterinaria = pedidos.filter(
    (p) => p.veterinaria?.id === v.id
  );

  const ventasEntregadas = pedidosVeterinaria
    .filter((p) => p.estado === 'entregado')
    .reduce((a, p) => a + (p.resumen?.total || 0), 0);

  const comisionVeterinaria = pedidosVeterinaria
    .filter((p) => p.estado === 'entregado')
    .reduce((a, p) => a + (p.resumen?.comision || 0), 0);


        const linkBase =
          typeof window !== 'undefined'
            ? window.location.origin
            : '';

        const linkAfiliado =
          v.linkAfiliado?.startsWith('http')
            ? v.linkAfiliado
            : `${linkBase}${v.linkAfiliado || `/?vet=${v.slug || v.codigo}`}`;

        return (
          <article key={v.id} className="admin-row no-image vet-card">
            <div className="vet-info">
  {v.logo && (
    <img
      src={v.logo}
      alt={v.nombre}
      className="vet-logo"
    />
  )}

  <b>{v.nombre}</b>

  <span>
    {v.codigo} · Comisión {v.comisionPorcentaje || 10}%
  </span>

  <span>
    Estado: {v.activa ? 'Activa' : 'Inactiva'}
  </span>

  {v.responsable && (
    <span>Responsable: {v.responsable}</span>
  )}

  {v.whatsapp && (
    <span>WhatsApp: {v.whatsapp}</span>
  )}

  {v.email && (
    <span>Correo: {v.email}</span>
  )}

  {v.direccion && (
    <span>Dirección: {v.direccion}</span>
  )}

  <span>
  Pedidos: {pedidosVeterinaria.length} · Ventas: {formatoC$(ventasEntregadas)} · Comisión: {formatoC$(comisionVeterinaria)}
</span>

</div>
            <div className="qr-box">
              <QRCodeCanvas
                id={`qr-${v.id}`}
                value={linkAfiliado}
                size={120}
                includeMargin
              />

              <small>{linkAfiliado}</small>

              <button
                type="button"
                className="btn-outline"
                onClick={() => navigator.clipboard.writeText(linkAfiliado)}
              >
                Copiar enlace
              </button>
              <button
  type="button"
  className="btn-outline"
  onClick={() => {
    setVeterinariaEditando(v);

    setNuevaVeterinaria({
      nombre: v.nombre || '',
      responsable: v.responsable || '',
      whatsapp: v.whatsapp || '',
      email: v.email || '',
      direccion: v.direccion || '',
      comisionPorcentaje: v.comisionPorcentaje || 10,
      logo: v.logo || '',
      activa: v.activa,
    });
  }}
>
  Editar
</button>

              <button
  type="button"
  className="btn-outline"
  onClick={() =>
    actualizarVeterinaria({
      ...v,
      activa: !v.activa,
    })
  }
>
  {v.activa ? 'Desactivar' : 'Activar'}
</button>

              <button
  type="button"
  className="btn-outline"
  onClick={() => {
    if (window.confirm(`¿Eliminar ${v.nombre}?`)) {
      eliminarVeterinaria(v.id);
    }
  }}
>
  Eliminar
</button>
            </div>
          </article>
        );
      })}
    </div>
  </section>
)}
    </main>
  );
}

