//////////////////////////////////////////////////////////////
//// Our schema and model for the fruit resource          ////
//////////////////////////////////////////////////////////////
const mongoose = require('mongoose') // import mongoose

// we'll destructure the Schema and model functions from mongoose
const { Schema, model } = mongoose

// make weather schema
const weatherSchema = new Schema({
    name: String,
    humidity: String,
    needUmbrella: Boolean,
})

// make the Weather model
const Weather = model('Weather', weatherSchema)

//////////////////////////
//// Export our Model ////
//////////////////////////
module.exports = Weather