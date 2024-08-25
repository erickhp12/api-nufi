'use strict'

import { Router } from 'express';
import {
    login,
    signUp
 } from '../controllers/auth.controller.ts'

const router = Router()

router
    .post('/login', login)
    .post('/signup', signUp)
    
export default router
