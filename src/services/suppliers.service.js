const pool = require('../config/db');
const Supplier = require('../models/suppliers.model'); // Asegúrate de tener el modelo correcto para los proveedores

const getSuppliers = async () => {
  return new Promise((resolve, reject) => {
    pool.query('CALL get_suppliers()', [], (error, results, fields) => {
      if (error) reject(error);

      if (!results || !Array.isArray(results[0])) {
        resolve([]);
        return;
      }

      const formattedResults = results[0].map((supplier) => {
        return new Supplier(supplier); // Asegúrate de tener el constructor correcto para los proveedores
      });

      resolve(formattedResults);
    });
  });
};

module.exports = {
  getSuppliers
};
