# FastPass
O FastPass é um sistema de gerenciamento de vendas de ingressos desenvolvido como parte da 2ª etapa do projeto avaliativo da disciplina de Desenvolvimento Back-End. O sistema permite a comercialização de ingressos para eventos específicos, oferecendo funcionalidades para usuários comuns e administradores.

## Funcionalidades
### Para Usuários Comuns
Cadastro de Usuário: Crie uma conta para acessar o sistema.

Login: Autentique-se no sistema para comprar ingressos.

Comprar Ingressos: Adquira ingressos para o evento desejado.

Histórico de Compras: Visualize os ingressos adquiridos.

### Para Administradores
Cadastro de Administrador: Crie contas de administrador (apenas administradores podem realizar essa ação).

Gerenciamento de Ingressos: Adicione, atualize ou remova ingressos.

Gerenciamento de Usuários: Visualize e exclua usuários (apenas administradores podem excluir usuários).

## Tecnologias Utilizadas
Back-End:

- Node.js

- Express.js

- Sequelize (ORM para MySQL)

- JWT (JSON Web Tokens para autenticação)

- Mustache (template engine para renderização de views)

- Swagger (documentação da API)

Banco de Dados:

- MySQL

## Ferramentas:

- Nodemon (reinício automático do servidor durante o desenvolvimento)

- Dotenv (gerenciamento de variáveis de ambiente)

## Como Executar o Projeto

Instale as dependências:
- npm install

Inicie o servidor:
- node bin/www

Acesse o sistema no navegador: http://localhost:3000.

Acesse a documentação da API no Swagger UI: http://localhost:3000/api-docs.
