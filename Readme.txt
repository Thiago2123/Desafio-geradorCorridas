- Bibliotecas Utilizadas e a razão de usa-las 

Express - Ajuda na criação de apis com nodeJS
Nodemon - Ajuda a atualizar automaticamente o servidor sem fechar e abrir o servidor toda hora, apenas precisando iniciar com 'npm start'
Chai, Mocha, Supertest - Facilita a criação de testes


- Decisões da arquitetura e estrutura das apis

Tentei deixar tudo em um arquivo só, index.js, para facilitar a leitura, fiz como se as 'accounts' fossem 'clientes para usar o aplicativo de corridas' e os 'users' como se fossem os 'motoristas do app'. A aplicação foi feita em nodeJS
Cada account tem um id, tem o próprio 'dinheiro', e um limite de transação, tem tambem um array onde fica gravada todas as transações da conta, tendo um id unico para cada transação, o valor da transação, a data da transação, a conta origem e a conta destino da transação.
Agora explicando sobre os users. Cada user tem um id unico, nome, se está disponivel ou não, um limite de corridas por conta, e um array com as corridas de cada conta. No array da corrida, tem o id unico da corrida, o id do user (motorista), a origem e o destino, o status da corrida e a data e hora de quando foi criada.
Para os testes fiz uma pasta separada chamada 'test' e lá escrevi meus teste. Para realizar o teste basta escrever "npm test" na raiz do projeto.


- Instruções para compilar e executar o projeto

Como foi feito em node.js basta ter o node instalado, baixar o repositório na maquina, rodar 'npm install' para instalar as dependencias de bibliotecas e em seguida rodar 'npm start'. O servidor já será iniciado na porta 3000 do localhost.
Para rodar os teste basta dar o 'npm install' para innstalar as dependencias e em seguida dar 'npm test', isso irá rodar os teste criados.

Aqui a seguir vou listar todas as rotas e seus respctivos jsons (lembranndo que é necessário trocar o ':id' por um id): 

GET   /accounts  - Lista todas as contas
GET   /accounts/:id  - Lista conta pelo id
GET   /users  - Lista todos usuarios
GET   /users/:id  - Lista Usuario pelo id
GET   /rides - Lista todas as corridas criadas independente do status
POST  /transactions - Cria uma transação para uma conta
        {
            "accountId": 1,
            "amount": 600,
            "destinationAccountId": 2
        }
POST  /rides - Cria uma corrida para um Usuario
        {
            "userId": 4,
            "origin": "Rua da consolação",
            "destination": "Rua São Paulo"
        }
POST  /rides/:id/cancel - Cancela uma corrida pelo id




- Notas adicionais
Como escrevi anteriormente, fiz imaginando as acccounts como clientes e os users como motoristas.
Para os acounts, a transação só poderá ser feita se ele tiver saldo o suficiente e que não tenha exedito o limite de transação da conta.
Um user só pode pegar uma corrida por vez, quando crio uma corrida o user fica indisponivel. 
A corrida pode ser cancelada, tem um endpoint para cancelar, mas tambem criei um cronometro que cancela a corrida a cada 2 minutos (que seria o tempo da corrida ter sido completa), assim que a corrida é cancelada o user(motorista) fica disponivel novamente para receber novas corridas, caso não tenha passado do limite de corridas da conta dele. 
