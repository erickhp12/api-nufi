const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/database')

const Siger = sequelize.define('Siger', {
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clients',
            key: 'id'
        }
    },
    commerces: {
        type: DataTypes.JSON,
        allowNull: true
    },
}, {
    tableName: 'siger'
})

// sequelize.sync({ alter: true }).then(() => console.log('Siger synced', '')).catch((err) => console.log('Error syncing Siger', err.toString()))

module.exports = {
    Siger
}