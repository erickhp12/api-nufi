'use strict'
import { Router } from 'express';
import {
    getNufiHistoryLogs,
    getConfigs,
    updateConfig
 } from '../controllers/nufi.controller.ts'

const router = Router()

router
    .get('/logs', getNufiHistoryLogs)
    .get('/configs', getConfigs)

router
    .put('/configs', updateConfig)

export default router
