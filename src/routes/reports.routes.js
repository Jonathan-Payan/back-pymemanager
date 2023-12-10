const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');

// Ruta para el reporte de Ventas Totales por Cliente
router.get('/reports/sales-by-client', reportsController.getSalesByClientController);

// Ruta para el reporte de Ventas por Período de Tiempo
router.get('/sales-by-period/:start/:end', reportsController.getSalesByPeriodController);

// Ruta para el reporte de Distribución de Productos Vendidos
router.get('/product-distribution', reportsController.getProductDistributionController);

// Ruta para el reporte de Ventas por Categoría de Producto
router.get('/sales-by-category', reportsController.getSalesByCategoryController);

module.exports = router;
