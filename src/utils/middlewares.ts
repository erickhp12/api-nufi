import { log } from './utils'
import { Clients } from '../models/clientsModel'
import { NextFunction } from 'express'

export async function getClient (req:any, res:any, next:any) {
  try {
    const { curp } = req.body
    const client = await Clients.findOrCreate({ where: { curp }, limit: 1 }).then((client:any) => client[0].dataValues)
    req.client = client
    next()
  } catch (error:any) {
    log(`[X] getClient [X] - ${error.message}`)
  }
}
