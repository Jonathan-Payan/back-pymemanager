const express = require('express');
const authenticate = require('../middleware/auth');

const router = express.Router();

 // Ruta pública, no requiere autenticación
 router.get('/products', (req, res) => {
    console.log('Ruta de productos ejecutándose');
    res.json({ message: 'Esta ruta de productos es pública' });
  });
  

// Ruta protegida, requiere autenticación
router.get('/categories', authenticate, (req, res) => {
    console.log('Ruta de categorías ejecutándose');
    res.json({ message: 'Esta ruta de categorías está protegida' });
  });
  
 
  module.exports = router;
