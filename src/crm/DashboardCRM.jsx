import React from 'react';
import { useCore } from '../core/context/CoreContext';

const formatoNumero = (valor) => new Intl.NumberFormat('es-NI').format(valor || 0);

const obtenerFecha = (registro) =>
  registro?.actualizado || registro?.fechaRegistro || registro?.fecha || registro?.createdAt || null;

const ordenarRecientes = (lista = []) =>
  [...lista]
    .filter(Boolean)
    .sort((a, b) => {
      const fechaA = new Date(obtenerFecha(a) || 0).getTime();
      const fechaB = new Date(obtenerFecha(b) || 0).getTime();
      return fechaB - fechaA;
    });

const contarPorEstado = (lista = [], palabras = []) => {
  const palabrasNormalizadas = palabras.map((p) => p.toLowerCase());

  return lista.filter((item) => {
    const estado = String(item?.estado || item?.estatus || item?.fase || '').toLowerCase();
    return palabrasNormalizadas.some((palabra) => estado.includes(palabra));
  }).length;
};

const obtenerNombre = (registro, fallback) =>
  registro?.nombre ||
  registro?.cliente ||
  registro?.empresa ||
  registro?.titulo ||
  registro?.codigo ||
  registro?.descripcion ||
  fallback;

export default function DashboardCRM() {
  const {
    empresas,
    contactos,
    cotizaciones,
    pedidos,
    ordenesTrabajo,
    produccion,
    cobros,
    comisiones,
    inventario,
    materiales,
  } = useCore();

  const totalRegistros =
    empresas.length +
    contactos.length +
    cotizaciones.length +
    pedidos.length +
    ordenesTrabajo.length +
    produccion.length +
    cobros.length +
    comisiones.length +
    inventario.length +
    materiales.length;

  const cotizacionesAbiertas = contarPorEstado(cotizaciones, [
    'abierta',
    'pendiente',
    'enviada',
    'revision',
  ]);

  const pedidosActivos = contarPorEstado(pedidos, [
    'activo',
    'pendiente',
    'aprobado',
    'proceso',
  ]);

  const otPendientes = contarPorEstado(ordenesTrabajo, [
    'pendiente',
    'proceso',
    'abierta',
    'produccion',
  ]);

  const produccionPendiente = contarPorEstado(produccion, [
    'pendiente',
    'proceso',
    'produccion',
    'fabricacion',
  ]);

  const cobrosPendientes = contarPorEstado(cobros, [
    'pendiente',
    'parcial',
    'credito',
    'por cobrar',
  ]);

  const kpis = [
    {
      titulo: 'Empresas',
      valor: empresas.length,
      icono: '🏢',
      area: 'CRM',
      color: '#1D4ED8',
      fondo: '#EFF6FF',
    },
    {
      titulo: 'Contactos',
      valor: contactos.length,
      icono: '👤',
      area: 'CRM',
      color: '#2563EB',
      fondo: '#EFF6FF',
    },
    {
      titulo: 'Cotizaciones',
      valor: cotizaciones.length,
      icono: '📄',
      area: 'Ventas',
      color: '#059669',
      fondo: '#ECFDF5',
    },
    {
      titulo: 'Pedidos',
      valor: pedidos.length,
      icono: '🛒',
      area: 'Ventas',
      color: '#16A34A',
      fondo: '#F0FDF4',
    },
    {
      titulo: 'Órdenes Trabajo',
      valor: ordenesTrabajo.length,
      icono: '🔧',
      area: 'Operación',
      color: '#EA580C',
      fondo: '#FFF7ED',
    },
    {
      titulo: 'Producción',
      valor: produccion.length,
      icono: '🏭',
      area: 'Operación',
      color: '#F97316',
      fondo: '#FFF7ED',
    },
    {
      titulo: 'Cobros',
      valor: cobros.length,
      icono: '💰',
      area: 'Finanzas',
      color: '#7C3AED',
      fondo: '#F5F3FF',
    },
    {
      titulo: 'Comisiones',
      valor: comisiones.length,
      icono: '💵',
      area: 'Finanzas',
      color: '#9333EA',
      fondo: '#FAF5FF',
    },
    {
      titulo: 'Inventario',
      valor: inventario.length,
      icono: '📦',
      area: 'Inventario',
      color: '#92400E',
      fondo: '#FFFBEB',
    },
    {
      titulo: 'Materiales',
      valor: materiales.length,
      icono: '🧱',
      area: 'Inventario',
      color: '#B45309',
      fondo: '#FEF3C7',
    },
  ];

  const indicadores = [
    {
      titulo: 'Cotizaciones abiertas',
      valor: cotizacionesAbiertas,
      descripcion: 'Pendientes de aprobación o revisión',
      icono: '📌',
    },
    {
      titulo: 'Pedidos activos',
      valor: pedidosActivos,
      descripcion: 'Pedidos en seguimiento operativo',
      icono: '🧾',
    },
    {
      titulo: 'OT pendientes',
      valor: otPendientes,
      descripcion: 'Órdenes listas para taller o instalación',
      icono: '🛠️',
    },
    {
      titulo: 'Producción pendiente',
      valor: produccionPendiente,
      descripcion: 'Trabajos en proceso de fabricación',
      icono: '🏗️',
    },
    {
      titulo: 'Cobros pendientes',
      valor: cobrosPendientes,
      descripcion: 'Cuentas por cobrar o pagos parciales',
      icono: '💳',
    },
  ];

  const actividades = ordenarRecientes([
    ...empresas.map((item) => ({ ...item, modulo: 'Empresa', icono: '🏢' })),
    ...contactos.map((item) => ({ ...item, modulo: 'Contacto', icono: '👤' })),
    ...cotizaciones.map((item) => ({ ...item, modulo: 'Cotización', icono: '📄' })),
    ...pedidos.map((item) => ({ ...item, modulo: 'Pedido', icono: '🛒' })),
    ...ordenesTrabajo.map((item) => ({ ...item, modulo: 'Orden de Trabajo', icono: '🔧' })),
    ...produccion.map((item) => ({ ...item, modulo: 'Producción', icono: '🏭' })),
    ...cobros.map((item) => ({ ...item, modulo: 'Cobro', icono: '💰' })),
    ...comisiones.map((item) => ({ ...item, modulo: 'Comisión', icono: '💵' })),
    ...inventario.map((item) => ({ ...item, modulo: 'Inventario', icono: '📦' })),
    ...materiales.map((item) => ({ ...item, modulo: 'Material', icono: '🧱' })),
  ]).slice(0, 6);

  const alertas = [
    totalRegistros === 0
      ? 'El CRM está listo, pero todavía no hay registros operativos.'
      : null,
    empresas.length > 0 && contactos.length === 0
      ? 'Hay empresas registradas sin contactos asociados.'
      : null,
    cotizaciones.length > 0 && pedidos.length === 0
      ? 'Hay cotizaciones registradas, pero todavía no se han convertido en pedidos.'
      : null,
    pedidos.length > 0 && ordenesTrabajo.length === 0
      ? 'Hay pedidos registrados pendientes de orden de trabajo.'
      : null,
    ordenesTrabajo.length > 0 && produccion.length === 0
      ? 'Hay órdenes de trabajo pendientes de producción.'
      : null,
    produccion.length > 0 && cobros.length === 0
      ? 'Hay producción registrada sin cobros asociados.'
      : null,
  ].filter(Boolean);

  const unidades = [
    { nombre: 'ELANPET', estado: 'Publicado', icono: '🐾' },
    { nombre: 'ELAN SUMINISTROS', estado: 'Futuro módulo', icono: '📦' },
    { nombre: 'ZONA A', estado: 'Futuro módulo', icono: '🏪' },
    { nombre: 'ABADON', estado: 'Futuro módulo', icono: '🦬' },
    { nombre: 'K&R TEXTIL', estado: 'Futuro módulo', icono: '👕' },
    { nombre: 'ELAN AI', estado: 'Futuro módulo', icono: '🤖' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.preTitulo}>FASE 3.2 · Panel Ejecutivo</p>
          <h1 style={styles.titulo}>CRM CENTRAL ELANKAV</h1>
          <p style={styles.subtitulo}>
            Control maestro para ventas, operación, producción, cobros e integración futura de unidades.
          </p>
        </div>

        <div style={styles.resumenPrincipal}>
          <span style={styles.resumenLabel}>Registros totales</span>
          <strong style={styles.resumenNumero}>{formatoNumero(totalRegistros)}</strong>
          <span style={styles.resumenTexto}>Base operativa activa</span>
        </div>
      </div>

      <div style={styles.kpiGrid}>
        {kpis.map((card) => (
          <div
            key={card.titulo}
            style={{
              ...styles.kpiCard,
              background: card.fondo,
              borderLeft: `5px solid ${card.color}`,
            }}
          >
            <div style={styles.kpiTop}>
              <span style={styles.kpiIcono}>{card.icono}</span>
              <span style={{ ...styles.kpiArea, color: card.color }}>{card.area}</span>
            </div>

            <div style={styles.kpiTitulo}>{card.titulo}</div>
            <div style={{ ...styles.kpiValor, color: card.color }}>
              {formatoNumero(card.valor)}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.mainGrid}>
        <section style={styles.panelGrande}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Cadena Operativa</h2>
              <p style={styles.sectionText}>Flujo completo desde cliente hasta comisión.</p>
            </div>
          </div>

          <div style={styles.flujo}>
            {[
              ['🏢', 'Empresa'],
              ['👤', 'Contacto'],
              ['📄', 'Cotización'],
              ['🛒', 'Pedido'],
              ['🔧', 'OT'],
              ['🏭', 'Producción'],
              ['💰', 'Cobro'],
              ['💵', 'Comisión'],
            ].map((paso, index, lista) => (
              <React.Fragment key={paso[1]}>
                <div style={styles.pasoFlujo}>
                  <span style={styles.pasoIcono}>{paso[0]}</span>
                  <span>{paso[1]}</span>
                </div>
                {index < lista.length - 1 && <span style={styles.flecha}>→</span>}
              </React.Fragment>
            ))}
          </div>

          <div style={styles.indicadorGrid}>
            {indicadores.map((item) => (
              <div key={item.titulo} style={styles.indicadorCard}>
                <span style={styles.indicadorIcono}>{item.icono}</span>
                <div>
                  <strong style={styles.indicadorValor}>{formatoNumero(item.valor)}</strong>
                  <p style={styles.indicadorTitulo}>{item.titulo}</p>
                  <small style={styles.indicadorDescripcion}>{item.descripcion}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside style={styles.panel}>
          <h2 style={styles.sectionTitle}>Alertas</h2>
          <p style={styles.sectionText}>Lectura rápida del estado actual.</p>

          <div style={styles.alertasBox}>
            {alertas.length === 0 ? (
              <div style={styles.alertaOk}>✅ No hay alertas críticas por ahora.</div>
            ) : (
              alertas.map((alerta) => (
                <div key={alerta} style={styles.alertaItem}>
                  ⚠️ {alerta}
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      <div style={styles.bottomGrid}>
        <section style={styles.panel}>
          <h2 style={styles.sectionTitle}>Últimas actividades</h2>
          <p style={styles.sectionText}>Preparado para auditoría y seguimiento multiusuario.</p>

          <div style={styles.actividadLista}>
            {actividades.length === 0 ? (
              <p style={styles.vacio}>Todavía no hay actividad registrada.</p>
            ) : (
              actividades.map((actividad, index) => (
                <div key={`${actividad.id || actividad.modulo}-${index}`} style={styles.actividadItem}>
                  <span style={styles.actividadIcono}>{actividad.icono}</span>
                  <div>
                    <strong>{actividad.modulo}</strong>
                    <p style={styles.actividadTexto}>
                      {obtenerNombre(actividad, `Registro ${index + 1}`)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section style={styles.panel}>
          <h2 style={styles.sectionTitle}>Gráficas futuras</h2>
          <p style={styles.sectionText}>Espacio reservado para métricas financieras y operativas.</p>

          <div style={styles.graficaPlaceholder}>
            <div style={styles.barraUno} />
            <div style={styles.barraDos} />
            <div style={styles.barraTres} />
            <div style={styles.barraCuatro} />
          </div>

          <div style={styles.leyendaGrafica}>
            <span>Ventas</span>
            <span>Cobros</span>
            <span>Producción</span>
          </div>
        </section>

        <section style={styles.panel}>
          <h2 style={styles.sectionTitle}>Unidades ELANKAV</h2>
          <p style={styles.sectionText}>Preparado para operar como grupo empresarial.</p>

          <div style={styles.unidadesLista}>
            {unidades.map((unidad) => (
              <div key={unidad.nombre} style={styles.unidadItem}>
                <span>{unidad.icono}</span>
                <div>
                  <strong>{unidad.nombre}</strong>
                  <p style={styles.unidadEstado}>{unidad.estado}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '22px',
    background: '#F3F4F6',
    minHeight: '100vh',
    color: '#111827',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: '18px',
    flexWrap: 'wrap',
    marginBottom: '18px',
  },
  preTitulo: {
    margin: '0 0 6px',
    color: '#6B7280',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  titulo: {
    margin: 0,
    fontSize: '30px',
    lineHeight: 1.1,
  },
  subtitulo: {
    margin: '8px 0 0',
    color: '#6B7280',
    maxWidth: '720px',
  },
  resumenPrincipal: {
    background: '#111827',
    color: '#fff',
    borderRadius: '18px',
    padding: '18px 22px',
    minWidth: '220px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: '0 12px 30px rgba(17,24,39,0.18)',
  },
  resumenLabel: {
    fontSize: '12px',
    color: '#D1D5DB',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  resumenNumero: {
    fontSize: '34px',
    marginTop: '4px',
  },
  resumenTexto: {
    color: '#D1D5DB',
    fontSize: '13px',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
    gap: '14px',
    marginBottom: '18px',
  },
  kpiCard: {
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 8px 22px rgba(15,23,42,0.07)',
    minHeight: '126px',
  },
  kpiTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  kpiIcono: {
    fontSize: '25px',
  },
  kpiArea: {
    fontSize: '11px',
    fontWeight: 800,
    textTransform: 'uppercase',
  },
  kpiTitulo: {
    fontSize: '13px',
    color: '#4B5563',
    fontWeight: 700,
  },
  kpiValor: {
    fontSize: '31px',
    fontWeight: 900,
    marginTop: '3px',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 0.8fr)',
    gap: '18px',
    marginBottom: '18px',
  },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '18px',
  },
  panelGrande: {
    background: '#fff',
    borderRadius: '18px',
    padding: '20px',
    boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
  },
  panel: {
    background: '#fff',
    borderRadius: '18px',
    padding: '20px',
    boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '18px',
  },
  sectionText: {
    margin: '6px 0 16px',
    color: '#6B7280',
    fontSize: '13px',
  },
  flujo: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '9px',
    marginBottom: '18px',
  },
  pasoFlujo: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '999px',
    padding: '9px 12px',
    fontSize: '13px',
    fontWeight: 700,
  },
  pasoIcono: {
    fontSize: '18px',
  },
  flecha: {
    color: '#9CA3AF',
    fontWeight: 900,
  },
  indicadorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '12px',
  },
  indicadorCard: {
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '14px',
    padding: '14px',
    display: 'flex',
    gap: '12px',
  },
  indicadorIcono: {
    fontSize: '23px',
  },
  indicadorValor: {
    fontSize: '24px',
    color: '#111827',
  },
  indicadorTitulo: {
    margin: '2px 0',
    fontWeight: 800,
    fontSize: '13px',
  },
  indicadorDescripcion: {
    color: '#6B7280',
    fontSize: '12px',
  },
  alertasBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  alertaItem: {
    background: '#FFFBEB',
    border: '1px solid #FDE68A',
    color: '#92400E',
    borderRadius: '12px',
    padding: '12px',
    fontSize: '13px',
    lineHeight: 1.35,
  },
  alertaOk: {
    background: '#ECFDF5',
    border: '1px solid #A7F3D0',
    color: '#047857',
    borderRadius: '12px',
    padding: '12px',
    fontSize: '13px',
    fontWeight: 700,
  },
  actividadLista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  actividadItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    padding: '11px',
    borderRadius: '12px',
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
  },
  actividadIcono: {
    fontSize: '20px',
  },
  actividadTexto: {
    margin: '3px 0 0',
    color: '#6B7280',
    fontSize: '13px',
  },
  vacio: {
    margin: 0,
    color: '#6B7280',
    fontSize: '13px',
  },
  graficaPlaceholder: {
    height: '180px',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '14px',
    padding: '16px',
    background: '#F9FAFB',
    border: '1px dashed #D1D5DB',
    borderRadius: '14px',
  },
  barraUno: {
    width: '22%',
    height: '45%',
    borderRadius: '12px 12px 0 0',
    background: '#DBEAFE',
  },
  barraDos: {
    width: '22%',
    height: '75%',
    borderRadius: '12px 12px 0 0',
    background: '#DCFCE7',
  },
  barraTres: {
    width: '22%',
    height: '58%',
    borderRadius: '12px 12px 0 0',
    background: '#FFEDD5',
  },
  barraCuatro: {
    width: '22%',
    height: '88%',
    borderRadius: '12px 12px 0 0',
    background: '#EDE9FE',
  },
  leyendaGrafica: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#6B7280',
    fontSize: '12px',
    marginTop: '10px',
  },
  unidadesLista: {
    display: 'grid',
    gap: '10px',
  },
  unidadItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    padding: '11px',
  },
  unidadEstado: {
    margin: '2px 0 0',
    color: '#6B7280',
    fontSize: '12px',
  },
};
