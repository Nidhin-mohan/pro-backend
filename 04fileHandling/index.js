const express = require("express");
const fileUpload = require("express-fileupload")
const app = express();

app.set('view engine', "ejs")

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir:"/tmp/"
}));

app.get("/", (req, res) => {
  res.send("<h1>Hello from LCO</h1>");
});

app.get("/myget", (req, res) => {
  console.log(req.query);

  res.send(req.body);
});

app.get("/mygetform", (req, res) => {
 res.render("getform");
});

app.get("/mypostform", (req, res) => {
   
 res.render("postform");
});

app.post("/mypost", (req, res) => {
     console.log(req.body);
     console.log(req.files);
     res.send(req.body)
})

app.listen(4000, () => console.log(`Server is running at port 4000`))