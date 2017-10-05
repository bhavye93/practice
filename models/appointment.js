const mongoose = require('mongoose');

const AppointmentSchema = mongoose.Schema({

    bookedBy : {
        type: String
    },

    date : {
        type: Date
    }

});

const Appointment = module.exports = mongoose.model('Appointment', AppointmentSchema);

module.exports.getAllAppointments = function(callback) {
    Appointment.find(callback);
}

module.exports.addAppointment = function(newAppointment, callback) {
    newAppointment.save(callback);
}