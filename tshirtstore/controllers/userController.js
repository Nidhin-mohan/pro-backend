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


exports.changePassword = BigPromise(async (req, res, next) => {

  console.log(req.user)
  // get user from middleware
  const userId = req.user.id;

  // get user from database
  const user = await User.findById(userId).select("+password");

  //check if old password is correct
  const isCorrectOldPassword = await user.isValidatedPassword(
    req.body.oldPassword
  );

  if (!isCorrectOldPassword) {
    return next(new CustomError("old password is incorrect", 400));
  }

  // allow to set new password
  user.password = req.body.password;

  // save user and send fresh token
  await user.save();
  cookieToken(user, res);
});


exports.updateUserDetails = BigPromise(async (req, res, next) => {
  // add a check for email and name in body
  if(!req.body.name  && !req.body.email){
    return next(new CustomError("Please enter valid fields", 400));

  }

  // collect data from body
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };

  // if photo comes to us
  if (req.files) {
    const user = await User.findById(req.user.id);

    const imageId = user.photo.id;

    // delete photo on cloudinary
    if(imageId){
      const resp = await cloudinary.uploader.destroy(imageId);
    }

    // upload the new photo
   let file = req.files.photo;
   console.log("file line 246", req.files.photo);
  
   if (file){
     const result = await cloudinary.uploader.upload(file.tempFilePath, {
       folder: "users",
       width: 150,
       crop: "scale",
     });

     // add photo data in newData object
     newData.photo = {
       id: result.public_id,
       secure_url: result.secure_url,
     };
   }

  }

  // update the data in user
  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

exports.adminAllUser = BigPromise(async (req, res, next) => {
  
 const users= await User.find()

 res.status(200).json({
  succes: true,
  users 
 })

});

exports.admingetOneUser = BigPromise(async (req, res, next) => {
  
  const user = await User.findOne(req.params.id)
 
  if (!user){
    next(new CustomError('no user found', 400))
  }

 res.status(200).json({
  succes: true,
  users 
 })

});


exports.adminUpdateOneUserDetails = BigPromise(async (req, res, next) => {
  // add a check for email and name in body
  console.log(req.body.name, req.body.email, req.body.role);
if(!req.body.name  && !req.body.email && !req.body.role){
    return next(new CustomError("Please enter valid fields", 400));
  
  }

  // get data from request body
  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  console.log(newData)
  // update the user in database
  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});



exports.adminDeleteOneUser = BigPromise(async (req, res, next) => {
  // get user from url
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new CustomError("No Such user found", 401));
  }

  // get image id from user in database
  const imageId = user.photo.id;

  // delete image from cloudinary
  if(imageId){
    await cloudinary.uploader.destroy(imageId);
    console.log("image deleted")
  }

  // remove user from databse
  await user.remove();

  res.status(200).json({
    success: true,
  });
});

exports.managerAllUser = BigPromise(async (req, res, next) => {
  // select the user with role of user
  const users = await User.find({ role: "user" });

  res.status(200).json({
    success: true,
    users,
  });
});


