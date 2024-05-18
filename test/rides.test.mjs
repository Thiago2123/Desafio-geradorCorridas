import request from 'supertest';
import { expect } from 'chai';
import server from '../index.js';

describe('Rides API', () => {
    it('Deve listar todos os usuarios', async() => {
        const res = await request(server)
            .get('/users')
            .expect(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.greaterThan(0);
    });

    it('Deve listar um usuario pelo ID', async() => {
        const res = await request(server)
            .get('/accounts/1')
            .expect(200);
    
        expect(res.body).to.have.property('id', 1);
    });

    it('Deve listar todas as corridas', async() => {
        const res = await request(server)
            .get('/rides')
            .expect(200);
    
        expect(res.body).to.be.an('array');    
    });

    it('Deve criar uma nova corrida', async () => {
        const res = await request(server)
            .post('/rides')
            .send({
                userId: 5,
                origin: 'Rua da Consolação, 1131',
                destination: 'Rua São Paulo, 3311'
            })
            .expect(200);

        expect(res.body).to.have.property('status', 'SUCCESS');
    });

    it('Deve cancelar uma corrida', async () => {
        const createRes = await request(server)
            .post('/rides')
            .send({
                userId: 4,
                origin: 'Rua da Consolação, 1131',
                destination: 'Rua São Paulo, 3311'
            })
            .expect(200);

        const rideId = createRes.body.dadosCorrida.id;
        
        const cancelRes = await request(server)
            .post(`/rides/${rideId}/cancel`)
            .expect(200);

        expect(cancelRes.body).to.have.property('status', 'SUCCESS');
        expect(cancelRes.body.dadosCorrida).to.have.property('status', 'cancelled');

    });

    it('Deve retornar 404 se a corrida não for encontrada', async () => {
        await request(server)
            .post('/rides/999/cancel')
            .expect(404);
    });

    it('Deve retornar 400 se a corrida já foi cancelada', async () => {
        const createRes = await request(server)
            .post('/rides')
            .send({
                userId: 1,
                origin: 'Rua da Consolação, 1131',
                destination: 'Rua São Paulo, 3311'
            })
            .expect(200);

        const rideId = createRes.body.dadosCorrida.id;

        await request(server)
            .post(`/rides/${rideId}/cancel`)
            .expect(200);

        await request(server)
            .post(`/rides/${rideId}/cancel`)
            .expect(400);
    });
});