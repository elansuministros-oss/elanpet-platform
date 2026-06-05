import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { productosIniciales, veterinariaDemo } from '../data/productos';
import { resumenCarrito } from '../lib/calculos';
import { supabase } from '../lib/supabase';

const AppContext = createContext(null);

const configuracionInicial = {
  nombreSitio: 'ELANPET.COM',
  slogan: 'Muebles funcionales para mascotas felices',
  logoTexto: 'ELANPET.COM',
  logo: '',
  whatsapp: '+505 8888 8888',
  correo: 'ventas@elanpet.com',
  instagram: '@elanpet',
  colorPrincipal: '#1E5AA8',
  colorSecundario: '#058B8C',
  textoHero: 'Tu mascota merece más',
  descripcionHero:
    'Muebles funcionales, resistentes y fabricados para el bienestar de perros y gatos. Compra fácil desde tu celular.',
  instruccionesPago:
    'Después de transferir, responde este mensaje enviando el comprobante para confirmar tu pedido.',
  anticipoPorcentaje: 60,
};

const cuentasIniciales = [
  { id: 'cta-1', banco: 'BAC', titular: 'ELAN', numero: '000000000', moneda: 'Córdobas', activa: true, visible: true },
  { id: 'cta-2', banco: 'LAFISE', titular: 'ELAN', numero: '000000000', moneda: 'Córdobas', activa: true, visible: true },
  { id: 'cta-3', banco: 'BANPRO', titular: 'ELAN', numero: '000000000', moneda: 'Córdobas', activa: true, visible: true },
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
  { ...veterinariaDemo, id: 'vet001', slug: 'veterinaria-demo', telefono: '', whatsapp: '', email: '', direccion: 'Managua, Nicaragua', responsable: 'Responsable Demo', comisionPorcentaje: 10, linkAfiliado: '/?vet=veterinaria-demo', activa: true, escaneos: 0, pedidos: 0, ventas: 0, comision: 0 },
  { id: 'vet002', codigo: 'VET002', nombre: 'Veterinaria Animal Care', slug: 'animal-care', telefono: '+505 7777 7777', whatsapp: '+505 7777 7777', email: '', direccion: 'Managua, Nicaragua', responsable: 'Responsable Animal Care', comisionPorcentaje: 10, linkAfiliado: '/?vet=animal-care', activa: true, escaneos: 0, pedidos: 0, ventas: 0, comision: 0 },
];

const usuariosIniciales = [
  { id: 'user-admin', nombre: 'Erick Cano', usuario: 'admin', email: 'elansuministros@gmail.com', password: 'ElanPet2026#', rol: 'admin', veterinariaId: '', activo: true, debeCambiarPassword: false, creadoEn: new Date().toISOString() },
  { id: 'user-vet-demo', nombre: 'Veterinaria Demo', usuario: 'vetdemo', email: 'vet@elanpet.com', password: 'VetDemo2026#', rol: 'veterinaria', veterinariaId: 'vet001', activo: true, debeCambiarPassword: true, creadoEn: new Date().toISOString() },
];

export const estadosProduccion = ['pedido_recibido', 'anticipo_confirmado', 'diseno', 'corte_cnc', 'armado', 'pintura_acabado', 'control_calidad', 'listo_entrega', 'entregado'];

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

function leerStorage(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : valorInicial;
  } catch {
    return valorInicial;
  }
}

function generarCodigoSeguimiento() {
  const year = new Date().getFullYear();
  const correlativo = String(Date.now()).slice(-6);
  return `EP-${year}-${correlativo}`;
}

function crearSlug(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}


function normalizarVeterinariaDesdeDB(row) {
  if (!row) return null;
  const slug = row.slug || crearSlug(row.nombre);
  return {
    id: row.id,
    codigo: row.codigo || '',
    nombre: row.nombre || '',
    slug,
    telefono: row.telefono || row.whatsapp || '',
    whatsapp: row.whatsapp || row.telefono || '',
    email: row.email || row.correo || '',
    direccion: row.direccion || '',
    responsable: row.responsable || '',
    logo: row.logo || '',
    comisionPorcentaje: Number(row.comision_porcentaje || 10),
    linkAfiliado: row.link_afiliado || `/?vet=${slug}`,
    activa: row.activa !== false,
    escaneos: Number(row.escaneos || 0),
    pedidos: Number(row.pedidos_count || 0),
    ventas: Number(row.ventas || 0),
    comision: Number(row.comision || 0),
  };
}

