const express = require("express");
const fileUpload = require("express-fileupload")
const cloudinary = require('cloudinary').v2
const app = express();


cloudinary.config({
  // cloud_name: processs.env.CLOUD_NAME
  cloud_name: "",
  api_key: "",
  api_secret: "",
});


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

app.post("/mypost",async (req, res) => {
     console.log(req.body);
     console.log(req.files);

     let result;
     let imageArray = [];

     //uploading multiple file
      if (req.files) {
        for (let index = 0; index < req.files.samplefile.length; index++) {
          let result = await cloudinary.uploader.upload(
            req.files.samplefile[index].tempFilePath,
            {
              folder: "users",
            }
          );

          imageArray.push({
            public_id: result.public_id,
            secure_url: result.secure_url,
          });
        }
      }

    //  ###uploading  single file
    //  let file = req.files.samplefile

    //  result = await cloudinary.uploader.upload(
    //     file.tempFilePath, {
    //         folder: 'users'
    //     }
    //  )

     console.log(result);

     details= {
        firstname : req.body.firstname,
        lastname: req.body.lastname.app,
        result,
     }

     res.send(req.body)
})

app.listen(4000, () => console.log(`Server is running at port 4000`))