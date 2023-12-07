const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/suppliers.controller');

router.get('/suppliers', suppliersController.getSuppliersController);




module.exports = router;