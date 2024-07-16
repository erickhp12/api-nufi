
import { Request, Response } from 'express';
import axios from 'axios';
import { log, returnError } from '../utils/utils.ts';
import { IRFC, IRFCResponse } from '../interfaces/rfc.ts';
import hardcodedData from '../../hardcoded.js';

const URL:string   = process.env.NUFU_API_URL || ''
const token:string = process.env.NUFI_API_KEY || ''
const judicialToken:string = process.env.NUFI_API_KEY_JUDITIAL || ''
const blacklistToken:string = process.env.NUFI_API_KEY_BLACKLIST || ''

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
    'NUFI-API-KEY':judicialToken
  }
}
const headers4:Object = {
  headers: {
    'NUFI-API-KEY':blacklistToken
  }
}

const getPersonalData = async (req:Request, res:Response) => {
  try {
    log('getPersonalData ', JSON.stringify(req.body))
    const { curp } = req.body
    
    const rfc:string = 'HOPE930625FK7'
    const nss:string = '33119354182'
    const fullName:string = 'Erick Fernando Holguin Pardavell'
    const firstName:string = 'Erick'
    const secondName:string = 'Fernando'
    const lastName:string = 'Holguin'
    const secondLastName:string = 'Pardavell'
    const names:string = 'Erick Fernando'
    const lastNames:string = 'Holguin Pardavell'
    const socialReason:string = 'arcadio hernandez macias'
    const state:string = 'Chihuahua'
    const phone:string = '526563364663'
    
    
    // Paso 1 Validar el CURP
    log('[1] - Inicia validateCurp', curp)
    const curpData = await validateCurp(curp)

    // Paso 2 Obtener el RFC
    log('[2] - incia getRFC', curp)
    const rfcData = await getRFC(curp)

    // Paso 3 Obtener el NSS
    log('[3] - Inicia getNSS', curp)
    const nssData = await getNSS(curp)

    // Paso 4 Obtener informacion del SAT
    log('[4] - Inicia getSATInformation', rfc)
    const satData = await getSATInformation(rfc)

    // Paso 5 Registro Público de Comercio (SIGER)
    log('[5] - Inicia getSIGER', fullName)
    const sigerData = await getSIGER(fullName)

    // Paso 6 Registro nacional de profesiones
    log('[6] - Inicia getProfesionalRecord', `firstName: ${firstName}, lastName: ${lastName}, secondLastName: ${secondLastName}`)
    const professionalData = await getProfesionalRecord(firstName, lastName, secondLastName)

    // Paso 7 Registro RUG (Registro Unico de Garantias Mobiliarias)
    log('[7] - Inicia getRUGInformation', `fullName: ${fullName}, curp: ${curp}, rfc: ${rfc}`)
    const rugData = await getRUGInformation(fullName, curp, rfc)

    // Paso 8 Obtener listas negras internacionales
    log('[8] - Inicia getBlackListInformation', `fullName: ${fullName}, firstName: ${firstName}, secondName: ${secondName}, lastName: ${lastName}`)
    const blackListData = await getBlackListInformation(fullName, firstName, secondName, lastName)

    // Paso 9 Obtener Contribuyentes boletinados del SAT 69B
    log('[9] - Inicia getSAT69B', rfc)
    const sat69BData = await getSAT69B(rfc)
    
    // Paso 10 Obtener Contribuyentes boletinados del SAT 69B
    log('[10] - Inicia getSAT74', `rfc: ${rfc}, socialReason: ${socialReason}, state: ${state}`)
    const sat74Data = await getSAT74(rfc, socialReason, state)

    // Paso 11 Obtener contribuyentes no localizados del SAT 69L
    log('[11] - Inicia getSAT69L', `rfc: ${rfc}, socialReason: ${socialReason}, state: ${state}`)
    const sat69LData = await getSAT69L(rfc, socialReason, state)

    // Paso 12 Obtener antecedentes judiciales
    log('[12] - Inicia getJuditialRecord', `firstName: ${firstName}, lastName: ${lastName}, secondLastName: ${secondLastName}`)
    const juditialData = await getJuditialRecord(firstName, lastName, secondLastName)

    // Paso 13 Obtener semanas cotizadas
    log('[13] - Inicia getWeeksWorked', `curp: ${curp}, nss: ${nss}`)
    const weeksWorkedData = await getWeeksWorked(curp, nss)
    
    // Paso 14 Obtener información de infonavit
    log('[14] - Inicia getInfonavitData','')
    const infonavitData = await getInfonavitData()

    // Paso 15 Obtener enriquecimiento de telefono
    log('[15] - Inicia getEnrichmentPhone', phone)
    const enrichmentDataPhone = await getEnrichmentPhone(phone)

    // Paso 16 Obtener enriquecimiento de nombre
    log('[16] - Inicia getEnrichmentName', `names: ${names}, lastNames: ${lastNames}`)
    const enrichmentNameData = await getEnrichmentName(names, lastNames)

    // Paso 17 Obtener noticias de google
    log('[17] - Inicia getGoogleNews', fullName)
    const googleData = await getGoogleNews(fullName)

    const data = {
      curpData,
      rfcData,
      nssData,
      satData,
      sigerData,
      professionalData,
      rugData,
      blackListData,
      sat69BData,
      sat74Data,
      sat69LData,
      juditialData,
      weeksWorkedData,
      infonavitData,
      enrichmentDataPhone,
      enrichmentNameData,
      googleData
    }
    return res.status(200).json(data)
  } catch (error:any) {
    log('[X] Auth > controller, getPersonalData', error.toString())
    res.status(500).json(returnError('Ocurrió un error'))
  }
}

