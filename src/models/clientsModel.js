const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/database.js')


const Clients = sequelize.define('Clients', {
    name: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    secondName: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    secondLastName: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    rfc: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    curp: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    state: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    revision_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: true
    },
    nss: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
}, {
    tableName: 'clients'
})

// sequelize.sync({ alter: true }).then(() => console.log('clientsModel synced', '')).catch((err) => console.log('Error syncing clientsModel', err.toString()))

module.exports = {
    Clients
}