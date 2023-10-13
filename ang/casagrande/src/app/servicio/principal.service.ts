import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PrincipalService {

  headers: Headers = new Headers({
    'Content-Type': 'application/json; ',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Accept': '*/*'
  });
  options: RequestOptions = new RequestOptions({ headers: this.headers });
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; ',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Accept': '*/*'
    })
  };
  //dominio: string = 'http://167.99.230.192:3000/'
  dominio: string = 'http://localhost:3000/'
  dominioDGS: string = 'https://www.redux.com.bo/api/apisat/ultimoreporte'
  //dominio: string = 'https://casagrande-erp.com/'
  constructor(private http: Http, private https: HttpClient) { }
  descargarPartes(x) {
    return this.http.post(`${this.dominio}partes/download`, x)
  }
  misproyectos() {
    return this.http.get(`${this.dominio}proyectos/lista`)
  }
  bienes() {
    return this.http.get(`${this.dominio}bienes/lista`)
  }
  bienes1() {
    return this.http.get(`${this.dominio}bienes/hola4`)
  }
  bienesyprevenciones() {
    return this.http.get(`${this.dominio}bienes/listaprenvencion`)
  }
  crear(x) {
    return this.http.post(`${this.dominio}bienes/crear`, x)
  }
  importar(x) {
    return this.http.post(`${this.dominio}api/subir`, x)
  }
  cargarbien(x) {
    return this.http.post(`${this.dominio}bienes/importar`, x)
  }
  usuariocrear(x) {
    return this.http.post(`${this.dominio}usuarios/crear`, x)
  }
  usuariover() {
    return this.http.get(`${this.dominio}usuario/ver`)
  }
  actupermi(x) {
    return this.http.post(`${this.dominio}usuarios/actualizarpermisos`, x)
  }
  usuarioactu(x) {
    return this.http.post(`${this.dominio}usuarios/actualizarusuarios`, x)
  }
  eliminarusuario(x) {
    return this.http.post(`${this.dominio}usuarios/eliminarusuarios`, x)
  }
  loguin(x) {
    return this.http.post(`${this.dominio}usuarios/login`, x)
  }
  serrar(x) {
    return this.http.post(`${this.dominio}usuario/destroy`, x)
  }
  buscarusuario(x) {
    return this.http.post(`${this.dominio}usuarios/letras`, x)
  }
  encargadobien(x) {
    return this.http.post(`${this.dominio}usuarios/encargado`, x)
  }
  bienesmios(x) {
    return this.http.post(`${this.dominio}bienes/mios`, x)
  }
  todo(x) {
    return this.http.post(`${this.dominio}bienes/todo`, x)
  }
  partesDiarias_create(x) {
    return this.http.post(`${this.dominio}partes/crear`, x)
  }
  enviarorden(x) {
    return this.http.post(`${this.dominio}orden/nuevo`, x)
  }
  cerrarod(x) {
    return this.http.post(`${this.dominio}orden/cerrar`, x)
  }
  editarunbien(x) {
    return this.http.post(`${this.dominio}bienes/editado`, x)
  }
  eliminarunbien(x) {
    return this.http.post(`${this.dominio}bienes/eliminado`, x)
  }
  fechasentre(x) {
    return this.http.post(`${this.dominio}bienes/entrefechas`, x)
  }
  parteunico(x) {
    return this.http.post(`${this.dominio}partes/unicos`, x)
  }
  ordenunica(x) {
    return this.http.post(`${this.dominio}orden/unica`, x)
  }
  solicitudnueva(x) {
    return this.http.post(`${this.dominio}solicitudes/nueva`, x)
  }
  listasolicitudes() {
    return this.http.get(`${this.dominio}solicitudes/lista`)
  }
  listasolicitudes2(x) {
    return this.http.post(`${this.dominio}Solicitud/solicitudes/lista`, x)
  }
  listasolicitudespersonales(x) {
    return this.http.post(`${this.dominio}solicitudes/listapersonal`, x)
  }
  aprobarsol(x) {
    return this.http.post(`${this.dominio}solicitudes/aprobada`, x)
  }
  cotizando(x) {
    return this.http.post(`${this.dominio}solicitudes/cotizando`, x)
  }
  desaprobarsol(x) {
    return this.http.post(`${this.dominio}solicitudes/desaprobada`, x)
  }
  terminarsolicitud(x) {
    return this.http.post(`${this.dominio}solicitudes/terminada`, x)
  }
  codigoproyecto() {
    return this.http.get(`${this.dominio}proyecto/numero`)
  }
  nuevoproyecto(x) {
    return this.http.post(`${this.dominio}proyecto/new`, x)
  }
  proyectoslista() {
    return this.http.get(`${this.dominio}proyecto/lista`)
  }
  informacionfiltrada() {
    return this.http.get(`${this.dominio}informacionfiltrada`)
  }
  buscarsolicitud(x) {
    return this.http.post(`${this.dominio}parte/buscar`, x)
  }
  editarunparte(x) {
    return this.http.post(`${this.dominio}parte/editado`, x)
  }
  agregarunprecioaunbien(x) {
    return this.http.post(`${this.dominio}bien/precio`, x)
  }
  agregarunprecioaundiesel(x) {
    return this.http.post(`${this.dominio}bien/preciodiesel`, x)
  }
  vercostos(x) {
    return this.http.post(`${this.dominio}bien/listacosto`, x)
  }
  vercostosdiesel(x) {
    return this.http.post(`${this.dominio}bien/listacostodiesel`, x)
  }
  cambiarprecioproyecto(x) {
    return this.http.post(`${this.dominio}bien/editarcosto`, x)
  }
  cambiarpreciodiesel(x) {
    return this.http.post(`${this.dominio}bien/editarcostodiesel`, x)
  }
  descuento(x) {
    return this.http.post(`${this.dominio}parte/descuento`, x)
  }
  solicitarcostodeproyecto(x) {
    return this.http.post(`${this.dominio}bien/costosproyectos`, x)
  }
  solicitardescuentos(x) {
    return this.http.post(`${this.dominio}bien/descuentoscostos`, x)
  }
  guardarprevencion(x) {
    return this.http.post(`${this.dominio}bien/suprevencion`, x)
  }
  verprevenciones(x) {
    return this.http.post(`${this.dominio}bien/mirarprevencion`, x)
  }
  verprevenciones1(x) {
    return this.http.post(`${this.dominio}bien/mirarprevencion1`, x)
  }
  verminombre(x) {
    return this.http.post(`${this.dominio}navbar/minombre`, x)
  }
  preventivonuevo(x) {
    return this.http.post(`${this.dominio}preventivo/nuevo`, x)
  }
  eliminarprevencion(x) {
    return this.http.post(`${this.dominio}preventivo/eliminar`, x)
  }
  informacionprevencion(x) {
    return this.http.post(`${this.dominio}preventivo/lista`, x)
  }
  informacionprevencion1(x) {
    return this.http.post(`${this.dominio}preventivo/lista1`, x)
  }
  editarunproyecto(x) {
    return this.http.post(`${this.dominio}proyecto/editar`, x)
  }
  eliminarproyecto(x) {
    return this.http.post(`${this.dominio}proyecto/eliminar`, x)
  }
  verpermisos(x) {
    return this.http.post(`${this.dominio}proyecto/verificacion`, x)
  }
  subirpermisos(x) {
    return this.http.post(`${this.dominio}proyecto/subirpermiso`, x)
  }
  mispermisos(x) {
    return this.http.post(`${this.dominio}proyecto/dimemipermiso`, x)
  }
  losproyectos() {
    return this.http.get(`${this.dominio}proyecto/damelalista`)
  }
  cargarcomprobante(x) {
    return this.http.post(`${this.dominio}comprobantes/nuevo`, x)
  }
  numerocomprobante(x) {
    return this.http.post(`${this.dominio}comprobantes/numero`, x)
  }
  mostrarunicocomprobante(x) {
    return this.http.post(`${this.dominio}comprobantes/unico`, x)
  }
  guardarche(x) {
    return this.http.post(`${this.dominio}check/list`, x)
  }
  actualizarcomprobante(x) {
    return this.http.post(`${this.dominio}comprobantes/actualizar`, x)
  }
  buscardorcomprobantes(x) {
    return this.http.post(`${this.dominio}comprobantes/buscador`, x)
  }
  buscardetalle(x) {
    return this.http.post(`${this.dominio}comprobantes/detalle`, x)
  }
  buscardorcuentas(x) {
    return this.http.post(`${this.dominio}comprobantes/cuentasbusqueda`, x)
  }
  nuevacuenta(x) {
    return this.http.post(`${this.dominio}comprobantes/cuentas`, x)
  }
  cuentaslista(x) {
    return this.http.get(`${this.dominio}comprobantes/cuentaslista/` + x)
  }
  nombrecuenta(x) {
    return this.http.post(`${this.dominio}comprobantes/nombrecuenta`, x)
  }
  buscarotrocomprobante(x) {
    return this.http.post(`${this.dominio}comprobantes/reporte`, x);
  }
  buscarotrocomprobante2(x) {
    return this.http.post(`${this.dominio}comprobantes/reporteLB`, x);
  }
  buscarotrocomprobante1(x) {
    return this.http.post(`${this.dominio}comprobantes/reporteFinal`, x);
  }
  reporte1(x) {
    return this.http.post(`${this.dominio}comprobantes/reporte1`, x);
  }
  reporte2(x) {
    return this.http.post(`${this.dominio}comprobantes/reporte2`, x);

  }

  reporteFijo(x) {
    return this.http.post(`${this.dominio}reporte/fijo`, x);

  }
  reportebalance(x) {
    return this.http.post(`${this.dominio}comprobantes/reporte3`, x);
  }
  guardarauxiliar(x) {
    return this.http.post(`${this.dominio}comprobantes/guardarauxiliar`, x);
  }
  todasauxiliares() {
    return this.http.get(`${this.dominio}comprobantes/auxiliares`);
  }
  agregarcomprobantesimportados(x) {
    return this.http.post(`${this.dominio}comprobantes/importaciones`, x);
  }
  llamamiento() {
    return this.http.get(`${this.dominio}hola3`)
  }
  filtrarcuenta(x) {
    return this.http.post(`${this.dominio}cuentas/filtrador`, x);
  }
  lascuentitas() {
    return this.http.get(`${this.dominio}comprobantes/cuentaslistada`);
  }
  categorias() {
    return this.http.get(`${this.dominio}comprobantes/categorias`);
  }
  cargarfechas(x) {
    return this.http.post(`${this.dominio}comprobantes/fechascargadas`, x);
  }
  partesresumen() {
    return this.http.get(`${this.dominio}parts/summary`);
  }
  solicitudreporte(x) {
    return this.http.post(`${this.dominio}solicitud/reporte`, x);
  }
  terminarlista(x) {
    return this.http.post(`${this.dominio}solicitud/finalizada`, x);
  }
  versolicitudesc() {
    return this.http.get(`${this.dominio}cerrarod/solicitud`);
  }
  buscarusuarioparaeditar(x) {
    return this.http.post(`${this.dominio}usuario/busqueda`, x);
  }
  actualizarusuarios(x) {
    return this.http.post(`${this.dominio}usuario/actu`, x);
  }
  lafotito(x) {
    return this.http.post(`${this.dominio}bienes/fotito`, x);
  }
  eliminarfoto(x) {
    return this.http.post(`${this.dominio}bienes/eliminarfotito`, x);
  }
  lafotito2(x) {
    return this.http.post(`${this.dominio}solicitud/fotito`, x);
  }
  avisonotifi() {
    return this.http.get(`${this.dominio}aviso/lista`);
  }
  transformar(x) {
    return this.http.post(`${this.dominio}preventivo/cambio`, x);
  }
  dedonde(x) {
    return this.http.post(`${this.dominio}preventivo/verw`, x);
  }
  agregarfalla(x) {
    return this.http.post(`${this.dominio}correctivo/falla`, x);
  }
  buscarfalla(x) {
    return this.http.post(`${this.dominio}correctivo/fallafind`, x);
  }
  buscarfallaq(x) {
    return this.http.post(`${this.dominio}correctivo/fallafindq`, x);
  }
  actualizarfalla(x) {
    return this.http.post(`${this.dominio}correctivo/fallaact`, x);
  }
  rechazarfalla(x) {
    return this.http.post(`${this.dominio}correctivo/fallarec`, x);
  }
  reportemaq(x) {
    return this.http.post(`${this.dominio}reporte/maqsol`, x);
  }
  micorre() {
    return this.http.get(`${this.dominio}sol/corre`);
  }
  buscarser(x) {
    return this.http.post(`${this.dominio}bien/busq`, x);
  }
  buscarserP(x) {
    return this.http.post(`${this.dominio}bien/busqP`, x);
  }
  buscarservicio(x) {
    return this.http.post(`${this.dominio}bien/busqueda`, x);
  }
  correlativo(x) {
    return this.http.post(`${this.dominio}correlativos/aumento`, x);
  }
  saberLosPrecios(x) {
    return this.http.post(`${this.dominio}partes/preciosProyecto`, x);
  }
  eliminarunaFoto(x) {
    return this.http.post(`${this.dominio}solicitud/eliminarFoto`, x);
  }
  itemLista() {
    return this.http.get(`${this.dominio}item/lista`);
  }
  editarItem(x) {
    return this.http.post(`${this.dominio}item/editar`, x);
  }
  agregarItem(x) {
    return this.http.post(`${this.dominio}item/agregar`, x);
  }
  adicionarItem(x) {
    return this.http.post(`${this.dominio}item/relacionar`, x);
  }
  itemMio(x) {
    return this.http.post(`${this.dominio}item/personal`, x);
  }
  listaDispositivos(x) {
    return this.http.post(`${this.dominio}item/listaTransferencia`, x);
  }
  transferir(x) {
    return this.http.post(`${this.dominio}item/enviar`, x);
  }
  bajarItem(x) {
    return this.http.post(`${this.dominio}item/darBaja`, x);
  }
  ItemListaGeneral() {
    return this.http.get(`${this.dominio}item/listaGeneral`);
  }
  solicitudPorId(x) {
    return this.http.get(`${this.dominio}solicitudes/lista/` + x);
  }
  solicitudDGS(x) {
    return this.http.post(`${this.dominioDGS}`, x, this.options);
  }
  itemsPreventivos() {
    return this.http.get(`${this.dominio}item/listaPreventiva`);
  }
  guardarItem(x) {
    return this.http.post(`${this.dominio}item/asociarPreventivo`, x);
  }
  miItem(x) {
    return this.http.post(`${this.dominio}item/miItem`, x);
  }
  agregarKit(x) {
    return this.http.post(`${this.dominio}kit/anadir`, x);
  }
  editarKit(x) {
    return this.http.post(`${this.dominio}kit/editar`, x);
  }
  kitLista() {
    return this.http.get(`${this.dominio}kit/lista`);
  }
  misKits(x) {
    return this.http.post(`${this.dominio}kit/mios`, x);
  }
  guardarPaquete(x) {
    return this.http.post(`${this.dominio}kit/grupos`, x);
  }
  preventivoDeEquipo(x) {
    return this.http.post(`${this.dominio}kit/preventivoBien`, x);
  }
  traerKit(x) {
    return this.http.get(`${this.dominio}kit/traerElKit/` + x);
  }
  misItems(x) {
    return this.http.get(`${this.dominio}item/traerItems/` + x._id);
  }
  reporteTransferencia(x) {
    return this.http.post(`${this.dominio}item/reporteTransferencia`, x);
  }
  reportePreventivo(x) {
    return this.http.post(`${this.dominio}item/reportePreventivo`, x);
  }
  habiliarDiario(x) {
    return this.http.post(`${this.dominio}orden/habilitar`, x);
  }
  reporteOrden(x) {
    return this.http.post(`${this.dominio}orden/reporteFecha`, x);
  }
  AuxiliarListaGeneral() {
    return this.http.get(`${this.dominio}auxiliar/listaGeneral`);
  }
  dameMiAuxiliar(x) {
    return this.http.post(`${this.dominio}auxiliar/elMio`, { mio: x });
  }
  NotificacionesListaPersonal(x) {
    return this.http.get(`${this.dominio}notificaciones/personales/` + x);
  }
  yaLaVi(x) {
    return this.http.post(`${this.dominio}notificaciones/yaLa`, x);
  }
  quitarNotificaciones(x) {
    return this.http.get(`${this.dominio}notificaciones/quitar/` + x);
  }

  agregarTarea(x) {
    return this.http.post(`${this.dominio}tarea/agregar`, x);
  }
  editarTarea(x) {
    return this.http.post(`${this.dominio}tarea/editar`, x);
  }
  tareaLista() {
    return this.http.get(`${this.dominio}tarea/lista`);

  }
  misTareas(x) {
    return this.http.post(`${this.dominio}tarea/mios`, x);
  }
  guardarTareas(x) {
    return this.http.post(`${this.dominio}tarea/grupos`, x);
  }
  misTareasC(x) {
    return this.http.post(`${this.dominio}tarea/completadas`, x);
  }

  busquedaOrdenPreventiva(x) {
    return this.http.post(`${this.dominio}preventivo/abierto`, x);
  }
  misCheck(x) {
    return this.http.post(`${this.dominio}check/maquina`, x);
  }
  dameElDetalle(x) {
    return this.http.post(`${this.dominio}check/maquinaDetalle`, x);
  }
  solicitudID(x) {
    return this.http.post(`${this.dominio}solicitudes/buscando/id`, x);
  }
  mantenimientoN(x) {
    return this.http.post(`${this.dominio}mantenimiento/nuevo`, x);
  }
  traerMantenimientos(x) {
    return this.http.post(`${this.dominio}mantenimiento/reporte`, x);
  }
  agregarOtroIngreso(x) {
    return this.http.post(`${this.dominio}otroIngreso/add`, x);
  }
  buscarSolicitudLista(x) {
    return this.http.post(`${this.dominio}solicitud/busquedaKit`, x);
  }
  solicitudEditada(x) {
    return this.http.post(`${this.dominio}solicitud/editada`, x);
  }
  parciallista(x) {
    return this.http.post(`${this.dominio}solicitud/parcial`, x);
  }
  // PARCHES

  parcheAuxiliar() {
    return this.http.get(`${this.dominio}actualizacion/auxiliares`);
  }
}
