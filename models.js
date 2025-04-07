/**
 * Modelo de aeroporto.
 *
 * @typedef {Object} Aeroporto
 * @property {string} id - ID do aeroporto.
 * @property {string} nome - Nome do aeroporto.
 * @property {string} cidade - Cidade do aeroporto.
 * @property {string} estado - Estado do aeroporto.
 */
class Aeroporto {
  // ...
}// filepath: backend/models/Flight.js 
import mongoose from 'mongoose';

/**
 * Flight schema 
 * @typedef {Object} Flight 
 * @property {string} flightNumber 
 * @property {string} departure 
 * @property {string} arrival 
 * @property {Date} date 
 * @typedef {Object} Flight
 * @property {string} flightNumber
 * @property {string} departure
 * @property {string} arrival
 * @property {Date} date
 */
const flightSchema = new mongoose.Schema({
  flightNumber: String,
  departure: String,
  arrival: String,
  date: Date,
});

export default mongoose.model('Flight', flightSchema); 
