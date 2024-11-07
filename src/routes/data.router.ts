'use strict'
import multer from 'multer';
import { Router } from 'express';
import {
    registerCurp,
    registerRfc,
    registerNss,
    registerSiger,
    registerProfessionalData,
    deleteProfessionalDataById,
    registerRugData,
    registerBlackList,
    registerJuditial,
    registerGoogle,
    getNss,
    readIdentification,
    deleteIdentificationById,
    readNss
 } from '../controllers/data.controller.ts'
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import { setKeys } from '../utils/middlewares.ts';

const router = Router()

const currentDate = moment().format('YYYY-MM-DD')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.mkdir(path.join(__dirname, `../../uploads/${currentDate}`), { recursive: true }, (err) => {
            if (err) console.log('Error al crear el directorio', err)
            console.log('Directorio creado correctamente')
            cb(null, `uploads/${currentDate}/`)
        })
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })


router
    // .post('/', getClient, getPersonalData)
    .post('/curp/:client_id', setKeys, registerCurp)
    .post('/rfc/:client_id', setKeys, registerRfc)
    .post('/nss/:client_id', setKeys, registerNss)
    .post('/siger/:client_id', setKeys, registerSiger)
    .post('/professional-data/:client_id', setKeys, registerProfessionalData)
    .post('/rug-data/:client_id', setKeys, registerRugData)
    .post('/blacklist/:client_id', setKeys, registerBlackList)
    .post('/juditial/:client_id', setKeys, registerJuditial)
    .post('/google/:client_id', setKeys, registerGoogle)
    
router
    .get('/nss/:client_id', getNss)
    .post('/mindee-identification/:client_id', upload.single('file'), readIdentification)
    .post('/mindee-nss/:client_id', upload.single('file'), readNss)

router.delete('/professional-data/:id', deleteProfessionalDataById)
router.delete('/identification/:id', deleteIdentificationById)


export default router
