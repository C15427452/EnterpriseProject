//importing libraries needed
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongodb = require('mongodb');

//User model
const User = require('../models/User');

//Login page
router.get('/login', function(req, res) {

    res.render('login', {msg: res.error})
})

//Logout method
router.get('/logout', (req, res) => {
    req.logout();
    console.log("User logged out");
    res.redirect('/')
})

//Register method
router.get('/register', (req, res) => res.render('register', {msg: res.error}))

//Delete Account method
router.get('/delete', (req, res) => {
    //User.deleteOne(req.user._id)
    User.deleteOne({_id: new mongodb.ObjectID(req.user._id)})
        .then(user => {
            console.log("Goodbye :" + req.user.first_name);
            res.redirect('/') //one account deleted go to home
        })
        .catch(err => console.log(err))
})

//Update Account method
router.get('/update', (req, res) => {

    //passing information from database to profile page
    res.render('editProfile', {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
    });
})

//Update Profile handler
router.post('/edit', function (req, res, next) {

    //updates html form body and updates to user id
    User.updateOne({_id: req.user._id}, {$set: req.body}, function (err){
        if (err) console.log(err);
        res.redirect('/profile') //redirecting to profile page
    });
})

//Register handler
router.post('/register', (req, res) => {
    //getting form data
    const {first_name, last_name, email, password, password2} = req.body

    let error = '';

    //check required fields
    if(!first_name || !last_name || !email || !password || !password2){
        error = 'Please fill out all fields';
        //passing in error and input that was filled
        res.render('register', {msg:error,
            first_name,
            last_name,
            email})
    }
    //check if passwords match
    else if(password2 !== password){
        error = 'Passwords do not match';
        //passing in error and input that was filled
        res.render('register', {msg:error,
            first_name,
            last_name,
            email})
    }
    //check password length
    else if(password.length < 6){
        error = 'Password must be at least 6 characters';
        //passing in error and input that was filled
        res.render('register', {msg:error,
            first_name,
            last_name,
            email})
    }
    else{
        //checking if email already exists in db
        User.findOne({email: email})
            .then(user => {
                //if user exists
                if(user){
                    error = 'An account with this email address already exists';
                    //passing in error and input that was filled
                    res.render('register', {msg:error,
                        first_name,
                        last_name,
                        email})
                }
                else{
                    //if user doesnt exists create new one
                    //passing data to user model
                    const newUser = new User({
                        first_name,
                        last_name,
                        email,
                        password
                    });
                    //hashing password for security purposes
                    //encrypting password with library
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) =>  {
                            if(err) throw err;

                            //setting password as hashed one
                            newUser.password = hash;

                            //save information to user model
                            newUser.save()
                                .then(user => {
                                    console.log("You are now registered");
                                    //redirect user to login and display message
                                    error = 'You are successfully registered please log in';
                                    res.render('login', {msg:error})
                                })
                                .catch(err => console.log(err))
                    }))
                }
            })
    }
})

//Login handler
router.post('/login', (req, res, next) => {
    //using passport library to handle authentication when logging in
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

module.exports = router;