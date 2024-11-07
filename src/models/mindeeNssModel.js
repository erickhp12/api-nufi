const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/database')

const MindeeNss = sequelize.define('MindeeNss', {
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clients',
            key: 'id'
        }
    },
    data: {
        type: DataTypes.JSON,
        allowNull: true
    },
    identificationPath: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'mindee_nss'
})

// sequelize.sync({ alter: true }).then(() => console.log('MindeeNssModel synced', '')).catch((err) => console.log('Error syncing MindeeNssModel', err.toString()))

module.exports = {
    MindeeNss
}