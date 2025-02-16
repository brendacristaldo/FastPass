const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
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

// Relação bidirecional
TicketStock.belongsTo(Ticket, { foreignKey: 'ticketId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Ticket.hasOne(TicketStock, { foreignKey: 'ticketId' });

module.exports = TicketStock;