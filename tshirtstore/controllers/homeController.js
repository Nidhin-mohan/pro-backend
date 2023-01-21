exports.home = (req, res) => {
    res.status(200).json({
        success: true,
        greetings: "Hello from api",
    })
}

exports.homedummy = (req, res) => {
  res.status(200).json({
    success: true,
    greetings: "hello from home dummy",
  });
};