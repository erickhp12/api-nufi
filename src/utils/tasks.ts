'use strict'
import { Webhook } from "../models/webhookModel"
const { Op } = require("sequelize")
import axios from 'axios'
import { log } from '../utils/utils.ts'
import { Clients } from "../models/clientsModel"
import { WorkHistory } from "../models/workHistory.js"

const URL:string   = process.env.NUFU_API_URL || ''
const token:string = process.env.NUFI_API_KEY || ''

const headers2:Object  = {
    headers: {
      'NUFI-API-KEY':token
    }
  }

// Funcion que consulta el saldo de los proveedores
export const checkUUID = async () => { 
  try {
    log('inicia revision de uuid pendientes')

    // se obtienen todos los webhooks pendientes
    const pendingData:any = await Webhook.findAll({ where: { completed:false, retries: {[Op.lt]: 5} }})
    log(`Se obtienen ${pendingData.length} uuid pendientes`)

    for (let i = 0; i < pendingData.length; i++) {
      log('inicia revision de uuid pendientes')
        const { nss, historial } = await getStatus(pendingData[i].uuid_nss, pendingData[i].uuid_historial || '')
        log(`Se obtiene informacion del cliente con el uuid: ${pendingData[i].id}, nss: ${nss}, historial: ${historial}`)
        if (!nss || !historial) {
            log(`No se encontro informacion para el cliente con el uuid: ${pendingData[i].id}`)
            const webhookId:any = await Webhook.findOne({ where: { client_id: pendingData[i].client_id } })
            webhookId.retries = webhookId.retries + 1
            webhookId.save()
            return
        }
        
        // si se obtiene la informacion del nss se actualiza la base de datos
        if (nss) {
            const client:any = await Clients.findByPk(pendingData[i].client_id)
            client.nss = nss.info.numero_seguridad_social
            client.save()
        } if (historial) {
            const workHistory:any = await WorkHistory.findOne({ where: { client_id: pendingData[i].client_id } })
            if (!workHistory) await WorkHistory.create({ client_id: pendingData[i].client_id, jobs: historial.info })
            workHistory.jobs = historial.info
            workHistory.save()
        }
        if (nss && historial) await Webhook.update({ completed:true }, { where: { id: pendingData[i].id } })
    }
  } catch (error: any) {
    log(`[X] tasks > checkUUID: ${error.message}`) 
  }
}


const getStatus = async (uuid_nss:string, uuid_historial:string) => {
    try {
        const body:object = { uuid_nss, uuid_historial }
        log(`Se obtiene informacion del cliente con el uuid: ${uuid_nss}, ${uuid_historial}`)
        const { data }= await axios.post(`${URL}/numero_seguridad_social/v2/status`, body, headers2)
        log(`[getStatus response] data ${JSON.stringify(data)}`)
        return data.data
    } catch (error:any) {
        log(`[X] getStatus Error [X]: ${error.message}`)
        return {}
    }
}
