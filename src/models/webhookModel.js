const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/database')

const Webhook = sequelize.define('Webhook', {
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clients',
            key: 'id'
        }
    },
    uuid_nss: {
        type: DataTypes.UUID,
        allowNull: true
    },
    uuid_historial: {
        type: DataTypes.UUID,
        allowNull: true
    }, 
    uuid_infonavit: {
        type:  DataTypes.UUID,
        allowNull: true
    },
    retries: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
    },
    nss_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    history_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'webhook'
})

// sequelize.sync({ alter: true }).then(() => console.log('webhookModel synced', '')).catch((err) => console.log('Error syncing webhookModel', err.toString()))

module.exports = {
    Webhook
}