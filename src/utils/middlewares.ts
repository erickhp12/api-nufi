import { log } from './utils'
import { Clients } from '../models/clientsModel'
import { Configurations } from '../models/configModel'

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


export async function setKeys (req:any, res:any, next:any) {
  try {
    const keys = await Configurations.findOne()
    req.keys = keys
    next()
  } catch (error:any) {
    log(`[X] setKeys [X] - ${error.message}`)
  }
}