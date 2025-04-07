import Flight from '../models/Flight.js';
import WeatherService from '../services/WeatherService.js';

class FlightController {
    /**
     * Lista todos os voos
     */
    async getAllFlights(req, res) {
        try {
            const flights = await Flight.find().sort({ departureDate: 1 });
            res.status(200).json(flights);
        } catch (error) {
            res.status(500).json({
                message: 'Erro ao buscar voos',
                error: error.message
            });
        }
    }

    /**
     * Busca um voo pelo ID
     */
    async getFlightById(req, res) {
        try {
            const flight = await Flight.findById(req.params.id);
            if (!flight) {
                return res.status(404).json({ message: 'Voo não encontrado' });
            }
            res.status(200).json(flight);
        } catch (error) {
            res.status(500).json({
                message: 'Erro ao buscar voo',
                error: error.message
            });
        }
    }

    /**
     * Cria um novo voo
     */
    async createFlight(req, res) {
        try {
            const flight = new Flight(req.body);
            
            // Busca informações do clima para o destino
            await WeatherService.updateFlightWeather(flight);
            
            await flight.save();
            res.status(201).json(flight);
        } catch (error) {
            res.status(400).json({
                message: 'Erro ao criar voo',
                error: error.message
            });
        }
    }

    /**
     * Atualiza um voo existente
     */
    async updateFlight(req, res) {
        try {
            const flight = await Flight.findById(req.params.id);
            if (!flight) {
                return res.status(404).json({ message: 'Voo não encontrado' });
            }

            // Atualiza os campos do voo
            Object.assign(flight, req.body);
            
            // Atualiza informações do clima se o destino foi alterado
            if (flight.isModified('destination')) {
                await WeatherService.updateFlightWeather(flight);
            }

            await flight.save();
            res.status(200).json(flight);
        } catch (error) {
            res.status(400).json({
                message: 'Erro ao atualizar voo',
                error: error.message
            });
        }
    }

    /**
     * Remove um voo
     */
    async deleteFlight(req, res) {
        try {
            const flight = await Flight.findByIdAndDelete(req.params.id);
            if (!flight) {
                return res.status(404).json({ message: 'Voo não encontrado' });
            }
            res.status(200).json({ message: 'Voo removido com sucesso' });
        } catch (error) {
            res.status(500).json({
                message: 'Erro ao remover voo',
                error: error.message
            });
        }
    }

    /**
     * Reserva assentos em um voo
     */
    async reserveSeats(req, res) {
        try {
            const { quantity } = req.body;
            const flight = await Flight.findById(req.params.id);

            if (!flight) {
                return res.status(404).json({ message: 'Voo não encontrado' });
            }

            if (!quantity || quantity <= 0) {
                return res.status(400).json({ message: 'Quantidade de assentos inválida' });
            }

            await flight.reserveSeats(quantity);
            res.status(200).json(flight);
        } catch (error) {
            res.status(400).json({
                message: 'Erro ao reservar assentos',
                error: error.message
            });
        }
    }
}

export default new FlightController();
