import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
    flightNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    origin: {
        type: String,
        required: true,
        trim: true
    },
    destination: {
        type: String,
        required: true,
        trim: true
    },
    departureDate: {
        type: Date,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true,
        min: 1
    },
    availableSeats: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    reservedSeats: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['scheduled', 'delayed', 'cancelled', 'completed'],
        default: 'scheduled'
    },
    weatherInfo: {
        temperature: Number,
        conditions: String,
        lastUpdated: Date
    }
}, {
    timestamps: true
});

// Middleware para garantir que availableSeats não seja maior que totalSeats
flightSchema.pre('save', function(next) {
    if (this.availableSeats > this.totalSeats) {
        this.availableSeats = this.totalSeats;
    }
    next();
});

// Método para verificar disponibilidade de assento
flightSchema.methods.isSeatAvailable = function(seatNumber) {
    return !this.reservedSeats.includes(seatNumber);
};

// Método para reservar assento
flightSchema.methods.reserveSeat = function(seatNumber) {
    if (this.isSeatAvailable(seatNumber)) {
        this.reservedSeats.push(seatNumber);
        this.availableSeats -= 1;
        return true;
    }
    return false;
};

// Método para liberar assento
flightSchema.methods.releaseSeat = function(seatNumber) {
    const index = this.reservedSeats.indexOf(seatNumber);
    if (index > -1) {
        this.reservedSeats.splice(index, 1);
        this.availableSeats += 1;
        return true;
    }
    return false;
};

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;
