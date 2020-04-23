const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//load user model
const User = require('../models/User')

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            //find user
            let error = ''
            User.findOne({email: email})
                .then(user => {
                    if (!user) {
                        console.log("That email is not registered")
                        return done(null, false, {message: 'That email is not registered'});
                    }
                    //check pass
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            console.log("Password is incorrect")
                            return done(null, false, {message: 'Password is incorrect'});
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    //passport ref
    passport.serializeUser(function(user, done){
        done(null, user.id)
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
            console.log("User logged in")
        });
    });
}