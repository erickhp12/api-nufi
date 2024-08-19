
import { Request, Response } from 'express'
import axios from 'axios'
import { log, returnError, returnSuccess, sleep } from '../utils/utils.ts'
import hardcodedData from '../../hardcoded.js'
import { Curp } from '../models/curpModel.js'
import { Clients } from '../models/clientsModel.js'
import moment from 'moment'
import { Webhook } from '../models/webhookModel.js'
import { Certificates } from '../models/satModel.js'
import { Rfc } from '../models/rfcModel.js'
import { Siger } from '../models/sigerModel.js'
import { ProfessionalData } from '../models/professionalModel.js'

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


// export const getPersonalData = async (req:any, res:Response) => {
//   try {
//     log(`getPersonalData ${JSON.stringify(req.body)}`)
//     let { curp, rfc, firstName, secondName, lastName, secondLastName, dob, state, phone } = req.body
    
//     let client = req.client
//     log(`[0] Client info: ${JSON.stringify(client)}`)
    
//     if (!firstName) firstName = client.name
//     if (!secondName) secondName = client.secondName
//     if (!lastName) lastName = client.lastName
//     if (!secondLastName) secondLastName = client.secondLastName
//     if (!dob) dob = client.dob
//     if (!state) state = client.state
//     if (!phone) phone = client.phone
//     if (!rfc) rfc = client.rfc

//     let fullName = client.name + ' ' + client.secondName + ' ' + client.lastName + ' ' + client.secondLastName
//     let socialReason:string = 'arcadio hernandez macias'
  
//     // Paso 1 Validar el CURP
//     log(`[1] - Inicia validateCurp: ${curp} cliente ${client.id}`)
//     const curpData:any = await validateCurp(client.id, curp)
//     // si no se tiene registro del nombre se registra en la BD
//     if (!client.name && !client.rfc) {
//       await fillData(client.id)
      
//       log(`[1.1] - client after fillData: ${JSON.stringify(client)}`)
//       firstName       = curpData.nombres.split(' ')[0]
//       secondName      = curpData.nombres.split(' ')[1]
//       lastName        = curpData.apellidos.split(' ')[0]
//       secondLastName  = curpData.apellidos.split(' ')[1]
//       fullName        = firstName + ' ' + secondName + ' ' + lastName + ' ' + secondLastName
//       client.dob      = new Date(`${curpData.curp.substring(6, 8)}/${curpData.curp.substring(8, 10)}/${curpData.curp.substring(4, 6)}`)
//     }
//     log(`firstName: ${firstName}`)
//     log(`secondName: ${secondName}`)
//     log(`lastName: ${lastName}`)
//     log(`secondLastName: ${secondLastName}`)
//     log(`fullName: ${fullName}`)

//     log(`[1.1] - rfc: ${rfc}`)
//     // Paso 2 Obtener el RFC
//     if (!rfc) {
//       log('[1.2] - No se recibio RFC incia método getRFC')
//       rfc = await getRFC(client.id, firstName, secondName, lastName, secondLastName, client.dob)
//     }
//     log(`[1.3] - rfc después de invocar el método getRFC: ${rfc}`)
//     log(`[2] - incia validateRFC: ${curp}`)
//     const rfcData = await validateRFC(rfc)
    
//     // Paso 3 Obtener el NSS
//     log(`[3] - Inicia getNSS: ${curp}`)
//     const nssData = await getNSS(client.id, curp)

//     // Paso 4 Obtener informacion del SAT
//     log(`[4] - Inicia getSATInformation: ${rfc}`)
//     const satData = await getSATInformation(client.id, rfc)

//     // Paso 5 Registro Público de Comercio (SIGER)
//     log(`[5] - Inicia getSIGER: ${fullName}`)
//     const sigerData = await getSIGER(fullName)

//     // Paso 6 Registro nacional de profesiones
//     log(`[6] - Inicia getProfesionalRecord, firstName: ${firstName}, lastName: ${lastName}, secondLastName: ${secondLastName}`)
//     const professionalData = await getProfesionalRecord(firstName, lastName, secondLastName)

//     // Paso 7 Registro RUG (Registro Unico de Garantias Mobiliarias)
//     log(`[7] - Inicia getRUGInformation fullName: ${fullName}, curp: ${curp}, rfc: ${rfc}`)
//     const rugData = await getRUGInformation(fullName)

