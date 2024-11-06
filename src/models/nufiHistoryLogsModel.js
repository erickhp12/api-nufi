const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/database.js')


const NufiHistoryLogs = sequelize.define('configurations', {
    module: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    endpoint: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING(1000),
        allowNull: true
    }
}, {
    tableName: 'nufi_history_logs'
});

// sequelize.sync({alter: true}).then(() => console.log('NufiHistoryLogsModel synced', '')).catch((err) => console.log('Error syncing configurationsModel', err.toString()))

module.exports = {
    NufiHistoryLogs
}