const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customers.controller');

router.get('/customers', customerController.getCustomerController);


module.exports = router;


