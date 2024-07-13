
import { Request, Response } from 'express';
import axios from 'axios';
import { log, returnError } from '../utils/utils.ts';
import { IRFC, IRFCResponse } from '../interfaces/rfc.ts';

const URL:string   = process.env.NUFU_API_URL || ''
const token:string = process.env.NUFI_API_KEY || ''
const headers:Object  = {
  headers: {
    'Ocp-Apim-Subscription-Key':token
  }
}
const headers2:Object  = {
  headers: {
    'NUFI-API-KEY':token
  }
}

const getPersonalData = async (req:Request, res:Response) => {
  try {
    log('getPersonalData ', JSON.stringify(req.body))
    const { curp } = req.body
    
    const rfc:string = 'HOPE930625FK7'

    // Paso 1 Obtener el RFC
    // const rfc = await getRFC(curp)

    // Paso 2 Obtener el NSS
    const nss = await getNSS(curp)

    // Paso 3 Obtener informacion del SAT
    const sat = await getSATInformation(rfc)

    // Paso 4 Información laboral

    // Paso 5 Registro Público de Comercio (SIGER)

    // Paso 6 Registro Nacional de Profesiones
    
    const data = {
      sat,
      nss
    }
    return res.status(400).json(data)
  } catch (error:any) {
    log('[X] Auth > controller, getPersonalData', error.toString())
    res.status(500).json(returnError('Ocurrió un error'))
  }
}

// funcion para obtener el RFC
const getRFC = async(curp:string) => {
  try {
    const body:object = {
      "tipo_busqueda": "curp",
      "curp": curp
    }
    const response:IRFCResponse = await axios.post(`${URL}/Curp/v1/consulta`, body, headers)
    return response.data
  } catch (error:any) {
    log('[X] getRFC Error [X]', error.toString())
    return {}
  }
}

// funcion para obtener el NSS
const getNSS = async(curp:string) => {
  try {
    log('antes de enviar el request','')
    const response:any = await axios.get(`${URL}/numero_seguridad_social/v2/consultar?curp=${curp}&webhook=b753ce8e-9f31-49ae-8036-17c90d9f9ded`, headers2)
    log('getNSS ----->', JSON.stringify(response.data))
    return response.data
  } catch (error:any) {
    log('[X] getNSS Error [X]', error.toString())
    return {}
  }
}

const getSATInformation = async(rfc:string) => {
  try {
    const body:object = {
      "rfc": rfc
    }
    log('antes de enviar el request',JSON.stringify(body))
    const response:any = await axios.post(`${URL}/certificadosat/v1/consultar/consultar`, body, headers2)
    log('getSATInformation ----->', response.data)
    return response.data
  } catch (error:any) {
    log('[X] getSATInformation Error [X]', error.toString())
    return {}
  }
}

export {
  getPersonalData
}
