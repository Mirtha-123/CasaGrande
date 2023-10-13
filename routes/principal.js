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


var cron = require('node-cron');

cron.schedule('0 0,30,45 8-19 * * 0-6', () => {

	bien.find({ tz_lock: '0' }, (err, doc) => {
		prevencion.find({ tz_lock: '0' }, (errs, docs) => {
			if (doc != undefined) {
				if (doc.length > 0) {
					var paranotificar = []
					for (var i = doc.length - 1; i >= 0; i--) {
						for (var ia = docs.length - 1; ia >= 0; ia--) {
							if (String(doc[i]._id) == String(docs[ia].bien)) {

								if (parseFloat(doc[i].horometro) >= (parseFloat(docs[ia].proximo) - parseFloat(docs[ia].aviso))) {
									var x = {
										bien: doc[i].nombre + " " + doc[i].descripcion,
										aviso: docs[ia].nombre
									}
									paranotificar.push(x)
								}
							}
						}
					}
				}
			}


			console.log(paranotificar)
			token.find({}, (eee, ddd) => {
				for (var iv = ddd.length - 1; iv >= 0; iv--) {

					for (var ix = paranotificar.length - 1; ix >= 0; ix--) {
						var payload = {
							notification: {
								title: paranotificar[ix].bien,
								body: paranotificar[ix].aviso,
								image: 'https://pngimage.net/wp-content/uploads/2018/06/transporte-png-7.png'
							}
						};
						var options = {
							priority: "high",
							timeToLive: 60 * 60 * 24
						};



						admin.messaging().sendToDevice(ddd[iv].tok, payload, options)
							.then(function (response) {
								console.log("Successfully sent message:", response);
							})
							.catch(function (error) {
								console.log("Error sending message:", error);
							});








					}




				}



			})


		})
	})











	console.log('running a task every minute');
});

cron.schedule('0 0 23 10 * 0-7', () => {
	console.log("repeti")
	fecha = new Date();
	bien.find({ combustiblePromedio: { $exists: true }, tz_lock: '0' }, (err, maquinas) => {

		console.log(fechas(new Date))
		console.log(fechas(fecha.setDate(fecha.getDate() + 7)))
		var totalBienes = []
		for (let index = 0; index < maquinas.length; index++) {
			totalBienes.push(maquinas[index]._id)
		}
		console.log(totalBienes)
		partediario.find({
			tz_lock: '0',
			$and: [{ maquina: { $in: totalBienes } },
			{ fecha: { $gte: fechas(fecha) } }, { fecha: { $lte: fechas(fecha.setDate(fecha.getDate() - 7)) } }]
		}, (err1, partes) => {
			for (let index1 = 0; index1 < maquinas.length; index1++) {
				var consumo = 0
				var gasolina = 0
				var hora = 0
				for (let index2 = 0; index2 < partes.length; index2++) {
					if (String(maquinas[index1]._id) == String(partes[index2].maquina)) {
						if (partes[index2].diesel != " ") {
							consumo = parseFloat(consumo) + parseFloat(partes[index2].diesel)
						}
						if (partes[index2].gasolina != " " && partes[index2].gasolina != undefined) {
							console.log(partes[index2].gasolina)
							gasolina = parseFloat(consumo) + parseFloat(partes[index2].gasolina)
						}


						hora = hora + parseFloat(partes[index2].habiles);
					}

				}
				var consumoDiesel = (parseFloat(consumo) / parseFloat(hora)).toFixed(2)
				var consumoGasolina = (parseFloat(gasolina) / parseFloat(hora)).toFixed(2)

				var dato = {
					bien: maquinas[index1]._id,
					fecha: fechas(fecha),
					promedio: maquinas[index1].combustiblePromedio,
					consumoDiesel: consumoDiesel,
					consumoGasolina: consumoGasolina
				}
				var uno = new combustible(dato)
				uno.save((err, doc) => {

				})
				if (parseFloat(dato.promedio) < parseFloat(dato.consumoDiesel)) {
					var dos = {
						tema: 'Excedio el promedio de Diesel combustible ' + maquinas[index1].nombre + ' ' + maquinas[index1].descripcion +
							'el promedio es de ' + dato.promedio + ' el consumo de esta semana fue ' + dato.consumoDiesel,
						fecha: fechas(fecha)
					}
					var tres = new notificacion(dos)
					tres.save((ef, del) => { })
				}
				if (parseFloat(dato.promedio) < parseFloat(dato.consumoGasolina)) {
					var dos2 = {
						tema: 'Excedio el promedio de Gasolina combustible ' + maquinas[index1].nombre + ' ' + maquinas[index1].descripcion +
							'el promedio es de ' + dato.promedio + ' el consumo de esta semana fue ' + dato.consumoDiesel,
						fecha: fechas(fecha)
					}
					var tres2 = new notificacion(dos2)
					tres2.save((ef, del) => { })
				}
				console.log(dato)
			}
		})
	})
})

//* 54 8-19 * * 0-6





var admin = require("firebase-admin");
var serviceAccount = require("../erp-casa-firebase-adminsdk-653kd-9fab36fd94.json");
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://erp-casa.firebaseio.com"
});


var registrationToken = 'fI82xLLwPgR27t72qIRxZZ:APA91bGlAux5dU8Ze9m62XxCEjcU3TN8LKEYJqHi-0ZplFPeb8YozeTmwvq4tfPB16O8YNqeS0evR6A1x4dynqHr3hrdsrur98DROtThCaUZgjgLpNl4Lf0uyFIn_QTBXwpnE98Uwq8d';


var payload = {
	notification: {
		title: "This is a Notification",
		body: "This is the body of the notification message."
	}
};

var options = {
	priority: "high",
	timeToLive: 60 * 60 * 24
};

// Send a message to the device corresponding to the provided
// registration token.



json1 = require('../export/cuentas.json')
json2 = require('../export/categoria.json')
var multipart = require('connect-multiparty');
const multipartMiddleware = multipart({
	uploadDir: './ang/casagrande/dist/casagrande/assets/excel'
});
bcrypt = require('bcrypt-nodejs')

var cloudinary = require('cloudinary')
cloudinary.config({
	cloud_name: 'dv6lissuw',
	api_key: '446219589575142',
	api_secret: 'fGDI7T3NoPJJZE3s6C8M8XcJQuw'
});
const multer = require('multer');

const DIR = './upimages';

let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, DIR);
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
	}
});
let upload = multer({ storage: storage });



router.post('/api/upload', upload.single('photo'), function (req, res) {
	console.log(req.file)
	if (!req.file) {

		return res.send({
			success: false
		});

	} else {
		cloudinary.uploader.upload(req.file.path, function (result) {

			return res.send({
				success: result
			})
		})

	}
});










