const express = require('express')
const app = express()

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const fileUpload = require('express-fileupload')

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json())
app.use(fileUpload())

let courses = [
 {
    id: "11",
    name: "Learn Reactjs",
    price: 299
 },
 {
    id: "22",
    name: "Learn angular",
    price: 299
 },
 {
    id: "33",
    name: "Learn Djago",
    price: 299
 }
]


app.get('/', (req,res) => {
    res.send("hello world")
})

app.get('/api/v1/lco', (req,res) => {
    res.send("hello world lco docs")
})

app.get('/api/v1/lcoobject', (req,res) => {
    res.send({id: "55", name: "Learn Backend", price: 999})
})

app.get('/api/v1/courses', (req,res) => {
    res.send(courses)
})

app.get('/api/v1/mycourse/:courseId', (req,res) => {
   const mycourse =courses.find(course => course.id === req.params.courseId)
   res.send(mycourse)
})

app.post("/api/v1/addCourse", (req, res) => {
    console.log(req.body);
    courses.push(req.body);
    res.send(true)
})

app.get("/api/v1/coursequery", (req, res) => {
    let location = req.query.location;
    let device = req.query.device;

    res.send({ location, device});
})




app.listen(4000, () => {
    console.log('server is runnig at port 4000')
})  