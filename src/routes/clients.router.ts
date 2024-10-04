'use strict'

import { Router } from 'express';
import {
    createClient,
    getClients,
    getClientDetail,
    getIdByCurp,
    updateClient,
    deleteClient
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

router
    .delete('/:id', deleteClient)

export default router
