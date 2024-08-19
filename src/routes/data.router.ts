'use strict'

import { Router } from 'express';
import {
    registerCurp,
    registerRfc,
    getWebhookData,
    registerNss,
    registerSiger,
    registerProfessionalData
 } from '../controllers/data.controller.ts'

const router = Router()

router
    // .post('/', getClient, getPersonalData)
    .post('/curp/:client_id', registerCurp)
    .post('/rfc/:client_id', registerRfc)
    .post('/nss/:client_id', registerNss)
    .post('/siger/:client_id', registerSiger)
    .post('/professional-data/:client_id', registerProfessionalData)
    .post('/webhook', getWebhookData)


export default router
