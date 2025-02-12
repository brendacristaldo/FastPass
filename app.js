const createError = require('http-errors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const cookieParser = require("cookie-parser")
const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require("express-session")
const Sequelize = require("sequelize")
const mustacheExpress = require('mustache-express');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// Configurar o motor de visualização Mustache
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const exampleRoute = require('./routes/exampleRoute');
app.use('/', exampleRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(session({
  secret: "#@A4327Asdzw",
  resave: false,
  saveUninitialized: false
  }));

  req.session.nome = req.query.nome
 res.send("Ola "+ req.session.nome)

module.exports = app;
