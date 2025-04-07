import express from 'express';
import FlightController from '../controllers/FlightController';
import { validateFlightInput } from '../middleware/flightValidation';

/**
 * Express router for flight management endpoints
 * @type {express.Router}
 */
const router = express.Router();

/**
 * @route GET /api/flights
 * @desc Get all flights
 */
router.get('/flights', async (req, res) => {
    try {
        const flights = await FlightController.getAllFlights();
        res.status(200).json(flights);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching flights', error: error.message });
    }
});

/**
 * @route POST /api/flights
 * @desc Create a new flight
 */
router.post('/flights', validateFlightInput, async (req, res) => {
    try {
        const newFlight = await FlightController.createFlight(req.body);
        res.status(201).json(newFlight);
    } catch (error) {
        res.status(400).json({ message: 'Error creating flight', error: error.message });
    }
});

/**
 * @route PUT /api/flights/:id
 * @desc Update a flight by ID
 */
router.put('/flights/:id', validateFlightInput, async (req, res) => {
    try {
        const updatedFlight = await FlightController.updateFlight(req.params.id, req.body);
        if (!updatedFlight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        res.status(200).json(updatedFlight);
    } catch (error) {
        res.status(400).json({ message: 'Error updating flight', error: error.message });
    }
});

/**
 * @route DELETE /api/flights/:id
 * @desc Delete a flight by ID
 */
router.delete('/flights/:id', async (req, res) => {
    try {
        const result = await FlightController.deleteFlight(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        res.status(200).json({ message: 'Flight deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting flight', error: error.message });
    }
});

export default router;
