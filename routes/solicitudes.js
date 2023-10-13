const router = require('express').Router(),
    solicitud = require('../modelos/modelos').solicitud

router.post('/solicitudes/lista', async (req, res, next) => {



    if (req.body.page == -1) {
        let leng = await solicitud.find({$and: [{ tz_lock: '0' }, { estado: { $ne: 'concluido' } }, { estado: { $ne: 'rechazado' } }] }).countDocuments((err, doc) => { })
        let numberPages = Math.trunc(parseInt(leng) / parseInt(req.body.count))
        let page = parseInt(numberPages) * parseInt(req.body.count)
        let data = await solicitud.find({$and: [{ tz_lock: '0' }, { estado: { $ne: 'concluido' } }, { estado: { $ne: 'rechazado' } }] }).skip(page).limit(parseInt(req.body.count)).populate('maquina usuario').sort().exec()
        let numeroDodc = await solicitud.find({$and: [{ tz_lock: '0' }, { estado: { $ne: 'concluido' } }, { estado: { $ne: 'rechazado' } }] }).skip(page).limit(parseInt(req.body.count)).count().populate('maquina usuario').exec()
        res.status(200).send({
            large: leng,
            numberPages,
            page: numberPages,
            size: numeroDodc,
            data: data


        })
    } else {
        let page = parseInt(req.body.page) * parseInt(req.body.count)

        let leng = await solicitud.find({$and: [{ tz_lock: '0' }, { estado: { $ne: 'concluido' } }, { estado: { $ne: 'rechazado' } }]}).countDocuments((err, doc) => { })
        let data = await solicitud.find({$and: [{ tz_lock: '0' }, { estado: { $ne: 'concluido' } }, { estado: { $ne: 'rechazado' } }]}).skip(page).limit(parseInt(req.body.count)).populate('maquina usuario').sort().exec()
        let numberPages = Math.trunc(parseInt(leng) / parseInt(req.body.count))
        let numeroDodc = await solicitud.find({ $and: [{ tz_lock: '0' }, { estado: { $ne: 'concluido' } }, { estado: { $ne: 'rechazado' } }]}).skip(page).limit(parseInt(req.body.count)).count().populate('maquina usuario').exec()
        console.log(numeroDodc)
        res.status(200).send({
            large: leng,
            numberPages,
            page: req.body.page,
            size: numeroDodc,
            data: data


        })
    }


   
})

router.post('/solicitudes/listapersonal', async (req, res, next) => {

    

    if (req.body.page == -1) {
        let leng = await solicitud.find({$and: [{ tz_lock: '0' }, { estado: { $ne: 'concluido' } }, { estado: { $ne: 'rechazado' } }, { usuario: req.body.id }] }).countDocuments((err, doc) => { })
        let numberPages = Math.trunc(parseInt(leng) / parseInt(req.body.count))
        let page = parseInt(numberPages) * parseInt(req.body.count)
        let data = await solicitud.find({$and: [{ tz_lock: '0' }, { estado: { $ne: 'concluido' } }, { estado: { $ne: 'rechazado' } }, { usuario: req.body.id }] }).skip(page).limit(parseInt(req.body.count)).populate('maquina usuario').sort().exec()
        let numeroDodc = await solicitud.find({$and: [{ tz_lock: '0' }, { estado: { $ne: 'concluido' } }, { estado: { $ne: 'rechazado' } }, { usuario: req.body.id }] }).skip(page).limit(parseInt(req.body.count)).count().populate('maquina usuario').exec()
        res.status(200).send({
            large: leng,
            numberPages,
            page: numberPages,
            size: numeroDodc,
            data: data


        })
    } else {
        let page = parseInt(req.body.page) * parseInt(req.body.count)

        let leng = await solicitud.find({$and: [{ tz_lock: '0' }, { estado: { $ne: 'concluido' } }, { estado: { $ne: 'rechazado' } }, { usuario: req.body.id }]}).countDocuments((err, doc) => { })
        let data = await solicitud.find({$and: [{ tz_lock: '0' }, { estado: { $ne: 'concluido' } }, { estado: { $ne: 'rechazado' } }, { usuario: req.body.id }]}).skip(page).limit(parseInt(req.body.count)).populate('maquina usuario').sort().exec()
        let numberPages = Math.trunc(parseInt(leng) / parseInt(req.body.count))
        let numeroDodc = await solicitud.find({ $and: [{ tz_lock: '0' }, { estado: { $ne: 'concluido' } }, { estado: { $ne: 'rechazado' } }, { usuario: req.body.id }]}).skip(page).limit(parseInt(req.body.count)).count().populate('maquina usuario').exec()
        console.log(numeroDodc)
        res.status(200).send({
            large: leng,
            numberPages,
            page: req.body.page,
            size: numeroDodc,
            data: data


        })
    }


	
})




module.exports = router