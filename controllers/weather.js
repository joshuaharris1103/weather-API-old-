////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const mongoose = require('mongoose')
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Weather = require('./models/weather')

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////
// Routes
/////////////////////////////////////////
// Seed the Database
router.get('/weather/seed', (req, res) => {
    const startWeather = [
        { name: 'Sunny',  humidity: 'low', needUmbrella: false },
        { name: 'Cloudy', humidity: 'high', needUmbrella: false },
        { name: 'Rain', humidity: 'high', needUmbrella: true },
        { name: 'Snow', humidity: 'low', needUmbrella: true },
        { name: 'Windy', humidity: 'high', needUmbrella: false },
        { name: 'Foggy', humidity: 'high', needUmbrella: false },
    ]
    // Delete every weather pattern in the database
    Weather.deleteMany({}).then(() => {
        // then we'll seed(create) our starter weather
        Weather.create(startWeather)
            // tell our db what to do with success and failures
            .then(data => {
                res.json(data)
            })
            .catch(err => console.log('The following error occurred: \n', err))
        })
})

// INDEX route 
router.get('/weather', (req, res) => {
    // find all the Weather patterns
    Weather.find({})
        .then((weather) => { 
            res.json({ weather: weather })
        })
        .catch(err => console.log('The following error occurred: \n', err))
})

  
//CREATE route

router.post('/weather', (req, res) => {
    const newWeather = req.body
    Weather.create(newWeather)
    // send user 201 Created message and the newly created weather pattern.
        .then(weather => {
            res.status(201).json({ weather: weather.toObject() })
        })
        // send an error if one occurs
        .catch((err) => console.log(err))
})

// PUT route

router.put('/weather/:id', (req, res) => {
    // get the id from params
    const id = req.params.id
    // save the request body to a variable for easy reference later
    // const updatedWeather = req.body
    req.body.needUmbrella = req.body.needUmbrella === "on" ? true : false
    // find and update the weather
    Weather.findByIdAndUpdate(id, req.body.needUmbrella, { new: true })
        .then((weather) => {
            console.log('the newly updated weather', weather)
            // update success message will just be a 204 - no content
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})

// DELETE route
// Delete -> delete a specific weather pattern
router.delete('/weather/:id', (req, res) => {
    // get the id from the req
    const id = req.params.id
    // find and delete the weather patter
    Weather.findByIdAndRemove(id)
        // send a 204 if successful
        .then(() => {
            res.sendStatus(204)
        })
        // send an error if not
        .catch(err => console.log(err))
})

// SHOW route
router.get('/weather/:id', (req, res) => {
    // get the id -> save to a variable
    const id = req.params.id
    Weather.findById(id)
        // send the weather pattern as json upon success
        .then(weather => {
            res.json({ weather: weather })
        })
        .catch(err => console.log(err))
})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router