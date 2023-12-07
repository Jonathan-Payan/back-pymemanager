const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

router.get('/users', usersController.getUsersController);
router.post('/users', usersController.createUserController);




module.exports = router;