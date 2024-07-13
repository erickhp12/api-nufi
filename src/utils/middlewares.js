'use strict'
const config = require('../config.json');
const utils = require('../utils/utils');
const jwt = require('jsonwebtoken')
/**
 * Module dependencies.
 */
// const debug = require('debug')('API-TAE:Middleware:Common')
async function setTokenData (req, res, next) {
  try {
    const token = req.headers.token
    const decodedToken = jwt.verify(token, config.secret)
    req.user = decodedToken
    next()
  } catch (error) {
    utils.log(`[X] setTokenData [X] - ${error.toString()}`)
  }
}

module.exports = {
    setTokenData
}
