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
  { ...veterinariaDemo, id: 'vet001', codigo: 'VET001', slug: 'veterinaria-demo', telefono: '', whatsapp: '', email: '', direccion: 'Managua, Nicaragua', responsable: 'Responsable Demo', comisionPorcentaje: 10, linkAfiliado: '/?vet=veterinaria-demo', activa: true, escaneos: 0, pedidos: 0, ventas: 0, comision: 0 },
  { id: 'vet002', codigo: 'VET002', nombre: 'Veterinaria Animal Care', slug: 'animal-care', telefono: '+505 7777 7777', whatsapp: '+505 7777 7777', email: '', direccion: 'Managua, Nicaragua', responsable: 'Responsable Animal Care', comisionPorcentaje: 10, linkAfiliado: '/?vet=animal-care', activa: true, escaneos: 0, pedidos: 0, ventas: 0, comision: 0 },
];

const usuariosIniciales = [
  { id: 'user-admin', nombre: 'Erick Cano', usuario: 'admin', email: 'elansuministros@gmail.com', password: 'ElanPet2026#', rol: 'admin', veterinariaId: '', activo: true, debeCambiarPassword: false, creadoEn: new Date().toISOString() },
  { id: 'user-vet-demo', nombre: 'Veterinaria Demo', usuario: 'vetdemo', email: 'vet@elanpet.com', password: 'VetDemo2026#', rol: 'veterinaria', veterinariaId: 'vet001', activo: true, debeCambiarPassword: true, creadoEn: new Date().toISOString() },
  { id: 'user-produccion-demo', nombre: 'Producción ELANPET', usuario: 'produccion', email: 'produccion@elanpet.com', password: 'Produccion2026#', rol: 'produccion', veterinariaId: '', activo: true, debeCambiarPassword: true, creadoEn: new Date().toISOString() },
];

export const estadosProduccion = ['pendiente', 'diseno', 'produccion', 'control_calidad', 'listo', 'entregado'];

