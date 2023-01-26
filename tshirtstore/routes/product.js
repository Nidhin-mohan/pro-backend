const express = require("express");
const router = express.Router();
const {addProduct, getAllProduct,  adminUpdateOneProduct, adminDeleteOneProduct, getOneProduct} = require("../controllers/productController")
const { isLoggedIn, customRole } = require("../middlewares/user");

//user routes
router.route("/products").get(getAllProduct);
router.route("/product/:id").get(getOneProduct);


//admin
router.route("/admin/product/add").post(isLoggedIn, customRole("admin"), addProduct);
router.route("/admin/product/:id")
.put(isLoggedIn, customRole("admin"), adminUpdateOneProduct)
.delete(isLoggedIn, customRole("admin"), adminDeleteOneProduct);






module.exports = router;