function veterinariaParaDB(datos) {
  const slug = datos.slug || crearSlug(datos.nombre);
  return {
    codigo: datos.codigo || '',
    nombre: datos.nombre || '',
    slug,
    telefono: datos.telefono || datos.whatsapp || '',
    whatsapp: datos.whatsapp || datos.telefono || '',
    email: datos.email || datos.correo || '',
    correo: datos.email || datos.correo || '',
    direccion: datos.direccion || '',
    responsable: datos.responsable || '',
    logo: datos.logo || '',
    comision_porcentaje: Number(datos.comisionPorcentaje || datos.comision_porcentaje || 10),
    link_afiliado: datos.linkAfiliado || `/?vet=${slug}`,
    activa: datos.activa !== false,
    escaneos: Number(datos.escaneos || 0),
    pedidos_count: Number(datos.pedidos || datos.pedidos_count || 0),
    ventas: Number(datos.ventas || 0),
    comision: Number(datos.comision || 0),
  };
}

function normalizarUsuarioDesdeDB(row) {
  if (!row) return null;
  return {
    id: row.id,
    nombre: row.nombre || row.usuario || row.email || '',
    usuario: String(row.usuario || '').toLowerCase().trim(),
    email: String(row.email || '').toLowerCase().trim(),
    password: String(row.password || '').trim(),
    rol: row.rol || 'veterinaria',
    veterinariaId: row.veterinaria_id || '',
    activo: row.activo !== false,
    debeCambiarPassword: row.debe_cambiar_password !== false,
    creadoEn: row.created_at || new Date().toISOString(),
  };
}

function usuarioParaDB(datos) {
  return {
    nombre: datos.nombre || datos.usuario || datos.email || '',
    usuario: String(datos.usuario || '').toLowerCase().trim(),
    email: String(datos.email || '').toLowerCase().trim(),
    password: String(datos.password || 'Temporal2026#').trim(),
    rol: datos.rol || 'veterinaria',
    veterinaria_id: (datos.rol || 'veterinaria') === 'veterinaria' ? datos.veterinariaId || datos.veterinaria_id || null : null,
    activo: datos.activo !== false,
    debe_cambiar_password: datos.debeCambiarPassword !== false,
  };
}

function esUUID(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(id || ''));
}

