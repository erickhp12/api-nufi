const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/database')

const Google = sequelize.define('Google', {
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
    tableName: 'google_data'
})

// sequelize.sync({ alter: true }).then(() => console.log('Google synced', '')).catch((err) => console.log('Error syncing Juditial', err.toString()))

module.exports = {
    Google
}