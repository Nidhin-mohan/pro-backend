const User = require ('../models/user')
const BigPromise = require("../middlewares/bigPromise")
const CustomError = require('../utils/customError')
const user = require('../models/user')
const cookieToken = require('../utils/cookieToken')
const fileupload = require('express-fileupload')
const cloudinary = require("../config/cloudinary")



exports.signup = BigPromise(async (req, res, next) => {
    
   
    if (!req.files) {
    return next(new CustomError("photo is required for signup", 400));
  }
       const { name, email, password } = req.body;

     if (!email || !name || !password) {
    return next(new CustomError("Name, email and password are required", 400));
  }

  let file = req.files.photo;    
const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "users",
    width: 150,
    crop: "scale",
  });

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
  
exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  // check for presence of email and password
  if (!email || !password) {
    return next(new CustomError("please provide email and password", 400));
  }

  // get user from DB
  const user = await User.findOne({ email }).select("+password");

  // if user not found in DB
  if (!user) {
    return next(
      new CustomError("Email or password does not match or exist", 400)
    );
  }

  // match the password
  const isPasswordCorrect = await user.isValidatedPassword(password);

  //if password do not match
  if (!isPasswordCorrect) {
    return next(
      new CustomError("Email or password does not match or exist", 400)
    );
  }

  // if all goes good and we send the token
  cookieToken(user, res);
});


exports.logout = BigPromise(async (req, res, next) => {

  //clear the cookie
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  //send JSON response for success
  res.status(200).json({
    succes: true,
    message: "Logout success",
  });
});