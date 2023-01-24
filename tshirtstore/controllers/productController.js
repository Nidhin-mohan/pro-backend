const BigPromise = require("../middlewares/bigPromise");

exports.testproduct = BigPromise(async (req, res, next) => {
  res.send("hi there");

});
