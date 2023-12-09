const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');


// Ruta para obtener todos los artículos o filtrarlos según parámetros opcionales

router.get('/products', productsController.getAllProductsController);
router.get('/products/:productCode', productsController.getProductByCodeController);

// Ruta para crear un nuevo artículo
router.post('/products', productsController.createProductController);

// Ruta para eliminar un artículo por id
router.delete('/products/:productId', productsController.deleteProductController);

// Ruta para actualizar un artículo por id
router.put('/products/:code', productsController.updateProductController);




module.exports = router;