//     // Paso 8 Obtener listas negras internacionales
//     log(`[8] - Inicia getBlackListInformation fullName: ${fullName}, firstName: ${firstName}, secondName: ${secondName}, lastName: ${lastName}`)
//     const blackListData = await getBlackListInformation(fullName, firstName, secondName, lastName)

//     // Paso 9 Obtener Contribuyentes boletinados del SAT 69B
//     log(`[9] - Inicia getSAT69B: ${rfc}`)
//     const sat69BData = await getSAT69B(rfc)
    
//     // Paso 10 Obtener Contribuyentes boletinados del SAT 69B
//     log(`[10] - Inicia getSAT74 rfc: ${rfc}, socialReason: ${socialReason}, state: ${state}`)
//     const sat74Data = await getSAT74(rfc, socialReason, state)

//     // Paso 11 Obtener contribuyentes no localizados del SAT 69L
//     log(`[11] - Inicia getSAT69L rfc: ${rfc}, socialReason: ${socialReason}, state: ${state}`)
//     const sat69LData = await getSAT69L(rfc, socialReason, state)

//     // Paso 12 Obtener antecedentes judiciales
//     log(`[12] - Inicia getJuditialRecord firstName: ${firstName}, lastName: ${lastName}, secondLastName: ${secondLastName}`)
//     const juditialData = await getJuditialRecord(firstName, lastName, secondLastName)

//     // Paso 13 Obtener semanas cotizadas
//     // log(`[13] - Inicia getWeeksWorked curp: ${curp}, nss: ${nss}`)
//     // const weeksWorkedData = await getWeeksWorked(curp, nss)
    
//     // Paso 14 Obtener información de infonavit
//     // log(`[14] - Inicia getInfonavitData`)
//     // const infonavitData = await getInfonavitData()

//     // Paso 15 Obtener enriquecimiento de telefono
//     log(`[15] - Inicia getEnrichmentPhone', phone}`)
//     const enrichmentDataPhone = await getEnrichmentPhone(phone)

//     // Paso 16 Obtener enriquecimiento de nombre
//     log(`[16] - Inicia getEnrichmentName name: ${fullName}`)
//     const enrichmentNameData = await getEnrichmentName(firstName, secondName, lastName, secondLastName)

//     // Paso 17 Obtener noticias de google
//     log(`[17] - Inicia getGoogleNews', ${fullName}`)
//     const googleData = getGoogleNews(fullName)

