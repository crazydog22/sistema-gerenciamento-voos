import Reservation from '../models/Reservation.js';
import Flight from '../models/Flight.js';
import nodemailer from 'nodemailer';
import config from '../config/environment.js';
import EmailService from '../services/EmailService.js';

class ReservationController {
    /**
     * Lista todas as reservas de um voo
     */
    async getFlightReservations(req, res) {
        try {
            const reservations = await Reservation.find({ flight: req.params.flightId })
                .populate('flight', 'flightNumber departureDate');
            res.status(200).json(reservations);
        } catch (error) {
            res.status(500).json({
                message: 'Erro ao buscar reservas',
                error: error.message
            });
        }
    }

    /**
     * Cria uma nova reserva
     */
    async createReservation(req, res) {
        try {
            const { flightId } = req.params;
            const flight = await Flight.findById(flightId);

            if (!flight) {
                return res.status(404).json({
                    message: 'Voo não encontrado'
                });
            }

            // Verifica se o assento está disponível
            if (flight.availableSeats <= 0) {
                return res.status(400).json({ message: 'Não há assentos disponíveis' });
            }

            // Verifica se o assento está disponível
            const seatTaken = await Reservation.findOne({
                flight: flight._id,
                seatNumber: req.body.seatNumber,
                status: 'confirmed'
            });

            if (seatTaken) {
                return res.status(400).json({ message: 'Este assento já está ocupado' });
            }

            // Gera o código da reserva
            const date = new Date();
            const year = date.getFullYear().toString().slice(-2);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const random = Math.random().toString(36).substring(2, 7).toUpperCase();
            const reservationCode = `RES${year}${month}-${random}`;

            // Cria a reserva
            const reservation = new Reservation({
                ...req.body,
                flight: flight._id,
                reservationCode
            });

            // Atualiza os assentos disponíveis
            flight.availableSeats -= 1;
            await flight.save();

            await reservation.save();

            // Envia e-mail de confirmação
            await EmailService.sendReservationConfirmation(reservation, flight);

            res.status(201).json(reservation);
        } catch (error) {
            res.status(400).json({
                message: 'Erro ao criar reserva',
                error: error.message
            });
        }
    }

    /**
     * Cancela uma reserva
     */
    async cancelReservation(req, res) {
        try {
            const reservation = await Reservation.findById(req.params.id);
            if (!reservation) {
                return res.status(404).json({ message: 'Reserva não encontrada' });
            }

            await reservation.cancel();
            res.status(200).json({ message: 'Reserva cancelada com sucesso' });
        } catch (error) {
            res.status(400).json({
                message: 'Erro ao cancelar reserva',
                error: error.message
            });
        }
    }

    /**
     * Busca uma reserva pelo código
     */
    async getReservationByCode(req, res) {
        try {
            const { code } = req.params;
            const reservation = await Reservation.findOne({ reservationCode: code });

            if (!reservation) {
                return res.status(404).json({
                    message: 'Reserva não encontrada'
                });
            }

            res.status(200).json(reservation);
        } catch (error) {
            res.status(500).json({
                message: 'Erro ao buscar reserva',
                error: error.message
            });
        }
    }
}

export default new ReservationController();
