
const router = require('express').Router()
bien = require('../modelos/modelos').bien
fallas = require('../modelos/modelos').fallas
usuario = require('../modelos/modelos').usuario
partediario = require('../modelos/modelos').partediario
orden = require('../modelos/modelos').orden
solicitud = require('../modelos/modelos').solicitud
proyecto = require('../modelos/modelos').proyecto
costobien = require('../modelos/modelos').costobien
recibo = require('../modelos/modelos').recibo
costodiesel = require('../modelos/modelos').costodiesel
prevencion = require('../modelos/modelos').prevencion
descuento = require('../modelos/modelos').descuento
modulo = require('../modelos/modelos').modulo
cuentas = require('../modelos/modelos').cuentas
ppermisos = require('../modelos/modelos').ppermisos
comprobante = require('../modelos/modelos').comprobante
detallecomprobante = require('../modelos/modelos').detallecomprobante
auxiliar = require('../modelos/modelos').auxiliar
categoria = require('../modelos/modelos').categoria
token = require('../modelos/modelos').token
check = require('../modelos/modelos').check
detallecheck = require('../modelos/modelos').detallecheck
correlativo = require('../modelos/modelos').correlativo
item = require('../modelos/modelos').item
kit = require('../modelos/modelos').kit
mantenimiento = require('../modelos/modelos').ma
tarea = require('../modelos/modelos').tarea
otroIngreso = require('../modelos/modelos').oI
transferenciaItem = require('../modelos/modelos').transferenciaItem

combustible = require('../modelos/modelos').combustiblePromedio
notificacion = require('../modelos/modelos').notificacion
vista = require('../modelos/modelos').vista




router.post('/crear', (req, res, next) => {
	console.log(req.body)
	var ayuda = 0
	// NOTIFICACION
	prevencion.find({ tz_lock: '0', bien: req.body.maquina }).populate('bien').exec((err, doc) => {
		for (let index = 0; index < doc.length; index++) {

			if (parseFloat(doc[index].proximo) < parseFloat(req.body.horometronuevo)) {
				var x = {
					tema: 'El ' + doc[index].bien.nombre + ' ' + doc[index].bien.descripcion + ' tiene un preventivo vencido ' + doc[index].nombre + ' se cambio se espera al consumo ' + doc[index].proximo + ' y actualmente el consumo es ' + req.body.horometronuevo,
					fecha: fechas(new Date)
				}
				var uno = new notificacion(x)
				console.log(x)
				uno.save((err, doc) => {
					console.log(doc);
				});
			}
		}
	})

	bien.findOne({ _id: req.body.maquina }, (bug, god) => {
		if (god.estado == "liberado") {

			partediario.find({ tz_lock: '0', maquina: req.body.maquina }, (error, docum) => {

				for (var i = docum.length - 1; i >= 0; i--) {
					if (docum[i].fecha == req.body.fecha && docum[i].proyecto == req.body.proyecto) {
						ayuda = ayuda + 1
					}
				}

				


				//}
			})



		} else {
			orden.findOne({ $and: [{ maquina: req.body.maquina }, { estado: 'c_mantenimiento' }, { tipo: 'correctivo' }] }, (err, doc) => {

				if (doc.pasa) {
					partediario.find({ tz_lock: '0', maquina: req.body.maquina }, (error, docum) => {

						for (var i = docum.length - 1; i >= 0; i--) {
							if (docum[i].fecha == req.body.fecha && docum[i].proyecto == req.body.proyecto) {
								ayuda = ayuda + 1
							}
						}

					
						//}
					})
				} else {
					console.log('aver', req.body)
					console.log('MANTENIMIENTO', doc)
					var p = new Date(doc.fecha)
					var t = fechas(p)
					console.log(t);
					if (req.body.fecha < t) {
						console.log('ES MENOR')						
					} else {
						res.send({ mensaje: "yamantenimiento" })
					}
					//	res.send({ mensaje: "yamantenimiento" })
				}
			})

		}
	})



});


function fechas(x) {
	var fecha = new Date(x);
	var year = fecha.getFullYear();//el año se puede quitar de este ejemplo
	var mes = (fecha.getMonth() + 1);//pero ya que estamos lo ponemos completo
	var dia = fecha.getDate();
	var hora = fecha.getHours();
	var minutos = fecha.getMinutes();
	var segundos = fecha.getSeconds();
	//aquí se hace lo 'importante'
	if (mes < 10) { mes = '0' + mes }
	if (dia < 10) { dia = '0' + dia }
	if (hora < 10) { hora = '0' + hora }
	if (minutos < 10) { minutos = '0' + minutos }
	if (segundos < 10) { segundos = '0' + segundos }
	return year + "-" + mes + "-" + dia
}

module.exports = router