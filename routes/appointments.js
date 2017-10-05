const express = require('express');
const router = express.Router();
const passport = require('passport');
const Appointment = require('../models/appointment');


router.get('/fetchallappointments', passport.authenticate('jwt', { session: false }), (req, res, next) => {

    Appointment.getAllAppointments((err, appointments) => {

        if (err)
            throw err;

        if (!appointments) {
            return res.json({ success: false, msg: "No appointments to fetch" });
        } else {
            res.json({
                success: true,
                msg: "Success",
                appointments: appointments
            });
        }

    });
});

router.post('/makeappointment', passport.authenticate('jwt', { session: false }), (req, res, next) => {

    let newAppointment = new Appointment ({
        bookedBy: req.body.bookedby,
        date: req.body.date
    });

    Appointment.addAppointment(newAppointment, (err, appointment) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to book' });
        } else {
            res.json({ success: true, msg: 'Booked!' });
        }
    });

});

module.exports = router;