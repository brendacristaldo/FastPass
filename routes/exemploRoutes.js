const mustacheExpress = require('mustache-express');
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const engine = mustacheExpress()

app.engine("mustache", engine);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

router.get('/', (req, res) => {
  res.render('pagina-template', { title: 'Página Inicial', message: 'Bem-vindo ao Mustache!' });
});

module.exports = router;