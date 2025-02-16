const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Índice único para email
        validate: {
            isEmail: true
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Índice único para username
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdm: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, 
{
    tableName: 'users',
    timestamps: false,
    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10);
        }
    },
    methods: {
        comparePassword: async function(password) {
            return await bcrypt.compare(password, this.password);
        }
    }
});

module.exports = User;