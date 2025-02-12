const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API Documentation',
    description: 'Documentação da API',
  },
  host: 'localhost:4000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/usersRoutes.js', './routes/ticketsRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);