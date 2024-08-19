const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/database.js')


const Rfc = sequelize.define('rfc', {
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clients',
            key: 'id'
        }
    },
    rfc: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    valid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    message: {
        type: DataTypes.STRING(255),
        allowNull: true
    }, 
}, {
    tableName: 'rfc'
});

// sequelize.sync({alter: true}).then(() => console.log('rfcModel synced', '')).catch((err) => console.log('Error syncing rfcModel', err.toString()))

module.exports = {
    Rfc
}