require('dotenv').config();
const express = require('express');
const { urlNotValid, verifyToken } = require('./middleware/auth.js');
const usersRoutes = require('./routes/userRoutes');
const ticketsRoutes = require('./routes/ticketRoutes');
const mustacheExpress = require('mustache-express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./config/swagger-output.json');
const app = express();

// Configuração do Mustache
const engine = mustacheExpress();
app.engine("mustache", engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

// Helpers do Mustache
app.locals.formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

app.locals.formatPrice = (price) => {
    if (!price) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
};

app.locals.getStatusClass = (status) => {
    const classes = {
        'active': 'text-green-600',
        'completed': 'text-gray-600',
        'cancelled': 'text-red-600'
    };
    return classes[status] || 'text-gray-600';
};

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração da sessão
app.use(session({
    secret: process.env.SESSION_SECRET || "#@A4327Asdzw",
    resave: false,
    saveUninitialized: false
}));

// Middleware para disponibilizar user na view
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.isAuthenticated = !!req.session.user;
    next();
});

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Rota raiz redireciona para login se não autenticado
app.get("/", (req, res) => {
    if (!req.session.user) {
        return res.redirect('/users/login');
    }
    res.redirect('views/ticket-view');
});

// Rota para o histórico de compras
app.get('/purchase-history', verifyToken, (req, res) => {
  // Verifique se o usuário está autenticado
  if (!req.cookies.token) {
      return res.redirect('/users/login');
  }

  // Busque os dados do usuário e seus ingressos
  const tickets = [
      {
          id: 1,
          ticket: { name: 'Ingresso Meia', type: 'Meia' },
          quantity: 2,
          purchaseDate: new Date(),
          status: 'active'
      },
      // Adicione mais ingressos conforme necessário
  ];

  // Renderize a view com os dados
  res.render('purchase-history', { tickets });
});

// Rotas da API
app.use('/users', usersRoutes);
app.use('/tickets', ticketsRoutes);

// Tratamento de erro para rota não encontrada
app.use(urlNotValid);

// Tratamento de erros
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;