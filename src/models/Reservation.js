import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    flight: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true
    },
    passengerName: {
        type: String,
        required: true,
        trim: true
    },
    passengerEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    passengerDocument: {
        type: String,
        required: true,
        trim: true
    },
    seatNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'pending'],
        default: 'pending'
    },
    reservationCode: {
        type: String,
        unique: true,
        required: true
    }
}, {
    timestamps: true
});

// Gera um código de reserva único
reservationSchema.pre('save', async function(next) {
    if (this.isNew) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const random = Math.random().toString(36).substring(2, 7).toUpperCase();
        this.reservationCode = `RES${year}${month}-${random}`;
    }
    next();
});

// Método para cancelar reserva
reservationSchema.methods.cancel = async function() {
    this.status = 'cancelled';
    const flight = await mongoose.model('Flight').findById(this.flight);
    if (flight) {
        flight.availableSeats += 1;
        await flight.save();
    }
    return this.save();
};

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
