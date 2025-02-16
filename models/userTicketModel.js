const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./userModel');
const Ticket = require('./ticketModel');

const UserTicket = sequelize.define('UserTicket', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    purchaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    }
}, 
{
    tableName: 'user_tickets',
    timestamps: false
});

UserTicket.belongsTo(User, { foreignKey: 'userId' });
UserTicket.belongsTo(Ticket, { foreignKey: 'ticketId' });

module.exports = UserTicket;
