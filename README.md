# App
A aplicação desenvolvida em typescript trata-se de uma API Node.js para um aplicativo semelhante ao Gympass, onde os usuários podem fazer check-in em academias cadastradas.
A aplicação envolve lógicas comuns e importantes, como geolocalização, cálculos de distância, verificações de data e regras de negócio.
Os principais pontos que tornam esse projeto interessante são:
- Abordagem dos princípios SOLID;
- Banco de dados para desenvolvimento provisionado via Docker;
- Comunicação com banco de dados via ferramenta ORM;
- O trabalho com Design Patterns;
- Testes automatizados desde o início do desenvolvimento; 
- Aplicação de metodologia TDD (Test-Driven Development) para algumas regras de negócio;
- Arquitetura com inversão de dependência;
- Criação de ambientes de testes para teste e2e;
- Autenticação utilizando JWT e refresh token;
- Aplicação simplificada de autorização por cargos (RBAC);
- Utilização de CI via GitHub Actions para validação de commits e pull-requests através dos testes automatizados.
## Tecnologias utilizadas no desenvolvimento
- `prisma`: ORM para banco de dados.
- `supertest`: Testes de API.
- `tsup`: Compilação TypeScript.
- `tsx`: Suporte para TSX.
- `typescript`: Linguagem de programação.
- `vitest`: Ferramenta de teste.
- `fastify`: Framework web (Fastify).
- `zod`: Validação de dados (Zod).
- `bcryptjs`: Biblioteca para hash de senhas.
- `fastify/cookie`: Gerenciamento de cookies no Fastify.
- `fastify/jwt`: Autenticação JWT no Fastify.
- `dotenv`: Carrega variáveis de ambiente a partir de um arquivo `.env`.

## RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [x] Deve ser possível o usuário obter o seu histórico de check-ins;
- [x] Deve ser possível o usuário buscar academias próximas (até 10km);
- [x] Deve ser possível o usuário buscar academias pelo nome;
- [x] Deve ser possível o usuário realizar check-in em uma academia;
- [x] Deve ser possível validar o check-in de um usuário;
- [x] Deve ser possível cadastrar uma academia;

## RNs (Regras de negócio)

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não pode fazer 2 check-ins no mesmo dia;
- [x] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [x] O check-in só pode ser validado até 20 minutos após ser criado;
- [x] O check-in só pode ser validado por administradores;
- [x] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);

## Testando o app:
Preparando ambiente:
```
# Clone o repositório
$ git clone https://github.com/jaocodes/api-solid.git

# Acesse a pasta do projeto
$ cd api-solid

# Instale as dependências
$ npm install

# Renomeio o arquivo .env.example para .env

# Inicie o container docker
$ docker compose up -d

# Execute as migrações do prisma
$ npx prisma migrate dev
```
Agora que todo o ambiente está de pé, podemos:

Rodar os testes unitários dos casos de uso:
```
$ npm run test
```
Rodar os testes e2e dos controllers http:
```
$ npm run test:e2e
```
Rodar todos os testes com o `vitest/ui`
```
$ npm run test:ui
```
Rodar a API em modo de desenvolvimento:
```
$ npm run dev
```
Buildar o `web-service`:
```
$ npm run build
```
Executar o `web-service` :
```
$ npm run start
```

Detalhes a respeito dos scripts consultar o arquivo `package.json` na raiz do projeto.