//     res.status(200).json({
//       curpData,
//       rfcData,
//       nssData,
//       satData,
//       sigerData,
//       professionalData,
//       rugData,
//       blackListData,
//       sat69BData,
//       sat74Data,
//       sat69LData,
//       juditialData,
//       // weeksWorkedData,
//       // infonavitData,
//       enrichmentDataPhone,
//       enrichmentNameData,
//       googleData
//     });
//   } catch (error:any) {
//     log(`[X] Auth > controller, getPersonal [X]: ${error.message}`)
//     res.status(500).json(returnError('Ocurrió un error'))
//   }
// }


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
      const { data, message }:any = await axios.post(`${URL}/estatusrfc/valida`, {rfc: clientFromDB.rfc}, headers)
      log(`validateRFC data: ${JSON.stringify(data)}`)
      log(`validateRFC message: ${JSON.stringify(message)}`)
    
      rfcFromDB.message = message
      rfcFromDB.valid = true
      rfcFromDB.save()
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
  let { curp } = req.body
  
  const { client_id } = req.params
  
  const nssFromDB:any = await Webhook.findOne({ where: { client_id: client_id }})
  log(`nssFromDB: ${JSON.stringify(nssFromDB)}`)
  if (nssFromDB) return res.status(200).json(returnSuccess('NSS Solicidado anteriormente', {}, 1))
  
  try {
    log(`inicia solicitud de nss, curp: ${curp}`)
    const { data } = await axios.get(`${URL}/numero_seguridad_social/v2/consultar?curp=${curp}`, headers2)
    const nssCreated = await Webhook.findOrCreate({ where: { client_id: client_id, uuid_nss: data.data.uuid }})
    log(`Respuesta directa de consulta de nss: ${JSON.stringify(nssCreated)}`)
    
    return res.status(201).json(returnSuccess('NSS registrado correctamente', {}, 1))
  } catch (error:any) {
    log(`[X] data > controller, Error al guardar el nss [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al validar el nss'))
  }
}


export const registerSiger = async (req:any, res:Response) => {
  log(`Inicia registerSiger ${JSON.stringify(req.body)}`)
  const { client_id } = req.params
  
  const sigerFromDB:any = await Siger.findAll({ where: { client_id: client_id }})
  log(`Se obtiene desde BD: ${JSON.stringify(sigerFromDB)}`)
  if (sigerFromDB) return res.status(200).json(returnSuccess('Información obtenida correctamente', {}, 1))
  
  try {
    log(`No existe en BD: Inicia consulta ${client_id}`)
    const clientFromDB:any = await Clients.findByPk(client_id)
    const body:object = {
      'socio': `${clientFromDB.name} ${clientFromDB.secondName} ${clientFromDB.lastName} ${clientFromDB.secondLastName}`
    }
    const { data }:any = await axios.post(`${URL}/siger/v4/busqueda_socio`, body, headers2)

    for (let item of data) {
      console.log('item --->', item)
      await Siger.create({
        client_id: client_id,
        commerces: item
      })
    }
    
    return res.status(201).json(returnSuccess('SIGER registrado correctamente', {}, 1))
  } catch (error:any) {
    log(`[X] data > controller, Error al guardar los datos del SIGER [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al obtener los datos del SIGER'))
  }
}


export const registerProfessionalData = async (req:any, res:Response) => {
  log(`Inicia registerProfessionalData ${JSON.stringify(req.body)}`)
  const { client_id } = req.params
  
  const professionalData:any = await ProfessionalData.findAll({ where: { client_id: client_id }})
  log(`Se obtiene desde BD: ${JSON.stringify(professionalData)}`)
  if (professionalData.length > 0) return res.status(200).json(returnSuccess('Información obtenida correctamente', {}, 1))
  
  try {
    log(`No existe en BD: Inicia consulta ${client_id}`)
    const clientFromDB:any = await Clients.findByPk(client_id)

    const body:object = {
      'nombre': `${clientFromDB.name} ${clientFromDB.secondName}`,
      'apellido_paterno': clientFromDB.lastName,
      'apellido_materno': clientFromDB.secondLastName
    }
    log(`Antes de enviar a consultar a nufi: ${JSON.stringify(body)}`)
    const { data }:any = await axios.post(`${URL}/CedulaProfesional/consultar`, body, headers)
    // const { data }:any = {
    // "status": "success",
    // "code": 200,
    // "message": "Operacion exitosa",
    //   "data": [
    //       {
    //           "nombre": "LUCÍA HERNÁNDEZ GONZÁLEZ",
    //           "numCedula": "0435151",
    //           "profesion": "PROFESOR EN EDUCACIÓN PRIMARIA",
    //           "genero": "MUJER",
    //           "institucion": "DIRECCIÓN GENERAL DE EDUCACIÓN NORMAL Y ACTUALIZAC",
    //           "fechaRegistro": "1977",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCÍA HERNÁNDEZ GONZÁLEZ",
    //           "numCedula": "0495132",
    //           "profesion": "TÉCNICO EN ENFERMERÍA",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD NACIONAL AUTÓNOMA DE MÉXICO",
    //           "fechaRegistro": "1978",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "ANA LUCIA HERNÁNDEZ GONZÁLEZ",
    //           "numCedula": "09145595",
    //           "profesion": "LICENCIATURA EN INGENIERÍA INDUSTRIAL ADMINISTRATIVA",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD DE LEÓN, PLANTEL SILAO",
    //           "fechaRegistro": "2015",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCIA HERNANDEZ GONZALEZ GUERRA",
    //           "numCedula": "09931429",
    //           "profesion": "MAESTRÍA EN PSICOTERAPIA SISTÉMICA",
    //           "genero": "MUJER",
    //           "institucion": "INSTITUTO BATESON DE PSICOTERAPIA SISTÉMICA",
    //           "fechaRegistro": "2016",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCIA HERNANDEZ GONZALEZ",
    //           "numCedula": "10337486",
    //           "profesion": "LICENCIATURA EN DERECHO",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD AUTÓNOMA DE GUERRERO",
    //           "fechaRegistro": "2017",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCIA LOURDES HERNANDEZ GONZALEZ",
    //           "numCedula": "10476677",
    //           "profesion": "LICENCIATURA EN COMUNICACIÓN",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD AUTÓNOMA DE BAJA CALIFORNIA",
    //           "fechaRegistro": "2017",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCIA HERNANDEZ GONZALEZ",
    //           "numCedula": "10501841",
    //           "profesion": "LICENCIATURA EN ADMINISTRACIÓN",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD NACIONAL AUTÓNOMA DE MÉXICO",
    //           "fechaRegistro": "2017",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCIA JANETH HERNANDEZ GONZALEZ",
    //           "numCedula": "10696072",
    //           "profesion": "MAESTRÍA EN CIENCIAS DE LA COMPUTACIÓN",
    //           "genero": "MUJER",
    //           "institucion": "INSTITUTO TECNOLÓGICO DE CIUDAD MADERO (I.T.R.)",
    //           "fechaRegistro": "2017",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCIA SELENNE HERNANDEZ GONZALEZ",
    //           "numCedula": "10729877",
    //           "profesion": "LICENCIATURA EN ODONTOLOGÍA",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD DE CIENCIAS Y ADMINISTRACIÓN",
    //           "fechaRegistro": "2017",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCIA SELENNE HERNANDEZ GONZALEZ",
    //           "numCedula": "11854590",
    //           "profesion": "ESPECIALIDAD EN ORTODONCIA",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD UCAD",
    //           "fechaRegistro": "2019",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "ANA LUCIA HERNANDEZ GONZALEZ",
    //           "numCedula": "12184684",
    //           "profesion": "LICENCIATURA EN COMUNICACIÓN, PUBLICIDAD Y RELACIONES PÚBLICAS",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD PANAMERICANA CAMPUS GUADALAJARA",
    //           "fechaRegistro": "2021",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCIA HERNANDEZ GONZALEZ",
    //           "numCedula": "12286996",
    //           "profesion": "LICENCIATURA EN ADMINISTRACIÓN DE EMPRESAS",
    //           "genero": "MUJER",
    //           "institucion": "BENEMÉRITA UNIVERSIDAD AUTÓNOMA DE PUEBLA",
    //           "fechaRegistro": "2021",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCÍA HERNÁNDEZ GONZÁLEZ",
    //           "numCedula": "1309240",
    //           "profesion": "TÉCNICO EN ENFERMERÍA",
    //           "genero": "MUJER",
    //           "institucion": "ESCUELA DE ENFERMERAS GUADALUPE, A.C.",
    //           "fechaRegistro": "1989",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCIA GUADALUPE HERNANDEZ GONZALEZ",
    //           "numCedula": "13227009",
    //           "profesion": "LICENCIATURA EN INGENIERÍA QUÍMICA",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD AUTÓNOMA DE SAN LUIS POTOSÍ",
    //           "fechaRegistro": "2023",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCÍA HERNÁNDEZ GONZÁLEZ",
    //           "numCedula": "2442747",
    //           "profesion": "LICENCIATURA EN ADMINISTRACIÓN",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD NACIONAL AUTÓNOMA DE MÉXICO",
    //           "fechaRegistro": "1997",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "ANA LUCÍA HERNÁNDEZ GONZÁLEZ",
    //           "numCedula": "2897837",
    //           "profesion": "LICENCIATURA COMO CIRUJANO DENTISTA",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD VERACRUZANA",
    //           "fechaRegistro": "1999",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "ANA LUCIA HERNÁNDEZ GONZÁLEZ",
    //           "numCedula": "3274258",
    //           "profesion": "LICENCIATURA EN CONTADURÍA",
    //           "genero": "MUJER",
    //           "institucion": "INSTITUTO TECNOLÓGICO DE MATAMOROS, TAMPS. (I.T.R.",
    //           "fechaRegistro": "2001",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "CARMEN LUCÍA HERNÁNDEZ GONZÁLEZ",
    //           "numCedula": "3321515",
    //           "profesion": "PROFNAL. TEC. COMO ASISTENTE DIRECTIVO",
    //           "genero": "MUJER",
    //           "institucion": "COLEGIO NACIONAL DE EDUCACIÓN PROFESIONAL TÉCNICA",
    //           "fechaRegistro": "2001",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LOURDES LUCIA HERNANDEZ GONZALEZ",
    //           "numCedula": "3667366",
    //           "profesion": "LICENCIATURA EN COMUNICACIÓN",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD ANÁHUAC",
    //           "fechaRegistro": "2002",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCIA NELIDA HERNANDEZ GONZALEZ",
    //           "numCedula": "3775279",
    //           "profesion": "LICENCIATURA EN EDUCACIÓN PREESCOLAR",
    //           "genero": "MUJER",
    //           "institucion": "INST.BENEM.Y CENT.ESC. NOR.DEL EDO.DE CHI.PROF. LU",
    //           "fechaRegistro": "2002",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCIA VIVIANA HERNÁNDEZ GONZÁLEZ",
    //           "numCedula": "4030114",
    //           "profesion": "TEC. SUP. UNIVER. EN ADMINISTRACIÓN",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD TECNOLÓGICA DE LEÓN",
    //           "fechaRegistro": "2004",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "DIANA LUCIA HERNANDEZ GONZALEZ",
    //           "numCedula": "4345674",
    //           "profesion": "TÉCNICO EN ADMINISTRACIÓN",
    //           "genero": "MUJER",
    //           "institucion": "C.E.T.I.S. NO. 48",
    //           "fechaRegistro": "2005",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "MARIA LUCIA HERNANDEZ GONZALEZ",
    //           "numCedula": "4984356",
    //           "profesion": "LICENCIATURA COMO CONTADOR PÚBLICO AUDITOR",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD METROPOLITANA DE MONTERREY",
    //           "fechaRegistro": "2006",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCIA HERNANDEZ GONZALEZ GUERRA",
    //           "numCedula": "5157780",
    //           "profesion": "LICENCIATURA EN PSICOLOGÍA",
    //           "genero": "MUJER",
    //           "institucion": "INSTITUTO TECNOLÓGICO Y DE ESTUDIOS SUPERIORES DE",
    //           "fechaRegistro": "2007",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCIA HERNANDEZ GONZÁLEZ",
    //           "numCedula": "5768262",
    //           "profesion": "TEC. PROFNAL. EN ENFERMERÍA GENERAL",
    //           "genero": "MUJER",
    //           "institucion": "ESCUELA DE ENFERMERIA FLORENCIA NIGHTINGALE",
    //           "fechaRegistro": "2008",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCIA DEL CARMEN HERNANDEZ GONZALEZ",
    //           "numCedula": "6168165",
    //           "profesion": "LICENCIATURA EN LENGUA Y LITERATURA HISPANOAMERICANA",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD AUTÓNOMA DE CHIAPAS",
    //           "fechaRegistro": "2009",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCÍA VIVIANA HERNÁNDEZ GONZÁLEZ",
    //           "numCedula": "6238552",
    //           "profesion": "LICENCIATURA EN ADMINISTRACIÓN",
    //           "genero": "MUJER",
    //           "institucion": "INSTITUTO TECNOLÓGICO DE LEÓN (I.T.R.)",
    //           "fechaRegistro": "2009",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCÍA VICTORIA HERNÁNDEZ GONZÁLEZ",
    //           "numCedula": "6303173",
    //           "profesion": "LICENCIATURA EN ADMINISTRACIÓN FINANCIERA",
    //           "genero": "MUJER",
    //           "institucion": "INSTITUTO TECNOLÓGICO Y DE ESTUDIOS SUPERIORES DE MONTERREY",
    //           "fechaRegistro": "2010",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "ANA LUCIA HERNANDEZ GONZALEZ",
    //           "numCedula": "6457606",
    //           "profesion": "TÉCNICO EN ANÁLISIS Y TECNOLOGÍA DE ALIMENTOS",
    //           "genero": "MUJER",
    //           "institucion": "C.E.T.I.S. NO. 139",
    //           "fechaRegistro": "2010",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "ANA LUCIA HERNANDEZ GONZALEZ",
    //           "numCedula": "6535141",
    //           "profesion": "PROFNAL. ASOCIADO EN ADMINISTRACIÓN DE LA MICRO Y PEQUEÑA EMPRESA",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD AUTÓNOMA DE GUADALAJARA",
    //           "fechaRegistro": "2010",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "ANA LUCIA HERNANDEZ GONZALEZ",
    //           "numCedula": "6684182",
    //           "profesion": "LICENCIATURA EN ADMINISTRACIÓN FINANCIERA",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD AUTÓNOMA DE AGUASCALIENTES",
    //           "fechaRegistro": "2010",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCIA HERNANDEZ GONZALEZ",
    //           "numCedula": "7075814",
    //           "profesion": "LICENCIATURA EN EDUCACIÓN PREESCOLAR",
    //           "genero": "MUJER",
    //           "institucion": "COLEGIO SIMÓN BOLIVAR DE CHILPANCINGO, A.C.",
    //           "fechaRegistro": "2011",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "ANA LUCÍA HERNÁNDEZ GONZÁLEZ",
    //           "numCedula": "7237922",
    //           "profesion": "ESPECIALIDAD EN ENDODONCIA",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD DEL EJÉRCITO Y FUERZA AÉREA",
    //           "fechaRegistro": "2011",
    //           "tipo": "A1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCIA HERNANDEZ GONZALEZ",
    //           "numCedula": "7934966",
    //           "profesion": "LICENCIATURA EN ENFERMERÍA",
    //           "genero": "MUJER",
    //           "institucion": "BENEMÉRITA UNIVERSIDAD AUTÓNOMA DE PUEBLA",
    //           "fechaRegistro": "2013",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "ANA LUCÍA HERNÁNDEZ GONZÁLEZ",
    //           "numCedula": "8054558",
    //           "profesion": "LICENCIATURA EN DERECHO",
    //           "genero": "MUJER",
    //           "institucion": "INSTITUTO TECNOLÓGICO Y DE ESTUDIOS SUPERIORES DE MONTERREY",
    //           "fechaRegistro": "2013",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCÍA JANETH HERNÁNDEZ GONZÁLEZ",
    //           "numCedula": "8977250",
    //           "profesion": "LICENCIATURA EN INGENIERÍA EN SISTEMAS COMPUTACIONALES",
    //           "genero": "MUJER",
    //           "institucion": "INSTITUTO TECNOLÓGICO DE CIUDAD MADERO (I.T.R.)",
    //           "fechaRegistro": "2015",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCÍA ELIZABETH HERNÁNDEZ GONZÁLEZ",
    //           "numCedula": "9340797",
    //           "profesion": "LICENCIATURA EN EDUCACIÓN",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD DEL DESARROLLO PROFESIONAL, SEDE SALTILLO",
    //           "fechaRegistro": "2015",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "LUCIA GUADALUPE HERNANDEZ GONZALEZ",
    //           "numCedula": "9340869",
    //           "profesion": "TÉCNICO EN ENFERMERÍA GENERAL",
    //           "genero": "MUJER",
    //           "institucion": "ESCUELA DE ENFERMERÍA FLORENCIA NIGHTINGALE",
    //           "fechaRegistro": "2015",
    //           "tipo": "C1",
    //           "estado": ""
    //       },
    //       {
    //           "nombre": "DULCE LUCIA HERNANDEZ GONZALEZ",
    //           "numCedula": "9429477",
    //           "profesion": "LICENCIATURA EN TRABAJO SOCIAL",
    //           "genero": "MUJER",
    //           "institucion": "UNIVERSIDAD DE GUADALAJARA",
    //           "fechaRegistro": "2015",
    //           "tipo": "C1",
    //           "estado": ""
    //       }
    //   ]
    // }
    console.log('response --->', data)
    log(`Respuesta directa de consulta de CedulaProfesional: ${JSON.stringify(data)}`)
    
    for (let item of data) {
      console.log('item --->', item)
      await ProfessionalData.create({
        client_id: client_id,
        data: item
      })
    }
    
    return res.status(201).json(returnSuccess('Datos de profesión registrados correctamente', {}, 1))
  } catch (error:any) {
    log(`[X] data > controller, Error al guardar los datos de los datos de profesión [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error interno al obtener los datos de profesión'))
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


const getSIGER = async(fullName:string) => {
  try {
    const body:object = {
      'socio': fullName
    }
    const response:any = await axios.post(`${URL}/siger/v4/busqueda_socio`, body, headers2)
    return response.data
  } catch (error:any) {
    log(`[X] getSIGER Error [X]: ${error.message}`)
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
    log(`[X] getProfesionalRecord Error [X]: ${error.message}`)
    return {}
  }
}


const getRUGInformation = async(fullName:string) => {
  try {
    const body:object = {
      'descripcion_de_bienes': '',
      'nombre_otorgante': fullName,
      'folio_electronico_otorgante': '',
      'numero_garantia_o_asiento': '',
      'curp_otorgante': '',
      'rfc_otorgante': ''
    }
    const response:any = await axios.post(`${URL}/rug/v3/consulta`, body, headers2)
    return response.data
  } catch (error:any) {
    log(`[X] getProfesionalRecord Error [X]: ${error.message}`)
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
    log(`[X] getProfesionalRecord Error [X]: ${error.message}`)
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