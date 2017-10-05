const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({

    name : {
        type: String
    },

    username : {
        type: String,
        required :true
    }, 

    password : {
        type: String,
        required : true
    },

    canBook : {
        type: Boolean
    },

    hours : {
        type: Number
    }, 

    minutes : {
        type: Number
    }

});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function (id, callback) {
    User.findById(id,callback);
}

module.exports.getUserByUsername = function(username, callback) {
    const query = {username: username};
    User.findOne(query,callback);
}

module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        if(err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function(password, hashedUserpw, callback) {
    bcrypt.compare(password, hashedUserpw, (err, isMatch)=>{
        if(err) throw err;
        callback(null, isMatch);
    });
}