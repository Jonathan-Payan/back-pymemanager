const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories.controller');


router.get('/categories', categoriesController.get_categories_controller);


module.exports = router;


