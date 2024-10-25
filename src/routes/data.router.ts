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
    deleteIdentificationById
 } from '../controllers/data.controller.ts'
import moment from 'moment';
import fs from 'fs';
import path from 'path';

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
    .post('/curp/:client_id', registerCurp)
    .post('/rfc/:client_id', registerRfc)
    .post('/nss/:client_id', registerNss)
    .post('/siger/:client_id', registerSiger)
    .post('/professional-data/:client_id', registerProfessionalData)
    .post('/rug-data/:client_id', registerRugData)
    .post('/blacklist/:client_id', registerBlackList)
    .post('/juditial/:client_id', registerJuditial)
    .post('/google/:client_id', registerGoogle)
    
router
    .get('/nss/:client_id', getNss)
    .post('/mindee-identification/:client_id', upload.single('file'), readIdentification)

router.delete('/professional-data/:id', deleteProfessionalDataById)
router.delete('/identification/:id', deleteIdentificationById)


export default router
