require("dotenv").config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT
  }
);

const authenticateDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
    } 
    
    catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
};

const syncDatabase = async () => {
    try {
      await sequelize.sync({ alter: true });
      console.log("Banco de dados sincronizado.");
    } 
    
    catch (error) {
      console.error("Erro ao sincronizar o banco de dados:", error);
    }
  };

authenticateDatabase();
syncDatabase();

module.exports = { sequelize }; // Export as an object