router.post('/partes/download', (req, res) => {
	console.log(req.body)
	let resp = []
	let cuerpo = req.body

	cuerpo.forEach(element => {
		let rep = {
			maquina: element.maquina,
			nombre: element.nombre,
			id: ""
		}
		bien.findOne({ _id: element.maquina }, (bug, god) => {
			console.log(rep)
			if (god.estado == "liberado") {

				partediario.find({ tz_lock: '0', maquina: req.body.maquina }, async (error, docum) => {
					console.log("AQUI VOY")
					var order = () => {
						var x = new partediario(element)
						return x.save((err, doc) => {
							if (err) {
								rep.err = err
								rep.cod = "0001"
								return
							} else {
								rep.err = ""
								rep.cod = "0000"
								rep.id = doc._id
								if (req.body.afecto == true) {
									bien.update({ _id: req.body.maquina }, { hodometro: req.body.hodometronuevo, horometro: req.body.horometronuevo }, (err, doc) => {
									})

								} else {


								}
								return rep
							}



						})
					}

					console.log('Valor', order)

					//}
				})



			} else {
				orden.findOne({ $and: [{ maquina: req.body.maquina }, { estado: 'c_mantenimiento' }, { tipo: 'correctivo' }] }, (err, doc) => {

					if (doc.pasa) {
						partediario.find({ tz_lock: '0', maquina: req.body.maquina }, (error, docum) => {

							var x = new partediario(element)

							x.save((err, doc) => {
								if (err) {
									rep.err = err
									rep.cod = "0001"
								} else {
									rep.err = ""
									rep.cod = "0000"
									rep.id = doc._id
									if (req.body.afecto == true) {
										bien.update({ _id: req.body.maquina }, { hodometro: req.body.hodometronuevo, horometro: req.body.horometronuevo }, (err, doc) => {
											res.send(doc)
										})

									} else {
										res.send(doc)
									}

								}




							})


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
							var x = new partediario(element)

							x.save((err, doc) => {
								if (err) {
									rep.err = err
									rep.cod = "0001"
								} else {
									rep.err = ""
									rep.cod = "0000"
									rep.id = doc._id
									if (req.body.afecto == true) {
										bien.update({ _id: req.body.maquina }, { hodometro: req.body.hodometronuevo, horometro: req.body.horometronuevo }, (err, doc) => {
											res.send(doc)
										})

									} else {
										res.send(doc)
									}

								}



							})
						} else {
							rep.err = ""
							rep.cod = "0002"
							//res.send({ mensaje: "yamantenimiento" })
						}
						//	res.send({ mensaje: "yamantenimiento" })
					}
				})

			}
		})
	});
	/*
		bien.findOne({ _id: req.body.maquina }, (bug, god) => {
			if (god.estado == "liberado") {
	
				partediario.find({ tz_lock: '0', maquina: req.body.maquina }, (error, docum) => {
	
					for (var i = docum.length - 1; i >= 0; i--) {
						if (docum[i].fecha == req.body.fecha && docum[i].proyecto == req.body.proyecto) {
							ayuda = ayuda + 1
						}
					}
	
					var x = new partediario(req.body)
	
					x.save((err, doc) => {
						if (req.body.afecto == true) {
							bien.update({ _id: req.body.maquina }, { hodometro: req.body.hodometronuevo, horometro: req.body.horometronuevo }, (err, doc) => {
								res.send(doc)
							})
	
						} else {
							res.send(doc)
						}
	
	
					})
	
	
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
	
							var x = new partediario(req.body)
	
							x.save((err, doc) => {
								if (req.body.afecto == true) {
									bien.update({ _id: req.body.maquina }, { hodometro: req.body.hodometronuevo, horometro: req.body.horometronuevo }, (err, doc) => {
										res.send(doc)
									})
	
								} else {
									res.send(doc)
								}
	
	
							})
	
	
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
							var x = new partediario(req.body)
	
							x.save((err, doc) => {
								if (req.body.afecto == true) {
									bien.update({ _id: req.body.maquina }, { hodometro: req.body.hodometronuevo, horometro: req.body.horometronuevo }, (err, doc) => {
										res.send(doc)
									})
	
								} else {
									res.send(doc)
								}
	
	
							})
						} else {
							res.send({ mensaje: "yamantenimiento" })
						}
						//	res.send({ mensaje: "yamantenimiento" })
					}
				})
	
			}
		})*/
})

router.post('/solicitud/eliminarFoto', (req, res) => {

	console.log(req.body)
	solicitud.findOne({ _id: req.body.maquina.solicitud }, (err, doc) => {
		console.log(doc);
		var x = doc.imgs;
		var index = x.indexOf(req.body.url);
		if (index > -1) {
			x.splice(index, 1);
		}
		solicitud.update({ _id: req.body.maquina.solicitud }, { $set: { imgs: x } }, (errs, docs) => {
			console.log(docs);
			res.send(docs);
		})
	})
})


router.get('/hola2', (req, res) => {

	console.log(json2)
	var aqui = json2
	for (var i = aqui.length - 1; i >= 0; i--) {
		if (aqui[i].codigo != "") {
			var x = {
				nombre: aqui[i].nombre,
				codigo: aqui[i].codigo,
				tipo: aqui[i].grupo,
				padre: aqui[i].padre
			}
			var y = new categoria(x)
			y.save((err, doc) => {

			})
		}

	}
	res.send(json2)
})
router.get('/bienes/hola4', (req, res) => {
	console.log("hola4")
	partediario.find({ tz_lock: '0' }, (err, doc) => {
		for (var i = doc.length - 1; i >= 0; i--) {
			var x = 0
			var y = parseFloat(doc[i].horometronuevo) - parseFloat(doc[i].horometroactual)
			if (doc[i].nulas == " ") {
				doc[i].nulas = 0
			}
			partediario.update({ _id: doc[i]._id }, { $set: { habiles: parseFloat(y - parseFloat(doc[i].nulas)).toFixed(2) } }, (ersr, dosc) => {

			})
		}
		res.send("bien")
	})
})
router.post('/token/crear', (req, res) => {
	var x = new token(req.body)
	token.findOne({ usu: req.body.usu }, (errq, docq) => {
		if (docq != null) {

			token.update({ usu: req.body.usu }, { $set: { tok: req.body.tok } }, (errs, docs) => {
				res.send(docs)
				console.log("actualice")
			})
		} else {
			x.save((err, doc) => {
				res.send(doc)

				console.log("Cree")
			})
		}

	})

})
router.post('/bienes/fotito', (req, res) => {
	console.log(req.body)
	var x = req.body
	bien.update({ _id: x.datos._id }, { $push: { fotos: x.fotito } }, (err, doc) => {
		res.send(doc)
	})
})
router.get('/aviso/lista', (req, res) => {
	bien.find({ tz_lock: '0' }, (err, doc) => {
		prevencion.find({ tz_lock: '0' }, (errs, docs) => {

			var paranotificar = []
			for (var i = doc.length - 1; i >= 0; i--) {
				for (var ia = docs.length - 1; ia >= 0; ia--) {
					if (String(doc[i]._id) == String(docs[ia].bien)) {
						console.log("entre")
						if (parseFloat(doc[i].horometro) >= (parseFloat(docs[ia].proximo) - parseFloat(docs[ia].aviso))) {
							var x = {
								bien: doc[i].nombre + " " + doc[i].descripcion,
								aviso: docs[ia].nombre
							}
							paranotificar.push(x)
						}
					}
				}
			}
			console.log(paranotificar)
			res.send(paranotificar)
		})
	})
})

router.post('/solicitud/fotito', (req, res) => {
	console.log(req.body)
	var x = req.body
	solicitud.update({ _id: x.datos.solicitud }, { $push: { imgs: x.fotito } }, (err, doc) => {
		res.send(doc)
	})
})
router.post('/reporte/maqsol', (req, res) => {
	console.log(req.body)
	var o = []
	for (var i = req.body.maq.length - 1; i >= 0; i--) {
		o.push(req.body.maq[i].value)
	}
	solicitud.find({ $and: [{ tz_lock: '0' }, { fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }, { maquina: { $in: o } }] }).populate('maquina proyecto usuario').exec((err, doc) => {
		res.send(doc)
	})
})

router.post('/bienes/eliminarfotito', (req, res) => {

	var x = req.body
	bien.update({ _id: x.maquina._id }, { $pull: { fotos: x.foto } }, (err, doc) => {
		res.send(doc)
	})
})
router.get('/hola3', (req, res) => {
	var cont = 1
	comprobante.find({}, (errw, docw) => {
		for (var i = 0; i <= docw.length - 1; i++) {
			comprobante.update({ _id: docw[i]._id }, { $set: { numero: cont } }, (ee, dd) => {

			})
			cont = cont + 1
		}
	})

	detallecomprobante.find({}, (err, doc) => {
		for (const prop in doc) {
			if (`${doc[prop].numerodecategoria}` != undefined) {

				categoria.findOne({ codigo: `${doc[prop].numerodecategoria}` }, (errs, docs) => {

					if (docs != null) {
						detallecomprobante.update({ _id: `${doc[prop]._id}` }, { $set: { categoria: docs._id } }, (errr, docc) => {


						})
					}


				})







			}
		}

	})
	res.send({ mensaje: "terminado" })

})
router.get('/hola1', (req, res) => {

	console.log(json1)
	var aqui = json1
	for (var i = aqui.length - 1; i >= 0; i--) {
		var x = {
			nombre: aqui[i].nombre,
			numero: aqui[i].codigo,
			tipo: aqui[i].tipo,
			papa: aqui[i].padre
		}
		var y = new cuentas(x)
		y.save((err, doc) => {

		})
	}
	res.send(json1)
})
router.get('/ajustecuentas', (req, res) => {

	cuentas.find({}, (err, doc) => {
		for (const prop in doc) {
			contador = 0

			if (`${doc[prop].papa}` != undefined) {

				cuentas.findOne({ numero: `${doc[prop].papa}` }, (errs, docs) => {

					if (docs != null) {
						cuentas.update({ numero: `${doc[prop].numero}` }, { $set: { padre: docs._id } }, (errr, docc) => {

							console.log(contador)
						})
					}


				})







			}
			contador = contador + 1
		}


	})

})

router.post('/comprobantes/nuevo', (req, res, next) => {
	console.log(req.body)
	var info = req.body.informacion
	info.estado = "abierto"
	var x = new comprobante(info)
	x.save((err, doc) => {
		console.log(err, doc)
		if (err) {
			res.send({ mensaje: 'no se pudo' })
		} else {
			var datos = req.body.datos
			for (var i = datos.length - 1; i >= 0; i--) {
				if (datos[i][2] == "") {
					var e = {
						original: datos[i][0],
						recurso: datos[i][1],

						partida: datos[i][3],
						fuente: datos[i][4],
						cuenta: datos[i][5],
						auxiliar: datos[i][6],
						nombre: datos[i][7],
						debe: datos[i][8],
						haber: datos[i][9],
						glosa: datos[i][10],
						cheque: datos[i][11],
						referencia: datos[i][12],
						fechaemision: datos[i][13],
						vencimiento: datos[i][14],
						comprobante: doc._id
					}
				} else {
					var e = {
						original: datos[i][0],
						recurso: datos[i][1],
						categoria: datos[i][2],
						partida: datos[i][3],
						fuente: datos[i][4],
						cuenta: datos[i][5],
						auxiliar: datos[i][6],
						nombre: datos[i][7],
						debe: datos[i][8],
						haber: datos[i][9],
						glosa: datos[i][10],
						cheque: datos[i][11],
						referencia: datos[i][12],
						fechaemision: datos[i][13],
						vencimiento: datos[i][14],
						comprobante: doc._id
					}
				}

				var o = new detallecomprobante(e)
				o.save((err, doc) => {

				})
			}
			res.send(doc)
		}

	})

})


router.post('/check/maquina', (req, res, next) => {
	console.log(req.body)
	check.find({ maquina: req.body._id }).populate('usuario').exec((err, doc) => {
		res.send(doc);
	})

})
router.post('/check/maquinaDetalle', (req, res, next) => {
	console.log(req.body)
	detallecheck.find({ check: req.body._id }).exec((err, doc) => {
		res.send(doc);
	})

})
router.post('/comprobantes/numero', (req, res, next) => {
	console.log(req.body)
	comprobante.find({ $and: [{ entidad: req.body.entidad }, { proyecto: req.body.proyecto }, { documento: req.body.documento }] }, (err, doc) => {
		res.send(doc)
	})

})

router.post('/comprobantes/fechascargadas', (req, res, next) => {
	console.log(req.body)
	json3 = require('../export/' + req.body.mensaje)
	console.log(json3)
	for (var i = json3.length - 1; i >= 0; i--) {
		json3[i].clase = String(json3[i].clase).trim();
		let valor = '0';
		switch (req.body.tipo) {
			case 'ingreso':
				valor = '1'
				break;
			case 'egreso':
				valor = '2'
				break;
			case 'traspaso':
				valor = '3'
				break;
			case 'apertura':
				valor = '4'
				break;

			default:
				break;
		}

		if (String(json3[i].clase) == String(valor) && String(json3[i].fondo).trim() == '019') {
			console.log('Encontre', String(json3[i].numero))
			comprobante.update({ $and: [{ entidad: 'casagrande' }, { proyecto: "5db836eeb377f60eb4dad912" }, { numeroimportado: String(json3[i].numero) }, { documento: req.body.tipo }] }, { $set: { fecha: json3[i].fecha } }, (err, doc) => {

			})
		}

	}
	res.send({ mensaje: "finalizado" })
})
router.get('/comprobantes/categorias', (req, res, next) => {

	categoria.find({}, (err, doc) => {
		res.send(doc)
	})

})
router.post('/comprobantes/importaciones', (req, res, next) => {


	comprobante.find({}).sort({ $natural: -1 }).limit(1).exec((err1, doc1) => {
		console.log(doc1);
		var contador = 0;
		if (doc1.length == 0) {
			contador = 1
		} else {
			contador = parseFloat(doc1[0].numero) + 1
		}
		var dia = new Date()
		var mes = ""
		var ano = ""
		var hoy = ""
		var midia = ""
		if ((dia.getMonth() + 1) < 10) {
			mes = '0' + (dia.getMonth() + 1)
		} else {
			mes = dia.getMonth() + 1
		}
		if (dia.getDate() < 10) { hoy = '0' + dia.getDate() } else {
			hoy = dia.getDate()
		}
		ano = dia.getFullYear()
		midia = ano + "-" + mes + "-" + hoy
		var losc = req.body
		console.log(midia)

		for (var i = losc.length - 1; i >= 0; i--) {
			var x = {
				entidad: losc[i].entidad,
				proyecto: losc[i].proyecto,
				documento: losc[i].documento,
				numeroimportado: losc[i].numero,
				numero: contador,
				glosa: losc[i].glosa,
				fecha: midia,
				estado: losc[i].estado
			}
			contador = parseFloat(contador) + 1

			var y = new comprobante(x)
			y.save((err, doc) => {
				console.log(err, doc)

				for (var iq = losc.length - 1; iq >= 0; iq--) {

					if (doc.numeroimportado == losc[iq].numero) {

						for (var iw = losc[iq].detalle.length - 1; iw >= 0; iw--) {
							var xx = {
								original: losc[iq].detalle[iw].original,
								recurso: losc[iq].detalle[iw].recurso,
								numerodecategoria: losc[iq].detalle[iw].categoria,
								partida: losc[iq].detalle[iw].partida,
								fuente: losc[iq].detalle[iw].fuente,
								cuenta: losc[iq].detalle[iw].cuenta,
								auxiliar: losc[iq].detalle[iw].auxiliar,
								debe: losc[iq].detalle[iw].debe,
								haber: losc[iq].detalle[iw].haber,
								glosa: losc[iq].detalle[iw].glosa,
								cheque: losc[iq].detalle[iw].cheque,
								comprobante: doc._id
							}

							var nueva = new detallecomprobante(xx)
							nueva.save((errss, docss) => {

							})
						}
					}
				}

			})

		}
		res.send({ mensaje: "complete" })
	});


})
router.get('/comprobantes/auxiliares', (req, res, next) => {
	auxiliar.find({}).populate('cuenta').exec((err, doc) => {
		res.send(doc)
	})

})

router.post('/comprobantes/guardarauxiliar', (req, res, next) => {
	console.log(req.body)
	var x = new auxiliar(req.body)
	x.save((err, doc) => {
		res.send(doc)
	})
})
router.post('/mantenimiento/nuevo', (req, res, next) => {
	console.log(req.body)
	var x = new mantenimiento(req.body)
	x.save((err, doc) => {
		res.send(doc)
	})
})
router.post('/mantenimiento/reporte', (req, res, next) => {
	console.log(req.body)
	mantenimiento.find({ bien: req.body._id }, (err, doc) => {
		res.send(doc);
	})
})
router.post('/usuario/busqueda', (req, res, next) => {
	console.log(req.body)
	usuario.findOne({ _id: req.body.usuario }, (err, doc) => {
		res.send(doc)
	})
})
router.post('/usuario/actu', (req, res, next) => {
	console.log(req.body)
	bcrypt.hash(req.body.pass, null, null, (err, hash) => {
		req.body.pass = hash
		usuario.update({ _id: req.body._id }, req.body, (err, doc) => {
			res.send(doc)
		})

	})

})

router.post('/comprobantes/buscador', (req, res, next) => {

	comprobante.find({ $or: [{ numeroimportado: eval("/" + req.body.palabra + "/") }, { glosa: eval("/" + req.body.palabra + "/") }, { numero: eval("/" + req.body.palabra + "/") }, { fecha: eval("/" + req.body.palabra + "/") }] }, (err, doc) => {
		res.send(doc)
	})

})
router.post('/otroIngreso/add', (req, res, next) => {
	console.log(req.body)
	var x = new otroIngreso(req.body)

	x.save((err, doc) => {
		res.send(doc)
	})

})
router.post('/comprobantes/nombrecuenta', (req, res, next) => {

	cuentas.findOne({ numero: req.body.codigo }, (err, doc) => {
		res.send(doc)
		console.log(doc)
	})

})
router.post('/comprobantes/reporteFinal', (req, res, next) => {
	console.log('busqueda auxiliar', req.body)
	switch (req.body.tipo) {
		case 'all':
			var comprobanteshabilitados = []
			comprobante.find({ $and: [{ fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }] }, (err, doc) => {

				for (var i = doc.length - 1; i >= 0; i--) {
					comprobanteshabilitados.push(doc[i]._id)
				}

				detallecomprobante.find({ $and: [{ $or: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }] }, { comprobante: { $in: comprobanteshabilitados } }] }).populate('categoria comprobante').exec((err, doc) => {
					cuentas.find({}, (rr, das) => {
						res.send({ de: doc, cuentas: das })
					})
				})
			})



			break; // al encontrar este 'break' no se continuará con el siguiente 'default:'
		case 'ingresos':
			var comprobanteshabilitados = []
			comprobante.find({ $and: [{ fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }, { documento: 'ingreso' }] }, (err, doc) => {

				for (var i = doc.length - 1; i >= 0; i--) {
					comprobanteshabilitados.push(doc[i]._id)
				}

				detallecomprobante.find({ $and: [{ $or: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }] }, { comprobante: { $in: comprobanteshabilitados } }] }).populate('categoria comprobante').exec((err, doc) => {
					cuentas.find({}, (rr, das) => {
						res.send({ de: doc, cuentas: das })
					})
				})
			})




			break;
		case 'egresos':
			var comprobanteshabilitados = []
			comprobante.find({ $and: [{ fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }, { documento: 'egreso' }] }, (err, doc) => {

				for (var i = doc.length - 1; i >= 0; i--) {
					comprobanteshabilitados.push(doc[i]._id)
				}

				detallecomprobante.find({ $and: [{ $or: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }] }, { comprobante: { $in: comprobanteshabilitados } }] }).populate('categoria comprobante').exec((err, doc) => {
					cuentas.find({}, (rr, das) => {
						res.send({ de: doc, cuentas: das })
					})

				})
			})




			break;
		case 'traspasos':
			var comprobanteshabilitados = []
			comprobante.find({ $and: [{ fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }, { documento: 'traspaso' }] }, (err, doc) => {

				for (var i = doc.length - 1; i >= 0; i--) {
					comprobanteshabilitados.push(doc[i]._id)
				}

				detallecomprobante.find({ $and: [{ $or: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }] }, { comprobante: { $in: comprobanteshabilitados } }] }).populate('categoria comprobante').exec((err, doc) => {
					cuentas.find({}, (rr, das) => {
						res.send({ de: doc, cuentas: das })
					})
				})
			})




			break;
		default:
			console.log('default')
		// fall-through

	}


})
router.post('/comprobantes/reporteLB', (req, res, next) => {
	console.log('busqueda auxiliar', req.body)

	var de = fechas(req.body.desde);
	var ha = fechas(req.body.hasta);
	console.log('AQUI TAN', de, ha)
	switch (req.body.tipo) {
		case 'all':

			if (req.body.aux.length > 0) {
				var mascomprobantes = []
				comprobante.find({ $and: [{ fecha: { $lte: de } }] }, (err1, doc1) => {

					for (var i2 = doc1.length - 1; i2 >= 0; i2--) {
						mascomprobantes.push(doc1[i2]._id)
					}
					detallecomprobante.find({ $and: [{ auxiliar: req.body.aux[0].id }, { numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }, { comprobante: { $in: mascomprobantes } }] }).populate('categoria comprobante').exec((errz, docz) => {


						var comprobanteshabilitados = []
						comprobante.find({ $and: [{ fecha: { $gte: fechas(req.body.desde) } }, { fecha: { $lte: fechas(req.body.hasta) } }] }, (err, doc) => {

							for (var i = doc.length - 1; i >= 0; i--) {
								comprobanteshabilitados.push(doc[i]._id)
							}

							detallecomprobante.find({ $and: [{ auxiliar: req.body.aux[0].id }, { $or: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }] }, { comprobante: { $in: comprobanteshabilitados } }] }).populate('categoria comprobante').exec((err, doc) => {
								cuentas.find({}, (rr, das) => {
									res.send({ de: doc, cuentas: das, atras: docz })
								})
							})
						})







					})
				})
			} else {
				var mascomprobantes = []
				comprobante.find({ $and: [{ fecha: { $lte: de } }] }, (err1, doc1) => {

					for (var i2 = doc1.length - 1; i2 >= 0; i2--) {
						mascomprobantes.push(doc1[i2]._id)
					}

					detallecomprobante.find({ $and: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }, { comprobante: { $in: mascomprobantes } }] }).populate('categoria comprobante').exec((errz, docz) => {


						var comprobanteshabilitados = []
						comprobante.find({ $and: [{ fecha: { $gte: de } }, { fecha: { $lte: ha } }] }, (err, doc) => {

							for (var i = doc.length - 1; i >= 0; i--) {
								comprobanteshabilitados.push(doc[i]._id)
							}

							detallecomprobante.find({ $and: [{ $or: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }] }, { comprobante: { $in: comprobanteshabilitados } }] }).populate('categoria comprobante').exec((err, dock) => {
								console.log('algo encontre', doc)
								cuentas.find({}, (rr, das) => {
									res.send({ de: dock, cuentas: das, atras: docz })
								})
							})
						})







					})
				})
			}





			break; // al encontrar este 'break' no se continuará con el siguiente 'default:'
		case 'ingresos':
			if (req.body.aux.length > 0) {
				var mascomprobantes = []
				comprobante.find({ $and: [{ fecha: { $lte: de } }] }, (err1, doc1) => {

					for (var i2 = doc1.length - 1; i2 >= 0; i2--) {
						mascomprobantes.push(doc1[i2]._id)
					}

					detallecomprobante.find({ $and: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }, { comprobante: { $in: mascomprobantes } }] }).populate('categoria comprobante').exec((errz, docz) => {


						var comprobanteshabilitados = []
						comprobante.find({ $and: [{ fecha: { $gte: de } }, { fecha: { $lte: ha } }, { documento: 'ingreso' }] }, (err, doc) => {

							for (var i = doc.length - 1; i >= 0; i--) {
								comprobanteshabilitados.push(doc[i]._id)
							}

							detallecomprobante.find({ $and: [{ $or: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }] }, { auxiliar: req.body.aux[0].id }, { comprobante: { $in: comprobanteshabilitados } }] }).populate('categoria comprobante').exec((err, docs) => {
								console.log('doc', docs);
								cuentas.find({}, (rr, das) => {
									res.send({ com: doc, de: docs, cuentas: das, atras: docz })
								})
							})
						})


					})
				})
			} else {
				var mascomprobantes = []
				comprobante.find({ $and: [{ fecha: { $lte: de } }] }, (err1, doc1) => {

					for (var i2 = doc1.length - 1; i2 >= 0; i2--) {
						mascomprobantes.push(doc1[i2]._id)
					}

					detallecomprobante.find({ $and: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }, { comprobante: { $in: mascomprobantes } }] }).populate('categoria comprobante').exec((errz, docz) => {


						var comprobanteshabilitados = []
						comprobante.find({ $and: [{ fecha: { $gte: de } }, { fecha: { $lte: ha } }, { documento: 'ingreso' }] }, (err, doc) => {

							for (var i = doc.length - 1; i >= 0; i--) {
								comprobanteshabilitados.push(doc[i]._id)
							}

							detallecomprobante.find({ $and: [{ $or: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }] }, { comprobante: { $in: comprobanteshabilitados } }] }).populate('categoria comprobante').exec((err, docs) => {
								console.log('doc', docs);
								cuentas.find({}, (rr, das) => {
									res.send({ com: doc, de: docs, cuentas: das, atras: docz })
								})
							})
						})


					})
				})
			}



			break;
		case 'egresos':
			if (req.body.aux.length > 0) {
				var mascomprobantes1 = []
				comprobante.find({ $and: [{ fecha: { $lte: req.body.desde } }] }, (err1, doc1) => {
					for (var i2 = doc1.length - 1; i2 >= 0; i2--) {
						mascomprobantes1.push(doc1[i2]._id)
					}
					detallecomprobante.find({ $and: [{ auxiliar: req.body.aux[0].id }, { numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }, { comprobante: { $in: mascomprobantes1 } }] }).populate('categoria comprobante').exec((errz, docz) => {


						var comprobanteshabilitados = []
						comprobante.find({ $and: [{ fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }, { documento: 'egreso' }] }, (err, doc) => {

							for (var i = doc.length - 1; i >= 0; i--) {
								comprobanteshabilitados.push(doc[i]._id)
							}

							detallecomprobante.find({ $and: [{ auxiliar: req.body.aux[0].id }, { $or: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }] }, { comprobante: { $in: comprobanteshabilitados } }] }).populate('categoria comprobante').exec((err, doc) => {
								cuentas.find({}, (rr, das) => {
									res.send({ de: doc, cuentas: das, atras: docz })
								})

							})
						})








					})
				})
			} else {
				var mascomprobantes1 = []
				comprobante.find({ $and: [{ fecha: { $lte: req.body.desde } }] }, (err1, doc1) => {
					for (var i2 = doc1.length - 1; i2 >= 0; i2--) {
						mascomprobantes1.push(doc1[i2]._id)
					}
					detallecomprobante.find({ $and: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }, { comprobante: { $in: mascomprobantes1 } }] }).populate('categoria comprobante').exec((errz, docz) => {


						var comprobanteshabilitados = []
						comprobante.find({ $and: [{ fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }, { documento: 'egreso' }] }, (err, doc) => {

							for (var i = doc.length - 1; i >= 0; i--) {
								comprobanteshabilitados.push(doc[i]._id)
							}

							detallecomprobante.find({ $and: [{ $or: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }] }, { comprobante: { $in: comprobanteshabilitados } }] }).populate('categoria comprobante').exec((err, doc) => {
								cuentas.find({}, (rr, das) => {
									res.send({ de: doc, cuentas: das, atras: docz })
								})

							})
						})








					})
				})
			}





			break;
		case 'traspasos':
			if (req.body.aux.length > 0) {
				var mascomprobantes1 = []
				comprobante.find({ $and: [{ fecha: { $lte: req.body.desde } }] }, (err1, doc1) => {
					for (var i2 = doc1.length - 1; i2 >= 0; i2--) {
						mascomprobantes1.push(doc1[i2]._id)
					}
					detallecomprobante.find({ $and: [{ auxiliar: req.body.aux[0].id }, { numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }, { comprobante: { $in: mascomprobantes1 } }] }).populate('categoria comprobante').exec((errz, docz) => {


						var comprobanteshabilitados = []
						comprobante.find({ $and: [{ fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }, { documento: 'traspaso' }] }, (err, doc) => {

							for (var i = doc.length - 1; i >= 0; i--) {
								comprobanteshabilitados.push(doc[i]._id)
							}

							detallecomprobante.find({ $and: [{ auxiliar: req.body.aux[0].id }, { $or: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }] }, { comprobante: { $in: comprobanteshabilitados } }] }).populate('categoria comprobante').exec((err, doc) => {
								cuentas.find({}, (rr, das) => {
									res.send({ de: doc, cuentas: das, atras: docz })
								})

							})
						})








					})
				})
			} else {
				var mascomprobantes1 = []
				comprobante.find({ $and: [{ fecha: { $lte: req.body.desde } }] }, (err1, doc1) => {
					for (var i2 = doc1.length - 1; i2 >= 0; i2--) {
						mascomprobantes1.push(doc1[i2]._id)
					}
					detallecomprobante.find({ $and: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }, { comprobante: { $in: mascomprobantes1 } }] }).populate('categoria comprobante').exec((errz, docz) => {


						var comprobanteshabilitados = []
						comprobante.find({ $and: [{ fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }, { documento: 'traspaso' }] }, (err, doc) => {

							for (var i = doc.length - 1; i >= 0; i--) {
								comprobanteshabilitados.push(doc[i]._id)
							}

							detallecomprobante.find({ $and: [{ $or: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }] }, { comprobante: { $in: comprobanteshabilitados } }] }).populate('categoria comprobante').exec((err, doc) => {
								cuentas.find({}, (rr, das) => {
									res.send({ de: doc, cuentas: das, atras: docz })
								})

							})
						})








					})
				})
			}



			break;
		default:
			console.log('default')
		// fall-through

	}


})
router.post('/comprobantes/reporte', (req, res, next) => {
	console.log('busqueda auxiliar uno', req.body)
	for (let index = 0; index < req.body.autos.length; index++) {
		req.body.autos[index] = '0' + req.body.autos[index]

	}
	console.log('EDI', req.body.autos)
	switch (req.body.tipo) {
		case 'all':
			var comprobanteshabilitados = []
			comprobante.find({ $and: [{ fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }] }, (err, doc) => {

				for (var i = doc.length - 1; i >= 0; i--) {
					comprobanteshabilitados.push(doc[i]._id)
				}

				detallecomprobante.find({ $and: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }, { comprobante: { $in: comprobanteshabilitados } }] }).populate('categoria comprobante').exec((err, docz) => {
					cuentas.find({}, (rr, das) => {
						res.send({ de: docz, cuentas: das })
					})
				})
			})



			break; // al encontrar este 'break' no se continuará con el siguiente 'default:'
		case 'ingresos':
			var comprobanteshabilitados = []
			comprobante.find({ $and: [{ fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }, { documento: 'ingreso' }] }, (err, doc) => {

				for (var i = doc.length - 1; i >= 0; i--) {
					comprobanteshabilitados.push(doc[i]._id)
				}

				detallecomprobante.find({ $and: [{ numerodecategoria: { $in: req.body.autos } }, { comprobante: { $in: comprobanteshabilitados } }, { cuenta: { $in: req.body.cuentas } }] }).populate('categoria comprobante').exec((err, doc) => {
					cuentas.find({}, (rr, das) => {
						res.send({ de: doc, cuentas: das })
					})
				})
			})




			break;
		case 'egresos':
			var comprobanteshabilitados = []
			comprobante.find({ $and: [{ fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }, { documento: 'egreso' }] }, (err, doc) => {

				for (var i = doc.length - 1; i >= 0; i--) {
					comprobanteshabilitados.push(doc[i]._id)
				}

				detallecomprobante.find({ $and: [{ numerodecategoria: { $in: req.body.autos } }, { cuenta: { $in: req.body.cuentas } }, { comprobante: { $in: comprobanteshabilitados } }] }).populate('categoria comprobante').exec((err, doc) => {
					cuentas.find({}, (rr, das) => {
						res.send({ de: doc, cuentas: das })
					})

				})
			})




			break;
		case 'traspasos':
			var comprobanteshabilitados = []
			comprobante.find({ $and: [{ fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }, { documento: 'traspaso' }] }, (err, doc) => {

				for (var i = doc.length - 1; i >= 0; i--) {
					comprobanteshabilitados.push(doc[i]._id)
				}

				detallecomprobante.find({ $and: [{ numerodecategoria: { $in: req.body.autos } }, { comprobante: { $in: comprobanteshabilitados } }, { cuenta: { $in: req.body.cuentas } }] }).populate('categoria comprobante').exec((err, doc) => {
					cuentas.find({}, (rr, das) => {
						res.send({ de: doc, cuentas: das })
					})
				})
			})




			break;
		default:
			console.log('default')
		// fall-through

	}


})
router.post('/comprobantes/reporte1', (req, res, next) => {
	console.log(req.body)
	var comprobanteshabilitados = []
	comprobante.find({ $and: [{ fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }] }, (err, doc) => {

		for (var i = doc.length - 1; i >= 0; i--) {
			comprobanteshabilitados.push(doc[i]._id)
		}

		detallecomprobante.find({ $and: [{ comprobante: { $in: comprobanteshabilitados } }, { cuenta: { $in: req.body.data } }] }).populate('categoria').exec((err, doc) => {
			res.send(doc)
		})
	})

})
router.post('/comprobantes/reporte2', (req, res, next) => {
	console.log(req.body)
	var comprobanteshabilitados = []
	var lo = []
	for (var iz = req.body.proy.length - 1; iz >= 0; iz--) {
		lo.push(req.body.proy[iz].value)
	}
	if (req.body.tipo[0] == 'all') {
		comprobante.find({ $and: [{ fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }, { proyecto: { $in: lo } }] }, (err, doc) => {

			for (var i = doc.length - 1; i >= 0; i--) {
				comprobanteshabilitados.push(doc[i]._id)
			}

			detallecomprobante.find({ $and: [{ comprobante: { $in: comprobanteshabilitados } }, { cuenta: { $in: req.body.data } }] }).populate('categoria').exec((err, doc) => {
				res.send(doc)
			})
		})
	} else {
		comprobante.find({ $and: [{ documento: { $in: req.body.tipo } }, { fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }, { proyecto: { $in: lo } }] }, (err, doc) => {

			for (var i = doc.length - 1; i >= 0; i--) {
				comprobanteshabilitados.push(doc[i]._id)
			}

			detallecomprobante.find({ $and: [{ comprobante: { $in: comprobanteshabilitados } }, { cuenta: { $in: req.body.data } }] }).populate('categoria').exec((err, doc) => {
				res.send(doc)
			})
		})
	}


})
router.post('/reporte/fijo', (req, res, next) => {
	console.log(req.body)
	var comprobanteshabilitados = []
	var lo = []
	for (var iz = req.body.proy.length - 1; iz >= 0; iz--) {
		lo.push(req.body.proy[iz].value)
	}
	comprobante.find({ $and: [{ fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }, { proyecto: { $in: lo } }] }, (err, doc) => {

		for (var i = doc.length - 1; i >= 0; i--) {
			comprobanteshabilitados.push(doc[i]._id)
		}

		detallecomprobante.find({ $and: [{ comprobante: { $in: comprobanteshabilitados } }, { cuenta: { $in: req.body.data } }] }).populate('categoria').exec((err, doc) => {
			res.send(doc)
		})
	})

})
router.post('/comprobantes/reporte3', (req, res, next) => {
	console.log(req.body)
	var comprobanteshabilitados = []
	var lo = []
	for (var iz = req.body.proy.length - 1; iz >= 0; iz--) {
		lo.push(req.body.proy[iz].value)
	}
	comprobante.find({ $and: [{ fecha: { $lte: req.body.hasta } }, { proyecto: { $in: lo } }] }, (err, doc) => {

		for (var i = doc.length - 1; i >= 0; i--) {
			comprobanteshabilitados.push(doc[i]._id)
		}

		detallecomprobante.find({ $and: [{ comprobante: { $in: comprobanteshabilitados } }, { cuenta: { $in: req.body.data } }] }).populate('categoria').exec((err, doc) => {
			res.send(doc)
		})
	})

})
router.post('/comprobantes/cuentasbusqueda', (req, res, next) => {

	if (req.body.palabra == "") {
		cuentas.find({}, (err, doc) => {
			res.send(doc)
		})
	} else {
		cuentas.find({ $or: [{ nombre: eval("/" + req.body.palabra + "/") }, { numero: eval("/" + req.body.palabra + "/") }] }, (err, doc) => {
			res.send(doc)
		})
	}


})

