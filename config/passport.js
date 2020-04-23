//importing libraries needed
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

//load user model
const User = require('../models/User');

//export strategy, taking in passes passport object
module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            //check if user email exists and then check is password is correct
            User.findOne({email: email})
                .then(user => {
                    if (!user) {
                        console.log("That email is not registered");
                        return done(null, false);
                    }
                    //check if password matches with db one, decrypting pass to check
                    bcrypt.compare(password, user.password, (err, matchesDBPassword) => {
                        if (err) throw err;
                        if (matchesDBPassword) {
                            return done(null, user);
                        } else {
                            console.log("Password is incorrect");
                            return done(null, false);
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    //http://www.passportjs.org/docs/authenticate/
    //passport ref
    passport.serializeUser(function(user, done){
        done(null, user.id)
    });

    //find user and check is logged in
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
            console.log("User logged in")
        });
    });
}