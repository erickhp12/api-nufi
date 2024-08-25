const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/database')

const BlackList = sequelize.define('BlackList', {
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
    tableName: 'blacklist_data'
})

// sequelize.sync({ alter: true }).then(() => console.log('BlackList synced', '')).catch((err) => console.log('Error syncing BlackList', err.toString()))

module.exports = {
    BlackList
}