import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import reservationRoutes from '../../routes/reservationRoutes.js';
import Flight from '../../models/Flight.js';
import Reservation from '../../models/Reservation.js';
import User from '../../models/User.js';
import { authenticate } from '../../middleware/auth.js';
import testConfig from '../../config/test.js';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/api/reservations', authenticate, reservationRoutes);

let authToken;
let testFlight;
let testUser;

beforeAll(async () => {
    await mongoose.connect(testConfig.database.url);
});

afterAll(async () => {
    await mongoose.disconnect();
});

beforeEach(async () => {
    // Limpar dados
    await User.deleteMany({});
    await Flight.deleteMany({});
    await Reservation.deleteMany({});

    // Criar usuário de teste
    testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456'
    });

    // Gerar token de autenticação
    authToken = jwt.sign(
        { id: testUser._id, role: testUser.role },
        testConfig.jwt.secret,
        { expiresIn: '1h' }
    );

    // Criar voo de teste
    testFlight = await Flight.create({
        flightNumber: 'TEST123',
        origin: 'São Paulo',
        destination: 'Rio de Janeiro',
        departureDate: new Date('2025-12-25T10:00:00Z'),
        availableSeats: 100,
        totalSeats: 100,
        price: 500,
        aircraft: 'Boeing 737',
        reservedSeats: []
    });
});

describe('Reservation Routes', () => {
    describe('POST /api/reservations', () => {
        it('should create a new reservation', async () => {
            const res = await request(app)
                .post('/api/reservations')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    flightId: testFlight._id,
                    passengerName: 'John Doe',
                    passengerEmail: 'john@example.com',
                    passengerDocument: '123.456.789-00',
                    seatNumber: '10A'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('reservationCode');
            expect(res.body.passengerName).toBe('John Doe');
        });

        it('should not create reservation with invalid seat', async () => {
            // Primeiro, criar uma reserva
            await request(app)
                .post('/api/reservations')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    flightId: testFlight._id,
                    passengerName: 'John Doe',
                    passengerEmail: 'john@example.com',
                    passengerDocument: '123.456.789-00',
                    seatNumber: '10A'
                });

            // Tentar criar outra reserva com o mesmo assento
            const res = await request(app)
                .post('/api/reservations')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    flightId: testFlight._id,
                    passengerName: 'Jane Doe',
                    passengerEmail: 'jane@example.com',
                    passengerDocument: '987.654.321-00',
                    seatNumber: '10A'
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Assento já reservado');
        });
    });

    describe('GET /api/reservations/:code', () => {
        let reservation;

        beforeEach(async () => {
            reservation = await Reservation.create({
                flight: testFlight._id,
                passengerName: 'John Doe',
                passengerEmail: 'john@example.com',
                passengerDocument: '123.456.789-00',
                seatNumber: '11A',
                reservationCode: 'TEST-123'
            });
        });

        it('should get reservation by code', async () => {
            const res = await request(app)
                .get(`/api/reservations/code/${reservation.reservationCode}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('reservationCode', 'TEST-123');
        });

        it('should return 404 for non-existent reservation', async () => {
            const res = await request(app)
                .get('/api/reservations/code/NONEXISTENT')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /api/reservations/:id', () => {
        let reservation;

        beforeEach(async () => {
            reservation = await Reservation.create({
                flight: testFlight._id,
                passengerName: 'John Doe',
                passengerEmail: 'john@example.com',
                passengerDocument: '123.456.789-00',
                seatNumber: '12A',
                reservationCode: 'TEST-456'
            });
        });

        it('should cancel reservation', async () => {
            const res = await request(app)
                .delete(`/api/reservations/${reservation._id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Reserva cancelada com sucesso');

            // Verificar se o assento foi liberado
            const updatedFlight = await Flight.findById(testFlight._id);
            expect(updatedFlight.reservedSeats).not.toContain('12A');
        });
    });
});
