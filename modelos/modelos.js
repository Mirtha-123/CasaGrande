var mongoose = require('mongoose')
  , Schema = mongoose.Schema
let findocreate = require('mongoose-findorcreate')
mongoose.connect('mongodb://superAdmin:pass1234@67.205.179.231:27017/casagrande?authSource=admin', { useNewUrlParser: true });
//mongoose.connect("mongodb://localhost:27017/casagrande");

var otroIngreso = Schema({
  bien: { type: Schema.Types.ObjectId, ref: 'bienes' },
  proyecto: { type: Schema.Types.ObjectId, ref: 'proyectos' },
  fecha: String,
  monto: Number,
  descripcion: String,
  tz_lock:  { type: String, default: '0' }
})

var mantenimiento = Schema({
  detalle: String,
  fecha: String,
  horometro: String,
  lugar: String,
  mecanico: String,
  bien: { type: Schema.Types.ObjectId, ref: 'bienes' },
  tz_lock:  { type: String, default: '0' }
})
var tarea = Schema({
  nombre: String,
  lista: Array
})

var item = Schema({
  nombre: String,
  codigo: String,
  codigoEmpresa: String,
  descripcion: String,
  horometro: String,
  marca: String,
  categoria: { type: Schema.Types.ObjectId, ref: 'categorias' },
  estado: String,
  preventivo: [{ type: Schema.Types.ObjectId, ref: 'prevenciones' }],
  bien: { type: Schema.Types.ObjectId, ref: 'bienes' },
  tipo: String,
  posicion: String,
  tz_lock:  { type: String, default: '0' }
})

var equipo = Schema({
  nombre: String,
  lista: Array,
  tz_lock:  { type: String, default: '0' }
});

var transferenciaItem = Schema({
  bienA: { type: Schema.Types.ObjectId, ref: 'bienes' },
  bienN: { type: Schema.Types.ObjectId, ref: 'bienes' },
  item: { type: Schema.Types.ObjectId, ref: 'items' },
  transferencia: Boolean,
  baja: Boolean,
  fecha: String,
  observaciones: String,
  usuario: { type: Schema.Types.ObjectId, ref: 'usuarios' },
  tz_lock:  { type: String, default: '0' }

})
var almacen = Schema({
  nombre: String,
  codigo: String,
  estado: String,
  tz_lock:  { type: String, default: '0' }

})

var almacen = Schema({
  nombre: String,
  codigo: String,
  estado: String,
  tz_lock:  { type: String, default: '0' }

})


var categoria = Schema({
  nombre: String,
  codigo: String,
  padre: String,
  tipo: String,
  tz_lock:  { type: String, default: '0' }
})
var correlativo = Schema({
  nombre: String,
  codigo: String,
  tz_lock:  { type: String, default: '0' }
})

var bienes = Schema({
  cuenta: String,
  semaforizacion: String,
  codigo: String,
  nombre: String,
  descripcion: String,
  tipo: String,
  tipoMaq: String,
  alias: String,
  anticipacion: String,
  horometro: String,
  aviso: String,
  proximo: String,
  hodometro: String,
  estado: String,
  ubicacion: String,
  categoria: String,
  estadopre: String,
  serieMaquina: String,
  serieMotor: String,
  marcaMotor: String,
  modelo: String,
  placa: String,
  combustiblePromedio: String,
  encargado: [{ type: Schema.Types.ObjectId, ref: 'usuarios' }],
  fotos: Array,
  estadofalla: String,
  items: [{ type: Schema.Types.ObjectId, ref: 'items' }],
  tz_lock:  { type: String, default: '0' }
})

