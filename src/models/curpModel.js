const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/database.js')


const Curp = sequelize.define('curp', {
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clients',
            key: 'id'
        }
    },
    curp: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    nombres: {
        type: DataTypes.STRING(255),
        allowNull: false
    }, 
    apellidos: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    sexo: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    claveEntidad: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    statusCurp: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    entidad: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    entidadRegistro: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    claveMunicipioRegistro: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    anioReg: {
        type: DataTypes.STRING(4),
        allowNull: true
    },
    claveEntidadRegistro: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    numActa: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    libro: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    municipioRegistro:{
        type: DataTypes.STRING(20),
        allowNull: true
    },
}, {
    tableName: 'curp'
});

// sequelize.sync({alter: true}).then(() => console.log('curpModel synced', '')).catch((err) => console.log('Error syncing curpModel', err.toString()))

module.exports = {
    Curp
}