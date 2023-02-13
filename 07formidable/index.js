const express = require("express");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");

const app = express();

app.post("/api/upload", (req, res, next) => {
  const form = formidable({ multiples: true });

 

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
     
    const otest = Object.keys(files)

    console.log(otest)
    console.log(typeof(otest))
let imgarr = Promise.all(
  otest.map((filekey, index) => {
    console.log(filekey, index);

    const element = files[filekey];
    console.log(element[index].filepath);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  })
);

imgarr.then(() => {
  console.log("All promises have resolved");
});


// imageFiles.forEach((pic) => {
//     console.log(pic.filepath)
// })


  
    res.json({ fields, files });
  });
});

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000 ...");
});