router.post('/comprobantes/detalle', (req, res, next) => {
	console.log(req.body)
	detallecomprobante.find({ comprobante: req.body._id }, (err, doc) => {
		res.send(doc)
	})

})
router.post('/comprobantes/cuentas', (req, res, next) => {
	var x = new cuentas(req.body)
	cuentas.find({ numero: req.body.numero }, (fail, good) => {

		if (good.length <= 0) {
			x.save((err, doc) => {
				res.send(doc)
			})
		} else {
			res.send({ mensaje: "ya existe" })
		}
	})


})
router.post('/cuentas/filtrador', (req, res, next) => {
	console.log(req.body)
	cuentas.find({ $or: [{ nombre: eval("/" + req.body.mensaje + "/") }, { numero: eval("/" + req.body.mensaje + "/") }] }).limit(100).exec((err, doc) => {
		res.send(doc)
	})

})
/*router.post('/bien/busq', (req, res, next) => {
	console.log('buscando', req.body)
	bien.findOne({ _id: req.body.men }, (err, doc) => {
		orden.findOne({ $and: [{ maquina: req.body.men }, { estado: "p_mantenimiento" }] }, (errs, docs) => {

			res.send({ bien: doc, serv: docs })


		})
	})
})*/

router.post('/solicitud/busquedaKit', (req, res, next) => {

	solicitud.findOne({ _id: req.body.id }, (err, doc) => {
		res.send(doc)
	})
})
router.post('/solicitud/editada', (req, res, next) => {
	console.log('buscando', req.body)
	solicitud.update({ _id: req.body.solicitud }, { $set: { mecanico: req.body.mecanico, maquina: req.body.maquina, proyecto: req.body.proyecto, observaciones: req.body.observaciones, kit: req.body.kit } }, (err, doc) => {
		res.send(doc)
	})
})
router.post('/bien/busq', (req, res, next) => {
	console.log('buscando', req.body)
	bien.findOne({ _id: req.body.men }, (err, doc) => {
		orden.findOne({ $and: [{ maquina: req.body.men }, { estado: "c_mantenimiento" }] }, (errs, docs) => {
			fallas.findOne({ _id: docs.fallas }, (fail, god) => {
				res.send({ bien: doc, serv: docs, fall: god })

			})
		})
	})
})
router.post('/bien/busqP', (req, res, next) => {
	console.log('buscando', req.body)
	bien.findOne({ _id: req.body.men }, (err, doc) => {
		orden.findOne({ $and: [{ maquina: req.body.men }, { estado: "p_mantenimiento" }] }, (errs, docs) => {
			fallas.findOne({ _id: docs.fallas }, (fail, god) => {
				res.send({ bien: doc, serv: docs, fall: god })

			})
		})
	})
})
router.get('/comprobantes/cuentaslista/:numero', (req, res, next) => {
	console.log(req.params.numero)

	cuentas.find({}).limit(100).skip(parseFloat(req.params.numero)).exec((err, docq) => {
		console.log(docq)
		res.send(docq)
	})




})
router.get('/comprobantes/cuentaslistada', (req, res, next) => {


	cuentas.find({}).exec((err, docq) => {

		res.send(docq)
	})




})
router.post('/comprobantes/unico', (req, res, next) => {
	console.log(req.body)
	comprobante.findOne({ $and: [{ entidad: req.body.entidad }, { proyecto: req.body.proyecto }, { documento: req.body.documento }, { numero: req.body.numero }] }, (err, doc) => {
		console.log(doc)
		if (doc != null) {
			detallecomprobante.find({ comprobante: doc._id }, (errs, docs) => {

				res.send({ inf: doc, datos: docs })
			})
		} else {
			res.send({ mensaje: "no ay nada" })
		}

	})

})
router.post('/comprobantes/actualizar', (req, res, next) => {
	console.log(req.body)
	var datt = req.body.datos
	var fecha = new Date()
	comprobante.update({ _id: req.body.compr }, req.body.informacion, (err, doc) => {
		detallecomprobante.update({ comprobante: req.body.compr }, { $set: { tz_lock: '3' + fecha.getFullYear() + fecha.getMonth() + fecha.getDate() } }, (errs, docs) => {

			for (var i = datt.length - 1; i >= 0; i--) {
				if (datt[i][2] == "") {
					var e = {
						original: datt[i][0],
						recurso: datt[i][1],
						partida: datt[i][3],
						fuente: datt[i][4],
						cuenta: datt[i][5],
						auxiliar: datt[i][6],
						nombre: datt[i][7],
						debe: datt[i][8],
						haber: datt[i][9],
						glosa: datt[i][10],
						cheque: datt[i][11],
						referencia: datt[i][12],
						fechaemision: datt[i][13],
						vencimiento: datt[i][14],
						comprobante: req.body.compr
					}
				} else {
					var e = {
						original: datt[i][0],
						recurso: datt[i][1],
						categoria: datt[i][2],
						partida: datt[i][3],
						fuente: datt[i][4],
						cuenta: datt[i][5],
						auxiliar: datt[i][6],
						nombre: datt[i][7],
						debe: datt[i][8],
						haber: datt[i][9],
						glosa: datt[i][10],
						cheque: datt[i][11],
						referencia: datt[i][12],
						fechaemision: datt[i][13],
						vencimiento: datt[i][14],
						comprobante: req.body.compr
					}
				}

				var o = new detallecomprobante(e)
				o.save((err, doc) => {

				})
			}
		})
		res.send({ mensaje: "gracias" })
	})

})
router.post('/usuarios/crear', (req, res, next) => {
	req.body.nombre = req.body.nombre.toLowerCase()
	req.body.apaterno = req.body.apaterno.toLowerCase()
	req.body.amaterno = req.body.amaterno.toLowerCase()

	var m = req.body

	bcrypt.hash(req.body.pass, null, null, (err, hash) => {
		m.pass = hash
		var y = new usuario(m)
		y.save((err, doc) => {

		})
		res.end()
	})

})
router.get('/usuario/ver', (req, res, next) => {
	usuario.find({ tz_lock: '0' }, (err, doc) => {
		res.send(doc)
	})
})
router.post('/proyecto/verificacion', (req, res, next) => {
	console.log(req.body)
	modulo.find({ usuario: req.body.id }, (err, doc) => {
		console.log(doc)
		res.send(doc)
	})
	/*var x = {
		nombre:"Usuarios",
		path:"/usuarios",
		verificacion:true,
		usuario:"5d07a55f7c9f4a1438e1ad15",
		img:"assets/8.png",
		clase:"numero9"

	}
	var y= new modulo(x)
	y.save((err,doc)=>{
		console.log("echo")
		res.send({mensaje:"gracias"})
	})*/
})

