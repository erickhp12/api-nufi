const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/database.js')

const Certificates = sequelize.define('Certificates', {
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clients',
            key: 'id'
        }
    },
    numero_serie: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    tipo: {
        type: DataTypes.STRING(255),
        allowNull: true
    }, 
    fecha_inicial: {
        type: DataTypes.DATE,
        allowNull: true
    }, 
    fecha_final: {
        type: DataTypes.DATE,
        allowNull: true
    },
    certificado: {
        type: DataTypes.STRING(3000),
        allowNull: true
    }
}, {
    tableName: 'certificates'
})


// sequelize.sync({alter: true}).then(() => console.log('satModel synced', '')).catch((err) => console.log('Error syncing usersModel', err.toString()))

module.exports = {
    Certificates
}