export const etiquetasEstado = {
  pendiente: 'Pendiente',
  pendiente_pago: 'Pendiente de pago',
  pedido_recibido: 'Pedido recibido',
  anticipo_confirmado: 'Anticipo confirmado',
  pago_total_confirmado: 'Pago total confirmado',
  diseno: 'Diseño',
  produccion: 'Producción',
  corte_cnc: 'Corte CNC',
  armado: 'Armado',
  pintura_acabado: 'Pintura / acabado',
  control_calidad: 'Control de calidad',
  listo: 'Listo',
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

function guardarStorage(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // sin acción
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

function normalizarUsuario(texto) {
  return String(texto || '').toLowerCase().trim();
}

function mapVeterinariaFromDb(row) {
  return {
    id: row.id,
    codigo: row.codigo || '',
    nombre: row.nombre || '',
    slug: row.slug || crearSlug(row.nombre || row.codigo || row.id),
    telefono: row.telefono || row.whatsapp || '',
    whatsapp: row.whatsapp || row.telefono || '',
    email: row.email || row.correo || '',
    direccion: row.direccion || '',
    responsable: row.responsable || '',
    logo: row.logo || '',
    comisionPorcentaje: Number(row.comision_porcentaje ?? 10),
    linkAfiliado: row.link_afiliado || `/?vet=${row.slug || crearSlug(row.nombre || row.codigo || row.id)}`,
    activa: row.activa !== false,
    escaneos: Number(row.escaneos || 0),
    pedidos: Number(row.pedidos || 0),
    ventas: Number(row.ventas || 0),
    comision: Number(row.comision || 0),
    createdAt: row.created_at || '',
  };
}

function mapVeterinariaToDb(vet) {
  const slug = vet.slug || crearSlug(vet.nombre);
  return {
    codigo: vet.codigo || '',
    nombre: vet.nombre || '',
    slug,
    telefono: vet.telefono || vet.whatsapp || '',
    whatsapp: vet.whatsapp || vet.telefono || '',
    correo: vet.email || vet.correo || '',
    email: vet.email || vet.correo || '',
    direccion: vet.direccion || '',
    responsable: vet.responsable || '',
    logo: vet.logo || '',
    comision_porcentaje: Number(vet.comisionPorcentaje ?? vet.comision_porcentaje ?? 10),
    link_afiliado: vet.linkAfiliado || `/?vet=${slug}`,
    activa: vet.activa !== false,
    escaneos: Number(vet.escaneos || 0),
    pedidos: Number(vet.pedidos || 0),
    ventas: Number(vet.ventas || 0),
    comision: Number(vet.comision || 0),
  };
}

function mapUsuarioFromDb(row) {
  return {
    id: row.id,
    nombre: row.nombre || row.usuario || row.email || '',
    usuario: row.usuario || '',
    email: row.email || '',
    password: row.password || '',
    rol: row.rol || 'veterinaria',
    veterinariaId: row.veterinaria_id || '',
    activo: row.activo !== false,
    debeCambiarPassword: row.debe_cambiar_password === true,
    creadoEn: row.created_at || '',
  };
}

function mapUsuarioToDb(usuario) {
  return {
    nombre: usuario.nombre || usuario.usuario || usuario.email || '',
    usuario: normalizarUsuario(usuario.usuario),
    email: normalizarUsuario(usuario.email),
    password: String(usuario.password || '').trim(),
    rol: usuario.rol || 'veterinaria',
    veterinaria_id: (usuario.rol || 'veterinaria') === 'veterinaria' ? usuario.veterinariaId || null : null,
    activo: usuario.activo !== false,
    debe_cambiar_password: usuario.debeCambiarPassword === true,
  };
}

function esUuid(valor) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(valor || ''));
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
  const [supabaseListo, setSupabaseListo] = useState(false);

  useEffect(() => guardarStorage('elanpet_configuracion', configuracion), [configuracion]);
  useEffect(() => guardarStorage('elanpet_cuentas_bancarias', cuentasBancarias), [cuentasBancarias]);
  useEffect(() => guardarStorage('elanpet_banners', banners), [banners]);
  useEffect(() => guardarStorage('elanpet_trabajos', trabajos), [trabajos]);
  useEffect(() => guardarStorage('elanpet_productos', productos), [productos]);
  useEffect(() => guardarStorage('elanpet_imagenes', imagenes), [imagenes]);
  useEffect(() => guardarStorage('elanpet_veterinarias', veterinarias), [veterinarias]);
  useEffect(() => guardarStorage('elanpet_pedidos', pedidos), [pedidos]);
  useEffect(() => guardarStorage('elanpet_usuarios', usuarios), [usuarios]);

  useEffect(() => {
    if (usuario) guardarStorage('elanpet_usuario_actual', usuario);
    else localStorage.removeItem('elanpet_usuario_actual');
  }, [usuario]);

  useEffect(() => {
    if (veterinaria) guardarStorage('elanpet_veterinaria_actual', veterinaria);
  }, [veterinaria]);

  useEffect(() => {
    let activo = true;

    const cargarDatosSupabase = async () => {
      if (!supabase) {
        setSupabaseListo(false);
        return;
      }

      try {
        const { data: vetsData, error: vetsError } = await supabase
          .from('veterinarias')
          .select('*')
          .order('created_at', { ascending: false });

        if (vetsError) throw vetsError;

        let vets = (vetsData || []).map(mapVeterinariaFromDb);

        const { data: usersData, error: usersError } = await supabase
          .from('usuarios')
          .select('*')
          .order('created_at', { ascending: false });

        if (usersError) throw usersError;

        let users = (usersData || []).map(mapUsuarioFromDb);

        if (vets.length === 0) {
          const vetsParaCrear = veterinariasIniciales.map((v, index) => ({
            ...mapVeterinariaToDb(v),
            codigo: v.codigo || `VET${String(index + 1).padStart(3, '0')}`,
          }));

          const { data: vetsCreadas, error: crearVetsError } = await supabase
            .from('veterinarias')
            .insert(vetsParaCrear)
            .select('*');

          if (crearVetsError) throw crearVetsError;
          vets = (vetsCreadas || []).map(mapVeterinariaFromDb);
        }

        if (users.length === 0) {
          const vetDemo = vets.find((v) => v.codigo === 'VET001') || vets[0];

          const usuariosParaCrear = [
            mapUsuarioToDb({
              ...usuariosIniciales[0],
              veterinariaId: '',
            }),
          ];

          if (vetDemo?.id) {
            usuariosParaCrear.push(
              mapUsuarioToDb({
                ...usuariosIniciales[1],
                veterinariaId: vetDemo.id,
              })
            );
          }

          const { data: usuariosCreados, error: crearUsersError } = await supabase
            .from('usuarios')
            .insert(usuariosParaCrear)
            .select('*');

          if (crearUsersError) throw crearUsersError;
          users = (usuariosCreados || []).map(mapUsuarioFromDb);
        }

        if (!activo) return;

        setVeterinarias(vets);
        setUsuarios(users);

        const usuarioActual = leerStorage('elanpet_usuario_actual', null);
        if (usuarioActual?.id) {
          const usuarioSincronizado = users.find((u) => u.id === usuarioActual.id || u.usuario === usuarioActual.usuario);
          if (usuarioSincronizado) {
            setUsuario(usuarioSincronizado);
            if (usuarioSincronizado.rol === 'veterinaria') {
              const vetAsignada = vets.find((v) => v.id === usuarioSincronizado.veterinariaId);
              if (vetAsignada) setVeterinaria(vetAsignada);
            }
          }
        }

        setSupabaseListo(true);
      } catch (error) {
        console.error('Error cargando datos desde Supabase:', error);
        setSupabaseListo(false);
      }
    };

    cargarDatosSupabase();

    return () => {
      activo = false;
    };
  }, []);

  const crearImagen = (imagen) => setImagenes((prev) => [imagen, ...prev]);
  const eliminarImagen = (id) => setImagenes((prev) => prev.filter((img) => img.id !== id));

  const crearVeterinaria = (datos) => {
    const slug = crearSlug(datos.nombre);
    const codigo = datos.codigo || `VET${String(veterinarias.length + 1).padStart(3, '0')}`;
    const tempId = `vet-temp-${Date.now()}`;

    const nueva = {
      id: tempId,
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
        .insert(mapVeterinariaToDb(nueva))
        .select('*')
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error creando veterinaria en Supabase:', error);
            setVeterinarias((prev) => prev.filter((v) => v.id !== tempId));
            window.alert('No se pudo guardar la veterinaria en Supabase. Revisá si el código ya existe.');
            return;
          }

          const creada = mapVeterinariaFromDb(data);
          setVeterinarias((prev) => prev.map((v) => (v.id === tempId ? creada : v)));
        });
    }

    return nueva;
  };

  const actualizarVeterinaria = (datosVeterinaria) => {
    const slug = datosVeterinaria.slug || crearSlug(datosVeterinaria.nombre);
    const actualizada = { ...datosVeterinaria, slug, linkAfiliado: `/?vet=${slug}` };

    setVeterinarias((prev) => prev.map((v) => (v.id === actualizada.id ? { ...v, ...actualizada } : v)));
    if (veterinaria?.id === actualizada.id) setVeterinaria((prev) => ({ ...prev, ...actualizada }));

    if (supabase && esUuid(actualizada.id)) {
      supabase
        .from('veterinarias')
        .update(mapVeterinariaToDb(actualizada))
        .eq('id', actualizada.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error actualizando veterinaria en Supabase:', error);
            window.alert('No se pudo actualizar la veterinaria en Supabase.');
          }
        });
    }
  };

  const eliminarVeterinaria = (id) => {
    setVeterinarias((prev) => prev.filter((v) => v.id !== id));
    setUsuarios((prev) => prev.map((u) => (u.veterinariaId === id ? { ...u, veterinariaId: '', activo: false } : u)));

    if (supabase && esUuid(id)) {
      supabase
        .from('veterinarias')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) {
            console.error('Error eliminando veterinaria en Supabase:', error);
            window.alert('No se pudo eliminar la veterinaria en Supabase.');
          }
        });
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
      estadoProduccion: 'pendiente',
      pagoEstado: 'pendiente_transferencia',
      seguimientoEstado: 'pendiente_pago',
      comisionEstado: 'no_generada',
      ordenTrabajo: { codigoOT: `OT-${String(Date.now()).slice(-6)}`, responsable: '', observaciones: '', fecha: new Date().toISOString(), estadoProduccion: 'pendiente', evidencias: { inicial: '', proceso: '', terminado: '', entrega: '' } },
      historial: [{ estado: 'pendiente', fecha: new Date().toISOString(), nota: 'Pedido creado desde carrito.' }],
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
      estadoProduccion: 'pendiente',
      pagoEstado: esTotal ? 'pago_total_confirmado' : 'anticipo_confirmado',
      seguimientoEstado: 'en_produccion',
      comisionEstado: 'pendiente_entrega',
      historial: [...(pedido.historial || []), { estado: esTotal ? 'pago_total_confirmado' : 'anticipo_confirmado', fecha: new Date().toISOString(), nota: 'Pago validado por administración.' }],
    });
    return codigo;
  };

  const crearOrdenTrabajoBase = (pedido) => ({
    codigoOT: pedido?.ordenTrabajo?.codigoOT || `OT-${String(pedido?.id || Date.now()).replace(/[^0-9]/g, '').slice(-6) || Date.now()}`,
    pedido: pedido?.codigoSeguimiento || pedido?.numero || '',
    cliente: pedido?.cliente?.nombre || '',
    veterinaria: pedido?.veterinaria?.nombre || '',
    producto: (pedido?.items || []).map((i) => i.nombre).join(', '),
    cantidad: (pedido?.items || []).reduce((a, i) => a + Number(i.cantidad || 0), 0),
    responsable: pedido?.ordenTrabajo?.responsable || '',
    observaciones: pedido?.ordenTrabajo?.observaciones || '',
    fecha: pedido?.ordenTrabajo?.fecha || new Date().toISOString(),
    estadoProduccion: pedido?.estadoProduccion || 'pendiente',
    evidencias: { inicial: '', proceso: '', terminado: '', entrega: '', ...(pedido?.ordenTrabajo?.evidencias || {}) },
  });

  const cambiarEstadoProduccion = (pedido, estadoProduccion) => {
    const entregado = estadoProduccion === 'entregado';
    const ordenTrabajo = {
      ...crearOrdenTrabajoBase(pedido),
      ...(pedido.ordenTrabajo || {}),
      estadoProduccion,
    };

    actualizarPedido({
      ...pedido,
      estado: entregado ? 'entregado' : pedido.estado,
      estadoProduccion,
      seguimientoEstado: estadoProduccion,
      ordenTrabajo,
      comisionEstado: entregado ? 'pendiente' : pedido.comisionEstado,
      historial: [...(pedido.historial || []), { estado: estadoProduccion, fecha: new Date().toISOString(), nota: etiquetasEstado[estadoProduccion] || estadoProduccion }],
    });
  };

  const actualizarOrdenTrabajo = (pedido, datosOrden) => {
    const ordenTrabajo = {
      ...crearOrdenTrabajoBase(pedido),
      ...(pedido.ordenTrabajo || {}),
      ...datosOrden,
      evidencias: {
        ...crearOrdenTrabajoBase(pedido).evidencias,
        ...(pedido.ordenTrabajo?.evidencias || {}),
        ...(datosOrden.evidencias || {}),
      },
    };

    actualizarPedido({
      ...pedido,
      ordenTrabajo,
      estadoProduccion: ordenTrabajo.estadoProduccion || pedido.estadoProduccion || 'pendiente',
      seguimientoEstado: ordenTrabajo.estadoProduccion || pedido.seguimientoEstado,
    });
  };

  const guardarEvidenciaProduccion = (pedido, tipo, imagen) => {
    actualizarOrdenTrabajo(pedido, {
      evidencias: {
        ...(pedido.ordenTrabajo?.evidencias || {}),
        [tipo]: imagen,
      },
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
    const acceso = normalizarUsuario(email);
    const clave = String(password || '').trim();

    const usuarioEncontrado = usuarios.find((u) => {
      const usuarioNormalizado = normalizarUsuario(u.usuario);
      const emailNormalizado = normalizarUsuario(u.email);
      return u.activo !== false && (usuarioNormalizado === acceso || emailNormalizado === acceso) && String(u.password || '').trim() === clave;
    });

    if (!usuarioEncontrado) return { ok: false };

    if (usuarioEncontrado.rol === 'veterinaria') {
      const vetAsignada = veterinarias.find((v) => v.id === usuarioEncontrado.veterinariaId);
      if (!vetAsignada || vetAsignada.activa === false) return { ok: false };
      setVeterinaria(vetAsignada);
    }

    setUsuario(usuarioEncontrado);
    return { ok: true, rol: usuarioEncontrado.rol, usuario: usuarioEncontrado, supabaseListo };
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('elanpet_usuario_actual');
  };

  const crearUsuario = (datos) => {
    const usuarioLimpio = normalizarUsuario(datos.usuario);
    const emailLimpio = normalizarUsuario(datos.email);

    const existe = usuarios.some((u) => {
      const mismoUsuario = usuarioLimpio && normalizarUsuario(u.usuario) === usuarioLimpio;
      const mismoEmail = emailLimpio && normalizarUsuario(u.email) === emailLimpio;
      const mismaVeterinaria = datos.rol === 'veterinaria' && datos.veterinariaId && u.veterinariaId === datos.veterinariaId && u.activo !== false;
      return mismoUsuario || mismoEmail || mismaVeterinaria;
    });

    if (existe) return { ok: false, error: 'usuario_duplicado' };

    const tempId = `user-temp-${Date.now()}`;
    const nuevo = {
      id: tempId,
      nombre: datos.nombre || usuarioLimpio,
      usuario: usuarioLimpio,
      email: emailLimpio,
      password: String(datos.password || 'Temporal2026#').trim(),
      rol: datos.rol || 'veterinaria',
      veterinariaId: datos.rol === 'veterinaria' ? datos.veterinariaId || '' : '',
      activo: datos.activo !== false,
      debeCambiarPassword: datos.debeCambiarPassword === true,
      creadoEn: new Date().toISOString(),
    };

    setUsuarios((prev) => [nuevo, ...prev]);

    if (supabase) {
      supabase
        .from('usuarios')
        .insert(mapUsuarioToDb(nuevo))
        .select('*')
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error creando usuario en Supabase:', error);
            setUsuarios((prev) => prev.filter((u) => u.id !== tempId));
            window.alert('No se pudo guardar el usuario en Supabase. Revisá duplicados.');
            return;
          }

          const creado = mapUsuarioFromDb(data);
          setUsuarios((prev) => prev.map((u) => (u.id === tempId ? creado : u)));
        });
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
          usuario: normalizarUsuario(usuarioActualizado.usuario || u.usuario),
          email: normalizarUsuario(usuarioActualizado.email || u.email),
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

    if (supabase && esUuid(usuarioActualizado.id)) {
      const datosDb = mapUsuarioToDb({
        ...usuarioActualizado,
        password: Object.prototype.hasOwnProperty.call(usuarioActualizado, 'password')
          ? String(usuarioActualizado.password || '').trim()
          : usuarios.find((u) => u.id === usuarioActualizado.id)?.password || '',
      });

      supabase
        .from('usuarios')
        .update(datosDb)
        .eq('id', usuarioActualizado.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error actualizando usuario en Supabase:', error);
            window.alert('No se pudo actualizar el usuario en Supabase.');
          }
        });
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

    if (supabase && esUuid(id)) {
      supabase
        .from('usuarios')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) {
            console.error('Error eliminando usuario en Supabase:', error);
            window.alert('No se pudo eliminar el usuario en Supabase.');
          }
        });
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
        actualizarOrdenTrabajo,
        guardarEvidenciaProduccion,
        buscarPedidoSeguimiento,
        usuario,
        login,
        logout,
        usuarios,
        crearUsuario,
        actualizarUsuario,
        eliminarUsuario,
        supabaseListo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
