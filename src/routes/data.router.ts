'use strict'

import express, { Router } from 'express';
import { getPersonalData } from '../controllers/data.controller.ts'

const router = Router()

router
    .post('/', getPersonalData)

export default router
