/**
 * Middleware para validação de dados de voos
 */

/**
 * Valida os dados de entrada para criação/atualização de voos
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função next do Express
 */
export const validateFlightInput = (req, res, next) => {
    const { numeroVoo, origem, destino, dataPartida, capacidade } = req.body;
    const errors = [];

    // Validação do número do voo (deve ser uma string não vazia)
    if (!numeroVoo || typeof numeroVoo !== 'string' || numeroVoo.trim() === '') {
        errors.push('Número do voo é obrigatório e deve ser uma string válida');
    }

    // Validação da origem (deve ser uma string não vazia)
    if (!origem || typeof origem !== 'string' || origem.trim() === '') {
        errors.push('Origem é obrigatória e deve ser uma string válida');
    }

    // Validação do destino (deve ser uma string não vazia e diferente da origem)
    if (!destino || typeof destino !== 'string' || destino.trim() === '') {
        errors.push('Destino é obrigatório e deve ser uma string válida');
    } else if (destino.trim().toLowerCase() === origem?.trim().toLowerCase()) {
        errors.push('Destino deve ser diferente da origem');
    }

    // Validação da data de partida
    if (!dataPartida) {
        errors.push('Data de partida é obrigatória');
    } else {
        const dataPartidaObj = new Date(dataPartida);
        if (isNaN(dataPartidaObj.getTime())) {
            errors.push('Data de partida inválida');
        } else if (dataPartidaObj < new Date()) {
            errors.push('Data de partida deve ser futura');
        }
    }

    // Validação da capacidade (deve ser um número positivo)
    if (!capacidade || typeof capacidade !== 'number' || capacidade <= 0) {
        errors.push('Capacidade deve ser um número positivo');
    }

    // Se houver erros, retorna status 400 com a lista de erros
    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Erro de validação',
            errors
        });
    }

    // Se não houver erros, continua para o próximo middleware/controller
    next();
};
