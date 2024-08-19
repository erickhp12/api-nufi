const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/database')

const WorkHistory = sequelize.define('WorkHistory', {
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clients',
            key: 'id'
        }
    },
    jobs: {
        type: DataTypes.JSON,
        allowNull: true
    },
}, {
    tableName: 'work_history'
})

// sequelize.sync({ alter: true })
//     .then(() => console.log('WorkHistory synced', ''))
//     .catch((err) => console.log('Error syncing WorkHistory', err.toString()))

module.exports = {
    WorkHistory
}