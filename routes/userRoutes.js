const express = require('express');
const usersControler = require('../controller/usersController');
const { verifyToken, isAdm, userIsAdmOrHimself } = require('../middleware/auth.js');
const router = express.Router();

// Rota para instalar o sistema (criar admin inicial)
router.get('/install', usersControler.installSystem);

// Rota para listar usuários
router.get('/', usersControler.getUsers);

// Rota para registro de usuário comum
router.post('/registerUser', usersControler.createUser);

// Rota para registro de administrador (apenas admins)
router.post('/registerAdm', verifyToken, isAdm, usersControler.createUserAdm);

// Rota para renderizar a página de login
router.get('/login', (req, res) => {
    res.render('login', { errors: [] });
});

// Rota para processar o login
router.post('/login', usersControler.verifyUser);

// Rota para atualizar informações do usuário
router.put('/updateUser', verifyToken, usersControler.updateUser);

// Rota para deletar usuário (apenas admins)
router.delete('/:id', verifyToken, isAdm, usersControler.deleteUser);

module.exports = router;