const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../config/auth');
const glide = require('glide');
const axios = require('axios')
const tmdb = require('tmdbv3').init("cf6207f94f14ff54bd0e2f850d23de55");

//Movies model
const Movies = require('../models/Movies')

//body parser
router.use(express.json());

router.get('/', (req, res) => {
    axios.get(
        "https://api.themoviedb.org/3/movie/popular?api_key=cf6207f94f14ff54bd0e2f850d23de55"
    )
        .then(response => {
            let page = response.data.total_pages;
            let data = response.data.results;
            //console.log(data)
            let movies = []
            for (let i = 0; i < data.length; i++) {
                movies.push({
                    title: data[i].title
                    //poster_path: "https://image.tmdb.org/t/p/w185_and_h278_bestv2" + data[i].poster_path,
                    //overview: data[i].overview, vote_average: data[i].vote_average, total_pages: page
                });
            }
            res.render('home', {movies: movies});
        })
        .catch(err => console.log(err))
})

router.get('/profile', ensureAuth, (req, res) =>
    res.render('profile', {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        password: req.user.password
    }));


router.get("/popular", (req, res) => {
        //let pageNum = 1;

        axios.get(
            "https://api.themoviedb.org/3/movie/popular?api_key=cf6207f94f14ff54bd0e2f850d23de55"
        )
            .then(response => {
                let page = response.data.total_pages;
                let data = response.data.results;
                //console.log(data)
                let movies = []
                for (let i = 0; i < data.length; i++) {
                    movies.push({
                        title: data[i].title,
                        poster_path: "https://image.tmdb.org/t/p/w185_and_h278_bestv2" + data[i].poster_path,
                        overview: data[i].overview, vote_average: data[i].vote_average, total_pages: page
                    });
                }
                res.render('searchResults.ejs', {movies: movies});
            })
            .catch(err => console.log(err))
    }
);

router.get("/latest", (req, res) => {
        //let pageNum = 1;

        axios.get(
            "https://api.themoviedb.org/3/movie/top_rated?api_key=cf6207f94f14ff54bd0e2f850d23de55"
        )
            .then(response => {
                let page = response.data.total_pages;
                let data = response.data.results;
                //console.log(data)
                let movies = []
                for (let i = 0; i < data.length; i++) {
                    movies.push({
                        title: data[i].title,
                        poster_path: "https://image.tmdb.org/t/p/w185_and_h278_bestv2" + data[i].poster_path,
                        overview: data[i].overview, vote_average: data[i].vote_average, total_pages: page
                    });
                }
                res.render('searchResults.ejs', {movies: movies});
            })
            .catch(err => console.log(err))
    }
);

router.get("/coming", (req, res) => {
        //let pageNum = 1;

        axios.get(
            "https://api.themoviedb.org/3/movie/upcoming?api_key=cf6207f94f14ff54bd0e2f850d23de55"
        )
            .then(response => {
                let page = response.data.total_pages;
                let data = response.data.results;
                //console.log(data)
                let movies = []
                for (let i = 0; i < data.length; i++) {
                    movies.push({
                        title: data[i].title
                        //poster_path: "https://image.tmdb.org/t/p/w185_and_h278_bestv2" + data[i].poster_path,
                        //overview: data[i].overview, vote_average: data[i].vote_average, total_pages: page
                    });
                }
                res.render('home.ejs', {movies: movies});
            })
            .catch(err => console.log(err))
    }
);

router.post("/addMovies", (req, res, next) => {
    const {searchText} = req.body

    if(searchText !== null){

        let pageNum = 1;

        axios.get(
                "https://api.themoviedb.org/3/search/movie?api_key=cf6207f94f14ff54bd0e2f850d23de55"
            +"&page=" + pageNum + "&query=" + searchText
            )
            .then(response => {
                let page = response.data.total_pages;
                let data = response.data.results;
                //console.log(data)
                let movies = []
                for (let i = 0; i < data.length; i++) {
                    movies.push({ title: data[i].title,
                        poster_path: "https://image.tmdb.org/t/p/w185_and_h278_bestv2" + data[i].poster_path,
                        overview: data[i].overview, vote_average: data[i].vote_average, total_pages: page});
                }
                res.render('searchResults.ejs', { movies: movies });
            })
            .catch(err => console.log(err))
    }
    else{
        console.log("Nothing entered")
        res.redirect('/')
    }
});

router.get("/movieDetails", (req, res) => {

})

module.exports = router