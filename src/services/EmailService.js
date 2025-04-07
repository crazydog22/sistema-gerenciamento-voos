import nodemailer from 'nodemailer';
import config from '../config/environment.js';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.email.user,
                pass: config.email.password
            }
        });
    }

    async sendReservationConfirmation(reservation, flight) {
        try {
            const mailOptions = {
                from: config.email.from,
                to: reservation.passengerEmail,
                subject: `❤️ Reserva Especial - Voo ${flight.flightNumber} ❤️`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #e91e63; text-align: center;">Confirmação de Reserva Especial</h1>
                        
                        <div style="background-color: #fce4ec; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            <h2 style="color: #c2185b;">Para meu amor ❤️</h2>
                            <p style="font-size: 16px; color: #333;">Querida ${reservation.passengerName},</p>
                            <p style="font-size: 16px; color: #333;">Esta é uma reserva muito especial para uma pessoa muito especial! 💑</p>
                            <p style="font-size: 16px; color: #333;">Mal posso esperar para viajar com você e criar mais memórias juntos! 🥰</p>
                        </div>

                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
                            <h2 style="color: #c2185b;">Detalhes da Nossa Viagem</h2>
                            <p><strong>Número do Voo:</strong> ${flight.flightNumber} ✈️</p>
                            <p><strong>Origem:</strong> ${flight.origin} 🌆</p>
                            <p><strong>Destino:</strong> ${flight.destination} 🌅</p>
                            <p><strong>Data/Hora:</strong> ${new Date(flight.departureDate).toLocaleString()} 📅</p>
                            <p><strong>Seu Assento:</strong> ${reservation.seatNumber} 💺</p>
                        </div>

                        <div style="text-align: center; margin-top: 20px; color: #e91e63;">
                            <p style="font-size: 18px;">Te amo muito! ❤️</p>
                            <p style="font-size: 16px;">Vamos juntos nessa aventura! 🚀</p>
                        </div>
                    </div>
                `
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email enviado:', info.messageId);
            return true;
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            return false;
        }
    }

    async sendReservationCancellation(reservation, flight) {
        try {
            const mailOptions = {
                from: config.email.from,
                to: reservation.passengerEmail,
                subject: `Cancelamento de Reserva - Voo ${flight.flightNumber}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #2c3e50; text-align: center;">Cancelamento de Reserva</h1>
                        
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            <h2 style="color: #e74c3c;">Reserva Cancelada</h2>
                            <p><strong>Código da Reserva:</strong> ${reservation.reservationCode}</p>
                            <p><strong>Voo:</strong> ${flight.flightNumber}</p>
                            <p><strong>Data/Hora:</strong> ${new Date(flight.departureDate).toLocaleString()}</p>
                        </div>

                        <div style="text-align: center; margin-top: 20px; color: #7f8c8d;">
                            <p>Esperamos poder atendê-lo em uma próxima oportunidade.</p>
                        </div>
                    </div>
                `
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email enviado:', info.messageId);
            return true;
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            return false;
        }
    }
}

export default new EmailService();
