//Dependencies
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()
const path = require('path')

//Import from weather model
const Weather = require('./models/weather')

// Setup inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG)

// Events for when connection opens/disconnects/errors
mongoose.connection
    .on('open', () => console.log('Connected to Mongoose'))
    .on('close', () => console.log('Disconnected from Mongoose'))
    .on('error', (err) => console.log('An error occurred: \n', err))

// Create our Express Application
const app = express()

/////////////////////////////////////
//// Middleware                  ////
/////////////////////////////////////
app.use(morgan('tiny')) 
app.use(express.urlencoded({ extended: true })) 
app.use(express.static('public')) 
app.use(express.json())

// Routing
app.get('/', (req, res) => {
    res.send('Server is live, ready for requests')
})

// Seed the Database
app.get('/weather/seed', (req, res) => {
    const startWeather = [
        { name: 'Sunny',  humidity: 'low', needUmbrella: false },
        { name: 'Cloudy', humidity: 'high', needUmbrella: false },
        { name: 'Rain', humidity: 'high', needUmbrella: true },
        { name: 'Snow', humidity: 'low', needUmbrella: true },
        { name: 'Windy', humidity: 'high', needUmbrella: false },
        { name: 'Foggy', humidity: 'high', needUmbrella: false },
    ]
    // Delete every weather pattern in the database
    Weather.deleteMany({}).then((data) => {
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
// app.get('/weather', (req, res) => {
//     // find all the Weather patterns
//     Weather.find({})
//         .then((weather) => { 
//             res.json({ weather: weather })
//         })
//         .catch(err => console.log('The following error occurred: \n', err))
// })
app.get("/weather", (req, res) => {
    Weather.find({}, (err, fruits) => {
      res.json({ weather: weather })
    })
  })

//CREATE route

app.post('/weather', (req, res) => {
    const newWeather = req.body
    Weather.create(newWeather)
    // send user 201 Created message and the newly created weather pattern.
        .then(weather => {
            res.status(201).json({ weather: weather.toObject() })
        })
        // send an error if one occurs
        .catch((err) => console.log(err))
})

// // PUT route
// // Update -> updates a specific weather
// // PUT replaces the entire document with a new document from the req.body
// // PATCH is able to update specific fields at specific times, but it requires a little more code to ensure that it works properly, so we'll use that later
// app.put('/weather/:id', (req, res) => {
//     // save the id to a variable for easy use later
//     const id = req.params.id
//     // save the request body to a variable for easy reference later
//     const updatedWeather = req.body
//     // we're going to use the mongoose method:
//     // findByIdAndUpdate
//     // eventually we'll change how this route works, but for now, we'll do everything in one shot, with findByIdAndUpdate
//     Weather.findByIdAndUpdate(id, updatedWeather, { new: true })
//         .then(weather => {
//             console.log('the newly updated weather', weather)
//             // update success message will just be a 204 - no content
//             res.sendStatus(204)
//         })
//         .catch(err => console.log(err))
// })
// // DELETE route
// // Delete -> delete a specific weather pattern
// app.delete('/weather/:id', (req, res) => {
//     // get the id from the req
//     const id = req.params.id
//     // find and delete the weather patter
//     Weather.findByIdAndRemove(id)
//         // send a 204 if successful
//         .then(() => {
//             res.sendStatus(204)
//         })
//         // send an error if not
//         .catch(err => console.log(err))
// })

// // SHOW route
// // Read -> finds and displays a single resource
// app.get('/weather/:id', (req, res) => {
//     // get the id -> save to a variable
//     const id = req.params.id
//     // use a mongoose method to find using that id
//     Weather.findById(id)
//         // send the weather pattern as json upon success
//         .then(weather => {
//             res.json({ weather: weather })
//         })
//         // catch any errors
//         .catch(err => console.log(err))
// })



// Server Listener
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening to the sweet sounds of port: ${PORT}`))

// END