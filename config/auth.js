module.exports = {
    ensureAuth: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        console.log("Please log in to view profile")
        res.redirect('/users/login')
    }
}