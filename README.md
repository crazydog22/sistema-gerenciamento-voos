# Sistema de Gerenciamento de Voos - Backend

Sistema de gerenciamento de voos desenvolvido com Node.js, Express e MongoDB.

## Funcionalidades

- Autenticação e autorização de usuários
- Gerenciamento de voos
- Sistema de reservas
- Perfis de usuário (admin/user)
- Validação de dados
- Logging estruturado
- Tratamento de erros
- Rate limiting
- Proteção contra ataques comuns

## Tecnologias Utilizadas

- Node.js
- Express
- MongoDB/Mongoose
- JWT para autenticação
- bcrypt para hash de senhas
- Winston para logging
- Joi para validação
- Helmet para segurança
- ESLint e Prettier para qualidade de código
- Jest para testes

## Pré-requisitos

- Node.js >= 14
- MongoDB
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd sistema-gerenciamento-voos/backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicie o servidor:
```bash
npm run dev
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo desenvolvimento
- `npm run start`: Inicia o servidor em modo produção
- `npm run test`: Executa os testes
- `npm run lint`: Executa o linter
- `npm run lint:fix`: Corrige automaticamente problemas de lint

## Estrutura do Projeto

```
src/
├── config/         # Configurações do projeto
├── controllers/    # Controladores da aplicação
├── middleware/     # Middlewares Express
├── models/         # Modelos Mongoose
├── routes/         # Rotas da API
├── services/       # Lógica de negócio
├── tests/          # Testes
└── validations/    # Schemas de validação
```

## API Endpoints

### Autenticação
- POST /api/auth/register - Registro de usuário
- POST /api/auth/login - Login
- POST /api/auth/logout - Logout
- POST /api/auth/refresh-token - Renovar token

### Usuários
- GET /api/users/profile - Perfil do usuário
- PUT /api/users/profile - Atualizar perfil
- PUT /api/users/password - Alterar senha

### Voos
- GET /api/flights - Listar voos
- GET /api/flights/:id - Detalhes do voo
- POST /api/flights - Criar voo (admin)
- PUT /api/flights/:id - Atualizar voo (admin)
- DELETE /api/flights/:id - Remover voo (admin)

### Reservas
- GET /api/reservations - Listar reservas do usuário
- POST /api/reservations - Criar reserva
- GET /api/reservations/:id - Detalhes da reserva
- DELETE /api/reservations/:id - Cancelar reserva

## Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

Seu Nome - [fabricioisaac.silva@gmail.com](mailto:seu-email@exemplo.com)

Link do projeto: [https://github.com/crazydo22/sistema-gerenciamento-voos](https://github.com/seu-usuario/sistema-gerenciamento-voos)
