//importing libraries needed
const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../config/auth');
const axios = require('axios');

//body parser
router.use(express.json());

//Home page method
//Loading movies using TMDB API for Home page
router.get('/', (req, res) => {
    //using the axios library to utilize the tmdb api
    axios.get(
        "https://api.themoviedb.org/3/movie/popular?api_key=cf6207f94f14ff54bd0e2f850d23de55"
    )
        .then(response => {
            //check results coming from api
            let data = response.data.results;

            let movies = []

            //loop through api results
            for (let i = 0; i < data.length; i++) {
                //pushing movie data to array
                movies.push({
                    title: data[i].title,
                    poster_path: "https://image.tmdb.org/t/p/w185_and_h278_bestv2" + data[i].poster_path,
                    overview: data[i].overview, vote_average: data[i].vote_average
                });
            }
            //passing movie array to home page
            res.render('home', {movies: movies});
        })
        .catch(err => console.log(err))
})

//Profile page method
router.get('/profile', ensureAuth, (req, res) =>
    //passing profile information to display on page
    res.render('profile', {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email
    }));

//Loading search movies using TMDB API
router.post("/addMovies", (req, res, next) => {
    const {searchText} = req.body

    //checking for search text entered
    if(searchText !== null){

        let pageNum = 1;

        //using the axios library to utilize the tmdb api
        axios.get(
                "https://api.themoviedb.org/3/search/movie?api_key=cf6207f94f14ff54bd0e2f850d23de55"
            +"&page=" + pageNum + "&query=" + searchText
            )
            .then(response => {
                let data = response.data.results;
                let movies = []
                for (let i = 0; i < data.length; i++) {
                    movies.push({ title: data[i].title,
                        poster_path: "https://image.tmdb.org/t/p/w185_and_h278_bestv2" + data[i].poster_path,
                        overview: data[i].overview, vote_average: data[i].vote_average});
                }
                //passing movie array to search page
                res.render('searchResults.ejs', { movies: movies });
            })
            .catch(err => console.log(err))
    }
    else{
        console.log("Nothing entered");
        res.redirect('/')
    }
});

module.exports = router