require("dotenv").config();
require('./config/database').connect();
const express = require('express');
const bcrypt = require("bcryptjs")

const app = express();
app.use(express.json());

app.get("/", (req,res) => {
    res.send("<>Hello from auth system</>")
});

app.post("/register", async(req, res) => {
    const {firstname, lastname, email, password} = req.body
 if (!(email && password && firstname && lastname)) {
      res.status(400).send("All fields are required");
    }

    const existingUser = await User.findOne({ email }); // PROMISE

    if (existingUser) {
      res.status(401).send("User already exists");
    }

    const myEncPassword = await bcrypt.hash(password, 10);

     const user = await User.create({
       firstname,
       lastname,
       email: email.toLowerCase(),
       password: myEncPassword,
     });

    
});

module.exports = app