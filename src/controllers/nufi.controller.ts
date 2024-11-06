
import { Request, Response } from 'express'
import { log, returnError, returnSuccess, sleep } from '../utils/utils.ts'

import { NufiHistoryLogs } from '../models/nufiHistoryLogsModel.js';
import { Configurations } from '../models/configModel.js';


export const getNufiHistoryLogs = async (req:Request, res:Response) => {
  try {
    const logs = (await NufiHistoryLogs.findAll()).sort((a:any, b:any) => b.id - a.id)
    return res.json(returnSuccess('Información recibida correctamente', logs, logs.length))
  } catch(error:any) {
    return res.status(500).json(returnError(`Ocurrió un error al obtener los datos ${error.toString()}`))
  }
}


export const getConfigs = async (req:Request, res:Response) => {
  try {
    const data = await Configurations.findOne()
    return res.json(returnSuccess('Información recibida correctamente', data, 1))
  } catch(error:any) {
    return res.status(500).json(returnError(`Ocurrió un error al obtener los datos ${error.toString()}`))
  }
}


export const updateConfig = async (req:Request, res:Response) => {
  try {
    log(`updateConfig ${JSON.stringify(req.body)}`)
    const data:any = await Configurations.findOne()
    data.mindeeKey = req.body.mindeeKey
    data.nufiKeyGeneral = req.body.nufiKeyGeneral
    data.nufiKeyJuditial = req.body.nufiKeyJuditial
    data.nufiKeyBlacklist = req.body.nufiKeyBlacklist
    data.save()
    return res.json(returnSuccess('Información actualizada correctamente', data, 1))
  } catch(error:any) {
    return res.status(500).json(returnError(`Ocurrió un error al actualizar los datos ${error.toString()}`))
  }
}
