'use strict'

import { Router } from 'express';
import { getProfile } from '../controllers/users.controller';

const router = Router()

router.get('profile/:id', getProfile)

export default router
