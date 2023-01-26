const Product = require("../models/product");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cloudinary = require("../config/cloudinary");
const WhereClause = require("../utils/whereClouse");

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


exports.getAllProduct = BigPromise(async (req, res, next) => {
  const resultPerPage = 6;
  const totalcountProduct = await Product.countDocuments();

  const productsObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();

  let products = await productsObj.base;
  const filteredProductNumber = products.length;

  //products.limit().skip()

  productsObj.pager(resultPerPage);
  products = await productsObj.base.clone();

  res.status(200).json({
    success: true,
    products,
    filteredProductNumber,
    totalcountProduct,
  });
});


exports.getAllProduct = BigPromise(async (req, res, next) => {
  const resultPerPage = 6;
  const totalcountProduct = await Product.countDocuments();

  const productsObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();

  let products = await productsObj.base;
  const filteredProductNumber = products.length;

  //products.limit().skip()

  productsObj.pager(resultPerPage);
  products = await productsObj.base.clone();

  res.status(200).json({
    success: true,
    products,
    filteredProductNumber,
    totalcountProduct,
  });
});

exports.adminGetOneProduct = BigPromise(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("No product found with this id", 401));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

exports.adminUpdateOneProduct = BigPromise(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("No product found with this id", 401));
  }

  let imagesArray = [];

console.log(req.files)  
  if (req.files) {

    console.log('handling images')
    //destroy the existing image
    for (let index = 0; index < product.photos.length; index++) {
     const res = await cloudinary.uploader.destroy(product.photos[index].id)
      
    }

    //uploading new images 
     for (let index = 0; index < req.files.photos.length; index++) {
       let result = await cloudinary.uploader.upload(
         req.files.photos[index].tempFilePath,
         {
           folder: "products",
         }
       );
       console.log(result);
       imagesArray.push({
         id: result.public_id,
         secure_url: result.secure_url,
       });
     }
  }

  req.body.photos = imagesArray

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    userFindAndMOdify: false
  })

  res.status(200).json({
    success: true,
    product,
  });
});



