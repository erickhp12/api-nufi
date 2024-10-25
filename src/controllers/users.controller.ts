const { Op } = require('sequelize');
import { Request, Response } from 'express'
import { log, returnError, returnSuccess } from '../utils/utils.ts'
import { Users } from '../models/usersModel.js'


export const getProfile = async (req:Request, res:Response) => {
  log(`Inicia getProfile ${req.params.id}`)
  const userFromDB:any = await Users.findOne({
    where: { username: req.params.id },
    attributes: [
      'id',
      'name',
      'username',
      'phone',
      'email',
      'user_role',
      'is_active',
      'createdAt'
    ]
  })
  console.log(`user: ${JSON.stringify(userFromDB)}`)
  return res.status(200).json(returnSuccess('Información obtenida correctamente', userFromDB, 1))
}
