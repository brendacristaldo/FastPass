const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./userModel');
const Ticket = require('./ticketModel');

const TicketStock = sequelize.define('TicketStock', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, 
{
    tableName: 'ticket_stock',
    timestamps: false
});

TicketStock.belongsTo(Ticket, { foreignKey: 'ticketId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

module.exports = TicketStock;
