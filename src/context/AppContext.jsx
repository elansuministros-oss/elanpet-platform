import React, { createContext, useContext, useMemo, useState } from 'react';
import { productosIniciales, veterinariaDemo } from '../data/productos';
import { resumenCarrito } from '../lib/calculos';

const AppContext = createContext(null);

const configuracionInicial = {
  nombreSitio: 'ELANPET.COM',
  slogan: 'Muebles funcionales para mascotas felices',
  logoTexto: 'ELANPET.COM',
  whatsapp: '+505 8888 8888',
  correo: 'ventas@elanpet.com',
  instagram: '@elanpet',
  colorPrincipal: '#1E5AA8',
  colorSecundario: '#058B8C',
  textoHero: 'Tu mascota merece más',
  descripcionHero: 'Muebles funcionales, resistentes y fabricados para el bienestar de perros y gatos. Compra fácil desde tu celular.',
  instruccionesPago: 'Después de transferir, responde este mensaje enviando el comprobante para confirmar tu pedido.',
  anticipoPorcentaje: 60,
};

const cuentasIniciales = [
  { id: 'cta-1', banco: 'BAC', titular: 'ELAN', numero: '000000000', moneda: 'Córdobas', activa: true },
  { id: 'cta-2', banco: 'LAFISE', titular: 'ELAN', numero: '000000000', moneda: 'Córdobas', activa: true },
  { id: 'cta-3', banco: 'BANPRO', titular: 'ELAN', numero: '000000000', moneda: 'Córdobas', activa: true },
];

const bannersIniciales = [
  { id: 'slide-1', titulo: 'Muebles funcionales para mascotas felices', subtitulo: 'Casas, camas, comederos y torres fabricadas para durar.', ubicacion: 'slider-home', link: 'catalogo', activo: true, imagen: '/productos/producto-04.jpg' },
  { id: 'slide-2', titulo: 'Compra desde tu veterinaria de confianza', subtitulo: 'Cada QR registra el origen del pedido y mantiene todo organizado.', ubicacion: 'slider-home', link: 'catalogo', activo: true, imagen: '/productos/producto-05.jpg' },
  { id: 'slide-3', titulo: 'Productos destacados para perros y gatos', subtitulo: 'Diseños pensados para comodidad, orden y bienestar diario.', ubicacion: 'slider-home', link: 'catalogo', activo: true, imagen: '/productos/producto-10.jpg' },
  { id: 'promo-1', titulo: 'Promoción destacada', subtitulo: 'Descuentos automáticos por cantidad en productos seleccionados.', ubicacion: 'home', link: 'catalogo', activo: true, imagen: '' },
];

const trabajosIniciales = [
  { id: 'trabajo-1', titulo: 'Casa premium con terraza', tipo: 'Foto', descripcion: 'Producto entregado con acabado resistente y diseño funcional.', imagen: '/productos/producto-04.jpg', activo: true },
  { id: 'trabajo-2', titulo: 'Comedero elevado doble', tipo: 'Foto', descripcion: 'Comedero funcional con doble plato y acabado limpio.', imagen: '/productos/producto-05.jpg', activo: true },
  { id: 'trabajo-3', titulo: 'Torre para gatos', tipo: 'Foto', descripcion: 'Mueble vertical para descanso, juego y rascado.', imagen: '/productos/producto-10.jpg', activo: true },
];

const veterinariasIniciales = [
  {
    ...veterinariaDemo,
    id: 'vet001',
    slug: 'veterinaria-demo',
    telefono: '',
    direccion: 'Managua, Nicaragua',
    responsable: 'Responsable Demo',
    comisionPorcentaje: 10,
    linkAfiliado: '/?vet=veterinaria-demo',
    activa: true,
    escaneos: 0,
    pedidos: 0,
    ventas: 0,
    comision: 0,
  },
  {
    id: 'vet002',
    codigo: 'VET002',
    nombre: 'Veterinaria Animal Care',
    slug: 'animal-care',
    telefono: '+505 7777 7777',
    direccion: 'Managua, Nicaragua',
    responsable: 'Responsable Animal Care',
    comisionPorcentaje: 10,
    linkAfiliado: '/?vet=animal-care',
    activa: true,
    escaneos: 0,
    pedidos: 0,
    ventas: 0,
    comision: 0,
  },
];

export const estadosProduccion = [
  'pedido_recibido',
  'anticipo_confirmado',
  'diseno',
  'corte_cnc',
  'armado',
  'pintura_acabado',
  'control_calidad',
  'listo_entrega',
  'entregado',
];

