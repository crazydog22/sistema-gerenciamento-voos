/**
 * Middleware para validação de dados de voos
 */

/**
 * Valida os dados de entrada para criação/atualização de voos
 */
export const validateFlightInput = (req, res, next) => {
    const { flightNumber, origin, destination, departureDate, totalSeats, price } = req.body;
    const errors = [];

    // Validação do número do voo
    if (!flightNumber || typeof flightNumber !== 'string' || flightNumber.trim() === '') {
        errors.push('Número do voo é obrigatório e deve ser uma string válida');
    }

    // Validação da origem
    if (!origin || typeof origin !== 'string' || origin.trim() === '') {
        errors.push('Origem é obrigatória e deve ser uma string válida');
    }

    // Validação do destino
    if (!destination || typeof destination !== 'string' || destination.trim() === '') {
        errors.push('Destino é obrigatório e deve ser uma string válida');
    } else if (destination.trim().toLowerCase() === origin?.trim().toLowerCase()) {
        errors.push('Destino deve ser diferente da origem');
    }

    // Validação da data de partida
    if (!departureDate) {
        errors.push('Data de partida é obrigatória');
    } else {
        const departureDateObj = new Date(departureDate);
        if (isNaN(departureDateObj.getTime())) {
            errors.push('Data de partida inválida');
        } else if (departureDateObj < new Date()) {
            errors.push('Data de partida deve ser futura');
        }
    }

    // Validação da capacidade
    if (!totalSeats || typeof totalSeats !== 'number' || totalSeats <= 0) {
        errors.push('Número total de assentos deve ser um número positivo');
    }

    // Validação do preço
    if (!price || typeof price !== 'number' || price < 0) {
        errors.push('Preço deve ser um número não negativo');
    }

    // Se houver erros, retorna status 400 com a lista de erros
    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Erro de validação',
            errors
        });
    }

    // Define availableSeats igual à capacidade para novos voos
    if (!req.body.availableSeats) {
        req.body.availableSeats = totalSeats;
    }

    // Se não houver erros, continua para o próximo middleware/controller
    next();
};

/**
 * Valida o ID do voo nos parâmetros da requisição
 */
export const validateFlightId = (req, res, next) => {
    const { id } = req.params;
    
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            message: 'ID do voo inválido',
            error: 'O ID deve ser um ObjectId válido do MongoDB'
        });
    }

    next();
};
