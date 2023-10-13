const
	express = require('express'),
	body = require('body-parser'),
	morgan = require('morgan')
app = express()
path = require('path'),
	rou1 = require('./routes/principal.js')
	rou2 = require('./routes/partesDiarias.js')
	rou3 = require('./routes/solicitudes.js')
server = require('http').Server(app);
cors = require('cors')
session = require('express-session'),
	cookie = require('cookie-parser'),
	cookiesession = require('cookie-session')


var io = require('socket.io')(server)
exec = require('child_process').exec;



app.set('port', process.env.PORT || 3000)
app.use(cors())
app.use(morgan('dev'))
app.use(cookie())

app.use("/cel", function (req, res, next) {




	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(session({
	secret: 'SC',
	resave: false,
	saveUninitialized: false

}))
app.use(body.json({ limit: 1024 * 1024 * 20 }))
app.use(body.urlencoded({ extended: false, limit: 1024 * 1024 * 20, }));

//static files
app.use(express.static(path.join(__dirname, 'ang/casagrande/dist/casagrande')))
//app.use(express.static(path.join(__dirname, 'elite-angular-lite/dist')))
//app.use(express.static(path.join(__dirname, 'angular/views/dist/views')))

//static server
//routes



app.get('/hola', (req, res) => {
	res.end("hola")
})

//app.use(rutas);
app.use('/Solicitud', rou3)
app.use('/', rou1)
app.use('/partes', rou2)


var conexiones = []
var usuarios = []
io.on('connection', function (socket) {
	conexiones.push(socket)
	console.log('cliente conectado', conexiones.length)


	socket.on('solicitud', function (data) {
		io.sockets.emit('ver', data)


	})
	socket.on('partenuevo', function (data) {
		io.sockets.emit('parteactualizado', data)


	})
	socket.on('nuevopreventivo', function (data) {
		io.sockets.emit('actualizarprevencion', data)


	})
	socket.on('cerrarorden', function (data) {
		io.sockets.emit('actualizarprevencion', data)


	})

	socket.on('nueva', function (data) {
		io.sockets.emit('otrasolicitud', data)


	})
	socket.on('cambios', function (data) {
		io.sockets.emit('cel', data)
		console.log("celular mensaje")
	})

	//disconect

	socket.on('disconnect', function () {
		io.emit('user disconnected');
		conexiones.splice(conexiones.indexOf(socket), 1)
		console.log("desconectado", conexiones.length)
	});
})

//verificador
function caminata(recorrido) {
	var x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	var y = []
	var aux = 0
	var aux1 = 0
	for (var i = x.length - 1; i >= 0; i--) {
		y.push(x)
	}
	for (var ia = 0; ia <= recorrido.length - 1; ia++) {
		if (recorrido[ia] == 'n') {
			aux = aux + 1
		}
		if (recorrido[ia] == 's') {
			aux = aux - 1
		}
		if (recorrido[ia] == 'e') {
			aux = aux - 1
		}
		if (recorrido[ia] == 'o') {
			aux = aux - 1
		}
	}
	console.log(aux, aux1)
	if (aux == 0 && aux1 == 0) {
		return true
	} else {
		return false
	}

	// Ingresa tu código acá



}
server.listen(app.get('port'), () => {
	console.log(caminata(["n", "n", "n", "s", "n", "s", "n", "s", "n", "s"]
	))
	console.log("servidor escuchando" + app.get('port'))
})