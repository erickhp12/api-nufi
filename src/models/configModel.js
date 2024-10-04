const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/database.js')


const Configurations = sequelize.define('configurations', {
    mindeeKey: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    nufiKeyGeneral: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    nufiKeyJuditial: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    nufiKeyBlacklist: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: 'configurations'
});

// sequelize.sync({alter: true}).then(() => console.log('configurationsModel synced', '')).catch((err) => console.log('Error syncing configurationsModel', err.toString()))

module.exports = {
    Configurations
}