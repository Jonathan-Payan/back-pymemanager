// En el archivo routes/prices.js
const express = require('express');
const router = express.Router();
const pricesController = require('../controllers/producs-prices.controller');

router.get('/prices/:productId', pricesController.getPricesController);
router.post('/prices/:productId', pricesController.addPriceController);

module.exports = router;
