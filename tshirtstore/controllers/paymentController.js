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