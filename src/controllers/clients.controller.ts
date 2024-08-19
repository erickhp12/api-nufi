
import { Request, Response } from 'express'
import { log, returnError, returnSuccess } from '../utils/utils.ts'
import { Clients } from '../models/clientsModel.js'
import { Curp } from '../models/curpModel.js'
import { Rfc } from '../models/rfcModel.js'
import { Siger } from '../models/sigerModel.js'
import { ProfessionalData } from '../models/professionalModel.js'


export const createClient = async (req:any, res:Response) => {
  try {
    log(`createClient ${JSON.stringify(req.body)}`)
    const { curp, rfc, name, secondName, lastName, secondLastName, email, nss } = req.body
    if (!curp) return res.status(400).json(returnError('El campo curp es requerido'))
    if (curp.length !== 18) return res.status(400).json(returnError('El campo curp debe tener 18 caracteres'))

    const clientExist = await Clients.findOne({ where: { curp } })
    if (clientExist) return res.status(400).json(returnError('El cliente ya existe'))
    
    const client = await Clients.create({ name, secondName, lastName, secondLastName, email, rfc, curp, nss })
    return res.status(201).json(returnSuccess('Cliente creado correctamente', client, 1))
  } catch (error:any) {
    log(`[X] data > controller, createClient [X]: ${error.message}`)
    return res.status(500).json(returnError('Ocurrió un error al crear el cliente'))
  }
}


export const getClients = async (req:Request, res:Response) => {
  let clients:any = []
  const clientsFromDB:any = await Clients.findAll({ attributes: [
    'id',
    'name',
    'secondName',
    'lastName',
    'secondLastName',
    'curp',
    'rfc',
    'nss',
    'revision_completed',
    'createdAt'
    ]
  })

  if (!clientsFromDB) return res.status(404).json(returnError('No se encontraron registros'))
  for (let i = 0; i < clientsFromDB.length; i++) {
    clientsFromDB[i].fullName = `${clientsFromDB[i].name} ${clientsFromDB[i].secondName} ${clientsFromDB[i].lastName} ${clientsFromDB[i].secondLastName}`
    const item = {
      id: clientsFromDB[i].id,
      name: clientsFromDB[i].name,
      secondName: clientsFromDB[i].secondName || '',
      lastName: clientsFromDB[i].lastName,
      secondLastName: clientsFromDB[i].secondLastName,
      rfc: clientsFromDB[i].rfc,
      curp: clientsFromDB[i].curp,
      nss: clientsFromDB[i].nss,
      revision_completed: clientsFromDB[i].revision_completed,
      fullName: `${clientsFromDB[i].name} ${clientsFromDB[i].secondName || ''} ${clientsFromDB[i].lastName} ${clientsFromDB[i].secondLastName}`,
      createdAt: clientsFromDB[i].createdAt
    }
    clients.push(item)
  }
  return res.status(200).json(returnSuccess('Información obtenida correctamente',clients, clients.length))
}

export const getClientDetail = async (req:Request, res:Response) => {
  log(`Inicia getClientDetail ${req.params.id}`)
  let data:any = {}
  // let user:any = {}
  const userFromDB:any = await Clients.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'name',
      'secondName',
      'lastName',
      'secondLastName',
      'curp',
      'rfc',
      'dob',
      'nss',
      'phone',
      'revision_completed',
      'createdAt'
    ]
  })
  console.log(`user: ${JSON.stringify(userFromDB)}`)
  const curpData = await Curp.findOne({
    where: {
      client_id: req.params.id
    }
  })
  let user = {
    id: userFromDB.id,
    name: userFromDB.name,
    secondName: userFromDB.secondName || '',
    lastName: userFromDB.lastName,
    secondLastName: userFromDB.secondLastName,
    rfc: userFromDB.rfc,
    curp: userFromDB.curp,
    dob: userFromDB.dob,
    nss: userFromDB.nss,
    phone: userFromDB.phone,
    revision_completed: userFromDB.revision_completed,
    fullName:`${userFromDB.name || ''} ${userFromDB.secondName || ''} ${userFromDB.lastName} ${userFromDB.secondLastName}`,
    createdAt: userFromDB.createdAt
  }
  const rfcData = await Rfc.findOne({ where: { client_id: req.params.id } })
  const sigerData = await Siger.findAll({ where: { client_id: req.params.id } })
  const professionalDataFromDB:any = await ProfessionalData.findAll({ where: { client_id: req.params.id } })
  data.user = user
  data.curpData = curpData
  data.rfcData = rfcData
  data.sigerData = sigerData
  let professionalData:any[] = []
  for (let i = 0; i < professionalDataFromDB.length; i++) {
    professionalData.push(professionalDataFromDB[i].data)
  }
  console.log('professionalData: ', professionalData)
  data.professionalData = professionalData
  return res.status(200).json(returnSuccess('Información obtenida correctamente', data, 1))
}


export const getIdByCurp = async (req:Request, res:Response) => {
  log(`Inicia getIdByCurp ${req.params.id}`)
  const userFromDB:any = await Clients.findOne({
    where: { curp: req.params.id },
    attributes: ['id', 'name', 'secondName', 'lastName', 'secondLastName', 'curp', 'rfc', 'nss', 'phone', 'createdAt']
  })
  if (!userFromDB) return res.status(404).json(returnError('No se encontró el registro'))
  console.log(`user id: ${userFromDB.id}`)
  return res.status(200).json(returnSuccess('Información obtenida correctamente', userFromDB, 1))
}