const getPersonalDataHardcoded = (req:Request, res:Response) => {
  return res.status(200).json(hardcodedData)
}


const validateCurp = async(curp:string) => {
  try {
    const body:object = {
      'tipo_busqueda': 'curp',
      'curp': curp
    }
    const response = await axios.post(`${URL}/Curp/v1/consulta`, body, headers)
    return response.data
  } catch (error:any) {
    log('[X] validateCurp Error [X]', error.toString())
    return {}
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


const getNSS = async(curp:string) => {
  try {
    const response = await axios.get(`${URL}/numero_seguridad_social/v2/consultar?curp=${curp}`, headers2)
    return response.data
  } catch (error:any) {
    log('[X] getNSS Error [X]', error.toString())
    return {}
  }
}


const getSATInformation = async(rfc:string) => {
  try {
    const response:any = await axios.post(`${URL}/certificadosat/v1/consultar/consultar`, {rfc}, headers2)
    return response.data
  } catch (error:any) {
    log('[X] getSATInformation Error [X]', error.toString())
    return {}
  }
}


const getSIGER = async(fullName:string) => {
  try {
    const body:object = {
      'socio': fullName
    }
    const response:any = await axios.post(`${URL}/siger/v4/busqueda_socio`, body, headers2)
    return response.data
  } catch (error:any) {
    log('[X] getSIGER Error [X]', error.toString())
    return {}
  }
}


const getProfesionalRecord = async(name:string, lastName:string, secondLastName:string) => {
  try {
    const body:object = {
      'nombre': name,
      'apellido_paterno': lastName,
      'apellido_materno': secondLastName
    }
    const response:any = await axios.post(`${URL}/CedulaProfesional/consultar`, body, headers)
    return response.data
  } catch (error:any) {
    log('[X] getProfesionalRecord Error [X]', error.toString())
    return {}
  }
}


const getRUGInformation = async(fullName:string, curp:string, rfc:string) => {
  try {
    const body:object = {
      'descripcion_de_bienes': '',
      'nombre_otorgante': 'Erick Fernando Holguin Pardavell',
      'folio_electronico_otorgante': '',
      'numero_garantia_o_asiento': '',
      'curp_otorgante': '',
      'rfc_otorgante': ''
    }
    const response:any = await axios.post(`${URL}/rug/v3/consulta`, body, headers2)
    return response.data
  } catch (error:any) {
    log('[X] getProfesionalRecord Error [X]', error.toString())
    return {}
  }
}


const getBlackListInformation = async(fullName:string, firstName:string, secondName:string, lastNames:string) => {
  try {
    const body:object = {
      'nombre_completo': fullName,
      'primer_nombre': firstName,
      'segundo_nombre': secondName,
      'apellidos': lastNames,
      'fecha_nacimiento': '',
      'lugar_nacimiento': ''
    }
    const response:any = await axios.post(`${URL}/perfilamiento/v1/aml`, body, headers2)
    return response.data
  } catch (error:any) {
    log('[X] getProfesionalRecord Error [X]', error.toString())
    return {}
  }
}


const getSAT69B = async(rfc:string) => {
  try {
    const response:any = await axios.post(`${URL}/contribuyentes/v1/obtener_contribuyente`, {rfc}, headers)
    return response.data
  } catch (error:any) {
    log('[X] getSAT69B Error [X]', error.toString())
    return {}
  }
}


const getSAT74 = async(rfc:string, socialReason:string, state:string) => {
  try {
    const body:object = {
      'rfc': rfc,
      'razon_social': socialReason,
      'fecha_autorizacion': '11/09/2023',
      'fecha_publicacion': '19/10/2023',
      'entidad_federativa': state
    }
    const response:any = await axios.post(`${URL}/contribuyentes_74/v1/reduccion_multas`, body, headers2)
    return response.data
  } catch (error:any) {
    log('[X] getSAT74 Error [X]', error.toString())
    return {}
  }
}


const getSAT69L = async(rfc:string, socialReason:string, state:string) => {
  try {
    const body:object = {
      'rfc': rfc,
      'razon_social': socialReason,
      'fecha_publicacion': '01/01/2014',
      'entidad_federativa': state
    }
    const response:any = await axios.post(`${URL}/contribuyentes_69/v1/no_localizados`, body, headers2)
    return response.data
  } catch (error:any) {
    log('[X] getSAT69L Error [X]', error.toString())
    return {}
  }
}


const getJuditialRecord = async(name:string, lastName:string, secondLastName:string) => {
  try {
    const body:object = {
      'nombre': name,
      'paterno': lastName,
      'materno': secondLastName,
      'detalle': true,
      'estado': 'nacional'
    }
    const response:any = await axios.post(`${URL}/antecedentes_judiciales/v2/persona_fisica_nacional`, body, headers3)
    return response.data
  } catch (error:any) {
    log('[X] getJuditialRecord Error [X]', error.toString())
    return {}
  }
}


const getWeeksWorked = async(curp:string, nss:string) => {
  try {
    let detail:any = {}
    const response:any = await axios.get(`${URL}/numero_seguridad_social/v2/consultar_historial?curp=${curp}&nss=${nss}`, headers2)
    if (response.data && response.data.data && response.data.data.uuid) {
      detail = await getStatusNssHistory(response.data.data.uuid)
      console.log('detail', detail)
      return detail
    } else {
      return response.data
    }
  } catch (error:any) {
    log('[X] getWeeksWorked Error [X]', error.toString())
    return {}
  }
}


const getStatusNssHistory = async(uuid1:string) => {
  try {
    const body: object = {
      "uuid_nss": uuid1,
      "uuid_historial": uuid1
    }
    const response: any = await axios.post(`${URL}/numero_seguridad_social/v2/status`, body, headers2)
    return response.data
  } catch (error:any) {
    log('[X] getStatusNssHistory Error [X]', error.toString())
    return {}
  }
}

const getInfonavitData = async() => {
  try {
    const body:any = {
        'info_persona': { 'nss': '' },
        'webhook': ''
    }
    const response:any = await axios.post(`${URL}/credito_infonavit/v1/credito_infonavit`, body, headers2)
    return response.data
  } catch (error:any) {
    console.log('[X] getInfonavitData Error [X]', JSON.stringify(error))
    return {}
  }
}

const getEnrichmentPhone = async(phone:string) => {
  try {
    const body:object = {
      'telefono': phone
    }
    const response:any = await axios.post(`${URL}/enriquecimientoidentidades/v3/telefono`, body, headers4)
    return response.data
  } catch (error:any) {
    log('[X] getEnrichmentPhone Error [X]', error.message)
    return {}
  }
}


const getEnrichmentName = async(names:string, lastNames:string) => {
  try {
    const body:object = {
      nombre:names,
      apellidos:lastNames
    }
    const response:any = await axios.post(`${URL}/enriquecimientoidentidades/v3/nombre`, body, headers4)
    return response.data
  } catch (error:any) {
    log('[X] getEnrichmentName Error [X]', error.message)
    return {}
  }
}

const getGoogleNews = async(fullName:string) => {
  try {
    const body:object = {
      'consulta':fullName,
      'tipo_noticia':'news',
      'pagina':1,
      'numero_resultados': 5,
      'localizacion':'mx',
      'lenguaje':'es'
    }
    const response:any = await axios.post(`${URL}/noticias/v2/busqueda`, body, headers2)
    return response.data
  } catch (error:any) {
    log('[X] getGoogleNews Error [X]', error.message)
    return {}
  }
}

export {
  getPersonalData,
  getPersonalDataHardcoded
}