export function AppProvider({ children }) {
  const [configuracion, setConfiguracion] = useState(() => leerStorage('elanpet_configuracion', configuracionInicial));
  const [cuentasBancarias, setCuentasBancarias] = useState(() => leerStorage('elanpet_cuentas_bancarias', cuentasIniciales));
  const [banners, setBanners] = useState(() => leerStorage('elanpet_banners', bannersIniciales));
  const [trabajos, setTrabajos] = useState(() => leerStorage('elanpet_trabajos', trabajosIniciales));
  const [productos, setProductos] = useState(() => leerStorage('elanpet_productos', productosIniciales));
  const [imagenes, setImagenes] = useState(() => leerStorage('elanpet_imagenes', []));
  const [veterinarias, setVeterinarias] = useState(() => leerStorage('elanpet_veterinarias', veterinariasIniciales));
  const [veterinaria, setVeterinaria] = useState(() => leerStorage('elanpet_veterinaria_actual', veterinariaDemo));
  const [carrito, setCarrito] = useState([]);
  const [pedidos, setPedidos] = useState(() => leerStorage('elanpet_pedidos', []));
  const [usuario, setUsuario] = useState(() => leerStorage('elanpet_usuario_actual', null));
  const [usuarios, setUsuarios] = useState(() => leerStorage('elanpet_usuarios', usuariosIniciales));

  useEffect(() => {
    let cancelado = false;

    async function cargarDatosBase() {
      if (!supabase) return;

      try {
        const { data: vetsDB, error: errorVets } = await supabase
          .from('veterinarias')
          .select('*')
          .order('created_at', { ascending: false });

        if (errorVets) throw errorVets;

        let vetsNormalizadas = (vetsDB || []).map(normalizarVeterinariaDesdeDB).filter(Boolean);

        if (vetsNormalizadas.length === 0) {
          const vetsParaInsertar = veterinariasIniciales.map((v) => veterinariaParaDB(v));
          const { data: vetsCreadas, error: errorCrearVets } = await supabase
            .from('veterinarias')
            .insert(vetsParaInsertar)
            .select('*');

          if (errorCrearVets) throw errorCrearVets;
          vetsNormalizadas = (vetsCreadas || []).map(normalizarVeterinariaDesdeDB).filter(Boolean);
        }

        const { data: usuariosDB, error: errorUsuarios } = await supabase
          .from('usuarios')
          .select('*')
          .order('created_at', { ascending: false });

        if (errorUsuarios) throw errorUsuarios;

        let usuariosNormalizados = (usuariosDB || []).map(normalizarUsuarioDesdeDB).filter(Boolean);

        if (usuariosNormalizados.length === 0) {
          const vetDemoDB = vetsNormalizadas.find((v) => v.slug === 'veterinaria-demo') || vetsNormalizadas[0];
          const usuariosBase = usuariosIniciales.map((u) => ({
            ...u,
            veterinariaId: u.rol === 'veterinaria' ? vetDemoDB?.id || null : null,
          }));

          const { data: usuariosCreados, error: errorCrearUsuarios } = await supabase
            .from('usuarios')
            .insert(usuariosBase.map((u) => usuarioParaDB(u)))
            .select('*');

          if (errorCrearUsuarios) throw errorCrearUsuarios;
          usuariosNormalizados = (usuariosCreados || []).map(normalizarUsuarioDesdeDB).filter(Boolean);
        }

        if (cancelado) return;

        setVeterinarias(vetsNormalizadas);
        setUsuarios(usuariosNormalizados);

        const usuarioActual = leerStorage('elanpet_usuario_actual', null);
        if (usuarioActual?.id) {
          const actualizado = usuariosNormalizados.find((u) => u.id === usuarioActual.id || u.usuario === usuarioActual.usuario);
          if (actualizado) setUsuario(actualizado);
        }

        const vetActual = leerStorage('elanpet_veterinaria_actual', null);
        if (vetActual?.id) {
          const actualizada = vetsNormalizadas.find((v) => v.id === vetActual.id || v.slug === vetActual.slug);
          if (actualizada) setVeterinaria(actualizada);
        }
      } catch (error) {
        console.error('Supabase no pudo cargar usuarios/veterinarias. Se mantiene respaldo local:', error);
      }
    }

    cargarDatosBase();

    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => localStorage.setItem('elanpet_configuracion', JSON.stringify(configuracion)), [configuracion]);
  useEffect(() => localStorage.setItem('elanpet_cuentas_bancarias', JSON.stringify(cuentasBancarias)), [cuentasBancarias]);
  useEffect(() => localStorage.setItem('elanpet_banners', JSON.stringify(banners)), [banners]);
  useEffect(() => localStorage.setItem('elanpet_trabajos', JSON.stringify(trabajos)), [trabajos]);
  useEffect(() => localStorage.setItem('elanpet_productos', JSON.stringify(productos)), [productos]);
  useEffect(() => localStorage.setItem('elanpet_imagenes', JSON.stringify(imagenes)), [imagenes]);
  useEffect(() => localStorage.setItem('elanpet_veterinarias', JSON.stringify(veterinarias)), [veterinarias]);
  useEffect(() => localStorage.setItem('elanpet_pedidos', JSON.stringify(pedidos)), [pedidos]);
  useEffect(() => localStorage.setItem('elanpet_usuarios', JSON.stringify(usuarios)), [usuarios]);

  useEffect(() => {
    if (usuario) localStorage.setItem('elanpet_usuario_actual', JSON.stringify(usuario));
    else localStorage.removeItem('elanpet_usuario_actual');
  }, [usuario]);

  useEffect(() => {
    if (veterinaria) localStorage.setItem('elanpet_veterinaria_actual', JSON.stringify(veterinaria));
  }, [veterinaria]);

  const crearImagen = (imagen) => setImagenes((prev) => [imagen, ...prev]);
  const eliminarImagen = (id) => setImagenes((prev) => prev.filter((img) => img.id !== id));

  const crearVeterinaria = (datos) => {
    const slug = crearSlug(datos.nombre);
    const codigo = datos.codigo || `VET${String(veterinarias.length + 1).padStart(3, '0')}`;
    const nueva = {
      id: `temp-vet-${Date.now()}`,
      codigo,
      nombre: datos.nombre,
      slug,
      telefono: datos.telefono || datos.whatsapp || '',
      whatsapp: datos.whatsapp || datos.telefono || '',
      email: datos.email || datos.correo || '',
      direccion: datos.direccion || '',
      responsable: datos.responsable || '',
      logo: datos.logo || '',
      comisionPorcentaje: Number(datos.comisionPorcentaje || 10),
      linkAfiliado: `/?vet=${slug}`,
      activa: datos.activa !== false,
      escaneos: 0,
      pedidos: 0,
      ventas: 0,
      comision: 0,
    };

    setVeterinarias((prev) => [nueva, ...prev]);

    if (supabase) {
      supabase
        .from('veterinarias')
        .insert(veterinariaParaDB(nueva))
        .select('*')
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          const guardada = normalizarVeterinariaDesdeDB(data);
          setVeterinarias((prev) => prev.map((v) => (v.id === nueva.id ? guardada : v)));
        })
        .catch((error) => console.error('No se pudo crear veterinaria en Supabase:', error));
    }

    return nueva;
  };

  const actualizarVeterinaria = (datosVeterinaria) => {
    const slug = datosVeterinaria.slug || crearSlug(datosVeterinaria.nombre);
    const actualizada = { ...datosVeterinaria, slug, linkAfiliado: `/?vet=${slug}` };

    setVeterinarias((prev) => prev.map((v) => (v.id === actualizada.id ? { ...v, ...actualizada } : v)));
    if (veterinaria?.id === actualizada.id) setVeterinaria((prev) => ({ ...prev, ...actualizada }));

    if (supabase && esUUID(actualizada.id)) {
      supabase
        .from('veterinarias')
        .update(veterinariaParaDB(actualizada))
        .eq('id', actualizada.id)
        .then(({ error }) => {
          if (error) throw error;
        })
        .catch((error) => console.error('No se pudo actualizar veterinaria en Supabase:', error));
    }
  };

  const eliminarVeterinaria = (id) => {
    setVeterinarias((prev) => prev.filter((v) => v.id !== id));
    setUsuarios((prev) => prev.map((u) => (u.veterinariaId === id ? { ...u, veterinariaId: '', activo: false } : u)));

    if (supabase && esUUID(id)) {
      supabase
        .from('veterinarias')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
        .catch((error) => console.error('No se pudo eliminar veterinaria en Supabase:', error));
    }
  };

  const agregar = (p) =>
    setCarrito((prev) => {
      const ex = prev.find((i) => i.id === p.id);
      return ex ? prev.map((i) => (i.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i)) : [...prev, { ...p, cantidad: 1 }];
    });

  const cambiarCantidad = (id, cantidad) =>
    setCarrito((prev) => prev.map((i) => (i.id === id ? { ...i, cantidad: Math.max(1, Number(cantidad) || 1) } : i)));

  const quitar = (id) => setCarrito((prev) => prev.filter((i) => i.id !== id));
  const limpiar = () => setCarrito([]);
  const resumen = useMemo(() => resumenCarrito(carrito), [carrito]);

  const crearPedidoTransferencia = ({ cliente, pagoTipo = 'anticipo' }) => {
    const numero = `PED-${String(Date.now()).slice(-6)}`;
    const anticipoPorcentaje = Number(configuracion.anticipoPorcentaje || 60);
    const montoSolicitado = pagoTipo === 'total' ? resumen.total : resumen.total * (anticipoPorcentaje / 100);
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

  const actualizarPedido = (pedido) => setPedidos((prev) => prev.map((p) => (p.id === pedido.id ? { ...p, ...pedido } : p)));

  const confirmarAnticipo = (pedido, pagoTipoConfirmado = pedido.pagoTipo || 'anticipo') => {
    const esTotal = pagoTipoConfirmado === 'total';
    const codigo = pedido.codigoSeguimiento || generarCodigoSeguimiento();
    const anticipoRecibido = esTotal ? pedido.resumen.total : pedido.anticipoRequerido || pedido.resumen.total * 0.6;
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
    return pedidos.find(
      (p) => String(p.codigoSeguimiento || '').toUpperCase() === c && String(p.cliente?.whatsapp || '').replace(/[^0-9]/g, '').endsWith(w.slice(-8))
    );
  };

  const login = ({ email, password }) => {
    const acceso = String(email || '').toLowerCase().trim();
    const clave = String(password || '').trim();
    const usuarioEncontrado = usuarios.find((u) => {
      const usuarioNormalizado = String(u.usuario || '').toLowerCase().trim();
      const emailNormalizado = String(u.email || '').toLowerCase().trim();
      return u.activo !== false && (usuarioNormalizado === acceso || emailNormalizado === acceso) && String(u.password || '').trim() === clave;
    });

    if (!usuarioEncontrado) return { ok: false };

    if (usuarioEncontrado.rol === 'veterinaria') {
      const vetAsignada = veterinarias.find((v) => v.id === usuarioEncontrado.veterinariaId);
      if (!vetAsignada || vetAsignada.activa === false) return { ok: false };
      setVeterinaria(vetAsignada);
    }

    setUsuario(usuarioEncontrado);
    return { ok: true, rol: usuarioEncontrado.rol, usuario: usuarioEncontrado };
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('elanpet_usuario_actual');
  };

  const crearUsuario = (datos) => {
    const usuarioLimpio = String(datos.usuario || '').toLowerCase().trim();
    const emailLimpio = String(datos.email || '').toLowerCase().trim();
    const existe = usuarios.some((u) => {
      const mismoUsuario = usuarioLimpio && String(u.usuario || '').toLowerCase().trim() === usuarioLimpio;
      const mismoEmail = emailLimpio && String(u.email || '').toLowerCase().trim() === emailLimpio;
      const mismaVeterinaria = datos.rol === 'veterinaria' && datos.veterinariaId && u.veterinariaId === datos.veterinariaId && u.activo !== false;
      return mismoUsuario || mismoEmail || mismaVeterinaria;
    });
    if (existe) return { ok: false, error: 'usuario_duplicado' };

    const nuevo = {
      id: `temp-user-${Date.now()}`,
      nombre: datos.nombre || usuarioLimpio,
      usuario: usuarioLimpio,
      email: emailLimpio,
      password: String(datos.password || 'Temporal2026#').trim(),
      rol: datos.rol || 'veterinaria',
      veterinariaId: datos.rol === 'veterinaria' ? datos.veterinariaId || '' : '',
      activo: datos.activo !== false,
      debeCambiarPassword: datos.debeCambiarPassword !== false,
      creadoEn: new Date().toISOString(),
    };

    setUsuarios((prev) => [nuevo, ...prev]);

    if (supabase) {
      supabase
        .from('usuarios')
        .insert(usuarioParaDB(nuevo))
        .select('*')
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          const guardado = normalizarUsuarioDesdeDB(data);
          setUsuarios((prev) => prev.map((u) => (u.id === nuevo.id ? guardado : u)));
        })
        .catch((error) => console.error('No se pudo crear usuario en Supabase:', error));
    }

    return { ok: true, usuario: nuevo };
  };

  const actualizarUsuario = (usuarioActualizado) => {
    let actualizadoFinal = null;
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id !== usuarioActualizado.id) return u;
        actualizadoFinal = {
          ...u,
          ...usuarioActualizado,
          usuario: String(usuarioActualizado.usuario || u.usuario || '').toLowerCase().trim(),
          email: String(usuarioActualizado.email || u.email || '').toLowerCase().trim(),
          password: Object.prototype.hasOwnProperty.call(usuarioActualizado, 'password')
            ? String(usuarioActualizado.password || '').trim()
            : u.password,
          veterinariaId: (usuarioActualizado.rol || u.rol) === 'veterinaria' ? usuarioActualizado.veterinariaId || '' : '',
          activo: usuarioActualizado.activo !== false,
        };
        return actualizadoFinal;
      })
    );

    if (usuario?.id === usuarioActualizado.id && actualizadoFinal) setUsuario(actualizadoFinal);

    if (supabase && esUUID(usuarioActualizado.id)) {
      const datosDB = usuarioParaDB({ ...usuarioActualizado, password: usuarioActualizado.password || undefined });
      if (!Object.prototype.hasOwnProperty.call(usuarioActualizado, 'password')) delete datosDB.password;

      supabase
        .from('usuarios')
        .update(datosDB)
        .eq('id', usuarioActualizado.id)
        .then(({ error }) => {
          if (error) throw error;
        })
        .catch((error) => console.error('No se pudo actualizar usuario en Supabase:', error));
    }
  };

  const eliminarUsuario = (id) => {
    setUsuarios((prev) => {
      const usuarioEliminar = prev.find((u) => u.id === id);
      const adminsActivos = prev.filter((u) => u.rol === 'admin' && u.activo !== false);
      if (usuarioEliminar?.rol === 'admin' && adminsActivos.length <= 1) return prev;
      return prev.filter((u) => u.id !== id);
    });

    if (usuario?.id === id) setUsuario(null);

    if (supabase && esUUID(id)) {
      supabase
        .from('usuarios')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
        .catch((error) => console.error('No se pudo eliminar usuario en Supabase:', error));
    }
  };

  const actualizarProducto = (producto) => setProductos((prev) => prev.map((p) => (p.id === producto.id ? { ...p, ...producto } : p)));

  const crearProducto = (producto) => {
    const id = producto.id || crearSlug(producto.nombre);
    setProductos((prev) => [{ ...producto, id, precio: Number(producto.precio || 0), activo: true }, ...prev]);
  };

  const crearBanner = (banner) => setBanners((prev) => [{ ...banner, id: `banner-${Date.now()}` }, ...prev]);
  const actualizarBanner = (banner) => setBanners((prev) => prev.map((b) => (b.id === banner.id ? { ...b, ...banner } : b)));
  const eliminarBanner = (id) => setBanners((prev) => prev.filter((b) => b.id !== id));

  const crearTrabajo = (trabajo) => setTrabajos((prev) => [{ ...trabajo, id: `trabajo-${Date.now()}`, activo: true }, ...prev]);
  const actualizarTrabajo = (trabajo) => setTrabajos((prev) => prev.map((t) => (t.id === trabajo.id ? { ...t, ...trabajo } : t)));

  const crearCuentaBancaria = (cuenta) => setCuentasBancarias((prev) => [{ ...cuenta, id: `cta-${Date.now()}`, activa: true, visible: true }, ...prev]);
  const actualizarCuentaBancaria = (cuenta) => setCuentasBancarias((prev) => prev.map((c) => (c.id === cuenta.id ? { ...c, ...cuenta } : c)));
  const eliminarCuentaBancaria = (id) => setCuentasBancarias((prev) => prev.filter((c) => c.id !== id));

  return (
    <AppContext.Provider
      value={{
        configuracion,
        setConfiguracion,
        cuentasBancarias,
        crearCuentaBancaria,
        actualizarCuentaBancaria,
        eliminarCuentaBancaria,
        banners,
        crearBanner,
        actualizarBanner,
        eliminarBanner,
        trabajos,
        crearTrabajo,
        actualizarTrabajo,
        productos,
        setProductos,
        actualizarProducto,
        crearProducto,
        imagenes,
        crearImagen,
        eliminarImagen,
        veterinarias,
        setVeterinarias,
        crearVeterinaria,
        actualizarVeterinaria,
        eliminarVeterinaria,
        veterinaria,
        setVeterinaria,
        carrito,
        agregar,
        cambiarCantidad,
        quitar,
        limpiar,
        resumen,
        pedidos,
        crearPedidoTransferencia,
        actualizarPedido,
        confirmarAnticipo,
        cambiarEstadoProduccion,
        buscarPedidoSeguimiento,
        usuario,
        login,
        logout,
        usuarios,
        crearUsuario,
        actualizarUsuario,
        eliminarUsuario,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