var descuentos = Schema({
  proyecto: { type: Schema.Types.ObjectId, ref: 'proyectos' },
  bien: { type: Schema.Types.ObjectId, ref: 'bienes' },
  precio: String,
  tipo: String,
  fecha: String,
  tz_lock:  { type: String, default: '0' }
})
var prevenciones = Schema({
  bien: { type: Schema.Types.ObjectId, ref: 'bienes' },
  anticipacion: String,
  proximo: String,
  aviso: String,
  nombre: String,
  tipo: String,
  equipos: [{ type: Schema.Types.ObjectId, ref: 'kits' }],
  tareas: [{ type: Schema.Types.ObjectId, ref: 'tareas' }],
  tz_lock:  { type: String, default: '0' }

})
var costobien = Schema({

  proyecto: { type: Schema.Types.ObjectId, ref: 'proyectos' },
  tipo: String,
  precio: String,
  bien: { type: Schema.Types.ObjectId, ref: 'bienes' },
  moneda: String,
  tz_lock:  { type: String, default: '0' }
})
var costodieseles = Schema({

  proyecto: { type: Schema.Types.ObjectId, ref: 'proyectos' },
  tipo: String,
  precio: String,
  bien: { type: Schema.Types.ObjectId, ref: 'bienes' },
  moneda: String,
  tz_lock:  { type: String, default: '0' }
})
var usuarios = Schema({
  nombre: String,
  apaterno: String,
  amaterno: String,
  ci: String,
  telefono: String,
  username: String,
  pass: String,
  permisos: [{
    modulo: String,
    crear: Boolean,
    editar: Boolean,
    eliminar: Boolean,
    ver: Boolean
  }],
  tz_lock:  { type: String, default: '0' }

})
var partediarios = Schema({
  proyecto: { type: Schema.Types.ObjectId, ref: 'proyectos' },
  fecha: String,
  operador: { type: Schema.Types.ObjectId, ref: 'usuarios' },
  maquina: { type: Schema.Types.ObjectId, ref: 'bienes' },
  horometroactual: String,
  horometronuevo: String,
  hodometroactual: String,
  hodometronuevo: String,
  observaciones: String,
  diesel: String,
  dieselpagado: String,
  aceitemotor: String,
  grasa: String,
  liquidofreno: String,
  gasolina: String,
  aceitehidraulico: String,
  aceitetransmision: String,
  filtroaceite: String,
  filtrocombustible: String,
  aguadestilada: String,
  nulas: String,
  habiles: String,
  viajes: String,
  operadormaquina: String,
  cubos: String,
  arena: String,
  piedra: String,
  ripio: String,
  grava: String,
  gravilla: String,
  descarte: String,
  basura: String,
  dia: String,
  codigo: String,
  precio: String,
  tipodeprecio: String,
  metododepago: String,
  km: String,
  traslado: String,
  otro: String,
  tz_lock:  { type: String, default: '0' }

})
var od = Schema({
  fecha: String,
  maquina: { type: Schema.Types.ObjectId, ref: 'bienes' },
  //kit:{ type: Schema.Types.ObjectId, ref: 'kits'},
  kit: [{
    codigo: String,
    pieza: String,
    costo: String,
    cantidad: String,
    descripcion: String,
    unidad: String
  }],
  estado: String,
  observaciones: String,
  fechasalida: String,
  tipo: String,
  viene: String,
  pasa: Boolean,
  tareas: Array,
  mecanico: String,
  mecanicoE: String,
  electricistaE: String,
  soldadorE: String,
  otroE: String,
  fallas: { type: Schema.Types.ObjectId, ref: 'fallas' },
  solicitudes: [{ type: Schema.Types.ObjectId, ref: 'solicitudes' }],
  tz_lock:  { type: String, default: '0' }
})

var modulos = Schema({
  nombre: String,
  path: String,
  verificacion: Boolean,
  usuario: { type: Schema.Types.ObjectId, ref: 'usuarios' },
  img: String,
  clase: String,
  botones: [{
    nombre: String,
    funcion: String,
    estado: Boolean
  }],
  tz_lock:  { type: String, default: '0' }
})

var proyectospermisos = Schema({
  usuario: { type: Schema.Types.ObjectId, ref: 'usuarios' },
  proyecto: { type: Schema.Types.ObjectId, ref: 'proyectos' },
  estado: String,
  tz_lock:  { type: String, default: '0' }
})





