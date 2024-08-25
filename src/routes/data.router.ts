'use strict'

import { Router } from 'express';
import {
    registerCurp,
    registerRfc,
    getWebhookData,
    registerNss,
    registerSiger,
    registerProfessionalData,
    deleteProfessionalDataById,
    registerRugData,
    registerBlackList,
    registerJuditial,
    getNss
 } from '../controllers/data.controller.ts'

const router = Router()

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
    
router
    .get('/nss/:client_id', getNss)

router.delete('/professional-data/:id', deleteProfessionalDataById)


export default router
