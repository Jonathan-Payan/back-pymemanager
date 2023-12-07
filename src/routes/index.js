const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articles');

router.get('/', articlesController.getArticlesController);

module.exports = router;
