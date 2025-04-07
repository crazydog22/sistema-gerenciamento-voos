import express from 'express';
import FlightController from '../controllers/FlightController.js';
import { validateFlightInput, validateFlightId } from '../middleware/flightValidation.js';

const router = express.Router();

/**
 * @route GET /api/flights
 * @desc Lista todos os voos
 * @access Public
 */
router.get('/flights', FlightController.getAllFlights);

/**
 * @route GET /api/flights/:id
 * @desc Busca um voo pelo ID
 * @access Public
 */
router.get('/flights/:id', validateFlightId, FlightController.getFlightById);

/**
 * @route POST /api/flights
 * @desc Cria um novo voo
 * @access Private
 */
router.post('/flights', validateFlightInput, FlightController.createFlight);

/**
 * @route PUT /api/flights/:id
 * @desc Atualiza um voo existente
 * @access Private
 */
router.put('/flights/:id', [validateFlightId, validateFlightInput], FlightController.updateFlight);

/**
 * @route DELETE /api/flights/:id
 * @desc Remove um voo
 * @access Private
 */
router.delete('/flights/:id', validateFlightId, FlightController.deleteFlight);

/**
 * @route POST /api/flights/:id/reserve
 * @desc Reserva assentos em um voo
 * @access Public
 */
router.post('/flights/:id/reserve', validateFlightId, FlightController.reserveSeats);

export default router;