router.post('/proyecto/dimemipermiso', (req, res, next) => {
	console.log(req.body)
	modulo.findOne({ $and: [{ usuario: req.body.id }, { nombre: req.body.modulo }] }, (err, doc) => {
		res.send(doc)
	})

})
router.post('/proyecto/subirpermiso', (req, res, next) => {

	var io = req.body
	for (var i = io.length - 1; i >= 0; i--) {
		for (var e = io[i].botones.length - 1; e >= 0; e--) {
			io[i].botones[e] = JSON.parse(io[i].botones[e])
		}
	}
	modulo.remove({ usuario: io[0].usuario }, (errs, docs) => {
		for (var i = io.length - 1; i >= 0; i--) {
			console.log(io[i])
			var w = new modulo(io[i])
			w.save((err, doc) => {
				console.log(doc)
			})

		}

	})
	res.send({ mensaje: "complete" })

})
router.get('/proyectos/lista', (req, res, next) => {
	proyecto.find({ tz_lock: '0', estado: { $ne: "Deshabilitado" } }, (err, doc) => {
		console.log(doc)
		res.send(doc)
	})
})
router.post('/proyecto/editar', (req, res, next) => {

	proyecto.update({ _id: req.body._id }, req.body, (err, doc) => {

		res.send(doc)
	})
});
router.post('/proyecto/eliminar', (req, res, next) => {

	proyecto.update({ _id: req.body._id }, { estado: "Deshabilitado" }, (err, doc) => {

		res.send(doc)
	})
});
router.get('/proyecto/damelalista', (req, res, next) => {
	proyecto.find({ tz_lock: '0' }, (err, doc) => {
		res.send(doc)
	})
})
router.post('/usuarios/actualizarpermisos', (req, res, next) => {

	usuario.update({ _id: req.body._id }, { permisos: req.body.permisos }, (err, doc) => {

		res.send(doc)
	})
});
router.post('/usuarios/encargado', (req, res, next) => {

	bien.update({ _id: req.body.maquina }, { encargado: req.body.codi }, (err, doc) => {

		res.send(doc)
	})
});
router.post('/usuarios/actualizarusuarios', (req, res, next) => {

	var m = {
		pass: ""
	}
	usuario.update({ _id: req.body.ayuda._id }, { $set: req.body.ayuda }, (err, doc) => {
		bcrypt.hash(req.body.pass, null, null, (err, hash) => {

			m.pass = hash
			usuario.update({ _id: req.body.ayuda._id }, { pass: m.pass }, function (err, doc) {

			})
			res.end()
		})

	})
});
router.post('/usuarios/letras', (req, res, next) => {

	usuario.find({ tz_lock: '0', $or: [{ nombre: eval("/" + req.body.palabra + "/") }, { apaterno: eval("/" + req.body.palabra + "/") }, { amaterno: eval("/" + req.body.palabra + "/") }, { ci: eval("/" + req.body.palabra + "/") }, { telefono: eval("/" + req.body.palabra + "/") }] }, (err, doc) => {

		res.send(doc)
	})
});
router.post('/check/list', (req, res, next) => {
	console.log(req.body)
	var x = new check(req.body.check)
	x.save((err, doc) => {
		for (var i = req.body.detal.length - 1; i >= 0; i--) {
			var o = req.body.detal[i]
			o.check = doc._id
			var y = new detallecheck(req.body.detal[i])
			y.save((errs, docs) => {

			})
		}
		res.send({ mensaje: 'complete' })
	})
});
router.post('/orden/habilitar', (req, res, next) => {
	console.log(req.body._id)
	orden.update({ $and: [{ maquina: String(req.body._id) }, { estado: 'c_mantenimiento' }, { tipo: 'correctivo' }] }, { $set: { pasa: true } }, (err, doc) => {
		res.send(doc)
	})

});
router.post('/orden/reporteFecha', (req, res, next) => {
	console.log(req.body)
	orden.find({ $and: [{ fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }] }).populate('solicitudes maquina').exec((err, doc) => {
		var x = doc
		var y = []
		for (let index = 0; index < doc.length; index++) {

			y.push(doc[index]._id)

		}
		console.log(y)
		solicitud.find({ tz_lock: '0', orden: { $in: y } }, (err1, doc1) => {
			res.send({ orden: doc, soli: doc1 });
		})

	})

});


