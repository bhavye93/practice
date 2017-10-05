const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database');


router.post('/register', (req, res, next) => {
    
    let newUser = User({
        name : req.body.name,
        username: req.body.username,
        password: req.body.password,
        canBook : req.body.canBook,
        hours: req.body.hours,
        minutes: req.body.minutes
    });

    User.addUser(newUser, (err, user) => {
        if(err) {
            res.json({success:false, msg: "Failed to register user" });
        }
        else {
            res.json({ success:true, msg: "User registered"});
        }
    }); 
});

router.get('/profile', passport.authenticate('jwt', {session:false}),  (req, res, next) => {
    res.json({user: { 
        _id: req.user._id,
        username: req.user.username, 
        name: req.user.name,
        canBook: req.user.canBook,
        hours: req.user.hours,
        minutes: req.user.minutes
    } });
});

router.post('/authenticate', (req, res, next)=> {
    
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err)
            throw err;

        if(!user) {
            return res.json({success:false, msg:"User not found"});
        }

        User.comparePassword(password, user.password, (err, isMatch)=> {
            
            if(err) throw err;
            
            if(isMatch) {
                
                const token = jwt.sign({user:user}, config.secret, {
                    expiresIn: 1800 // 30 minutes                   
                });
                
                res.json({
                    success: true,
                    token : "JWT " + token,
                    user : {
                        _id: user._id,
                        username: user.username,
                        name: user.name,
                        canBook: user.canBook,
                        hours: user.hours,
                        minutes: user.minutes
                    }
                });
            } else {
                return res.json({success: false, msg: "Wrong Password"});
            }
        });

    });
});

module.exports = router;