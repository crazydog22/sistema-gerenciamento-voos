import express from 'express';
import ReservationController from '../controllers/ReservationController.js';

const router = express.Router();

// Rotas para reservas
router.get('/flights/:flightId/reservations', ReservationController.getFlightReservations);
router.post('/flights/:flightId/reservations', ReservationController.createReservation);
router.get('/reservations/code/:code', ReservationController.getReservationByCode);
router.post('/reservations/:id/cancel', ReservationController.cancelReservation);

export default router;
