const Ticket = require('../models/ticketModel');
const TicketStock = require('../models/ticketStockModel');
const User = require('../models/userModel');

class AdminController {
    // Renderiza dashboard administrativo
    async dashboard(req, res) {
        try {
            const tickets = await Ticket.findAll({
                include: [TicketStock]
            });
            
            res.render('admin/dashboard', { tickets });
        } catch (error) {
            res.status(500).render('error', { 
                message: 'Erro ao carregar dashboard' 
            });
        }
    }

    // Cria novo ingresso
    async createTicket(req, res) {
        const transaction = await sequelize.transaction();
        
        try {
            const { name, type, price, quantity } = req.body;
            
            const ticket = await Ticket.create({
                name,
                type,
                price
            }, { transaction });

            await TicketStock.create({
                ticketId: ticket.id,
                quantity
            }, { transaction });

            await transaction.commit();
            
            if (req.accepts('html')) {
                res.redirect('/admin/tickets');
            } else {
                res.status(201).json(ticket);
            }
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({ error: 'Erro ao criar ingresso' });
        }
    }

    // Atualiza ingresso existente
    async updateTicket(req, res) {
        const transaction = await sequelize.transaction();
        
        try {
            const { id } = req.params;
            const { name, type, price, quantity } = req.body;

            const ticket = await Ticket.findByPk(id, { transaction });
            if (!ticket) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Ingresso não encontrado' });
            }

            // Atualiza ticket
            await ticket.update({ name, type, price }, { transaction });

            // Atualiza estoque
            await TicketStock.update(
                { quantity },
                { where: { ticketId: id }, transaction }
            );

            await transaction.commit();

            if (req.accepts('html')) {
                res.redirect('/admin/tickets');
            } else {
                res.json(ticket);
            }
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({ error: 'Erro ao atualizar ingresso' });
        }
    }

    // Remove ingresso
    async deleteTicket(req, res) {
        const transaction = await sequelize.transaction();
        
        try {
            const { id } = req.params;

            const ticket = await Ticket.findByPk(id, { transaction });
            if (!ticket) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Ingresso não encontrado' });
            }

            await TicketStock.destroy({
                where: { ticketId: id },
                transaction
            });

            await ticket.destroy({ transaction });

            await transaction.commit();

            if (req.accepts('html')) {
                res.redirect('/admin/tickets');
            } else {
                res.json({ message: 'Ingresso removido com sucesso' });
            }
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({ error: 'Erro ao remover ingresso' });
        }
    }

    // Lista usuários (apenas admin)
    async listUsers(req, res) {
        try {
            const users = await User.findAll({
                attributes: ['id', 'name', 'email', 'isAdmin']
            });

            if (req.accepts('html')) {
                res.render('admin/users', { users });
            } else {
                res.json(users);
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar usuários' });
        }
    }
}

module.exports = new AdminController();