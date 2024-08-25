const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/database')

const Juditial = sequelize.define('Juditial', {
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
    tableName: 'juditial_data'
})

// sequelize.sync({ alter: true }).then(() => console.log('Juditial synced', '')).catch((err) => console.log('Error syncing Juditial', err.toString()))

module.exports = {
    Juditial
}