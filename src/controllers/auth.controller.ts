
import { Request, Response } from 'express'
const jwt = require('jsonwebtoken');
// import bcrypt from "bcrypt";
const bcrypt = require("bcrypt");
const config = require('../config.json');
import { isPasswordValid, log, returnError, returnSuccess } from '../utils/utils.ts'
import { Users } from '../models/usersModel.js'


export const login = async (req:any, res:Response) => {
  try {
    log(`login ${JSON.stringify(req.body)}`);
    const payload:any = {}
    const { username, password } = req.body;
    let validPassword = false;

    // funcion que valida que exista el usuario
    const user:any = await Users.findOne({ where: { username:username } });
    if (!user) return res.status(401).send(returnError('El usuario no existe'));
    if (!user.is_active) return res.status(401).send(returnError('El usuario esta inactivo'));

    payload.id = user.id,
    payload.name = user.name,
    payload.username = user.username,
    payload.password = user.password,
    payload.phone = user.phone,
    payload.email = user.email,
    payload.user_role = user.user_role,
    payload.is_active = user.is_active,
    
    // funcion que valida el password y hace el token
    await bcrypt.compare(password, user.password).then((res:boolean) => validPassword = res);
    if (!validPassword) return res.status(401).send(returnError('Contraseña incorrecta'));
    log(`Contraseña correcta ${validPassword}`);
    const token = jwt.sign(payload, config.secret, { expiresIn: config.cookieAge });
    res.cookie("jwt", token, { maxAge: config.cookieAge, httpOnly: true });
    const dataToClient = returnSuccess('Inicio de sesion exitoso', token, 1);
    return res.status(201).send(dataToClient);
  } catch (error:any) {
    log(`[X] data > controller, getCurp [X]: ${error.message}`)
    return res.status(500).json(returnError(`Ocurrió un error al obtener el CURP: ${error.message}`))
  }
}


export const signUp = async (req:any, res:Response) => {
  log(`Creacion de usuario ${JSON.stringify(req.body)}`);
  try {
    const { name, username, password, email, phone, commission, user_role } = req.body;
    
    // Valida que los parametros de entrada esten correctos
    if (!name) return res.status(500).send(returnError('El campo name es requerido'))
    if (!username) return res.status(500).send(returnError('El campo username es requerido'))
    if (!password) return res.status(500).send(returnError('El campo password es requerido'))
    if (!user_role) return res.status(500).send(returnError('El campo user_role es requerido'))
    if (username.length !== 10) return res.status(500).send(returnError('El campo username debe ser de 10 digitos'))
    if (!isPasswordValid(password)) return res.status(500).send(returnError('El campo password no cumple con el criterio minimo: 8 Digitos, al menos 1 mayuscula, al menos 1 minuscula, al menos 1 número, al menos un digito tipo (@#$%^&*!)'))

    // Valida que el usuario no exista
    const userExists = await Users.findOne({ where: { username:username } })
    if (userExists) return res.status(400).send(returnError('El usuario ya existe'))

    const data = {
      name,
      username,
      password: await bcrypt.hash(password, 10),
      email,
      phone,
      user_role
    }

    const user:any = await Users.create(data)
    
    let token = jwt.sign(data, config.secret, { expiresIn: 86400000  });
    res.cookie("jwt", token, { maxAge: 86400000, httpOnly: true });
    delete user.password
    return res.status(201).send(returnSuccess(`Usuario creado correctamente ${username}`, user, 1));
   
  } catch (error:any) {
    log(`[X1] Auth > controller > signUp ${error.message}`);
    const errorToClient = returnError('Ocurrio un error al crear el usuario 142');
    return res.status(500).send(errorToClient);
  }
}

