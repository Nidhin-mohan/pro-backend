const express = require('express')
const router = express.Router()

const {home,homedummy} = require('../controllers/homeController')

router.route('/').get(home)
router.route('/dummy').get(homedummy)


module.exports = router