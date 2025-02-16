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
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
    }
}, 
{
    tableName: 'user_tickets',
    timestamps: false,
    hooks: {
        beforeUpdate: (userTicket, options) => {
            // Impede cancelamento após conclusão
            if (userTicket.changed('status') && 
                userTicket.previous('status') === 'completed' && 
                userTicket.status === 'cancelled') {
                throw new Error('Não é possível cancelar uma compra já concluída');
            }
        }
    }
});

UserTicket.belongsTo(User, { foreignKey: 'userId' });
UserTicket.belongsTo(Ticket, { foreignKey: 'ticketId' });
User.hasMany(UserTicket, { foreignKey: 'userId' });
Ticket.hasMany(UserTicket, { foreignKey: 'ticketId' });

module.exports = UserTicket;