router.post('/bienes/todo', (req, res, next) => {
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

				var x = new partediario(req.body)

				x.save((err, doc) => {
					if (req.body.afecto == true) {
						bien.update({ _id: req.body.maquina }, { hodometro: req.body.hodometronuevo, horometro: req.body.horometronuevo }, (err, doc) => {
							res.send(doc)
						})

					} else {
						res.send(doc)
					}


				})


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

						var x = new partediario(req.body)

						x.save((err, doc) => {
							if (req.body.afecto == true) {
								bien.update({ _id: req.body.maquina }, { hodometro: req.body.hodometronuevo, horometro: req.body.horometronuevo }, (err, doc) => {
									res.send(doc)
								})

							} else {
								res.send(doc)
							}


						})


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
						var x = new partediario(req.body)

						x.save((err, doc) => {
							if (req.body.afecto == true) {
								bien.update({ _id: req.body.maquina }, { hodometro: req.body.hodometronuevo, horometro: req.body.horometronuevo }, (err, doc) => {
									res.send(doc)
								})

							} else {
								res.send(doc)
							}


						})
					} else {
						res.send({ mensaje: "yamantenimiento" })
					}
					//	res.send({ mensaje: "yamantenimiento" })
				}
			})

		}
	})



});
router.post('/bienes/editado', (req, res, next) => {

	console.log(req.body)
	bien.update({ _id: req.body._id }, { $set: req.body }, (err, doc) => {
		res.send(doc)
	})


});
router.post('/partes/unicos', (req, res, next) => {


	partediario.find({ tz_lock: '0', maquina: req.body.maquina }).populate('operador maquina proyecto').exec((err, doc) => {
		res.send(doc)
	})


});
router.post('/preventivo/abierto', (req, res, next) => {

	console.log('verifivs', req.body._id)
	orden.findOne({ $and: [{ maquina: req.body._id }, { estado: 'p_mantenimiento' }, { tipo: 'preventivo' }] }, (err, doc) => {
		console.log('ENCOTREN', doc, err)
		res.send(doc)
	})


});

router.post('/bienes/entrefechas', (req, res, next) => {

	var x = new Date(req.body.desde)
	var y = new Date(req.body.hasta)
	var aux
	var arreglo = []
	var arreglo1 = []

	for (var i = req.body.bienes.length - 1; i >= 0; i--) {
		arreglo1.push(req.body.bienes[i].value)
	}

	partediario.find({ tz_lock: '0', maquina: { $in: arreglo1 } }).populate('maquina').exec((erros, docsd) => {
		for (var i = docsd.length - 1; i >= 0; i--) {
			aux = new Date(docsd[i].fecha)
			if (aux >= x && aux <= y) {
				arreglo.push(docsd[i])
			}
		}

		res.send(arreglo)
	})

	/*partediario.find({$and:[{fecha:{$gte:x}},{fecha:{$lte:y}}]}).populate('maquina').exec((err,doc)=>{
		   res.send(doc)
	})*/

});

router.post('/bienes/eliminado', (req, res, next) => {
	var fecha = new Date()
	bien.update({ _id: req.body._id }, { $set: { tz_lock: '3' + fecha.getFullYear() + fecha.getMonth() + fecha.getDate() } }, (err, doc) => {
		res.send(doc)
	})


});
router.post('/orden/nuevo', (req, res, next) => {
	console.log(req.body)

	var contador = 0
	if (req.body.tipo == "preventivo") {
		orden.findOne({ maquina: req.body.maquina, estado: "p_mantenimiento" }, (err, doc) => {
			if (doc != null) {
				res.send({ mensaje: "ya esta" })
			} else {
				var x = new orden(req.body)
				x.save((err, doc) => {

					bien.update({ _id: req.body.maquina }, { estadopre: 'mantenimiento' }, (errs, docs) => {
						res.send({ mensaje: docs })
					})
				})
			}
		})
	} else {
		orden.findOne({ maquina: req.body.maquina, estado: "c_mantenimiento" }, (err, doc) => {
			if (doc != null) {
				res.send({ mensaje: "ya esta" })
			} else {
				fallas.findOne({ maquina: req.body.maquina, estado: 'abierto' }, (tt, rr) => {
					console.log(rr)
					if (rr != null) {
						req.body.fallas = rr._id
						var x = new orden(req.body)
						x.save((err, doc) => {
							bien.update({ _id: req.body.maquina }, { estado: 'mantenimiento' }, (errs, docs) => {
								res.send({ mensaje: docs })
							})
						})
					} else {


					}
				})

			}
		})
	}





});
router.post('/orden/unica', (req, res, next) => {


	orden.find({ maquina: req.body.maquina }).populate('maquina').exec((err, doc) => {
		res.send(doc)
	})




});
router.post('/preventivo/lista', (req, res, next) => {
	console.log(req.body)

	prevencion.find({ tz_lock: '0', bien: req.body._id }, (err, doc) => {
		res.send(doc)
	})


});

router.post('/preventivo/lista1', (req, res, next) => {
	console.log(req.body)

	prevencion.find({ tz_lock: '0', bien: req.body._id }).populate('tareas').exec((err, doc) => {
		res.send(doc)
	})

});
router.post('/preventivo/verw', (req, res, next) => {
	console.log(req.body)

	orden.findOne({ maquina: req.body._id, estado: 'c_mantenimiento', tipo: 'correctivo' }).populate('fallas').exec((err, doc) => {
		if (doc != null) {
			res.send(doc)
		} else {
			res.send({ mensaje: "no" })
		}

	})


});
router.post('/correctivo/falla', (req, res, next) => {
	console.log(req.body)
	var x = new fallas(req.body)
	x.save((err, doc) => {
		bien.update({ _id: req.body.maquina }, { $set: { estadofalla: 'pendiente' } }, (err, doc) => {
			res.send(doc)
		})
	})


});
router.post('/correctivo/fallafindq', (req, res, next) => {
	fallas.findOne({ maquina: req.body._id, estado: 'abierto' }).populate('maquina proyecto').exec((err, doc) => {
		res.send(doc)
	})


});
router.post('/correctivo/fallafind', (req, res, next) => {
	fallas.findOne({ maquina: req.body._id, estado: 'abierto' }, (err, doc) => {
		res.send(doc)
	})


});
router.post('/correctivo/fallaact', (req, res, next) => {
	console.log(req.body)
	fallas.update({ _id: req.body.maq._id }, { $set: { lista: req.body.lista } }, (err, doc) => {
		res.send(doc)
	})

});
router.post('/correctivo/fallarec', (req, res, next) => {
	console.log(req.body)
	fallas.update({ _id: req.body.maq._id }, { $set: { estado: 'rechazado' } }, (err, doc) => {
		bien.update({ _id: req.body.maq.maquina }, { $set: { estadofalla: 'abierto', estado: 'liberado' } }, (es, ds) => {
			res.send(doc)
		})

	})

});

