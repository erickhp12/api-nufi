
import { Request, Response } from 'express'
import axios from 'axios'
import fs from 'fs';
const path = require('path');
const mindee = require("mindee");

import { fixAccents, fixAccentsInObject, log, returnError, returnSuccess, sleep } from '../utils/utils.ts'
import { Curp } from '../models/curpModel.js'
import { Clients } from '../models/clientsModel.js'
import moment from 'moment'
import { Webhook } from '../models/webhookModel.js'
import { Certificates } from '../models/satModel.js'
import { Rfc } from '../models/rfcModel.js'
import { Siger } from '../models/sigerModel.js'
import { ProfessionalData } from '../models/professionalModel.js'
import { RugData } from '../models/rugModel.js'
import { BlackList } from '../models/blackListModel.js'
import { Juditial } from '../models/juditialModel.js'
import { WorkHistory } from '../models/workHistory.js'
import { MindeeIdentification } from '../models/mindeeIdentificationModel.js';
import { Configurations } from '../models/configModel.js';
import { Google } from '../models/googleModel.js';

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

const dataMinee:any = {
  givenNames: [
    {
      value: 'ERICK',
      reconstructed: false,
      polygon: [],
      confidence: 0,
    },
    {
      value: 'FERNANDO',
      reconstructed: false,
      polygon: [],
      confidence: 0,
    }
  ],
  surnames: [
     {
      value: 'HOLGUIN',
      reconstructed: false,
      polygon: [],
      confidence: 0,
    },
     {
      value: 'PARDAVELL',
      reconstructed: false,
      polygon: [],
      confidence: 0,
    }
  ],
  address:  {
    value: 'CAUREA SUR 6716 FRACC AUREA RESIDENCIAL 32659 JUAREZ,CHIH.',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  birthDate: {
    value: '1993-06-25',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  birthPlace:  {
    value: undefined,
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  countryOfIssue:  {
    value: 'MEX',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  documentNumber:  {
    value: 'HLPRER93062524H200',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  documentType: {
    value: 'VOTER_REGISTRATION',
    reconstructed: false,
    confidence: 0
  },
  expiryDate: {
    value: '2032-03-01',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  issueDate: {
    value: undefined,
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  mrzLine1:  {
    value: undefined,
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  mrzLine2:  {
    value: undefined,
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  mrzLine3:  {
    value: undefined,
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  nationality:  {
    value: 'MEX',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  personalNumber:  {
    value: 'HOPE930625HSPLRR01',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  sex:  {
    value: 'M',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  },
  stateOfIssue:  {
    value: 'CHIH',
    reconstructed: false,
    polygon: [],
    confidence: 0,
  }
}


export const registerCurp = async (req:any, res:Response) => {
  try {
    log(`Inicia método registerCurp: ${JSON.stringify(req.body)}`)
    const { curp } = req.body
    if (!curp) return res.status(400).json(returnError('El campo CURP es requerido'))
    
    const { client_id } = req.params
    if (!client_id) return res.status(400).json(returnError('El campo client_id es requerido'))

    const curpFromDB:any = await Curp.findOne({ where: { client_id: client_id }})
    if (curpFromDB) return res.status(200).json(returnSuccess('El CURP obtenido correctamente', {}, 1))
    
    const { data } = await axios.post(`${URL}/Curp/v1/consulta`, { 'tipo_busqueda': 'curp', curp }, headers)
    log(`[validateCurp response] Response: ${JSON.stringify(data)}`)
    const curpCreated = await Curp.create({
      client_id: client_id, 
      curp: data.data.curpdata[0].curp,
      nombres: data.data.curpdata[0].nombres || '',
      apellidos: `${data.data.curpdata[0].primerApellido} ${data.data.curpdata[0].segundoApellido}` || '',
      sexo: data.data.curpdata[0].sexo,
      claveEntidad: data.data.curpdata[0].claveEntidad,
      statusCurp: data.data.curpdata[0].statusCurp,
      entidad: data.data.curpdata[0].entidad,
      entidadRegistro: data.data.curpdata[0].datosDocProbatorio.entidadRegistro,
      claveMunicipioRegistro: data.data.curpdata[0].datosDocProbatorio.claveMunicipioRegistro,
      anioReg: data.data.curpdata[0].datosDocProbatorio.anioReg,
      claveEntidadRegistro: data.data.curpdata[0].datosDocProbatorio.claveEntidadRegistro,
      numActa: data.data.curpdata[0].datosDocProbatorio.numActa,
      libro: data.data.curpdata[0].datosDocProbatorio.libro,
      municipioRegistro: data.data.curpdata[0].datosDocProbatorio.municipioRegistro
    })
    log(`curpCreated: ${JSON.stringify(curpCreated)}`)
    if (data.data.curpdata[0]) {
      const client:any = await Clients.findByPk(client_id)
      client.name = data.data.curpdata[0].nombres.split(' ')[0]
      client.secondName = data.data.curpdata[0].nombres.split(' ')[1]
      client.lastName = data.data.curpdata[0].primerApellido
      client.secondLastName = data.data.curpdata[0].segundoApellido
      client.state = data.data.curpdata[0].entidad
      client.dob = new Date(`${data.data.curpdata[0].curp.substring(6, 8)}/${data.data.curpdata[0].curp.substring(8, 10)}/${data.data.curpdata[0].curp.substring(4, 6)}`)
      client.save()
    }
    log(`[1.1] - client after fillData: ${client_id}`)
    return res.status(201).json(returnSuccess('CURP creado correctamente', {}, 1))
  } catch (error:any) {
    log(`[X] data > controller, getCurp [X]: ${error.message}`)
    return res.status(500).json(returnError(`Ocurrió un error al obtener el CURP: ${error.message}`))
  }
}


export const registerRfc = async (req:any, res:Response) => {
  try {
    log(`Inicia registerRfc ${JSON.stringify(req.body)}`)
    let { rfc } = req.body
    await sleep(5000)
    const { client_id } = req.params
    const clientFromDB:any = await Clients.findByPk(client_id)
    
    const rfcFromDB:any = await Rfc.findOne({ where: { client_id: client_id }})

    if (rfcFromDB && rfcFromDB.valid) return res.status(200).json(returnSuccess('RFC Obtenido correctamente', {}, 1))
    
    // si no se recibe el RFC se consulta con NUFI
    if (!rfc) {
      log('[1] - No se recibio RFC incia método getRFC')
      try {
        const body:object = {
          nombres: `${clientFromDB.name} ${clientFromDB.secondName}`,
          apellido_paterno: clientFromDB.lastName,
          apellido_materno: clientFromDB.secondLastName,
          fecha_nacimiento: moment(clientFromDB.dob).format('DD/MM/YYYY')
        }
        log(`[getRFC] URL: ${URL}/api/v1/calcular_rfc, body: ${JSON.stringify(body)}`)
        const { data }:any = await axios.post(`${URL}/api/v1/calcular_rfc`, body, headers)
        log(`[getRFC] Response: ${JSON.stringify(data)}`)
        
        if (data.status === 'success') {
          clientFromDB.rfc = data.data.rfc
          clientFromDB.save()
          await Rfc.create({ client_id: clientFromDB.id, rfc: data.data.rfc })
        }
      } catch (error:any) {
        log(`[X] getRFC Error [X]: ${error.message}`)
        return res.status(500).json(returnError('Ocurrió un error interno al registrar el RFC'))
      }
    }
    
    try {
      log(`[2] - se registró el RFC correctamente, inicia validateRFC: ${clientFromDB.rfc}`)
      const { data }:any = await axios.post(`${URL}/estatusrfc/valida`, {rfc: clientFromDB.rfc}, headers)
      log(`validateRFC data: ${JSON.stringify(data)}`)
      log(`validateRFC message: ${JSON.stringify(data.message)}`)
      const RFCFromDB2:any = await Rfc.findOne({ where: { client_id: client_id }})
      RFCFromDB2.message = data.message
      RFCFromDB2.valid = true
      RFCFromDB2.save()
    } catch (error:any) {
      log(`[X] getRfc Error al guardar el RFC [X]: ${error.message}`)
      return res.status(500).json(returnError('Ocurrió un error interno al validar el RFC'))
    }
    
    return res.status(201).json(returnSuccess('RFC registrado correctamente', {}, 1))
  } catch (error:any) {
    log(`[X] data > controller, getRfc [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error al obtener el CURP'))
  }
}


export const registerNss = async (req:any, res:Response) => {
  log(`Inicia registerNss ${JSON.stringify(req.body)}`)
  const { curp } = req.body
  const { client_id } = req.params
  
  const nssFromDB:any = await Webhook.findOne({ where: { client_id: client_id }})
  log(`nssFromDB: ${JSON.stringify(nssFromDB)}`)
  if (nssFromDB) return res.status(200).json(returnSuccess('NSS Solicitado anteriormente', {}, 1))
  
  try {
    log(`inicia solicitud de NSS, curp: ${curp}`)
    const { data } = await axios.get(`${URL}/numero_seguridad_social/v2/consultar?curp=${curp}`, headers2)
    log(`Respuesta directa de consulta de NSS: ${JSON.stringify(data)}`)
    await Webhook.create({ client_id: client_id, uuid_nss: data.data.uuid })
    
    return res.status(201).json(returnSuccess('NSS registrado correctamente', {}, 1))
  } catch (error:any) {
    log(`[X] data > controller, Error al guardar el NSS [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al validar el NSS'))
  }
}


export const registerSiger = async (req:any, res:Response) => {
  log(`Inicia registerSiger ${JSON.stringify(req.body)}`)
  const { client_id } = req.params
  
  const sigerFromDB:any = await Siger.findAll({ where: { client_id: client_id }})
  log(`Se busca desde la base de datos: ${JSON.stringify(sigerFromDB)}`)
  if (sigerFromDB.length > 0) return res.status(200).json(returnSuccess('Información obtenida correctamente', {}, 1))
  
  try {
    log(`No existe en BD: Inicia consulta ${client_id}`)
    const clientFromDB:any = await Clients.findByPk(client_id)
    const body:object = {
      'socio': `${clientFromDB.name} ${clientFromDB.secondName} ${clientFromDB.lastName} ${clientFromDB.secondLastName}`
    }
    log(`Antes de enviar a consultar a nufi SIGER: ${JSON.stringify(body)}`)
    const responseFromApi:any = await axios.post(`${URL}/siger/v4/busqueda_socio`, body, headers2)
    log(`Respuesta directa de consulta de SIGER: ${JSON.stringify(responseFromApi.data)}`)

    if (responseFromApi && responseFromApi.data.count === 0) {
      await Siger.create({ client_id: client_id, commerces: {} })
    } else {
      responseFromApi.data.data.forEach(async (item:any) => {
        await Siger.create({ client_id: client_id, commerces: item })
      });
    }
    
    return res.status(201).json(returnSuccess('SIGER registrado correctamente', {}, 1))
  } catch (error:any) {
    log(`[X] data > controller, registerSiger Error al guardar los datos del SIGER [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al obtener los datos del SIGER'))
  }
}


export const registerProfessionalData = async (req:any, res:any) => {
  log(`Inicia registerProfessionalData ${JSON.stringify(req.body)}`)
  const { client_id } = req.params
  
  const professionalData:any = await ProfessionalData.findAll({ where: { client_id: client_id }})
  log(`Se busca desde la base de datos: ${JSON.stringify(professionalData)}`)
  if (professionalData.length > 0) return res.status(200).json(returnSuccess('Información obtenida correctamente 2', {}, 1))
  
  try {
    log(`No existe en BD: Inicia consulta ${client_id}`)
    const clientFromDB:any = await Clients.findByPk(client_id)

    const body:object = {
      'nombre': `${clientFromDB.name} ${clientFromDB.secondName}`,
      'apellido_paterno': clientFromDB.lastName,
      'apellido_materno': clientFromDB.secondLastName
    }
    log(`Antes de enviar a consultar a nufi registerProfessionalData: ${JSON.stringify(body)}`)
    const responseFromApi:any = await axios.post(`${URL}/CedulaProfesional/consultar`, body, headers)
    log(`Respuesta directa de consulta de CedulaProfesional: ${JSON.stringify(responseFromApi.data)}`)
    
    
    responseFromApi.data.data.forEach(async (item:any) => {
      // Validacion solicitada por Alan para evitar ingresar datos incorrectos: no introducir cedulas de profesionales menores a 15 años de la edad del candidato
      if (item.fechaRegistro > moment(clientFromDB.dob).format('YYYY') + 15) {
        await ProfessionalData.create({ client_id: client_id, data: item })
      }
    });
    return res.status(201).json(returnSuccess('Datos de profesión registrados correctamente', {}, 1))
  } catch (error:any) {
    log(`[X] data > controller, registerProfessionalData Error al guardar los datos de profesión [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al obtener los datos de profesión'))
  }
}


export const deleteProfessionalDataById = async (req:any, res:any) => {
  log(`Inicia deleteProfessionalDataById ${JSON.stringify(req.body)}`)
  try {
    const professionalData:any = await ProfessionalData.findByPk(req.params.id)
    professionalData.destroy()
    return res.status(200).json(returnSuccess('Elemento eliminado correctamente', {}, 1))
  } catch (error:any) {
    log(`[X] data > controller, deleteProfessionalDataById Error al eliminar el registro los datos de profesión [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al eliminar los datos de profesión'))
  }
}


export const registerRugData = async (req:any, res:any) => {
  log(`Inicia registerRugData ${JSON.stringify(req.body)}`)
  const { client_id } = req.params
  
  const rugData:any = await RugData.findAll({ where: { client_id: client_id }})
  log(`Se busca desde la base de datos: ${JSON.stringify(rugData)}`)
  if (rugData.length > 0) return res.status(200).json(returnSuccess('Información obtenida correctamente', {}, 1))
  
  try {
    log(`No existe en BD: Inicia consulta ${client_id}`)
    const clientFromDB:any = await Clients.findByPk(client_id)

    const body:object = {
      'descripcion_de_bienes': '',
      'nombre_otorgante': `${clientFromDB.name} ${clientFromDB.secondName} ${clientFromDB.lastName} ${clientFromDB.secondLastName}`,
      'folio_electronico_otorgante': '',
      'numero_garantia_o_asiento': '',
      'curp_otorgante': '',
      'rfc_otorgante': ''
    }
    log(`Antes de enviar a consultar a nufi rugData: ${JSON.stringify(body)}`)
    const responseFromApi:any = await axios.post(`${URL}/rug/v3/consulta`, body, headers2)
    log(`Respuesta directa de consulta de RUG: ${JSON.stringify(responseFromApi.data)}`)

    if (responseFromApi.data.length === 0) {
      await RugData.create({ client_id: client_id, data: 'No se encontraron resultados', requested: true })
      return res.status(200).json(returnSuccess('No se encontraron datos de RUG', {}, 1))
    } else {
      responseFromApi.data.data.forEach(async (item:any) => {
        await RugData.create({ client_id: client_id, data: item })
      })
      return res.status(201).json(returnSuccess('Datos de RUG registrados correctamente', {}, 1))
    }
  } catch (error:any) {
    log(`[X] data > controller, rugData Error al guardar los datos de RUG [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al obtener los datos de RUG'))
  }
}


export const registerBlackList = async (req:any, res:any) => {
  log(`Inicia registerBlackList ${JSON.stringify(req.body)}`)
  const { client_id } = req.params
  
  const blacklistFromDB:any = await BlackList.findAll({ where: { client_id: client_id }})
  log(`Se busca desde la base de datos: ${JSON.stringify(blacklistFromDB)}`)
  if (blacklistFromDB.length > 0 && blacklistFromDB.requested === false) return res.status(200).json(returnSuccess('Información obtenida correctamente', {}, 1))
  
  try {
    log(`No existe en BD: Inicia consulta ${client_id}`)
    const clientFromDB:any = await Clients.findByPk(client_id)

    const body:object = {
      'nombre_completo': `${clientFromDB.name} ${clientFromDB.secondName} ${clientFromDB.lastName} ${clientFromDB.secondLastName}`,
      'primer_nombre': clientFromDB.name,
      'segundo_nombre': clientFromDB.secondName,
      'apellidos': `${clientFromDB.lastName} ${clientFromDB.secondLastName}`,
      'fecha_nacimiento': '',
      'lugar_nacimiento': ''
    }
    
    log(`Antes de enviar a consultar a nufi blacklist: ${JSON.stringify(body)}`)
    const responseFromApi:any = await axios.post(`${URL}/perfilamiento/v1/aml`, body, headers2)
    // const responseFromApi:any = {"status":"success","code":200,"mensaje":"no se encotraron resultados","registros":0,"data":[]}
    log(`Respuesta directa de consulta de blacklist: ${JSON.stringify(responseFromApi.data)}`)

    await BlackList.create({ client_id: client_id, data: responseFromApi.data })
    return res.status(201).json(returnSuccess('Datos de listas negras registrados correctamente', {}, 1))
  } catch (error:any) {
    log(`[X] data > controller, registerBlackList Error al guardar los datos de listas negras [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al obtener los datos de listas negras'))
  }
}


export const registerJuditial = async (req:any, res:any) => {
  log(`Inicia registerJuditial ${JSON.stringify(req.body)}`)
  const { client_id } = req.params
  
  const juditialFromDB:any = await Juditial.findOne({ where: { client_id: client_id }})
  log(`Se busca desde la base de datos: ${JSON.stringify(juditialFromDB)}`)
  if (juditialFromDB) return res.status(200).json(returnSuccess('Información obtenida correctamente', {}, 1))
  
  try {
    log(`No existe en BD: Inicia consulta ${client_id}`)
    const clientFromDB:any = await Clients.findByPk(client_id)

    const body:object = {
      'nombre': clientFromDB.name,
      'paterno': clientFromDB.lastName,
      'materno': clientFromDB.secondLastName,
      'detalle': true,
      'estado': 'nacional'
    }
    log(`Antes de enviar a consultar a nufi expedientes judiciales: ${JSON.stringify(body)}`)
    const responseFromApi:any = await axios.post(`${URL}/antecedentes_judiciales/v2/persona_fisica_nacional`, body, headers3)
    log(`Respuesta directa de consulta de expedientes judiciales: ${JSON.stringify(responseFromApi.data)}`)

    if (responseFromApi.data.numero_resultados > 0) {
      const cleanedResponse = fixAccentsInObject(responseFromApi);
      console.log('cleanedResponse', cleanedResponse)
      await Juditial.create({ client_id: client_id, data: cleanedResponse })
      return res.status(201).json(returnSuccess('Datos de expedientes judiciales registrados correctamente', {}, 1))
    } else {
      await Juditial.create({ client_id: client_id, data: responseFromApi })
      return res.status(201).json(returnSuccess('Datos de expedientes judiciales registrados correctamente', {}, 1))
    }

  } catch (error:any) {
    log(`[X] data > controller, registerJuditial Error al guardar los datos de expedientes judiciales [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al obtener los datos de  expedientes judiciales'))
  }
}


export const registerGoogle = async (req:any, res:any) => {
  log(`Inicia registerGoogle ${JSON.stringify(req.body)}`)
  const { client_id } = req.params
  
  const googleFromDB:any = await Google.findOne({ where: { client_id: client_id }})
  log(`Se busca desde la base de datos: ${JSON.stringify(googleFromDB)}`)
  if (googleFromDB) return res.status(200).json(returnSuccess('Información obtenida correctamente', {}, 1))
  
  try {
    log(`No existe en BD: Inicia consulta ${client_id}`)
    const clientFromDB:any = await Clients.findByPk(client_id)

    const body:object = {
      'consulta':clientFromDB.name + ' ' + clientFromDB.secondName + ' ' + clientFromDB.lastName + ' ' + clientFromDB.secondLastName,
      'tipo_noticia':'news',
      'pagina':1,
      'numero_resultados': 5,
      'localizacion':'mx',
      'lenguaje':'es'
    }

    log(`Antes de enviar a consultar a nufi noticias en Google: ${JSON.stringify(body)}`)
    const responseFromApi:any = await axios.post(`${URL}/noticias/v2/busqueda`, body, headers2)
    log(`Respuesta directa de consulta de noticias en Google: ${JSON.stringify(responseFromApi.data)}`)

    await Google.create({ client_id: client_id, data: responseFromApi.data.data, requested: true })
    return res.status(201).json(returnSuccess('Datos de noticias en Google registrados correctamente', {}, 1))
    
  } catch (error:any) {
    log(`[X] data > controller, registerGoogle Error al guardar los datos de noticias en Google [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al obtener los datos de  noticias en Google'))
  }
}


export const getNss = async (req:any, res:Response) => {
  try {
    const { client_id } = req.params

    const webhookData:any = await Webhook.findOne({
      where: { client_id: client_id },
      attributes: [
        'client_id',
        'uuid_nss',
        'uuid_historial',
        'uuid_infonavit',
        'nss_completed',
        'history_completed'
      ]
    })
    log(`webhookData: ${JSON.stringify(webhookData)}`)
    const body:object = {
      uuid_nss: webhookData.uuid_nss,
      uuid_historial: webhookData.uuid_historial || '',
    }
    log(`Antes de enviar a consultar a nufi get status: ${JSON.stringify(body)}`)
    const responseFromAPI:any = await axios.post(`${URL}/numero_seguridad_social/v2/status`, body, headers2)
    log(`[getStatus response] data ${JSON.stringify(responseFromAPI.data)}`)
    if (responseFromAPI.data.status === 'success') {
      await WorkHistory.create({ client_id: client_id, jobs: responseFromAPI.data })
      return res.status(200).json(returnSuccess('NSS obtenido correctamente', responseFromAPI.data, 1))
    } else {
      return res.status(404).json(returnError('No se encontraron datos de NSS'))
    }

  } catch (error:any) {
    log(`[X] getStatus Error [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al obtener el NSS'))
  }
}

export const getWebhookData = (req:Request, res:Response) => {
  log(`getWebhookData ${JSON.stringify(req.body)}`)

  const webhookData = ''

  // const data = {
  //   user_id: balance.user_id,
  //   initial_balance: getCurrentBalance(balance),
  //   purchases: 0,
  //   sales: 0,
  //   transfers: 0,
  //   balance_date: new Date()
  // }
  // BalancesHistory.create(data)

  return res.status(200).json(req.body)
}


const getSATInformation = async(clientId:string, rfc:string) => {
  try {
    let certificados:object[] = []
    
    const certificatesFromDB = await Certificates.findAll({ where: { client_id: clientId }})
    if (certificatesFromDB.length > 0) return certificatesFromDB
    
    log(`[getSATInformation] URL: ${URL}/certificadosat/v1/consultar/consultar, rfc: ${rfc}`)
    const { data }:any = await axios.post(`${URL}/certificadosat/v1/consultar/consultar`, {rfc}, headers2)
    for (let certificado of data.data.certificados) {
      const certificatedCreated = await Certificates.create({
        client_id: clientId,
        numero_serie: certificado.numero_serie,
        estado: certificado.estado,
        tipo: certificado.tipo,
        fecha_inicial: certificado.fecha_inicial,
        fecha_final: certificado.fecha_final,
        certificado: certificado.certificado
      })
      certificados.push(certificatedCreated)
    }
    return certificados
  } catch (error:any) {
    log(`[X] getSATInformation Error [X]: ${error.message}`)
    return {}
  }
}



const getSAT69B = async(rfc:string) => {
  try {
    const response:any = await axios.post(`${URL}/contribuyentes/v1/obtener_contribuyente`, {rfc}, headers)
    return response.data
  } catch (error:any) {
    log(`[X] getSAT69B Error [X]: ${error.message}`)
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
    log(`[X] getSAT74 Error [X]: ${error.message}`)
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
    log(`[X] getSAT69L Error [X]: ${error.message}`)
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
    log(`[X] getJuditialRecord Error [X]: ${error.message}`)
    return {}
  }
}


const getWeeksWorked = async(curp:string, nss:string) => {
  try {
    let detail:any = {}
    log(`[getWeeksWorked] URL: ${URL}/numero_seguridad_social/v2/consultar_historial?curp=${curp}&nss=${nss}`)
    const response:any = await axios.get(`${URL}/numero_seguridad_social/v2/consultar_historial?curp=${curp}&nss=${nss}`, headers2)
    if (response.data && response.data.data && response.data.data.uuid) {
      detail = await getStatusNssHistory(response.data.data.uuid)
      console.log('detail', detail)
      return detail
    } else {
      return response.data
    }
  } catch (error:any) {
    log(`[X] getWeeksWorked Error [X]: ${error.message}`)
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
    log(`[X] getStatusNssHistory Error [X]: ${error.message}`)
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
    const { data } = await axios.post(`${URL}/enriquecimientoidentidades/v3/telefono`, body, headers4)
    return data
  } catch (error:any) {
    log(`[X] getEnrichmentPhone Error [X]: ${JSON.stringify(error)}`)
    return {}
  }
}


const getEnrichmentName = async(firstName:string, secondName:string, lastName:string, secondLastName:string) => {
  try {
    const body:object = {
      nombre:firstName + ' ' + secondName,
      apellidos:lastName + ' ' + secondLastName
    }
    const response:any = await axios.post(`${URL}/enriquecimientoidentidades/v3/nombre`, body, headers4)
    return response.data
  } catch (error:any) {
    log(`[X] getEnrichmentName Error [X]: ${error.message}`)
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
    log(`[X] getGoogleNews Error [X]: ${error.message}`)
    return {}
  }
}

const fillData = async(clientId:any) => {
  const curpData:any = await Curp.findOne({ where: { client_id: clientId }})
  const client:any = await Clients.findByPk(clientId)
  if (client && curpData) {
    client.name = curpData.nombres.split(' ')[0]
    client.secondName = curpData.nombres.split(' ')[1]
    client.lastName = curpData.apellidos.split(' ')[0]
    client.secondLastName = curpData.apellidos.split(' ')[1]
    client.state = curpData.entidad
    client.dob = new Date(`${curpData.curp.substring(6, 8)}/${curpData.curp.substring(8, 10)}/${curpData.curp.substring(4, 6)}`)
    client.save()
  }
}


export const readIdentification = async (req:any, res:any) => {
    console.log('inicia lectura de ID', req.file)
    try {

    const { client_id } = req.params

    const identificationFromDB:any = await MindeeIdentification.findOne({ where: { client_id: client_id }})
    // log(`Se busca desde la base de datos: ${JSON.stringify(identificationFromDB)}`)
    if (identificationFromDB) return res.status(200).json(returnSuccess('Información obtenida correctamente', identificationFromDB, 1))
  
    log(`No existe en BD: Inicia consulta ${client_id}`)
    const configurations:any = await Configurations.findOne({ where: { id: 1 }})    
    log(`mindeKey: ${JSON.stringify(configurations)}`)
    const mindeeClient = new mindee.Client({ apiKey: configurations.mindeeKey });
    const inputSource = mindeeClient.docFromPath(req.file.path, 'image/jpeg');
    const apiResponse = mindeeClient.enqueueAndParse(mindee.product.InternationalIdV2,inputSource);
    const data = await apiResponse.then(async (resp:any) => {
      log(`Respuesta directa de consulta de Minee InternationalID: ${JSON.stringify(resp.toString())}`)
      await MindeeIdentification.create({ client_id: client_id, mindeeID: resp.document, identificationPath: req.file.path })
      return resp.document
    })
    return res.status(201).json(returnSuccess('Se obtuvieron correctamente los datos de la identificación, recargar la página', data, 1));
  } catch (error:any) {
    log(`[X] data > controller, readIdentification Error al guardar los datos de la identificación [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al validar la identidad'))
  }
}
  
  export const deleteIdentificationById = async (req:any, res:any) => {
    log(`Inicia deleteIdentificationById ${req.params.id}`)
    try {
      const identification:any = await MindeeIdentification.findOne({ where: { client_id: req.params.id }})
      identification.destroy()
      return res.status(200).json(returnSuccess('Elemento eliminado correctamente', {}, 1))
    } catch (error:any) {
      log(`[X] data > controller, deleteIdentificationById Error al eliminar el registro de la identificación [X]: ${error.message}`)
      return res.status(500).json(returnError('Ocurrió un error interno al eliminar de la identificación'))
    }
  }