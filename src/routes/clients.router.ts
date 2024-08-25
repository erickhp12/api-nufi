'use strict'

import { Router } from 'express';
import {
    createClient,
    getClients,
    getClientDetail,
    getIdByCurp,
    updateClient
} from '../controllers/clients.controller.ts'

const router = Router()

router
    .post('/', createClient)

router
    .get('/', getClients)
    .get('/:id', getClientDetail)
    .get('/get-id-by-curp/:id', getIdByCurp)

router
    .put('/:id', updateClient)

export default router