router.post('/preventivo/cambio', (req, res, next) => {
	console.log(req.body)
	var x = req.body.falla
	x.proyecto = req.body.proy[0].value
	x.maquina = req.body.maq._id
	x.lista = req.body.lista
	x.estado = "abierto"

	orden.findOne({ $and: [{ maquina: req.body.maq._id }, { estado: 'c_mantenimiento' }, { tipo: 'correctivo' }] }, (err, doc) => {
		console.log(doc)
		if (doc == null) {
			bien.update({ _id: req.body.maq._id }, { $set: { estadopre: 'liberado', estado: 'mantenimiento', estadofalla: 'pendiente' } }, (ff, gg) => {
				var t = new fallas(x)
				t.save((aa, zz) => {
					orden.update({ $and: [{ maquina: req.body.maq._id }, { estado: 'p_mantenimiento' }, { tipo: 'preventivo' }] }, { $set: { tipo: 'correctivo', viene: 'depreventivo', estado: 'c_mantenimiento', fallas: zz._id } }, (errs, docs) => {


					})
					res.send({ mensaje: "transformado" })
				})
			})



		} else {
			res.send({ mensaje: "estaconcorrectivo" })
		}
	})

});
router.post('/orden/cerrar', (req, res, next) => {
	console.log('para cerrar', req.body)
	solicitud.find({ $and: [{ tz_lock: '0' }, { orden: req.body.archivo.od }, { orden: { $exists: true } }, { estado: { $ne: 'rechazado' } }, { estado: { $ne: 'concluida' } }, { estado: { $ne: 'concluido' } }] }, (err, doc) => {
		console.log(doc);
		if (doc.length > 0) {
			console.log()
			res.send({ mensaje: 'sigue' });
		} else {


			var ayuda = 0
			if (req.body.tipox == "preventivo") {
				orden.update({ maquina: req.body.archivo.maquina, estado: 'p_mantenimiento', tipo: 'preventivo' }, {
					$set:
					{
						fechasalida: req.body.archivo.fechasalida,
						estado: "concluida",
						observaciones: req.body.archivo.observaciones,
						kit: req.body.archivo.kit,
						solicitudes: req.body.solicitudes,
						tareas: req.body.tareas
					}
				}, (err, doc) => {
					bien.findOne({ _id: req.body.archivo.maquina }, (errores, documentos) => {



						if (req.body.tipo == "hor") {
							bien.update({ _id: req.body.archivo.maquina }, { estadopre: "liberado", horometro: req.body.horometro }, (errs, docs) => {
								for (var i = req.body.prevenciones.length - 1; i >= 0; i--) {

									prevencion.findOne({ _id: req.body.prevenciones[i].value }, (errss, docss) => {

										var oi = parseFloat(req.body.horometro) + parseFloat(docss.anticipacion)
										console.log(req.body.horometro, docss.anticipacion, oi)
										prevencion.update({ _id: docss._id }, {
											proximo: oi
										}, (finalerr, finaldoc) => {

										})
									})
								}
								res.send(docs)
							})
						} else {
							bien.update({ _id: req.body.archivo.maquina }, { estadopre: "liberado", hodometro: req.body.hodometro }, (errs, docs) => {
								for (var i = req.body.prevenciones.length - 1; i >= 0; i--) {
									prevencion.findOne({ _id: req.body.prevenciones[i].value }, (errss, docss) => {
										var oi = parseFloat(req.body.hodometro) + parseFloat(docss.anticipacion)
										console.log(req.body.horometro, docss.anticipacion, oi)
										prevencion.update({ _id: docss._id }, {
											proximo: oi
										}, (finalerr, finaldoc) => {

										})
									})
								}
								res.send(docs)
							})
						}

					})




				})
			} else {


				console.log('ES CORRECTIVO')
				orden.update({ maquina: req.body.archivo.maquina, estado: 'c_mantenimiento', tipo: 'correctivo' }, {
					$set:
					{
						fechasalida: req.body.archivo.fechasalida,
						estado: "concluida",
						observaciones: req.body.archivo.observaciones,
						kit: req.body.archivo.kit
					}
				}, (err, doc) => {
					console.log('CerrarOrden ---------------> Actualizado Orden.Update')
					bien.findOne({ _id: req.body.archivo.maquina }, (errores, documentos) => {
						if (documentos.aviso == null) {
							documentos.aviso = 0
						}
						if (documentos.tipo == "horometro") {
							ayuda = String(parseFloat(req.body.horometro) + parseFloat(documentos.aviso))
						} else {
							ayuda = String(parseFloat(req.body.hodometro) + parseFloat(documentos.aviso))
						}
						console.log('CerrarOrden ---------------> Campo ayuda', ayuda)
						if (req.body.tipo == "hor") {
							console.log('CerrarOrden ---------------> Tipo Hor')
							if (req.body.archivo.viene == 'depreventivo') {
								console.log('CerrarOrden ---------------> Tipo depreventivo')
								if (req.body.prevenciones.length > 0) {
									for (var i = req.body.prevenciones.length - 1; i >= 0; i--) {

										prevencion.findOne({ _id: req.body.prevenciones[i].value }, (errss, docss) => {

											var oi = parseFloat(req.body.horometro) + parseFloat(docss.anticipacion)
											console.log(req.body.horometro, docss.anticipacion, oi)
											prevencion.update({ _id: docss._id }, {
												proximo: oi
											}, (finalerr, finaldoc) => {
												fallas.update({ maquina: req.body.archivo.maquina, estado: 'abierto' }, { $set: { estado: 'cerrado', corregido: req.body.lista } }, (pp, oo) => {
													bien.update({ _id: req.body.archivo.maquina }, { $set: { estado: "liberado", horometro: req.body.horometro, proximo: ayuda, estadofalla: 'liberado' } }, (errs, docs) => {
														console.log('CerrarOrden ---------------> Actualizar bien con prevencio')
													})
												})

											})
										})
									}
								} else {
									bien.update({ _id: req.body.archivo.maquina }, { $set: { estado: "liberado", horometro: req.body.horometro, proximo: ayuda, estadofalla: 'liberado' } }, (errs, docs) => {
										console.log('CerrarOrden ---------------> Actualizar bien sin prevencio')
									})
								}

								res.send({ mensaje: 'ok' })
							} else {
								fallas.update({ maquina: req.body.archivo.maquina, estado: 'abierto' }, { $set: { estado: 'cerrado', corregido: req.body.lista } }, (pp, oo) => {
									bien.update({ _id: req.body.archivo.maquina }, { $set: { estado: "liberado", horometro: req.body.horometro, proximo: ayuda, estadofalla: 'liberado' } }, (errs, docs) => {
										res.send(docs)
									})
								})



							}




						} else {
							bien.update({ _id: req.body.archivo.maquina }, { estado: "liberado", hodometro: req.body.hodometro, proximo: ayuda }, (errs, docs) => {
								res.send(docs)
							})
						}



					})




				})
			}
		}
	})
	/*
*/


});

router.post('/usuarios/eliminarusuarios', (req, res, next) => {
	var fecha = new Date()
	usuario.update({ _id: req.body._id }, { $set: { tz_lock: '3' + fecha.getFullYear() + fecha.getMonth() + fecha.getDate() } }, (err, doc) => {
		res.send(doc)
	})
});

router.post('/usuarios/login', (req, res, next) => {

	usuario.findOne({ username: req.body.login }, function (err, doc) {
		if (doc == null) {

			res.send({ mensaje: "no ay" })
		} else {

			bcrypt.compare(req.body.pass, doc.pass, function (err, resp) {

				if (resp == true) {
					req.session.suid = doc._id
					req.session.nombre = doc.nombre

					res.send(doc)

				} else {
					res.send({ mensaje: "no ay" })
				}

			});


		}



	})
})
router.post('/usuario/destroy', (req, res, next) => {
	token.remove({ usu: req.body.nombre }, (err, doc) => {
		req.session.destroy(function (err) {



			res.clearCookie('connect.sid', { path: '/' });
			res.clearCookie('io', { path: '/' }).status(200).send('Cookie deleted.');
		})
	})

})
router.post('/api/subir', multipartMiddleware, function (req, resp) {

	resp.json({ mensaje: req.files.uploads })
	// don't forget to delete all req.files when done
});
router.post('/bienes/mios', (req, res, next) => {

	bien.find({ tz_lock: '0', encargado: req.body.usu }).populate('encargado').exec((err, doc) => {
		res.send(doc)
	})
});
router.get('/cerrarod/solicitud', (req, res, next) => {

	solicitud.find({ tz_lock: '0', estado: 'concluido' }, (err, doc) => {
		res.send(doc)
	})
});
router.get('/sol/corre', (req, res, next) => {

	solicitud.find({ tz_lock: '0' }).sort({ $natural: -1 }).limit(1).exec((err, doc) => {
		console.log(doc)
		var x = parseFloat(doc[0].nombre) + 1
		var cod = ('0000' + x).slice(-5)
		res.send({ toca: cod })
	})
})
router.post('/solicitudes/nueva', (req, res, next) => {
	console.log(req.body)
	solicitud.find({ tz_lock: '0' }).sort({ $natural: -1 }).limit(1).exec((err, doc) => {
		var x = parseFloat(doc[0].nombre) + 1
		var cod = ('0000' + x).slice(-5)
		req.body.nombre = cod
		var q = new solicitud(req.body)
		q.save((err, doc) => {
			res.send(doc)
		})
	})
	/* solicitud.findOne({nombre:req.body.nombre},(err,doc)=>{
		   if (doc!=null) {
			   res.send({mensaje:"yaay"})
		   }else{
		   	
		   }
	 })*/

})
router.post('/solicitud/reporte', (req, res, next) => {

	solicitud.find({ $and: [{ tz_lock: '0' }, { fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }] }).populate('proyecto maquina usuario').exec((err, doc) => {
		res.send(doc)
	})
})

router.post('/solicitudes/aprobada', (req, res, next) => {
	if (req.body.viene == 'lista') {
		solicitud.update({ _id: req.body.solicitud }, { $set: { horaAprobacion: new Date(), estado: req.body.estado, kit: req.body.kit, observaciones_nuevas: req.body.observaciones_nuevas } }, (err, doc) => {

			res.send(doc)
		})
	} else {
		solicitud.update({ _id: req.body.solicitud }, { $set: { horaAprobacion: new Date(), estado: req.body.estado, observaciones_nuevas: req.body.observaciones_nuevas } }, (err, doc) => {

			res.send(doc)
		})
	}

});

router.post('/solicitudes/cotizando', (req, res, next) => {

	solicitud.update({ _id: req.body.solicitud }, { $set: { estado: req.body.estado } }, (err, doc) => {

		res.send(doc)
	})


});
router.post('/solicitudes/desaprobada', (req, res, next) => {

	solicitud.update({ _id: req.body.solicitud }, { $set: { horaAprobacion: new Date(), estado: req.body.estado, observaciones_nuevas: req.body.observaciones_nuevas } }, (err, doc) => {

		res.send(doc)
	})
});
router.post('/solicitudes/terminada', (req, res, next) => {

	solicitud.update({ _id: req.body.informacion.ident }, { $set: { horaCierre: new Date, estado: 'concluido', kit: req.body.actualizar.kit, observaciones_finales: req.body.actualizar.observaciones_finales } }, (err, doc) => {
		req.body.recep.compra = req.body.informacion.ident
		var er = new recibo(req.body.recep)
		er.save((errs, docs) => {
			res.send(docs)
		})

	})
});
router.post('/solicitud/finalizada', (req, res, next) => {
	console.log(req.body)
	solicitud.update({ _id: req.body.informacion.ident }, { $set: { horaCierre: new Date, estado: 'concluido', kit: req.body.informacion.kit } }, (err, doc) => {
		req.body.recepcion.compra = req.body.informacion.ident
		var x = new recibo(req.body.recepcion)
		x.save((errs, docs) => {
			res.send(doc)
		})

	})
});
router.post('/solicitud/parcial', (req, res, next) => {
	console.log(req.body)
	solicitud.update({ _id: req.body.informacion.ident }, { $set: { kit: req.body.informacion.kit } }, (err, doc) => {
		res.send(doc)

	})
});
router.get('/solicitudes/lista', (req, res, next) => {
	solicitud.find({ $and: [{ tz_lock: '0' }, { estado: { $ne: 'concluido' } }, { estado: { $ne: 'rechazado' } }] }).populate('maquina usuario').exec((err, doc) => {

		res.send(doc)
	})
})
router.get('/solicitudes/lista/:id', (req, res, next) => {
	solicitud.findOne({ $and: [{ _id: req.params.id }] }).populate('maquina usuario').exec((err, doc) => {

		res.send(doc)
	})
})
router.post('/solicitudes/buscando/id', (req, res, next) => {
	solicitud.findOne({ _id: req.body.id }).populate('maquina usuario').exec((err, doc) => {

		res.send(doc)
	})
})
router.post('/solicitudes/listapersonal', (req, res, next) => {
	solicitud.find({ $and: [{ tz_lock: '0' }, { estado: { $ne: 'concluido' } }, { estado: { $ne: 'rechazado' } }, { usuario: req.body.id }] }).populate('maquina usuario').exec((err, doc) => {

		res.send(doc)
	})
})
router.post('/correlativos/aumento', (req, res, next) => {
	console.log(req.body)
	correlativo.findOne({ nombre: req.body.nom }).sort({ $natural: -1 }).limit(1).exec((err, doc) => {
		console.log(doc)
		if (doc == null) {
			var numero = 1
			var y = {

				nombre: req.body.nom,
				codigo: ('000000' + numero).slice(-7)

			}
			var x = new correlativo(y)
			x.save((errs, docs) => {
				res.send({ codigo: ('000000' + numero).slice(-7) })
			})
		} else {
			var num = parseFloat(doc.codigo) + 1
			correlativo.update({ nombre: req.body.nom }, { $set: { codigo: ('000000' + num).slice(-7) } }, (errss, docss) => {
				res.send({ codigo: ('000000' + num).slice(-7) })
			})
			console.log("ahora")
		}
	})
})


