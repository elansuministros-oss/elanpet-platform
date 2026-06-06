import React, { useMemo } from 'react';
import { useCore } from '../core/context/CoreContext';

export default function ReportesCRM() {
  const {
    empresas,
    contactos,
    seguimiento,
    vendedores,
    veterinarias,
    afiliados,
  } = useCore();

  const formatoCordobas = (valor) => {
    return new Intl.NumberFormat('es-NI', {
      style: 'currency',
      currency: 'NIO',
      minimumFractionDigits: 2,
    }).format(Number(valor || 0));
  };

  const reportes = useMemo(() => {
    const ventasVendedores = vendedores.reduce(
      (total, item) => total + Number(item.ventas || 0),
      0
    );

    const comisionesVendedores = vendedores.reduce((total, item) => {
      return (
        total +
        (Number(item.ventas || 0) *
          Number(item.comisionPorcentaje || 0)) /
          100
      );
    }, 0);

    const ventasVeterinarias = veterinarias.reduce(
      (total, item) => total + Number(item.totalVendido || 0),
      0
    );

    const comisionesVeterinarias = veterinarias.reduce((total, item) => {
      return (
        total +
        (Number(item.totalVendido || 0) *
          Number(item.comisionPorcentaje || 0)) /
          100
      );
    }, 0);

    const ventasAfiliados = afiliados.reduce(
      (total, item) => total + Number(item.ventas || 0),
      0
    );

    const comisionesAfiliados = afiliados.reduce((total, item) => {
      return (
        total +
        (Number(item.ventas || 0) *
          Number(item.comisionPorcentaje || 0)) /
          100
      );
    }, 0);

    return {
      empresas: empresas.length,
      contactos: contactos.length,
      clientes: contactos.filter((item) => item.rol === 'Cliente').length,
      proveedores: contactos.filter((item) => item.rol === 'Proveedor').length,
      seguimiento: seguimiento.length,
      seguimientoPendiente: seguimiento.filter(
        (item) => item.estado === 'Pendiente'
      ).length,
      vendedores: vendedores.length,
      veterinarias: veterinarias.length,
      afiliados: afiliados.length,
      ventasTotales:
        ventasVendedores + ventasVeterinarias + ventasAfiliados,
      comisionesTotales:
        comisionesVendedores +
        comisionesVeterinarias +
        comisionesAfiliados,
    };
  }, [
    empresas,
    contactos,
    seguimiento,
    vendedores,
    veterinarias,
    afiliados,
  ]);

  return (
    <div className="crm-page">
      <div className="crm-page-header">
        <div>
          <h2>Reportes CRM</h2>
          <p>
            Panel general de indicadores del CRM Central ELANKAV.
          </p>
        </div>
      </div>

      <div className="crm-stats">
        <div className="crm-stat-card">
          <span>Empresas</span>
          <strong>{reportes.empresas}</strong>
        </div>

        <div className="crm-stat-card">
          <span>Contactos</span>
          <strong>{reportes.contactos}</strong>
        </div>

        <div className="crm-stat-card">
          <span>Clientes</span>
          <strong>{reportes.clientes}</strong>
        </div>

        <div className="crm-stat-card">
          <span>Proveedores</span>
          <strong>{reportes.proveedores}</strong>
        </div>

        <div className="crm-stat-card">
          <span>Seguimientos</span>
          <strong>{reportes.seguimiento}</strong>
        </div>

        <div className="crm-stat-card">
          <span>Pendientes</span>
          <strong>{reportes.seguimientoPendiente}</strong>
        </div>

        <div className="crm-stat-card">
          <span>Vendedores</span>
          <strong>{reportes.vendedores}</strong>
        </div>

        <div className="crm-stat-card">
          <span>Veterinarias</span>
          <strong>{reportes.veterinarias}</strong>
        </div>

        <div className="crm-stat-card">
          <span>Afiliados</span>
          <strong>{reportes.afiliados}</strong>
        </div>

        <div className="crm-stat-card">
          <span>Ventas totales</span>
          <strong>{formatoCordobas(reportes.ventasTotales)}</strong>
        </div>

        <div className="crm-stat-card">
          <span>Comisiones</span>
          <strong>{formatoCordobas(reportes.comisionesTotales)}</strong>
        </div>
      </div>

      <div className="crm-card">
        <h3>Resumen ejecutivo</h3>

        <p>
          Este reporte consolida empresas, contactos, clientes,
          proveedores, seguimiento comercial, vendedores, veterinarias,
          afiliados, ventas y comisiones.
        </p>

        <p>
          Esta pantalla servirá como base para futuros reportes de
          cotizaciones, pedidos, producción, cobros y comisiones.
        </p>
      </div>
    </div>
  );
}