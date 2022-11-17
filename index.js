const express = require("express");
// to format date
const format = require("date-format");
const app = express();

// port
const PORT =  process.env.PORT || 4000 ; 

//home route
app.get("/", (req, res) => {
  res.status(200).send("<h1>Hello from LCO</h1>");
});

// instagram route
app.get("/api/v1/instagram", (req, res) => {
  const instaSocial = {
    username: "hiteshchoudharyOfficial",
    folowers: 66,
    follows: 70,
    date: format.asString("dd[MM] - hh:mm:ss", new Date()),
  };

  res.status(200).json(instaSocial);
});


// facebook route
app.get("/api/v1/facebook", (req, res) => {
  const instaSocial = {
    username: "hiteshchoudharyPage",
    folowers: 88,
    follows: 10,
    date: format.asString("dd[MM] - hh:mm:ss", new Date()),
  };

  res.status(200).json(instaSocial);
});


// linkdin route
app.get("/api/v1/linkedin", (req, res) => {
  const instaSocial = {
    username: "hiteshchoudhary",
    folowers: 800,
    follows: 80,
    date: format("hh:mm:ss.SSS", new Date()),
  };

  res.status(200).json(instaSocial);
});


//api token route
app.get("/api/v1/:token", (req, res) => {
  console.log(req.params.token);
  res.status(200).json({ param: req.params.token });
});


// 404 route
app.use((req, res) => {
    res.status(404).send("<h1>page not found</h1>")
})


//listening to port
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