var solicitudes = Schema({
  nombre: String,
  mecanico: String,
  usuario: { type: Schema.Types.ObjectId, ref: 'usuarios' },
  numerodeaprobaciones: Number,
  proyecto: { type: Schema.Types.ObjectId, ref: 'proyectos' },
  fecha: String,
  maquina: { type: Schema.Types.ObjectId, ref: 'bienes' },
  observaciones: String,
  imgs: Array,
  estado: String,
  hora: String,
  horaAprobacion: String,
  horaCierre: String,
  observaciones_nuevas: String,
  orden: { type: Schema.Types.ObjectId, ref: 'ordenservicios' },
  observaciones_finales: String,
  kit: [{
    id: String,
    pieza: String,
    codigo: String,
    descripcion: String,
    costo: String,
    completo: { type: Boolean, default: false },
    cantidad: String,
    nCantidad: String,
    unidad: String,
    aprobado: String
  }],
  tipo: String,
  tz_lock:  { type: String, default: '0' }
})
var recepcion = Schema({
  fecha: String,
  mecanico: String,
  entrega: String,
  obra: String,
  observaciones: String,
  compra: { type: Schema.Types.ObjectId, ref: 'solicitudes' },
  tz_lock:  { type: String, default: '0' }
})
var informefallas = Schema({
  solicitante: String,
  ubicacion: String,
  proyecto: { type: Schema.Types.ObjectId, ref: 'proyectos' },
  maquina: { type: Schema.Types.ObjectId, ref: 'bienes' },
  fecha: String,
  lista: Array,
  corregido: Array,
  estado: String,
  tz_lock:  { type: String, default: '0' }
})
var proyectos = Schema({
  codigo: String,
  nombre: String,
  descripcion: String,
  estado: String,
  tz_lock:  { type: String, default: '0' }
})


var detallecomprobante = Schema({

  original: String,
  recurso: String,
  categoria: { type: Schema.Types.ObjectId, ref: 'categorias' },
  numerodecategoria: String,
  partida: String,
  fuente: String,
  cuenta: String,
  auxiliar: String,
  nombre: String,
  debe: String,
  haber: String,
  glosa: String,
  cheque: String,
  referencia: String,
  fechaemision: String,
  vencimiento: String,
  comprobante: { type: Schema.Types.ObjectId, ref: 'comprobantes' },
  numeroantiguo: String,
  tz_lock:  { type: String, default: '0' }
})

var comprobantes = Schema({
  entidad: String,
  proyecto: { type: Schema.Types.ObjectId, ref: 'proyectos' },
  documento: String,
  numero: String,
  glosa: String,
  estado: String,
  fecha: String,
  numeroimportado: String,
  tz_lock:  { type: String, default: '0' }

})
var cuentas = Schema({
  nombre: String,
  numero: String,
  tipo: String,
  padre: { type: Schema.Types.ObjectId, ref: 'cuentas' },
  papa: String,
  tz_lock:  { type: String, default: '0' }

})
var auxiliarcuentas = Schema({
  cuenta: { type: Schema.Types.ObjectId, ref: 'cuentas' },
  nombre: String,
  tipo: String,
  codigo: String,
  direccion: String,
  tz_lock:  { type: String, default: '0' }
})
var checklist = Schema({
  lugar: String,
  baterias: String,
  combustibleUrl: String,
  horometro: String,
  neumaticoUrl: String,
  rodilloUrl: String,
  rodadoUrl: String,
  nombreR: String,
  obra: String,
  usuario: { type: Schema.Types.ObjectId, ref: 'usuarios' },
  observaciones: String,
  motivo: String,
  fecha: String,
  combustible: String,
  rodillo: String,
  rodado: String,
  neumaticos: String,
  maquina: { type: Schema.Types.ObjectId, ref: 'bienes' },
  tz_lock:  { type: String, default: '0' }
})
var detallecheck = Schema({
  name: String,
  valor: String,
  padre: String,
  check: { type: Schema.Types.ObjectId, ref: 'checklists' },
  tz_lock:  { type: String, default: '0' }
})
var token = Schema({
  usu: { type: Schema.Types.ObjectId, ref: 'usuarios' },
  tok: String,
  tz_lock: { type: String, default: '0' }

})



