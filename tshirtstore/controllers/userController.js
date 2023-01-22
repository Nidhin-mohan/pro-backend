const User = require ('../models/user')
const BigPromise = require("../middlewares/bigPromise")
const CustomError = require('../utils/customError')
const user = require('../models/user')
const cookieToken = require('../utils/cookieToken')
const fileupload = require('express-fileupload')
const cloudinary = require("../config/cloudinary")



exports.signup = BigPromise(async (req, res, next) => {
    // console.log(req.body)
    // console.log(req.files)
    let result;
   
    if (req.files) {
        console.log("if")
        let file = req.files.photo
      
     
  result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "users",
    width: 150,
    crop: "scale",
  });

     
    }
   

    const {name, email, password} = req.body
 
    if (!email || !name || !password){
         return next(new CustomError("Name, email and password are required", 400))
    }

    console.log(result)
  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });
    
   
 cookieToken(user, res); 

})
