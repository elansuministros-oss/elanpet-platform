import React, { useState } from 'react';

import DashboardCRM from '../DashboardCRM';
import Empresas from '../Empresas';
import Contactos from '../Contactos';
import Clientes from '../Clientes';
import Proveedores from '../Proveedores';
import SeguimientoCRM from '../SeguimientoCRM';
import Vendedores from '../Vendedores';
import VeterinariasCRM from '../VeterinariasCRM';
import Afiliados from '../Afiliados';
import ReportesCRM from '../ReportesCRM';

import Pedidos from '../Pedidos';
import Produccion from '../Produccion';
import Cobros from '../Cobros';
import Comisiones from '../Comisiones';

import Cotizaciones from '../Cotizaciones';
import OrdenesTrabajo from '../OrdenesTrabajo';
import Inventario from '../Inventario';
import Materiales from '../Materiales';

export default function CRM() {
  const [modulo, setModulo] = useState('dashboard');

  return (
    <div style={{ padding: 20 }}>
      <h1>CRM CENTRAL ELANKAV</h1>

      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          marginBottom: 20,
        }}
      >
        <button onClick={() => setModulo('dashboard')}>
          Dashboard
        </button>

        <button onClick={() => setModulo('empresas')}>
          Empresas
        </button>

        <button onClick={() => setModulo('contactos')}>
          Contactos
        </button>

        <button onClick={() => setModulo('clientes')}>
          Clientes
        </button>

        <button onClick={() => setModulo('proveedores')}>
          Proveedores
        </button>

        <button onClick={() => setModulo('seguimiento')}>
          Seguimiento
        </button>

        <button onClick={() => setModulo('vendedores')}>
          Vendedores
        </button>

        <button onClick={() => setModulo('veterinarias')}>
          Veterinarias
        </button>

        <button onClick={() => setModulo('afiliados')}>
          Afiliados
        </button>

        <button onClick={() => setModulo('reportes')}>
          Reportes
        </button>

        <button onClick={() => setModulo('cotizaciones')}>
          Cotizaciones
        </button>

        <button onClick={() => setModulo('pedidos')}>
          Pedidos
        </button>

        <button onClick={() => setModulo('ordenes')}>
          Órdenes Trabajo
        </button>

        <button onClick={() => setModulo('produccion')}>
          Producción
        </button>

        <button onClick={() => setModulo('inventario')}>
          Inventario
        </button>

        <button onClick={() => setModulo('materiales')}>
          Materiales
        </button>

        <button onClick={() => setModulo('cobros')}>
          Cobros
        </button>

        <button onClick={() => setModulo('comisiones')}>
          Comisiones
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        {modulo === 'dashboard' && <DashboardCRM />}

        {modulo === 'empresas' && <Empresas />}

        {modulo === 'contactos' && <Contactos />}

        {modulo === 'clientes' && <Clientes />}

        {modulo === 'proveedores' && <Proveedores />}

        {modulo === 'seguimiento' && <SeguimientoCRM />}

        {modulo === 'vendedores' && <Vendedores />}

        {modulo === 'veterinarias' && <VeterinariasCRM />}

        {modulo === 'afiliados' && <Afiliados />}

        {modulo === 'reportes' && <ReportesCRM />}

        {modulo === 'cotizaciones' && <Cotizaciones />}

        {modulo === 'pedidos' && <Pedidos />}

        {modulo === 'ordenes' && <OrdenesTrabajo />}

        {modulo === 'produccion' && <Produccion />}

        {modulo === 'inventario' && <Inventario />}

        {modulo === 'materiales' && <Materiales />}

        {modulo === 'cobros' && <Cobros />}

        {modulo === 'comisiones' && <Comisiones />}
      </div>
    </div>
  );
}