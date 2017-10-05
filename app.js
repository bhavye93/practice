const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose'); 
const path = require('path');

mongoose.connect('mongodb://bhavye:bhavye@ds149874.mlab.com:49874/assignment');

mongoose.connection.on('connected', () => {
    console.log("connected to database");
});

mongoose.connection.on( 'error', (err) => {
    console.log("db error: " + err);
});


const app = express();
const port = 3000;

// CORS Middleware
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());

require('./config/passport')(passport);

app.use(express.static(path.join(__dirname, "public")));

// define and setup route for users
const users = require('./routes/users');
app.use('/users', users);

const appointments = require('./routes/appointments');
app.use('/appointments', appointments);

// Start Server
app.listen(port, function() {
    console.log('server started on port: '+ port);
});


app.get('/', (req, res) => {
    res.send("Node server running on port: " + port);
});