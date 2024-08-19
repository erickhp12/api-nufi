const { Sequelize } = require('sequelize')
require('dotenv').config()

const configs = {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
}

const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, configs)

module.exports = { sequelize }