var promedioCombustible = Schema({
  bien: { type: Schema.Types.ObjectId, ref: 'bienes' },
  fecha: String,
  promedio: String,
  consumoDiesel: String,
  consumoGasolina: String,
  tz_lock:  { type: String, default: '0' }
})
var notificaciones = Schema({
  tema: String,
  fecha: String,
  usuarios: [{ type: Schema.Types.ObjectId, ref: 'usuarios' }],
  tz_lock:  { type: String, default: '0' }
})

var visorNotificacion = Schema({
  notificacion: { type: Schema.Types.ObjectId, ref: 'notificaciones' },
  usuario: { type: Schema.Types.ObjectId, ref: 'usuarios' },
  estado: Boolean,
  tz_lock: { type: String, default: '0' }
})

var promedioC = mongoose.model('combustiblepromedios', promedioCombustible)
var noti = mongoose.model('notificaciones', notificaciones)
var vistaNotificacion = mongoose.model('vistenotificaciones', visorNotificacion)
var check = mongoose.model('checklists', checklist)
var detal = mongoose.model('detalleschecks', detallecheck)
var corr = mongoose.model('correlativos', correlativo)
var falla = mongoose.model('fallas', informefallas)
var usuario = mongoose.model('usuarios', usuarios)
var modulo = mongoose.model('modulos', modulos)
var bien = mongoose.model('bienes', bienes)
var tokens = mongoose.model('tokens', token)
var partediario = mongoose.model('partediarios', partediarios)
var orden = mongoose.model('ordenservicios', od)
var recibo = mongoose.model('recepciones', recepcion)
var solicitud = mongoose.model('solicitudes', solicitudes)
var proyecto = mongoose.model('proyectos', proyectos)
var costodebienes = mongoose.model('costosdebienes', costobien)
var costodiesel = mongoose.model('costosgasolinas', costodieseles)
var prevencion = mongoose.model('prevenciones', prevenciones)
var descontar = mongoose.model('descuentos', descuentos)
var cuenta = mongoose.model('cuentas', cuentas)
var ppermisos = mongoose.model('proyectospermisos', proyectospermisos)
var comprobant = mongoose.model('comprobantes', comprobantes)
var detallecompro = mongoose.model('detallecomprobantes', detallecomprobante)
var auxilio = mongoose.model('auxiliarcuentas', auxiliarcuentas)
var categorias = mongoose.model('categorias', categoria)
var items = mongoose.model('items', item)
var equipos = mongoose.model('kits', equipo)
var tareas = mongoose.model('tareas', tarea)
var mA = mongoose.model('mantenimientos', mantenimiento)
var oI = mongoose.model('otrosIngresos', otroIngreso)
var transferenciaItems = mongoose.model('transferenciaItems', transferenciaItem)

module.exports.orden = orden
module.exports.partediario = partediario
module.exports.bien = bien
module.exports.check = check
module.exports.detallecheck = detal
module.exports.token = tokens
module.exports.fallas = falla
module.exports.modulo = modulo
module.exports.recibo = recibo
module.exports.usuario = usuario
module.exports.correlativo = corr
module.exports.solicitud = solicitud
module.exports.proyecto = proyecto
module.exports.costobien = costodebienes
module.exports.costodiesel = costodiesel
module.exports.prevencion = prevencion
module.exports.descuento = descontar
module.exports.ppermisos = ppermisos
module.exports.comprobante = comprobant
module.exports.detallecomprobante = detallecompro
module.exports.cuentas = cuenta
module.exports.auxiliar = auxilio
module.exports.categoria = categorias
module.exports.item = items
module.exports.kit = equipos
module.exports.tarea = tareas
module.exports.ma = mA
module.exports.oI = oI

module.exports.combustiblePromedio = promedioC
module.exports.notificacion = noti
module.exports.vista = vistaNotificacion

module.exports.transferenciaItem = transferenciaItems
