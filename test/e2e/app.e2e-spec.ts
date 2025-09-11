import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/interface/http/app.module';
import { prisma } from '../../src/infrastructure/prisma/prisma.client';

describe('App E2E', () => {
    let app: INestApplication;
    let token: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        await prisma.transfer.deleteMany();
        await prisma.account.deleteMany();
        await prisma.company.deleteMany();
    });

    it('GET /health should return 200', async () => {
        const res = await request(app.getHttpServer()).get('/health');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: 'ok' });
    });

    describe('Auth', () => {
        it('POST /auth/login invalid creds should return error', async () => {
            const res = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ username: 'bad', password: 'bad' });
            expect(res.status).toBe(201);
            expect(res.body).toEqual({ error: 'Invalid credentials' });
        });

        it('POST /auth/login valid creds should return token', async () => {
            const res = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ username: 'hackme', password: 'please' });
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('access_token');
            token = res.body.access_token;
        });
    });

    describe('Companies', () => {
        it('POST /companies without token should return 401', async () => {
            const res = await request(app.getHttpServer())
                .post('/companies')
                .send({ cuit: '12345678901', name: 'MyCo', type: 'PYME', accounts: [] });
            expect(res.status).toBe(401);
        });

        it('POST /companies with valid token should create a company', async () => {
            const login = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ username: 'hackme', password: 'please' });
            token = login.body.access_token;

            const res = await request(app.getHttpServer())
                .post('/companies')
                .set('Authorization', `Bearer ${token}`)
                .send({ cuit: '12345678901', name: 'MyCo', type: 'PYME', accounts: ['112233445566'] });

            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({ cuit: '12345678901', name: 'MyCo' });
        });

        it('GET /companies/adhesion should return empty array initially', async () => {
            const login = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ username: 'hackme', password: 'please' });
            token = login.body.access_token;

            const res = await request(app.getHttpServer())
                .get('/companies/adhesion')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('GET /companies/transfers should return empty array initially', async () => {
            const login = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ username: 'hackme', password: 'please' });
            token = login.body.access_token;

            const res = await request(app.getHttpServer())
                .get('/companies/transfers')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });
});
