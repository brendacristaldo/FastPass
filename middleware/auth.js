const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

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

const isAdm = (req, res, next) => {
    if (!req.user.isAdm) {
        return res.status(403).json({ message: 'Acesso negado: apenas administradores podem realizar a ação' });
    }
    next();
};

const userIsAdmOrHimself = (req, res, next) => {
    const userId = parseInt(req.params.id || req.body.id);
    
    if (!req.user.isAdm && req.user.id !== userId) {
        return res.status(403).json({ 
            message: 'Acesso negado: você só pode acessar seus próprios recursos' 
        });
    }
    next();
};

const urlNotValid = (req, res, next) => {
    res.status(404).json({message: "Rota não existente"});
};

module.exports = { verifyToken, isAdm, userIsAdmOrHimself, urlNotValid };