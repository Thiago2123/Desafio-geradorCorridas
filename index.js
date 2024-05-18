import express from 'express';
const server = express();

server.use(express.json());

const tempoCancelamentoAutomatico = 120000;
const limitTransation = 10;

let accounts = [
    { id: 1, balance: 1000, transactionLimit: limitTransation, transactions: [] },
    { id: 2, balance: 2000, transactionLimit: limitTransation, transactions: [] },
    { id: 3, balance: 3000, transactionLimit: limitTransation, transactions: [] },
    { id: 4, balance: 4000, transactionLimit: limitTransation, transactions: [] },
    // OUTRAS CONTAS...
];

// PROCURAR TODAS AS ACCOUNTS
server.get('/accounts', (req, res) => {
    res.send(accounts);
});

// PROCURAR A CONTA COM O ID DESEJADO
server.get('/accounts/:id', (req, res) => {
    const account = accounts.find(a => a.id === parseInt(req.params.id));
    // CASO NÃO EXISTA ID DA CONTA
    if (!account) return res.status(404).send({status: "ERRO", statusCode: 404, mensagem: 'Conta não encontrada'});

    res.send(account);
});

// FAZER A TRANSAÇÃO DE UMA CONTA PARA OUTRA
server.post('/transactions', (req, res) => {
    // VERIFICAR O BODY
    const { accountId, amount, destinationAccountId } = req.body;
    // PROCURAR O ID DA CONTA E DA CONTADESTINO PASSADA NO BODY
    const account = accounts.find(a => a.id === accountId);
    const destinationAccount = accounts.find(a => a.id === destinationAccountId);
    // SE NÃO ACHAR CONTA RETORNA ERRO
    if (!account || !destinationAccount) return res.status(404).send({status: "ERRO", statusCode: 404, mensagem: 'Conta não encontrada'});
    // SE A CONTA NÃO TIVER SALDO PARA PASSAR PARA A CONTADESTINO OU SE O VALOR FOR 0
    if (account.balance < amount || amount == 0) return res.status(400).send({status: "ERRO", statusCode: 400, mensagem: 'Saldo insuficiente para a transação'});
    // SE A CONTA NÃO PASSOU O LIMITE DE TRANSAÇÃO
    if (account.transactions.length >= account.transactionLimit) return res.status(400).send({status: "ERRO", statusCode: 400, mensagem: 'Limite de transações excedido'});

    account.balance -= amount;
    destinationAccount.balance += amount;

    const transaction = { id: Date.now(), amount, date: new Date(), from: accountId, to: destinationAccountId };
    account.transactions.push(transaction);

    res.send({status: "SUCCESS", statusCode: 200, mensagem: 'Transação Realizada com Successo', dadosTrasacao: transaction});
});





let users = [
    { id: 1, name: 'Alice', available: true, rideLimit: 1, rides: [] },
    { id: 2, name: 'Thiago', available: false, rideLimit: 3, rides: [] },
    { id: 3, name: 'Rogério', available: false, rideLimit: 3, rides: [] },
    { id: 4, name: 'Marcelo', available: true, rideLimit: 3, rides: [] },
    { id: 5, name: 'Vanessa', available: true, rideLimit: 3, rides: [] },
    // Outros usuários
];

let rides = [];

// PROCURAR TODOS OS USUARIOS
server.get('/users', (req, res) => {
    res.send(users);
});

// PROCURAR USUARIO PELO ID
server.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send({status: "ERRO", statusCode: 404, mensagem: 'Usuário não encontrado'});
    res.send(user);
});

// CRIAR CORRIDAS PASSANDO ORIGEM E DESTINO 
server.post('/rides', (req, res) => {
    const { userId, origin, destination } = req.body;
    const user = users.find(u => u.id === userId);
    
    if (!user) return res.status(404).send({status: "ERRO", statusCode: 404, mensagem: 'Usuário não encontrado'});
    if (!user.available) return res.status(400).send({status: "ERRO", statusCode: 400, mensagem: 'Usuário indisponível ou já está em uma corrida'});
    if (user.rides.length >= user.rideLimit) return res.status(400).send({status: "ERRO", statusCode: 400, mensagem: 'Limite de corridas excedido'});

    const ride = { id: rides.length + 1, userId, origin, destination, status: 'pending', createdAt: new Date() };
    user.rides.push(ride);
    user.available = false;
    rides.push(ride);


    // Configurar cancelamento automático após 1 minuto (60000 ms)
    setTimeout(() => {
        if (ride.status === 'pending') {
            ride.status = 'cancelled';
            user.available = true;
            console.log(`Corrida ID ${ride.id} cancelada automaticamente.`);
        }
    }, tempoCancelamentoAutomatico);


    res.send({status: "SUCCESS", statusCode: 200, mensagem: 'Corrida Criada Com Sucesso', dadosCorrida: ride});
});

// Endpoint para listar todas as corridas
server.get('/rides', (req, res) => {
    res.send(rides);
});


// Endpoint para cancelar uma corrida
server.post('/rides/:id/cancel', (req, res) => {
    const rideId = parseInt(req.params.id);
    const ride = rides.find(r => r.id === rideId);
    
    if (!ride) return res.status(404).send({status: "ERRO", statusCode: 404, mensagem: 'Corrida não encontrada'});
    if (ride.status !== 'pending') return res.status(400).send({status: "ERRO", statusCode: 400, mensagem: 'A corrida não pode ser cancelada'});

    ride.status = 'cancelled';

    res.send({status: "SUCCESS", statusCode: 200, mensagem: 'Corrida Cancelada', dadosCorrida: ride});
});





server.listen(3000, () => {
    console.log('Servidor funcionando na porta 3000');
});

export default server;
