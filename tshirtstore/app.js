const express = require("express")
require('dotenv').config()

const app = express()
const morgan = require('morgan')
const cookieParser = require("morgan")
const fileUpload = require('express-fileupload')

//for swagger documentation
const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))



//regular middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//cookies and file  middleware
app.use(cookieParser())
app.use(fileUpload())


//morgan middleware
app.use(morgan("tiny"));

//import all rooutes here
const home = require('./routes/home')

//router middleware
app.use('/api/v1',home)




module.exports = app