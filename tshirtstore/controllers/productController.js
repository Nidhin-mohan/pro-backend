const Product = require("../models/product");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cloudinary = require("../config/cloudinary");

exports.addProduct = BigPromise(async (req, res, next) => {
  // images

  let imageArray = [];
  console.log(req.files)

  if (!req.files) {
    return next(new CustomError("images are required", 401));
  }

  
  if (req.files) {
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );
     console.log(result)
      imageArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }
    console.log("req.user",req.user)
  req.body.photos = imageArray;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product,
  });


});
