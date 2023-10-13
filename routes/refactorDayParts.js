const router = require('express').Router()

router.get('/parts/summary', async (req, res, next) => {
    var x = new Date()
    var y = x.getFullYear() + "-" + ("0" + x.getMonth()).slice(-2) + "-" + ("0" + x.getDate()).slice(-2)
   
    try {
        const totalDocumentos = await partediario.countDocuments({});

        const fechaEspecifica = new Date('2023-10-01'); // Fecha en formato ISO (año-mes-día)
        const estadoHabilitado = true;

        const totalDocumentosEspecificos = await partediario.countDocuments({ fecha: y, tz_lock: '0' });

        const datosTotales = {
            todos: totalDocumentos,
            dia: totalDocumentosEspecificos
        };

        res.json(datosTotales);
    } catch (error) {
        console.error('Error al obtener los datos totales', error);
        res.status(500).json({ error: 'Error al obtener los datos totales' });
    }
})


router.post('/parts/unique', (req, res, next) => {


	partediario.find({ tz_lock: '0', maquina: req.body.maquina }).populate('operador maquina proyecto').exec((err, doc) => {
		res.send(doc)
	})


});



module.exports = router