const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/database')

const ProfessionalData = sequelize.define('ProfessionalData', {
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
}, {
    tableName: 'professional_data'
})

// sequelize.sync({ alter: true }).then(() => console.log('ProfessionalData synced', '')).catch((err) => console.log('Error syncing Siger', err.toString()))

module.exports = {
    ProfessionalData
}