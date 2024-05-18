import request from 'supertest';
import { expect } from 'chai';
import server from '../index.js';

describe('Accounts API', () => {
    it('Deve listar todas as contas', async () => {
        const res = await request(server)
            .get('/accounts')
            .expect(200);
        
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.greaterThan(0);
    });

    it('Deve obter detalhes de uma conta específica', async () => {
        const res = await request(server)
            .get('/accounts/1')
            .expect(200);
        
        expect(res.body).to.have.property('id', 1);
    });
    
    it('Deve retornar 404 se a conta não for encontrada', async () => {
        await request(server)
            .get('/accounts/999')
            .expect(404);
    });

    it('Deve criar uma transação de uma conta para outra', async () => {
        const res = await request(server)
            .post('/transactions')
            .send({
                accountId: 1,
                amount: 600,
                destinationAccountId: 2
            })
            .expect(200);
        expect(res.body).to.have.property('status', 'SUCCESS');

           
    });
});