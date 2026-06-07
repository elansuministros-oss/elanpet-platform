import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CoreContext = createContext(null);

const leerStorage = (clave, valorInicial) => {
  try {
    const data = localStorage.getItem(clave);
    return data ? JSON.parse(data) : valorInicial;
  } catch {
    return valorInicial;
  }
};

const guardarStorage = (clave, valor) => {
  localStorage.setItem(clave, JSON.stringify(valor));
};

const crearId = (prefijo) => `${prefijo}-${Date.now()}`;

const crearRegistro = (prefijo, datos) => ({
  id: datos.id || crearId(prefijo),
  ...datos,
  fechaRegistro: datos.fechaRegistro || new Date().toISOString(),
  actualizado: new Date().toISOString(),
});

const actualizarLista = (lista, id, datos) =>
  lista.map((item) =>
    item.id === id
      ? {
          ...item,
          ...datos,
          actualizado: new Date().toISOString(),
        }
      : item
  );

const eliminarDeLista = (lista, id) => lista.filter((item) => item.id !== id);

export function CoreProvider({ children }) {
  const [empresas, setEmpresas] = useState(() =>
    leerStorage('elankav_empresas', [])
  );

  const [contactos, setContactos] = useState(() =>
    leerStorage('elankav_contactos', [])
  );

  const [seguimiento, setSeguimiento] = useState(() =>
    leerStorage('elankav_seguimiento', [])
  );

  const [vendedores, setVendedores] = useState(() =>
    leerStorage('elankav_vendedores', [])
  );

  const [veterinarias, setVeterinarias] = useState(() =>
    leerStorage('elankav_veterinarias', [])
  );

  const [afiliados, setAfiliados] = useState(() =>
    leerStorage('elankav_afiliados', [])
  );

  const [proveedores, setProveedores] = useState(() =>
    leerStorage('elankav_proveedores', [])
  );

  const [compras, setCompras] = useState(() =>
    leerStorage('elankav_compras', [])
  );

  const [cuentasPorPagar, setCuentasPorPagar] = useState(() =>
    leerStorage('elankav_cuentas_por_pagar', [])
  );

  const [cuentasPorCobrar, setCuentasPorCobrar] = useState(() =>
    leerStorage('elankav_cuentas_por_cobrar', [])
  );

  const [flujoCaja, setFlujoCaja] = useState(() =>
    leerStorage('elankav_flujo_caja', [])
  );

  const [cotizaciones, setCotizaciones] = useState(() =>
    leerStorage('elankav_cotizaciones', [])
  );

  const [pedidos, setPedidos] = useState(() =>
    leerStorage('elankav_pedidos', [])
  );

  const [ordenesTrabajo, setOrdenesTrabajo] = useState(() =>
    leerStorage('elankav_ordenes_trabajo', [])
  );

  const [produccion, setProduccion] = useState(() =>
    leerStorage('elankav_produccion', [])
  );

  const [cobros, setCobros] = useState(() =>
    leerStorage('elankav_cobros', [])
  );

  const [comisiones, setComisiones] = useState(() =>
    leerStorage('elankav_comisiones', [])
  );

  const [inventario, setInventario] = useState(() =>
    leerStorage('elankav_inventario', [])
  );

  const [materiales, setMateriales] = useState(() =>
    leerStorage('elankav_materiales', [])
  );

  useEffect(() => guardarStorage('elankav_empresas', empresas), [empresas]);
  useEffect(() => guardarStorage('elankav_contactos', contactos), [contactos]);
  useEffect(() => guardarStorage('elankav_seguimiento', seguimiento), [seguimiento]);
  useEffect(() => guardarStorage('elankav_vendedores', vendedores), [vendedores]);
  useEffect(() => guardarStorage('elankav_veterinarias', veterinarias), [veterinarias]);
  useEffect(() => guardarStorage('elankav_afiliados', afiliados), [afiliados]);
  useEffect(() => guardarStorage('elankav_proveedores', proveedores), [proveedores]);
  useEffect(() => guardarStorage('elankav_compras', compras), [compras]);
  useEffect(() => guardarStorage('elankav_cuentas_por_pagar', cuentasPorPagar), [cuentasPorPagar]);
  useEffect(() => guardarStorage('elankav_cuentas_por_cobrar', cuentasPorCobrar), [cuentasPorCobrar]);
  useEffect(() => guardarStorage('elankav_flujo_caja', flujoCaja), [flujoCaja]);
  useEffect(() => guardarStorage('elankav_cotizaciones', cotizaciones), [cotizaciones]);
  useEffect(() => guardarStorage('elankav_pedidos', pedidos), [pedidos]);
  useEffect(() => guardarStorage('elankav_ordenes_trabajo', ordenesTrabajo), [ordenesTrabajo]);
  useEffect(() => guardarStorage('elankav_produccion', produccion), [produccion]);
  useEffect(() => guardarStorage('elankav_cobros', cobros), [cobros]);
  useEffect(() => guardarStorage('elankav_comisiones', comisiones), [comisiones]);
  useEffect(() => guardarStorage('elankav_inventario', inventario), [inventario]);
  useEffect(() => guardarStorage('elankav_materiales', materiales), [materiales]);

  const crearEmpresa = (datos) => {
    setEmpresas((prev) => [crearRegistro('empresa', datos), ...prev]);
  };

  const actualizarEmpresa = (id, datos) => {
    setEmpresas((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarEmpresa = (id) => {
    setEmpresas((prev) => eliminarDeLista(prev, id));
    setContactos((prev) =>
      prev.map((contacto) =>
        contacto.empresaId === id ? { ...contacto, empresaId: '' } : contacto
      )
    );
  };

  const crearContacto = (datos) => {
    setContactos((prev) => [crearRegistro('contacto', datos), ...prev]);
  };

  const actualizarContacto = (id, datos) => {
    setContactos((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarContacto = (id) => {
    setContactos((prev) => eliminarDeLista(prev, id));
  };

  const crearSeguimiento = (datos) => {
    setSeguimiento((prev) => [crearRegistro('seguimiento', datos), ...prev]);
  };

  const actualizarSeguimiento = (id, datos) => {
    setSeguimiento((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarSeguimiento = (id) => {
    setSeguimiento((prev) => eliminarDeLista(prev, id));
  };

  const crearVendedor = (datos) => {
    setVendedores((prev) => [crearRegistro('vendedor', datos), ...prev]);
  };

  const actualizarVendedor = (id, datos) => {
    setVendedores((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarVendedor = (id) => {
    setVendedores((prev) => eliminarDeLista(prev, id));
  };

  const crearVeterinaria = (datos) => {
    setVeterinarias((prev) => [crearRegistro('veterinaria', datos), ...prev]);
  };

  const actualizarVeterinaria = (id, datos) => {
    setVeterinarias((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarVeterinaria = (id) => {
    setVeterinarias((prev) => eliminarDeLista(prev, id));
  };

  const crearAfiliado = (datos) => {
    setAfiliados((prev) => [crearRegistro('afiliado', datos), ...prev]);
  };

  const actualizarAfiliado = (id, datos) => {
    setAfiliados((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarAfiliado = (id) => {
    setAfiliados((prev) => eliminarDeLista(prev, id));
  };

  const crearProveedor = (datos) => {
    setProveedores((prev) => [crearRegistro('proveedor', datos), ...prev]);
  };

  const actualizarProveedor = (id, datos) => {
    setProveedores((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarProveedor = (id) => {
    setProveedores((prev) => eliminarDeLista(prev, id));
  };

  const crearCompra = (datos) => {
    setCompras((prev) => [crearRegistro('compra', datos), ...prev]);
  };

  const actualizarCompra = (id, datos) => {
    setCompras((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarCompra = (id) => {
    setCompras((prev) => eliminarDeLista(prev, id));
  };

  const crearCuentaPorPagar = (datos) => {
    setCuentasPorPagar((prev) => [crearRegistro('cuenta-pagar', datos), ...prev]);
  };

  const actualizarCuentaPorPagar = (id, datos) => {
    setCuentasPorPagar((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarCuentaPorPagar = (id) => {
    setCuentasPorPagar((prev) => eliminarDeLista(prev, id));
  };

  const crearCuentaPorCobrar = (datos) => {
    setCuentasPorCobrar((prev) => [crearRegistro('cuenta-cobrar', datos), ...prev]);
  };

  const actualizarCuentaPorCobrar = (id, datos) => {
    setCuentasPorCobrar((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarCuentaPorCobrar = (id) => {
    setCuentasPorCobrar((prev) => eliminarDeLista(prev, id));
  };

  const crearMovimientoFlujoCaja = (datos) => {
    setFlujoCaja((prev) => [crearRegistro('flujo-caja', datos), ...prev]);
  };

  const actualizarMovimientoFlujoCaja = (id, datos) => {
    setFlujoCaja((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarMovimientoFlujoCaja = (id) => {
    setFlujoCaja((prev) => eliminarDeLista(prev, id));
  };

  const crearCotizacion = (datos) => {
    setCotizaciones((prev) => [crearRegistro('cotizacion', datos), ...prev]);
  };

  const actualizarCotizacion = (id, datos) => {
    setCotizaciones((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarCotizacion = (id) => {
    setCotizaciones((prev) => eliminarDeLista(prev, id));
  };

  const crearPedido = (datos) => {
    setPedidos((prev) => [crearRegistro('pedido', datos), ...prev]);
  };

  const actualizarPedido = (id, datos) => {
    setPedidos((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarPedido = (id) => {
    setPedidos((prev) => eliminarDeLista(prev, id));
  };

  const crearOrdenTrabajo = (datos) => {
    setOrdenesTrabajo((prev) => [crearRegistro('orden-trabajo', datos), ...prev]);
  };

  const actualizarOrdenTrabajo = (id, datos) => {
    setOrdenesTrabajo((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarOrdenTrabajo = (id) => {
    setOrdenesTrabajo((prev) => eliminarDeLista(prev, id));
  };

  const crearProduccion = (datos) => {
    setProduccion((prev) => [crearRegistro('produccion', datos), ...prev]);
  };

  const actualizarProduccion = (id, datos) => {
    setProduccion((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarProduccion = (id) => {
    setProduccion((prev) => eliminarDeLista(prev, id));
  };

  const crearCobro = (datos) => {
    setCobros((prev) => [crearRegistro('cobro', datos), ...prev]);
  };

  const actualizarCobro = (id, datos) => {
    setCobros((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarCobro = (id) => {
    setCobros((prev) => eliminarDeLista(prev, id));
  };

  const crearComision = (datos) => {
    setComisiones((prev) => [crearRegistro('comision', datos), ...prev]);
  };

  const actualizarComision = (id, datos) => {
    setComisiones((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarComision = (id) => {
    setComisiones((prev) => eliminarDeLista(prev, id));
  };

  const crearInventario = (datos) => {
    setInventario((prev) => [crearRegistro('inventario', datos), ...prev]);
  };

  const actualizarInventario = (id, datos) => {
    setInventario((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarInventario = (id) => {
    setInventario((prev) => eliminarDeLista(prev, id));
  };

  const crearMaterial = (datos) => {
    setMateriales((prev) => [crearRegistro('material', datos), ...prev]);
  };

  const actualizarMaterial = (id, datos) => {
    setMateriales((prev) => actualizarLista(prev, id, datos));
  };

  const eliminarMaterial = (id) => {
    setMateriales((prev) => eliminarDeLista(prev, id));
  };

  const valor = useMemo(
    () => ({
      empresas,
      contactos,
      seguimiento,
      vendedores,
      veterinarias,
      afiliados,
      proveedores,
      compras,
      cuentasPorPagar,
      cuentasPorCobrar,
      flujoCaja,

      cotizaciones,
      pedidos,
      ordenesTrabajo,
      produccion,
      cobros,
      comisiones,
      inventario,
      materiales,

      crearEmpresa,
      actualizarEmpresa,
      eliminarEmpresa,

      crearContacto,
      actualizarContacto,
      eliminarContacto,

      crearSeguimiento,
      actualizarSeguimiento,
      eliminarSeguimiento,

      crearVendedor,
      actualizarVendedor,
      eliminarVendedor,

      crearVeterinaria,
      actualizarVeterinaria,
      eliminarVeterinaria,

      crearAfiliado,
      actualizarAfiliado,
      eliminarAfiliado,

      crearProveedor,
      actualizarProveedor,
      eliminarProveedor,

      crearCompra,
      actualizarCompra,
      eliminarCompra,

      crearCuentaPorPagar,
      actualizarCuentaPorPagar,
      eliminarCuentaPorPagar,

      crearCuentaPorCobrar,
      actualizarCuentaPorCobrar,
      eliminarCuentaPorCobrar,

      crearMovimientoFlujoCaja,
      actualizarMovimientoFlujoCaja,
      eliminarMovimientoFlujoCaja,

      crearCotizacion,
      actualizarCotizacion,
      eliminarCotizacion,

      crearPedido,
      actualizarPedido,
      eliminarPedido,

      crearOrdenTrabajo,
      actualizarOrdenTrabajo,
      eliminarOrdenTrabajo,

      crearProduccion,
      actualizarProduccion,
      eliminarProduccion,

      crearCobro,
      actualizarCobro,
      eliminarCobro,

      crearComision,
      actualizarComision,
      eliminarComision,

      crearInventario,
      actualizarInventario,
      eliminarInventario,

      crearMaterial,
      actualizarMaterial,
      eliminarMaterial,
    }),
    [
      empresas,
      contactos,
      seguimiento,
      vendedores,
      veterinarias,
      afiliados,
      proveedores,
      compras,
      cuentasPorPagar,
      cuentasPorCobrar,
      flujoCaja,
      cotizaciones,
      pedidos,
      ordenesTrabajo,
      produccion,
      cobros,
      comisiones,
      inventario,
      materiales,
    ]
  );

  return <CoreContext.Provider value={valor}>{children}</CoreContext.Provider>;
}

export function useCore() {
  const context = useContext(CoreContext);

  if (!context) {
    throw new Error('useCore debe usarse dentro de CoreProvider');
  }

  return context;
}