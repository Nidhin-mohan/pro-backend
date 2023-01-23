const User = require ('../models/user')
const BigPromise = require("../middlewares/bigPromise")
const CustomError = require('../utils/customError')
const user = require('../models/user')
const cookieToken = require('../utils/cookieToken')
const fileupload = require('express-fileupload')
const cloudinary = require("../config/cloudinary")
const mailHelper = require("../utils/emailHelper");
const crypto = require("crypto");


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

exports.forgotPassword = BigPromise(async (req, res, next) => {
  // collect email
  const { email } = req.body;

  // find user in database
  const user = await User.findOne({ email });

  // if user not found in database
  if (!user) {
    return next(new CustomError("Email not found as registered", 400));
  }

  //get token from user model methods
  const forgotToken = user.getForgotPasswordToken();

// making false to not validate all data in model
   await user.save({validateBeforeSave:false})

  const myUrl = `${req.protociol}://${req.get("host")}/password/reset/${forgotToken}`

  const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`

  try {
    await mailHelper({
      email: user.email,
      subject: "Tshirt store - Password reset email",
      message,
    });

    // json reponse if email is success
    res.status(200).json({
      succes: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    // reset user fields if things goes wrong
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    // send error response
    return next(new CustomError(error.message, 500));
  }



});


exports.passwordReset = BigPromise(async (req, res, next) => {
  const forgotToken = req.params.token;

  const encryToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  console.log("front end ", encryToken);

  // find user based on hased on token and time in future
  const user = await User.findOne({
    forgotPasswordToken : encryToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  // console.log(user.forgotPasswordToken);
  console.log("user", user);
  if (!user) {
    return next(new CustomError("Token is invalid or expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new CustomError("password and confirm password do not match", 400)
    );
  }

  user.password = req.body.password;

  // reset token fields
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  cookieToken(user, res);
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  // console.log("Request data:");
  // console.log(req);
  //send response and user data
  res.status(200).json({
    success: true,
    user,
  });
});