export const etiquetasEstado = {
  pendiente_pago: 'Pendiente de pago',
  pedido_recibido: 'Pedido recibido',
  anticipo_confirmado: 'Anticipo confirmado',
  pago_total_confirmado: 'Pago total confirmado',
  diseno: 'Diseño',
  corte_cnc: 'Corte CNC',
  armado: 'Armado',
  pintura_acabado: 'Pintura / acabado',
  control_calidad: 'Control de calidad',
  listo_entrega: 'Listo para entrega',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

function generarCodigoSeguimiento() {
  const year = new Date().getFullYear();
  const correlativo = String(Date.now()).slice(-6);
  return `EP-${year}-${correlativo}`;
}

export function AppProvider({ children }) {
  const [configuracion, setConfiguracion] = useState(configuracionInicial);
  const [cuentasBancarias, setCuentasBancarias] = useState(cuentasIniciales);
  const [banners, setBanners] = useState(bannersIniciales);
  const [trabajos, setTrabajos] = useState(trabajosIniciales);
  const [productos, setProductos] = useState(productosIniciales);
  const [imagenes, setImagenes] = useState([]);

  

const crearImagen = (imagen) => {
  setImagenes((prev) => [imagen, ...prev]);
};

const eliminarImagen = (id) => {
  setImagenes((prev) => prev.filter((img) => img.id !== id));
};
  const [veterinarias, setVeterinarias] = useState(veterinariasIniciales);
  const crearSlug = (texto) =>
  String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const crearVeterinaria = (datos) => {
  const slug = crearSlug(datos.nombre);
  const codigo = datos.codigo || `VET${String(veterinarias.length + 1).padStart(3, '0')}`;

  const nueva = {
    id: `vet${Date.now()}`,
    codigo,
    nombre: datos.nombre,
    slug,
    telefono: datos.telefono || '',
    direccion: datos.direccion || '',
    responsable: datos.responsable || '',
    comisionPorcentaje: Number(datos.comisionPorcentaje || 10),
    linkAfiliado: `/?vet=${slug}`,
    activa: true,
    escaneos: 0,
    pedidos: 0,
    ventas: 0,
    comision: 0,
  };

  setVeterinarias((prev) => [nueva, ...prev]);
};

const actualizarVeterinaria = (veterinaria) => {
  setVeterinarias((prev) =>
    prev.map((v) =>
      v.id === veterinaria.id
        ? {
            ...v,
            ...veterinaria,
            slug: veterinaria.slug || crearSlug(veterinaria.nombre),
            linkAfiliado: `/?vet=${veterinaria.slug || crearSlug(veterinaria.nombre)}`,
          }
        : v
    )
  );
};

const eliminarVeterinaria = (id) => {
  setVeterinarias((prev) => prev.filter((v) => v.id !== id));
};

  const [veterinaria, setVeterinaria] = useState(veterinariaDemo);
  const [carrito, setCarrito] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  const agregar = (p) => setCarrito((prev) => {
    const ex = prev.find((i) => i.id === p.id);
    return ex ? prev.map((i) => i.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i) : [...prev, { ...p, cantidad: 1 }];
  });
  const cambiarCantidad = (id, cantidad) => setCarrito((prev) => prev.map((i) => i.id === id ? { ...i, cantidad: Math.max(1, Number(cantidad) || 1) } : i));
  const quitar = (id) => setCarrito((prev) => prev.filter((i) => i.id !== id));
  const limpiar = () => setCarrito([]);
  const resumen = useMemo(() => resumenCarrito(carrito), [carrito]);

  const crearPedidoTransferencia = ({ cliente, pagoTipo = 'anticipo' }) => {
    const numero = `PED-${String(Date.now()).slice(-6)}`;
    const anticipoPorcentaje = Number(configuracion.anticipoPorcentaje || 60);
    const montoSolicitado = pagoTipo === 'total' ? resumen.total : resumen.total * (anticipoPorcentaje / 100);
    const saldoPendiente = Math.max(0, resumen.total - montoSolicitado);
    const pedido = {
      id: `pedido-${Date.now()}`,
      numero,
      codigoSeguimiento: '',
      cliente,
      veterinaria,
      items: carrito,
      resumen,
      pagoTipo,
      anticipoPorcentaje,
      montoSolicitado,
      anticipoRequerido: resumen.total * (anticipoPorcentaje / 100),
      anticipoRecibido: 0,
      saldoPendiente: resumen.total,
      estado: 'pendiente_pago',
      estadoProduccion: 'pedido_recibido',
      pagoEstado: 'pendiente_transferencia',
      seguimientoEstado: 'pendiente_pago',
      comisionEstado: 'no_generada',
      historial: [{ estado: 'pedido_recibido', fecha: new Date().toISOString(), nota: 'Pedido creado desde carrito.' }],
      createdAt: new Date().toISOString(),
      fechaEstimada: '',
    };
    setPedidos((prev) => [pedido, ...prev]);
    return pedido;
  };

  const actualizarPedido = (pedido) => setPedidos((prev) => prev.map((p) => p.id === pedido.id ? { ...p, ...pedido } : p));

  const confirmarAnticipo = (pedido, pagoTipoConfirmado = pedido.pagoTipo || 'anticipo') => {
    const esTotal = pagoTipoConfirmado === 'total';
    const codigo = pedido.codigoSeguimiento || generarCodigoSeguimiento();
    const anticipoRecibido = esTotal ? pedido.resumen.total : (pedido.anticipoRequerido || pedido.resumen.total * 0.6);
    const saldoPendiente = Math.max(0, pedido.resumen.total - anticipoRecibido);
    actualizarPedido({
      ...pedido,
      codigoSeguimiento: codigo,
      pagoTipo: pagoTipoConfirmado,
      anticipoRecibido,
      saldoPendiente,
      estado: esTotal ? 'pago_total_confirmado' : 'anticipo_confirmado',
      estadoProduccion: 'anticipo_confirmado',
      pagoEstado: esTotal ? 'pago_total_confirmado' : 'anticipo_confirmado',
      seguimientoEstado: 'en_produccion',
      comisionEstado: 'pendiente_entrega',
      historial: [...(pedido.historial || []), { estado: esTotal ? 'pago_total_confirmado' : 'anticipo_confirmado', fecha: new Date().toISOString(), nota: 'Pago validado por administración.' }],
    });
    return codigo;
  };

  const cambiarEstadoProduccion = (pedido, estadoProduccion) => {
    const entregado = estadoProduccion === 'entregado';
    actualizarPedido({
      ...pedido,
      estado: entregado ? 'entregado' : pedido.estado,
      estadoProduccion,
      seguimientoEstado: estadoProduccion,
      comisionEstado: entregado ? 'pendiente' : pedido.comisionEstado,
      historial: [...(pedido.historial || []), { estado: estadoProduccion, fecha: new Date().toISOString(), nota: etiquetasEstado[estadoProduccion] || estadoProduccion }],
    });
  };

  const buscarPedidoSeguimiento = ({ codigo, whatsapp }) => {
    const c = String(codigo || '').trim().toUpperCase();
    const w = String(whatsapp || '').replace(/[^0-9]/g, '');
    return pedidos.find((p) => String(p.codigoSeguimiento || '').toUpperCase() === c && String(p.cliente?.whatsapp || '').replace(/[^0-9]/g, '').endsWith(w.slice(-8)));
  };

 const login = ({ email, password }) => {
  const correo = String(email || '').toLowerCase().trim();
  const clave = String(password || '').trim();

  if (
    correo === 'elansuministros@gmail.com' &&
    clave === 'ElanPet2026#'
  ) {
    setUsuario({
      nombre: 'Erick Cano',
      email: correo,
      rol: 'admin'
    });
    return { ok: true, rol: 'admin' };
  }

  if (
    correo === 'vet@elanpet.com' &&
    clave === 'VetDemo2026#'
  ) {
    setUsuario({
      nombre: 'Veterinaria Demo',
      email: correo,
      rol: 'veterinaria',
      veterinariaId: veterinaria.id
    });
    return { ok: true, rol: 'veterinaria' };
  }

  return { ok: false };
};
const logout = () => {
  setUsuario(null);
};

  const actualizarProducto = (producto) => setProductos((prev) => prev.map((p) => p.id === producto.id ? { ...p, ...producto } : p));
  const crearProducto = (producto) => {
    const id = producto.id || producto.nombre.toLowerCase().replaceAll(' ', '-').replace(/[^a-z0-9-]/g, '');
    setProductos((prev) => [{ ...producto, id, activo: true }, ...prev]);
  };
  const crearBanner = (banner) => setBanners((prev) => [{ ...banner, id: `banner-${Date.now()}` }, ...prev]);
  const actualizarBanner = (banner) => setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, ...banner } : b));
  const crearTrabajo = (trabajo) => setTrabajos((prev) => [{ ...trabajo, id: `trabajo-${Date.now()}`, activo: true }, ...prev]);
  const actualizarTrabajo = (trabajo) => setTrabajos((prev) => prev.map((t) => t.id === trabajo.id ? { ...t, ...trabajo } : t));
  const crearCuentaBancaria = (cuenta) => setCuentasBancarias((prev) => [{ ...cuenta, id: `cta-${Date.now()}`, activa: true }, ...prev]);
  const actualizarCuentaBancaria = (cuenta) => setCuentasBancarias((prev) => prev.map((c) => c.id === cuenta.id ? { ...c, ...cuenta } : c));

  return <AppContext.Provider value={{ configuracion, setConfiguracion, cuentasBancarias, crearCuentaBancaria, actualizarCuentaBancaria, banners, crearBanner, actualizarBanner, trabajos, crearTrabajo, actualizarTrabajo, productos, setProductos, actualizarProducto,imagenes,
crearImagen, eliminarImagen, crearProducto, veterinarias, setVeterinarias, crearVeterinaria,
actualizarVeterinaria, eliminarVeterinaria, veterinaria, setVeterinaria, carrito, agregar, cambiarCantidad, quitar, limpiar, resumen, pedidos, crearPedidoTransferencia, actualizarPedido, confirmarAnticipo, cambiarEstadoProduccion, buscarPedidoSeguimiento, usuario, login, logout }}>{children}</AppContext.Provider>;
}
export const useApp = () => useContext(AppContext);
