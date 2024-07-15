
import { Request, Response } from 'express';
import axios from 'axios';
import { log, returnError } from '../utils/utils.ts';
import { IRFC, IRFCResponse } from '../interfaces/rfc.ts';
import { json } from 'stream/consumers';

const URL:string   = process.env.NUFU_API_URL || ''
const token:string = process.env.NUFI_API_KEY || ''
const judicialRecordsToken:string = process.env.NUFI_API_JUDICIALKEY || ''
const dataToken:string = process.env.NUFI_API_DATAKEY || ''
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
const headers3:Object = {
  headers: {
    'NUFI-API-KEY':judicialRecordsToken
  }
}
const headers4:Object = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'NUFI-API-KEY':dataToken 
  }
}

const getPersonalData = async (req:Request, res:Response) => {
  try {
    log('getPersonalData ', JSON.stringify(req.body))
    const { nombre} = req.body
    
    //const rfc:string = 'HOPE930625FK7'

    // Paso 1 Obtener el RFC
    //const rfc = await getRFC(curp)

    // Paso 2 Obtener el NSS
    //const nssData = await getNSSStatus(curp,nss)

    // Paso 3 Obtener informacion del SAT
    //const sat = await getSATInformation(rfc)

    // Paso 4 Historial laboral
    //const history = await getEmploymentHistory(curp,nss);

    // Paso 5 Antecedentes Judiciales
    //const judicialRecords = await getJudicialRecords(nombre,paterno,materno);

    // Paso 6 Registro Público de Comercio (SIGER)
    //const SIGER = await getSIGER(nombre);

    // Paso 7 Huella digital
    const huella = await getDigitalFootprint(nombre);

    
    const data = {
      huella
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



const getSATInformation = async(rfc:string) => {
  try {
    const body:object = {
      "rfc": rfc
    }
    log('antes de enviar el request',JSON.stringify(body))
    const response:any = await axios.post(`${URL}/certificadosat/v1/consultar/consultar`, body, headers2)
    log('getSATInformation ----->', JSON.stringify(response.data))
    return response.data
  } catch (error:any) {
    log('[X] getSATInformation Error [X]', error.toString())
    return {}
  }
}

const getNSSStatus = async(curp:string,nss:string) =>{
  let uuid1:string
  let uuid2:string
  
  //Primero se saca el UUID de el nss
  try {
    log('antes de enviar el request N1', '')
    const response:any = await axios.get(`${URL}/numero_seguridad_social/v2/consultar?curp=${curp}&webhook=b753ce8e-9f31-49ae-8036-17c90d9f9ded`, headers2)
    log('getNSS ----->', JSON.stringify(response.data))
    uuid1 = response.data.data ? response.data.data.uuid : "";
    if (uuid1 != "") {
      console.log(uuid1);
    } else {
      console.error('UUID no encontrado en response.data');
      return{}
    }
    log(uuid1,'');
  } catch (error:any) {
    log('[X] Error while getting nss uuid [X]', error.toString())
    return {}
  }

  //Despues el UUID de el historial judicial
  try {
    log('antes de enviar el request N2', '')
    const response:any = await axios.get(`${URL}/numero_seguridad_social/v2/consultar_historial?curp=${curp}&nss=${nss}&webhook=b753ce8e-9f31-49ae-8036-17c90d9f9ded`, headers2)
    log('getHistory ----->', response.data)
    uuid2 = response.data.data ? response.data.data.uuid : "";
    if (uuid2 != "") {
      console.log(uuid2);
    } else {
      console.error('UUID no encontrado en response.data');
      return{}
    }
    log(uuid2,'');
  } catch (error:any) {
    log('[X] Error while getting records uuid  [X]', error.toString())
    return {}
  }

  //Al ultimo se hace la consulta con los uuid recibidos
  try {
    const body: object = {
      "uuid_nss": uuid1,
      "uuid_historial": uuid2
    }
    log(`UUIDS ${JSON.stringify(body)}`,'')
    const response:any = await axios.post(`${URL}/numero_seguridad_social/v2/status`, body, headers2)
    log('getStatus ----->', JSON.stringify(response.data))
    return response.data
  } catch (error:any) {
    log('[X] Error while getting nss status [X]', error.toString())
    return {}
  }
}

const getJudicialRecords = async(name:string,firstSurname:string,lastSurname:string)=>{
  try {
    const body:object = {
      "nombre": name,
      "paterno": firstSurname,
      "materno": lastSurname,
    }
    const response:any = await axios.post(`${URL}/antecedentes_judiciales/v2/persona_fisica_nacional`, body, headers3)
    log('getJudicialRecords ----->', JSON.stringify(response.data))
    return response.data
  } catch (error:any) {
    log('[X] getJudicialRecords Error [X]', error.toString())
    return {}
  }
}

const getSIGER = async(fullName:string)=>{
  try {
    const body:object = {
      "socio": fullName,
    }
    const response:any = await axios.post(`${URL}/siger/v4/busqueda_socio`, body, headers2)
    log('getSIGER ----->', JSON.stringify(response.data))
    return response.data
  } catch (error:any) {
    log('[X] getSIGER Error [X]', error.toString())
    return {}
  }
}

const getDigitalFootprint = async(fullName: string)=>{
  try {
    const body:object = {
      "nombre_completo": fullName
    }
    log(JSON.stringify(body),'')
    const response:any = await axios.post(`${URL}/enriquecimientoidentidades/v3/nombre`, body, headers4)
    log('getDigitalFootprint ----->', JSON.stringify(response.data))
    return response.data
  } catch (error:any) {
    log('[X] getDigitalFootprint Error [X]', error.toString())
    return {}
  }
}

export {
  getPersonalData
}
