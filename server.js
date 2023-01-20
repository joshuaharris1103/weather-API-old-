//Dependencies
require("dotenv").config()
const express = require('express')
const morgan = require('morgan')
const path = require('path')
//Import from weather model
const Weather = require('./models/weather')


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


// Server Listener
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening to the sweet sounds of port: ${PORT}`))

// END