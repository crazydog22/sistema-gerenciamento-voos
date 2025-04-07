import axios from 'axios';
import config from '../config/environment.js';

class WeatherService {
    constructor() {
        this.apiKey = config.weather.apiKey;
        this.baseUrl = config.weather.baseUrl;
    }

    /**
     * Busca informações do clima para uma cidade
     * @param {string} city - Nome da cidade
     * @returns {Promise<Object>} Informações do clima
     */
    async getWeatherForCity(city) {
        try {
            const response = await axios.get(`${this.baseUrl}/current.json`, {
                params: {
                    key: this.apiKey,
                    q: city
                }
            });

            return {
                temperature: response.data.current.temp_c,
                conditions: response.data.current.condition.text,
                updatedAt: new Date()
            };
        } catch (error) {
            console.error(`Erro ao buscar clima para ${city}:`, error.message);
            throw new Error(`Não foi possível obter informações do clima para ${city}`);
        }
    }

    /**
     * Atualiza informações do clima para um voo
     * @param {Object} flight - Instância do modelo Flight
     * @returns {Promise<Object>} Voo atualizado com informações do clima
     */
    async updateFlightWeather(flight) {
        try {
            const weatherInfo = await this.getWeatherForCity(flight.destination);
            flight.weatherInfo = weatherInfo;
            return await flight.save();
        } catch (error) {
            console.error('Erro ao atualizar clima do voo:', error.message);
            // Não propaga o erro para não interromper outras operações
            return flight;
        }
    }
}

export default new WeatherService();
