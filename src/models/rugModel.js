const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/database')

const RugData = sequelize.define('RugData', {
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
    requested: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    tableName: 'rug_data'
})

// sequelize.sync({ alter: true }).then(() => console.log('RugData synced', '')).catch((err) => console.log('Error syncing RugData', err.toString()))

module.exports = {
    RugData
}