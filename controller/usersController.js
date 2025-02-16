const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')
const TicketStock = require('../models/ticketStockModel')

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    console.log('Token recebido:', token); // Log do token

    if (!token) {
        console.log('Token ausente');
        return res.status(401).json({ message: 'Acesso negado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.error('Erro ao verificar o token:', err); // Log do erro
            return res.status(403).json({ message: 'Token inválido!' });
        }

        try {
            const user = await User.findByPk(decoded.id);
            if (!user) {
                console.log('Usuário não encontrado para o ID:', decoded.id);
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            console.log('Usuário autenticado:', user.username); // Log do usuário autenticado
            req.user = user;
            next();
        } catch (error) {
            console.error('Erro ao buscar usuário:', error); // Log do erro
            return res.status(500).json({ message: 'Erro ao buscar usuário' });
        }
    });
};

module.exports = { verifyToken };

//Função que retorna todos os usuários salvos no vetor users do database
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();  // Busca todos os usuários no banco
        res.status(200).json(users);
    } 
    
    catch (error) {
        res.status(500).json({ message: "Erro ao buscar usuários", error });
    }
};



const installSystem = async (req, res) => {
    try {
        // Verificar se o administrador já existe
        const existingAdmin = await User.findOne({
            where: { isAdm: true, email: "adm@gmail.com" }
        });

        if (existingAdmin) {
            return res.status(400).json({ message: 'Já existe o usuário Administrator no sistema.' });
        }

        const initialAdm = await User.create({
            name: "Administrator",
            email: "adm@gmail.com",
            username: "admin",
            password: "admin",
            isAdm: true
        });

        const tickets = [
            { id: 1, name: 'Meia', price: 30.00 },
            { id: 2, name: 'Inteira', price: 60.00 },
            { id: 3, name: 'V.I.P', price: 90.00 }
        ];

        const createdTickets = await Ticket.bulkCreate(tickets, { ignoreDuplicates: true });

        const ticketStockData = [
            { ticketId: 1, quantity: 20 },
            { ticketId: 2, quantity: 20 },
            { ticketId: 3, quantity: 10 }
        ];

        await TicketStock.bulkCreate(ticketStockData);

        res.status(200).json({
            message: "Sistema instalado com sucesso.",
            administrator: initialAdm,
            tickets: createdTickets,
            ticketStock: ticketStockData
        });
    } 
    
    catch (error) {
        res.status(500).json({ message: "Erro ao realizar a instalação do sistema", error });
    }
};



//Função para criar usuário
const createUser = async (req, res) => {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
        return res.render('register', { errors: ['Todos os campos são obrigatórios'] });
    }

    try {
        const userCreated = await User.create({
            name,
            email,
            username,
            password,
            isAdm: false
        });

        // Redireciona para a página de login após o cadastro
        res.redirect('/purchase-history');
    } catch (error) {
        // Exibe erros na view de cadastro
        res.render('register', { errors: ['Erro ao criar usuário. Tente novamente.'] });
    }
};

//Função para criar administrador
const createUserAdm = async (req, res) => {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        const userCreated = await User.create({
            name,
            email,
            username,
            password,
            isAdm: true
        });

        res.status(201).json(userCreated);
    } 
    
    catch (error) {
        res.status(500).json({ message: "Erro ao criar administrador", error });
    }
};


//Função de login que retorna um token
const verifyUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userLogin = await User.findOne({
            where: { username }
        });

        if (!userLogin) {
            return res.render('login', { errors: ['Usuário ou senha inválida, tente novamente'] });
        }

        const isValidPassword = await userLogin.comparePassword(password);
        if (!isValidPassword) {
            return res.render('login', { errors: ['Usuário ou senha inválida, tente novamente'] });
        }

        const token = jwt.sign({ id: userLogin.id, isAdm: userLogin.isAdm }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use HTTPS em produção
        sameSite: 'strict',
        domain: 'localhost', // Defina o domínio corretamente
        path: '/purchase-history' // Defina o caminho corretamente
    });

        // Redireciona para a página de histórico de compras
        res.redirect('../purchase-history');
    } catch (error) {
        res.render('login', { errors: ['Erro ao fazer login'] });
    }
};



//Função de atualizar informações do usuário
const updateUser = async (req, res) => {
    const { id, name, email, username, password } = req.body;

    try {
        const userToBeUpdated = await User.findOne({ where: { id } });

        if (!userToBeUpdated) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        await userToBeUpdated.update({ name, email, username, password });

        res.status(200).json(userToBeUpdated);
    } 
    
    catch (error) {
        res.status(500).json({ message: "Erro ao atualizar usuário", error });
    }
};


const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        const userToDelete = await User.findOne({ where: { id: userId } });

        if (!userToDelete) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (userToDelete.isAdm) {
            return res.status(400).json({ message: 'Admins não podem ser deletados' });
        }

        await userToDelete.destroy();

        res.status(200).json({ message: 'Usuário deletado', user: userToDelete });
    } 
    
    catch (error) {
        res.status(500).json({ message: "Erro ao deletar usuário", error });
    }
};


module.exports = {
    verifyToken,
    getUsers,
    installSystem,
    createUser,
    createUserAdm,
    verifyUser,
    updateUser,
    deleteUser
}
