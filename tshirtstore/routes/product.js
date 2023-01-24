const express = require("express");
const router = express.Router();
const {testproduct} = require("../controllers/productController")
const { isLoggedIn, customRole } = require("../middlewares/user");


router.route("/test").get(testproduct);


module.exports = router;