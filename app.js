//importing libraries needed
const express = require('express');
const expressLay = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
require('./config/passport')(passport);

//mongo config
const db = require('./config/keys').MongoURI;

//mongo connection
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

//ejs
app.use(expressLay);
app.set('view engine', 'ejs');

//body parser
app.use(express.urlencoded({ extended:false}));

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global var
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    next();
});

//setting application routes with route files
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//setting port to host web page
app.listen(4000, console.log('Server started on port 4000'));
