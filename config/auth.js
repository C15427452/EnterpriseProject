module.exports = {
    //checking is user is already logged in
    ensureAuth: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        //if not logged in redirect to login screen
        console.log("Please log in to view profile");
        let error = 'Please log in to view your profile';
        res.render('login', {msg:error})
    }
}