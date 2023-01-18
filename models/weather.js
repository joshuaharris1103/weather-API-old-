//////////////////////////////////////////////////////////////
//// Our schema and model for the fruit resource          ////
//////////////////////////////////////////////////////////////
const mongoose = require('mongoose') // import mongoose

// we'll destructure the Schema and model functions from mongoose
const { Schema, model } = mongoose

// weather schema
const weatherSchema = new Schema({
    name: String,
    humidity: String,
    needUmbrella: Boolean
})

// make the eather model
// the model method takes two arguments
// the eather is what we call our model
// the second is the schema used to build the model
const Weather = model('Weather', weatherSchema)

//////////////////////////
//// Export our Model ////
//////////////////////////
module.exports = Weather