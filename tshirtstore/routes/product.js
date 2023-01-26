const express = require("express");
const router = express.Router();
const {addProduct, getAllProduct, getOneProduct} = require("../controllers/productController")
const { isLoggedIn, customRole } = require("../middlewares/user");

//user routes
router.route("/products").get(getAllProduct);
router.route("/product/:id").get(getOneProduct);


//admin
router.route("/admin/product/add").post(isLoggedIn, customRole("admin"), addProduct);






module.exports = router;