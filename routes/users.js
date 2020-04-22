const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
var mongodb = require('mongodb');

//User model
const User = require('../models/User')

//Login page
router.get('/login', (req, res) => res.render('login'))

//Logout page
router.get('/logout', (req, res) => {
    req.logout();
    console.log("User logged out")
    res.redirect('/')
})

//Register page
router.get('/register', (req, res) => res.render('register'))

//Delete Account
router.get('/delete', (req, res) => {
    //User.deleteOne(req.user._id)
    User.deleteOne({_id: new mongodb.ObjectID(req.user._id)})
        .then(user => {
            console.log("Goodbye :" + req.user.first_name)
            res.redirect('/')
        })
        .catch(err => console.log(err))
})

//Update Account
router.get('/update', (req, res) => {

    res.render('editProfile', {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
    });
    console.log(req.user._id)
})
router.post('/edit', function (req, res, next) {

    //console.log(req.user._id) //console like this

    User.updateOne({_id: req.user._id}, {$set: req.body}, function (err){
        if (err) console.log(err);
        res.render('home', {
            user: req.user
        });
    });
})

//Handlers
router.post('/register', (req, res) => {
    const {first_name, last_name, email, password, password2} = req.body

    //check required fields
    if(!first_name || !last_name || !email || !password || !password2){
        console.log('Please fill out all field')
    }
    //check if passwords match
    if(password !== password2){
        console.log('Passwords do not match')
    }
    //check password length
    if(password.length < 6){
        console.log('Password must be at least 6 characters')
    }
    else{
        User.findOne({email: email})
            .then(user => {
                if(user){
                    console.log('User exists')
                    res.render('register')
                }
                else{
                    const newUser = new User({
                        first_name,
                        last_name,
                        email,
                        password
                    });
                    //hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) =>  {
                            if(err) throw err;

                            newUser.password = hash;

                            newUser.save()
                                .then(user => {
                                    console.log("You are now registered")
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                    }))
                }
            })
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

module.exports = router