// TAREAS
router.post('/tarea/completadas', (req, res, next) => {
	console.log(req.body)
	var x = req.body
	var y = []
	for (let index = 0; index < x.length; index++) {
		y.push(x[index].value)
	}
	tarea.find({})
})
router.post('/tarea/grupos', (req, res, next) => {
	console.log(req.body)
	prevencion.update({ _id: req.body.preventivo._id }, { $set: { tareas: req.body.lista } }, (err, doc) => {
		res.send(doc);
	})
})
router.post('/tarea/agregar', (req, res, next) => {
	console.log(req.body)
	var x = new tarea(req.body)
	x.save((err, doc) => {
		res.send(doc)
	})
})
router.post('/tarea/editar', (req, res, next) => {
	console.log(req.body)

	tarea.update({ _id: req.body.id }, { $set: req.body }, (err, doc) => {
		res.send(doc)
	})
})
router.get('/tarea/lista', (req, res, next) => {
	console.log(req.body)
	tarea.find({}, (err, doc) => {
		res.send(doc)
	})
})
router.post('/tarea/mios', (req, res, next) => {
	console.log(req.body)
	prevencion.findOne({ _id: req.body._id }).populate('tareas').exec((err, doc) => {
		res.send(doc);
	})
})

// KITS
router.post('/kit/anadir', (req, res, next) => {
	console.log(req.body)
	var x = new kit(req.body)
	x.save((err, doc) => {
		res.send(doc)
	})
})
router.post('/kit/editar', (req, res, next) => {
	console.log(req.body)
	kit.update({ _id: req.body.id }, { $set: req.body }, (err, doc) => {
		res.send(doc)
	})
})
router.post('/kit/mios', (req, res, next) => {
	console.log(req.body)
	prevencion.findOne({ _id: req.body._id }).populate('equipos').exec((err, doc) => {
		res.send(doc);
	})
})
router.post('/kit/grupos', (req, res, next) => {
	console.log(req.body)
	prevencion.update({ _id: req.body.preventivo._id }, { $set: { equipos: req.body.lista } }, (err, doc) => {
		res.send(doc);
	})
})
router.post('/kit/preventivoBien', (req, res, next) => {
	console.log(req.body)
	prevencion.find({ tz_lock: '0', bien: req.body.bien._id }, (err, doc) => {
		res.send(doc);
	})
})

router.get('/kit/traerElKit/:id', (req, res, next) => {
	console.log(req.params)
	prevencion.findOne({ _id: req.params.id }).populate('equipos').exec((err, doc) => {
		res.send(doc)
	})
})
router.get('/kit/lista', (req, res, next) => {
	console.log(req.body)
	kit.find({}, (err, doc) => {
		res.send(doc)
	})
})



// ITEMS
router.get('/item/listaGeneral', (req, res, next) => {
	item.find({}).populate('bien preventivo').exec((err, doc) => {
		res.send(doc)
	})
})

router.get('/item/listaPreventiva', (req, res, next) => {
	item.find({ preventivo: { $exists: false } }).populate('bien').exec((err, doc) => {
		res.send(doc)
	})
})

router.post('/item/asociarPreventivo', (req, res, next) => {
	console.log(req.body)
	console.log(req.body.itemA.nose)
	console.log(req.body.itemA._id)
	if (req.body.itemA._id != undefined) {
		item.update({ _id: req.body.item }, { $set: { preventivo: req.body.preventivo } }, (err, doc) => {
			item.update({ _id: req.body.itemA._id }, { $unset: { "preventivo": "" } }, (err1, doc1) => {
				res.send(doc);
			})

		})
	} else {
		item.update({ _id: req.body.item }, { $set: { preventivo: req.body.preventivo } }, (err, doc) => {
			res.send(doc);

		})
	}
	/*item.update({ _id: req.body.item }, { $set: { preventivo: req.body.preventivo } }, (err, doc) => {
		
		res.send(doc);
	})*/
})

router.post('/item/miItem', (req, res, next) => {
	console.log(req.body)
	item.find({ preventivo: req.body._id }, (err, doc) => {
		res.send(doc)
	})
})

router.get('/item/lista', (req, res, next) => {
	item.find({ bien: { $exists: false } }).populate('bien').exec((err, doc) => {
		res.send(doc)
	})
})
router.post('/item/agregar', (req, res, next) => {
	console.log(req.body)
	var x = new item(req.body)
	x.save((err, doc) => {
		res.send(doc)
	})
})

router.get('/item/traerItems/:id', (req, res, next) => {
	console.log(req.params)
	item.find({ bien: req.params.id }).populate('bien').exec((err, doc) => {
		res.send(doc)
	})
})

router.post('/item/personal', (req, res, next) => {
	item.find({ bien: req.body.bien._id }).populate('bien preventivo').exec((err, doc) => {
		res.send(doc)
	})
})
router.post('/item/listaTransferencia', (req, res, next) => {
	bien.find({ _id: { $ne: req.body.bien._id } }, (err, doc) => {
		res.send(doc)
	})
})

router.post('/item/darBaja', (req, res, next) => {
	console.log(req.body)
	item.update({ _id: req.body.item }, { $set: { estado: 'baja' } }, (err, doc) => {
		var x = new transferenciaItem(req.body)
		x.save((err3, doc3) => {
			res.send(doc3)
		})
		console.log(doc);
	})
})
router.post('/item/reporteTransferencia', (req, res, next) => {
	console.log(req.body)
	transferenciaItem.find({ $and: [{ fecha: { $gte: req.body.desde } }, { fecha: { $lte: req.body.hasta } }] }).populate('bienN bienA item usuario').exec((err, doc) => {
		res.send(doc)
	})
})
router.post('/item/reportePreventivo', (req, res, next) => {
	console.log(req.body)
	var x = []
	req.body.forEach(element => {
		x.push(element.id)
	});
	prevencion.find({ tz_lock: '0', bien: { $in: x } }).populate('bien').exec((err, doc) => {
		res.send(doc)
	})
})



router.post('/item/enviar', (req, res, next) => {
	console.log(req.body);
	bien.findOne({ _id: req.body.bienN }, (err, doc) => {
		for (let index = 0; index < req.body.proximos.length; index++) {
			var x = parseFloat(req.body.proximos[index].proximo) - parseFloat(req.body.horometroA)
			var y = parseFloat(doc.horometro) + parseFloat(x)
			console.log(x + '-', '-' + doc.horometro, y)
			prevencion.update({ _id: req.body.proximos[index]._id }, { $set: { proximo: y, bien: req.body.bienN } }, (err1, doc1) => {

			})
		}
	})
	bien.update({ _id: req.body.bienA }, { $pull: { items: req.body.item } }, (err, doc) => {
		item.update({ _id: req.body.item }, { $set: { bien: req.body.bienN } }, (err2, doc2) => {
			var y = new transferenciaItem(req.body)
			y.save((err3, doc3) => {
				res.send(doc3)
			})
		})
	})
})

router.post('/item/relacionar', (req, res, next) => {
	console.log(req.body)
	bien.update({ _id: req.body.bien._id }, { $push: { items: req.body.item._id } }, (err1, doc1) => {
		item.update({ _id: req.body.item._id }, { $set: { bien: req.body.bien._id } }, (err, doc) => {
			res.send(doc)
		})
	})
})
router.post('/item/editar', (req, res, next) => {
	console.log(req.body)
	item.update({ _id: req.body._id }, { $set: req.body }, (err, doc) => {
		res.send(doc);
	})
})
router.get('/bienes/lista', (req, res, next) => {
	bien.find({ tz_lock: '0' }).populate('encargado').exec((err, doc) => {
		res.send(doc)
	})
})
router.get('/partes/resumenes', (req, res, next) => {
	var x = new Date()
	var y = x.getFullYear() + "-" + ("0" + x.getMonth()).slice(-2) + "-" + ("0" + x.getDate()).slice(-2)
	partediario.count().exec((err, doc) => {
		console.log("NUMERO DE REGISTROS", doc)
	})

	partediario.find({ tz_lock: '0' }, (err, doc) => {
		partediario.find({ fecha: y }, (errs, docs) => {
			var m = {
				todos: doc.length,
				dia: docs.length
			}
			res.send(m)
		})
	})
})
router.post('/preventivo/eliminar', (req, res, next) => {
	var fecha = new Date()
	prevencion.update({ _id: req.body._id }, { $set: { tz_lock: '3' + fecha.getFullYear() + fecha.getMonth() + fecha.getDate() } }, (err, doc) => {
		res.send(doc)
	})
})

router.get('/bienes/listaprenvencion', (req, res, next) => {
	bien.find({}).populate('encargado').exec((err, doc) => {
		prevencion.find({ tz_lock: '0' }).populate('bien').exec((errs, docs) => {
			var x = {
				bienes: doc,
				prevencion: docs
			}
			res.send(x)
		})
	})
})

router.post('/bienes/crear', (req, res, next) => {
	req.body.nombre = req.body.nombre.toLowerCase()

	req.body.ubicacion = req.body.ubicacion.toLowerCase()
	bien.find({ tz_lock: '0', cuenta: req.body.cuenta }, (errr, docc) => {
		if (docc <= 0) {
			bien.findOne().sort({ $natural: -1 }).limit(1).exec((errr, docr) => {
				if (docr == null) {
					req.body.codigo = "000001"
				} else {
					req.body.codigo = String(parseFloat(docr.codigo) + 1)
				}
				var x = new bien(req.body)

				x.save((err, doc) => {
					res.send(doc)
				})
			})
		} else {
			res.send({ mensaje: "yaexiste" })
		}
	})
})

router.post('/bienes/importar', (req, res, next) => {
	var paquete = req.body

	bien.findOne().sort({ $natural: -1 }).limit(1).exec((errr, docr) => {
		var numero = 0
		if (docr == null) {
			numero = "10000"
		} else {
			numero = String(parseFloat(docr.codigo) + 1)
		}
		for (var i = paquete.length - 1; i >= 0; i--) {
			cargarbien(paquete[i], numero)
			numero = String(parseFloat(numero) + 1)
		}
	})


	res.send({ mensaje: "concluido" })
})


router.get('/proyecto/numero', (req, res, next) => {
	var x = {
		mensaje: ""
	}
	proyecto.findOne().sort({ $natural: -1 }).limit(1).exec((errr, docr) => {
		if (docr == null) {
			x.mensaje = "1"
		} else {
			x.mensaje = String(parseFloat(docr.codigo) + 1)
		}
		res.send(x)
	})
})
router.post('/proyecto/new', (req, res, next) => {
	var x = new proyecto(req.body)
	x.save((err, doc) => {
		res.send(doc)
	})
})
router.get('/proyecto/lista', (req, res, next) => {
	proyecto.find({ tz_lock: '0' }, (err, doc) => {
		res.send(doc)
	})
})
router.get('/informacionfiltrada', (req, res, next) => {
	proyecto.find({ tz_lock: '0' }, (err, doc) => {
		bien.find({ tz_lock: '0' }, (errs, docs) => {
			res.send({ proyectos: doc, bienes: docs })
		})

	})

})

router.post('/bien/precio', (req, res, next) => {
	console.log(req.body)
	var x = {
		precio: req.body.precio,
		moneda: req.body.moneda,
		bien: req.body.idbien,
		tipo: req.body.tipo,
		proyecto: req.body.proyecto[0].value
	}

	var o = new costobien(x)
	costobien.findOne({ $and: [{ bien: x.bien }, { proyecto: x.proyecto }, { tipo: x.tipo }] }, (err, doc) => {

		if (doc == null) {
			o.save((errs, docs) => {
				res.send(docs)
			})
		} else {
			res.send({ mensaje: "encontrado" })
		}
	})



})
router.post('/partes/preciosProyecto', (req, res, next) => {

	costobien.find({ $and: [{ bien: req.body.bien._id }, { proyecto: req.body.proyecto.value }] }, (err, doc) => {
		console.log(doc)
		res.send(doc);
	})

})

