'use strict'

import express, { Router } from 'express';
import { getPersonalData, getPersonalDataHardcoded } from '../controllers/data.controller.ts'

const router = Router()

router
    .post('/', getPersonalData)
    .get('/hardcoded', getPersonalDataHardcoded)

export default router
