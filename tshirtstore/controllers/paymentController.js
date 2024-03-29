const BigPromise = require("../middlewares/bigPromise");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.sendStripeKey = BigPromise(async (req, res, next) => {
    res.status(200).json({
      stripekey: process.env.STRIPE_API_KEY,
    });
});

exports.captureStripePayment = BigPromise(async (req, res, next) => {

    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      automatic_payment_methods: { enabled: true },

      //optional
      metadata: { intergration_check: 'accept_a_payment'}
    });

    res.status(200).json({
      succes: true,
      client_secret: paymentIntent.client_secret,
    
    });
});


exports.sendRazorpayKey = BigPromise(async (req, res, next) => {
  res.status(200).json({
    razorpaykey: process.env.RAZORPAY_API_KEY,
  });
});


exports.captureRazorpayPayment = BigPromise(async (req, res, next) => {
  let instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  let options = {
    amount: req.body.amount, // amount in the smallest currency unit
    currency: "INR",
  };
  const myOrder = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    amount: req.body.amount,
    order: myOrder,
  });
});