router.post('/bien/preciodiesel', (req, res, next) => {
	console.log('gaso', req.body)
	var x = {
		precio: req.body.precio,
		moneda: req.body.moneda,
		bien: req.body.idbien,
		tipo: req.body.tipo,
		proyecto: req.body.proyecto[0].value
	}

	var o = new costodiesel(x)
	costodiesel.findOne({ $and: [{ bien: x.bien }, { proyecto: x.proyecto }, { tipo: x.tipo }] }, (err, doc) => {

		if (doc == null) {
			o.save((errs, docs) => {
				res.send(docs)
			})
		} else {
			res.send({ mensaje: "encontrado" })
		}
	})



})

router.post('/parte/editado', (req, res, next) => {
	/*var nuestraFecha= new Date()
	var nuevaFecha =  nuestraFecha.getFullYear().toString()+  '/' + ('0' + nuestraFecha.getMonth()+1).slice(-2).toString()
		 + '/' +('0' + nuestraFecha.getDate()).slice(-2).toString()
		 
	 console.log(nuevaFecha)*/
	console.log(req.body)
	var ayuda = 0

	partediario.find({ tz_lock: '0', maquina: req.body.maquina }, (error, docum) => {
		if (req.body.sifecha == 0) {
			for (var i = docum.length - 1; i >= 0; i--) {
				if (docum[i].fecha == req.body.fecha && docum[i].proyecto == req.body.idproyecto) {
					ayuda = ayuda + 1
				}
			}
			if (ayuda >= 1) {
				res.send({ mensaje: "yaexiste" })
			} else {
				partediario.update({ _id: req.body.parte }, { $set: req.body }, (err, doc) => {
					bien.update({ _id: req.body.maquina }, { hodometro: req.body.hodometronuevo, horometro: req.body.horometronuevo }, (errq, doqc) => {
						res.send(doc)
					})


				})




			}
		} else {
			partediario.update({ _id: req.body.parte }, { $set: req.body }, (err, doc) => {
				bien.update({ _id: req.body.maquina }, { hodometro: req.body.hodometronuevo, horometro: req.body.horometronuevo }, (errq, doqc) => {
					res.send(doc)
				})


			})
		}

	})



})
router.post('/bien/listacosto', (req, res, next) => {
	costobien.find({ bien: req.body._id }).populate('proyecto').exec((err, doc) => {
		res.send(doc)
	})

})
router.post('/bien/listacostodiesel', (req, res, next) => {
	costodiesel.find({ bien: req.body._id }).populate('proyecto').exec((err, doc) => {
		res.send(doc)
	})

})
router.post('/bien/editarcosto', (req, res, next) => {

	costobien.update({ _id: req.body._id }, { precio: req.body.precio, moneda: req.body.moneda, tipo: req.body.tipo }, (err, doc) => {
		res.send(doc)
	})

})
router.post('/bien/editarcostodiesel', (req, res, next) => {

	costodiesel.update({ _id: req.body._id }, { precio: req.body.precio, moneda: req.body.moneda }, (err, doc) => {
		res.send(doc)
	})

})
router.post('/bien/costosproyectos', (req, res, next) => {

	var proy = []


	for (var i = req.body.proyectos.length - 1; i >= 0; i--) {
		proy.push(req.body.proyectos[i].value)
	}
	costobien.find({ proyecto: { $in: proy } }).populate('bien proyecto').exec((err, doc) => {
		costodiesel.find({ proyecto: { $in: proy } }).populate('bien proyecto').exec((errs, docs) => {
			res.send({ costobien: doc, costodiesel: docs })
		})
	})

})
router.post('/parte/descuento', (req, res, next) => {
	var y = {
		proyecto: req.body.proyecto[0].value,
		bien: req.body._id,
		precio: req.body.precio,
		tipo: req.body.motivo,
		fecha: req.body.fecha
	}
	var x = new descuento(y)
	x.save((err, doc) => {
		res.send(doc)
	})


})
router.post('/bien/suprevencion', (req, res, next) => {

	if (req.body.tipo == "hr") {
		var x = new prevencion({
			bien: req.body.bien._id,
			anticipacion: req.body.anticipacion,
			aviso: req.body.aviso,
			tipo: req.body.tipo,
			proximo: parseFloat(req.body.bien.horometro) + parseFloat(req.body.anticipacion),
			nombre: req.body.nombre
		})
	} else {
		var x = new prevencion({
			bien: req.body.bien._id,
			anticipacion: req.body.anticipacion,
			aviso: req.body.aviso,
			tipo: req.body.tipo,
			proximo: parseFloat(req.body.bien.hodometro) + parseFloat(req.body.anticipacion),
			nombre: req.body.nombre
		})
	}

	x.save((err, doc) => {
		res.send(doc)
	})



})
router.post('/bien/mirarprevencion1', (req, res, next) => {

	prevencion.find({ tz_lock: '0', bien: req.body._id }).populate('bien tareas').exec((err, doc) => {
		res.send(doc)
	})


})
router.post('/bien/mirarprevencion', (req, res, next) => {

	prevencion.find({ tz_lock: '0', bien: req.body._id }).populate('bien').exec((err, doc) => {
		res.send(doc)
	})


})
router.post('/navbar/minombre', (req, res, next) => {

	usuario.findOne({ _id: req.body.nombre }, (err, doc) => {
		res.send(doc)
	})


})
router.post('/preventivo/nuevo', (req, res, next) => {
	console.log(req.body)
	var x = new prevencion(req.body)

	x.save((err, doc) => {
		if (req.body.item) {
			item.update({ _id: req.body.item }, { $push: { preventivo: doc._id } }, (err1, doc1) => {
				res.send(doc)
			})
		} else {
			res.send(doc)
		}


	})

})
router.get('/auxiliar/listaGeneral', (req, res, next) => {
	console.log(req.body)
	auxiliar.find({}, (eer, doc) => {
		res.send(doc);
	})

})

router.get('/actualizacion/auxiliares', (req, res, next) => {
	console.log('empezara')
	// AQUI VA EL JSON CON TODO
	for (let index = 0; index < o.length; index++) {
		var x = {
			codigo: String(o[index].codigo).trim(),
			nombre: String(o[index].nombre).trim(),
			direccion: String(o[index].direccion).trim()
		}
		var y = new auxiliar(x)
		y.save();
	}
	res.send('ok')
})















router.get('/actualizacion1', (req, res, next) => {

	solicitud.find({ tz_lock: '0' }, (err, doc) => {
		for (var i = doc.length - 1; i >= 0; i--) {
			var t = []
			for (var ia = doc[i].imgs.length - 1; ia >= 0; ia--) {
				var x = String(doc[i].imgs[ia])
				var y = x.replace('http', 'https')
				t.push(y)
			}
			console.log(t)

			solicitud.update({ _id: doc[i]._id }, { $set: { imgs: t } }, (errs, docs) => {

			})
		}
		res.send("holas")
	})

})
router.post('/auxiliar/elMio', (req, res, next) => {
	console.log('llegaAuxilar', req.body)
	auxiliar.findOne({ codigo: req.body.mio }, (err, doc) => {
		res.send(doc)
	})

})
router.get('/notificaciones/personales/:id', (req, res, next) => {

	notificacion.find({ usuarios: { $nin: req.params.id } }, (err, doc) => {
		res.send(doc)
	});
})
router.get('/notificaciones/quitar/:id', (req, res, next) => {

	notificacion.update({}, { $addToSet: { usuarios: req.params.id } }, { multi: true }, (err, doc) => {
		res.send(doc)
	});
})
router.post('/notificaciones/yaLa', (req, res, next) => {
	console.log(req.body)
	notificacion.update({ _id: req.body.noti._id }, { $addToSet: { usuarios: req.body.usu } }, (err, doc) => {
		res.send(doc)
	})
})


router.post('/parte/buscar', (req, res, next) => {
	var auxiliar = 0
	console.log(req.body)
	if (req.body.proyectos.length >= 1 && req.body.bienes.length >= 1 && req.body.desde != undefined && req.body.hasta != undefined) {
		console.log("al primero")
		var des = fechas(req.body.desde)
		var has = fechas(req.body.hasta)
		var proy = []
		var bie = []

		console.log(des, has)

		for (var i = req.body.proyectos.length - 1; i >= 0; i--) {
			proy.push(req.body.proyectos[i].value)
		}
		for (var ii = req.body.bienes.length - 1; ii >= 0; ii--) {
			bie.push(req.body.bienes[ii].value)
		}

		partediario.find({ $and: [{ tz_lock: '0' }, { maquina: { $in: bie } }, { proyecto: { $in: proy } }, { fecha: { $gte: des } }, { fecha: { $lte: has } }] }).populate('proyecto maquina').exec((err, doc) => {

			descuento.find({ $and: [{ bien: { $in: bie } }, { proyecto: { $in: proy } }, { fecha: { $gte: des } }, { fecha: { $lte: has } }] }, (errs, docs) => {
				console.log(docs)
				otroIngreso.find({ $and: [{ bien: { $in: bie } }, { proyecto: { $in: proy } }, { fecha: { $gte: des } }, { fecha: { $lte: has } }] }, (falla, otro) => {
					var p = {
						parte: doc,
						descuento: docs,
						otro: otro

					}

					res.send(p)
				})

			})
		})

	} else if (req.body.proyectos.length >= 1 && req.body.bienes.length >= 1 && req.body.desde == undefined && req.body.hasta == undefined) {
		console.log("al segundo")
		var proy = []
		var bie = []
		for (var i = req.body.proyectos.length - 1; i >= 0; i--) {
			proy.push(req.body.proyectos[i].value)
		}
		for (var ii = req.body.bienes.length - 1; ii >= 0; ii--) {
			bie.push(req.body.bienes[ii].value)
		}

		partediario.find({ $and: [{ tz_lock: '0' }, { maquina: { $in: bie } }, { proyecto: { $in: proy } }] }).populate('proyecto maquina').exec((err, doc) => {
			res.send(doc)
			descuento.find({ $and: [{ bien: { $in: bie } }, { proyecto: { $in: proy } }] }, (errs, docs) => {
				otroIngreso.find({ $and: [{ bien: { $in: bie } }, { proyecto: { $in: proy } }, { fecha: { $gte: des } }, { fecha: { $lte: has } }] }, (falla, otro) => {
					var p = {
						parte: doc,
						descuento: docs,
						otro: otro

					}

					res.send(p)
				})
			})
		})
	} else if (req.body.proyectos.length >= 1 && req.body.bienes.length == 0 && req.body.desde == undefined && req.body.hasta == undefined) {
		console.log("al tercero")
		var proy = []
		var bie = []
		for (var i = req.body.proyectos.length - 1; i >= 0; i--) {
			proy.push(req.body.proyectos[i].value)
		}

		partediario.find({ $and: [{ tz_lock: '0' }, { proyecto: { $in: proy } }] }).populate('proyecto maquina').exec((err, doc) => {

			descuento.find({ $and: [{ proyecto: { $in: proy } }] }, (errs, docs) => {
				otroIngreso.find({ $and: [{ bien: { $in: bie } }, { proyecto: { $in: proy } }, { fecha: { $gte: des } }, { fecha: { $lte: has } }] }, (falla, otro) => {
					var p = {
						parte: doc,
						descuento: docs,
						otro: otro

					}

					res.send(p)
				})

			})
		})
	} else if (req.body.proyectos.length >= 1 && req.body.bienes.length == 0 && req.body.desde != undefined && req.body.hasta != undefined) {
		console.log("al cuarto")
		var des = fechas(req.body.desde)
		var has = fechas(req.body.hasta)
		var proy = []

		for (var i = req.body.proyectos.length - 1; i >= 0; i--) {
			proy.push(req.body.proyectos[i].value)
		}

		partediario.find({ $and: [{ tz_lock: '0' }, { proyecto: { $in: proy } }, { fecha: { $gte: des } }, { fecha: { $lte: has } }] }).populate('proyecto maquina').exec((err, doc) => {
			descuento.find({ $and: [{ proyecto: { $in: proy } }, { fecha: { $gte: des } }, { fecha: { $lte: has } }] }, (errs, docs) => {
				otroIngreso.find({ $and: [{ bien: { $in: bie } }, { proyecto: { $in: proy } }, { fecha: { $gte: des } }, { fecha: { $lte: has } }] }, (falla, otro) => {
					var p = {
						parte: doc,
						descuento: docs,
						otro: otro

					}

					res.send(p)
				})
			})

		})
	}











})


function cargarbien(x, y) {
	x.codigo = y

	var g = new bien(x)

	g.save((err, doc) => {

	})

}
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