const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/database')

const MindeeIdentification = sequelize.define('MindeeIdentification', {
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clients',
            key: 'id'
        }
    },
    mindeeID: {
        type: DataTypes.JSON,
        allowNull: true
    },
    identificationPath: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'mindee_identification'
})

// sequelize.sync({ alter: true }).then(() => console.log('MindeeIdentificationModel synced', '')).catch((err) => console.log('Error syncing MindeeIdentificationModel', err.toString()))

module.exports = {
    MindeeIdentification
}