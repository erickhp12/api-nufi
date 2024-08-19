const { DataTypes } = require('sequelize')
const { sequelize } = require('../utils/database.js')

const Users = sequelize.define('Users', {
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    }, 
    phone: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    user_role: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'users'
})


const Permissions = sequelize.define('Permissions', {
    name: {
        type: DataTypes.STRING(100)
    },
    type: {
        type: DataTypes.STRING(50)
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'permissions'
})


const UserPermissions = sequelize.define('UserPermissions', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'permissions',
            key: 'id'
        }
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'user_permissions'
})

sequelize.sync({alter: true}).then(() => console.log('usersModel synced', '')).catch((err) => console.log('Error syncing usersModel', err.toString()))

module.exports = {
    Users,
    Permissions,
    UserPermissions
}