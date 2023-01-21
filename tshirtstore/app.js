const express = require("express")
require('dotenv').config()

const app = express()

//import all rooutes here
const home = require('./routes/home')

//router middleware
app.use('/api/v1',home)


module.exports = app