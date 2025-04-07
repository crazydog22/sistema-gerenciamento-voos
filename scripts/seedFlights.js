import mongoose from 'mongoose';
import Flight from '../src/models/Flight.js';
import config from '../src/config/environment.js';

const seedFlights = async () => {
    try {
        // Conecta ao MongoDB
        await mongoose.connect(config.database.url);
        console.log('Conectado ao MongoDB');

        // Limpa a coleção de voos
        await Flight.deleteMany({});
        console.log('Coleção de voos limpa');

        // Cria voos de exemplo
        const flights = [
            {
                flightNumber: 'JJ1234',
                origin: 'São Paulo',
                destination: 'Rio de Janeiro',
                departureDate: new Date('2025-04-10T10:00:00Z'),
                totalSeats: 180,
                availableSeats: 180,
                price: 350.00,
                status: 'scheduled',
                reservedSeats: []
            },
            {
                flightNumber: 'AD4567',
                origin: 'Rio de Janeiro',
                destination: 'Salvador',
                departureDate: new Date('2025-04-11T14:30:00Z'),
                totalSeats: 150,
                availableSeats: 150,
                price: 500.00,
                status: 'scheduled',
                reservedSeats: []
            },
            {
                flightNumber: 'LA7890',
                origin: 'Brasília',
                destination: 'Recife',
                departureDate: new Date('2025-04-12T08:15:00Z'),
                totalSeats: 120,
                availableSeats: 120,
                price: 450.00,
                status: 'scheduled',
                reservedSeats: []
            }
        ];

        // Insere os voos no banco de dados
        await Flight.insertMany(flights);
        console.log('Voos de exemplo criados com sucesso');

        // Fecha a conexão
        await mongoose.connection.close();
        console.log('Conexão com MongoDB fechada');

    } catch (error) {
        console.error('Erro ao criar voos:', error);
        process.exit(1);
    }
};

// Executa o script
seedFlights();
