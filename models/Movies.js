const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    overview: {
        type: String,
        required: true
    },
    vote_average: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Movies = mongoose.model('Movies', MovieSchema)

module.exports = Movies