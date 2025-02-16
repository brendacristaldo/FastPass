require('dotenv').config();
const express = require('express');
const { urlNotValid } = require('./middleware/auth.js');
const usersRoutes = require('./routes/userRoutes');
const ticketsRoutes = require('./routes/ticketRoutes');
const { sequelize } = require('./config/db');
const mustacheExpress = require('mustache-express');
const path = require('path');

const app = express();

const engine = mustacheExpress()
app.engine("mustache", engine)

app.set("views", path.join(__dirname, "templates"))
app.set("view engine", "mustache")

app.get("/home", (req, res) => {
  query = []
  keys = Object.keys(req.query)
  for (let i = 0; i < keys.length; i++) {
    query.push({key: keys[i], value: req.query[keys[i]]})
  }

  args = {
    'titulo': "Ola Mundo dos Templates",
    'descricao': "Texto aleatório para ilustrar o caso!",
    'params': query
  }
  res.render("home", args)
})

app.use(express.json());

// Rotas principais
app.use('/users', usersRoutes);
app.use('/tickets', ticketsRoutes);

// Middleware para rota não encontrada
app.use(urlNotValid);

// Função assíncrona para criar as tabelas no MySQL caso elas não existam ao compilar o projeto
(async () => {
  try {
    await sequelize.sync();
    app.listen(4000, () => console.log("Servidor rodando na porta 4000"));
  } 
  
  catch (error) {
    console.error("Erro ao sincronizar o banco de dados:", error);
  }
})();