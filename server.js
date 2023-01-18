const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()
const path = require('path')

const Weather = require('./models/weather')

const DATABASE_URL = process.env.DATABASE_URL

const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(DATABASE_URL, CONFIG)

mongoose.connection
    .on('open', () => console.log('Connected to Mongoose'))
    .on('close', () => console.log('Disconnected from Mongoose'))
    .on('error', (err) => console.log('An error occurred: \n', err))

const app = express()

/////////////////////////////////////
//// Middleware                  ////
/////////////////////////////////////
// middleware runs before all the routes.
// every request is processed through our middleware before mongoose can do anything with it
app.use(morgan('tiny')) // this is for request loggging, the 'tiny' argument declares what size of morgan log to use
app.use(express.urlencoded({ extended: true })) //this parses urlEncoded request bodies(useful for POST and PUT requests)
app.use(express.static('public')) // this serves static files from the 'public' folder
app.use(express.json()) // parses incoming request payloads with JSON

app.get('/', (req, res) => {
    res.send('Server is live, ready for requests')
})

// we're going to build a seed route
// this will seed the database for us with a few starter resources
// There are two ways we will talk about seeding the database
// First -> seed route, they work but they are not best practices
// Second -> seed script, they work and they ARE best practices
app.get('/weather/seed', (req, res) => {
    // array of starter resources(weather)
    const startWeather = [
        { name: Sunny,  humidity: low, needUmbrella: false },
        { name: Cloudy, humidity: high, needUmbrella: false },
        { name: Rain, humidity: high, needUmbrella: true },
        { name: Snow, humidity: low, needUmbrella: true },
        { name: Windy, humidity: high, needUmbrella: false },
        { name: Foggy, humidity: high, needUmbrella: false }
    ]
    // then we delete every weather pattern in the database(all instances of this resource)
    Weather.deleteMany({})
        .then(() => {
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
// Read -> finds and displays all weather
app.get('/weather', (req, res) => {
    // find all the weather
    Weather.find({})
        // send json if successful
        .then(weather => { res.json({ weather: weather })})
        // catch errors if they occur
        .catch(err => console.log('The following error occurred: \n', err))
})

// CREATE route
// Create -> receives a request body, and creates a new document in the database
app.post('/weather', (req, res) => {
    // here, we'll have something called a request body
    // inside this function, that will be called req.body
    // we want to pass our req.body to the create method
    const newWeather = req.body
    Weather.create(newWeather)
        // send a 201 status, along with the json response of the new weather
        .then(weather => {
            res.status(201).json({ weather: weather.toObject() })
        })
        // send an error if one occurs
        .catch(err => console.log(err))
})

// PUT route
// Update -> updates a specific weather
// PUT replaces the entire document with a new document from the req.body
// PATCH is able to update specific fields at specific times, but it requires a little more code to ensure that it works properly, so we'll use that later
app.put('/weather/:id', (req, res) => {
    // save the id to a variable for easy use later
    const id = req.params.id
    // save the request body to a variable for easy reference later
    const updatedWeather = req.body
    // we're going to use the mongoose method:
    // findByIdAndUpdate
    // eventually we'll change how this route works, but for now, we'll do everything in one shot, with findByIdAndUpdate
    Weather.findByIdAndUpdate(id, updatedWeather, { new: true })
        .then(weather => {
            console.log('the newly updated weather', weather)
            // update success message will just be a 204 - no content
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})
// DELETE route
// Delete -> delete a specific weather pattern
app.delete('/weather/:id', (req, res) => {
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
// Read -> finds and displays a single resource
app.get('/weather/:id', (req, res) => {
    // get the id -> save to a variable
    const id = req.params.id
    // use a mongoose method to find using that id
    Weather.findById(id)
        // send the weather pattern as json upon success
        .then(weather => {
            res.json({ weather: weather })
        })
        // catch any errors
        .catch(err => console.log(err))
})


/////////////////////////////////////
//// Server Listener             ////
/////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening to the sweet sounds of port: ${PORT}`))

// END