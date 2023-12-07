// En el archivo services/prices.service.js
const pool = require('../config/db');

const getPrices = async (productId) => {
  return new Promise((resolve, reject) => {
    pool.query('CALL get_prices(?)', [productId], (error, results, fields) => {
      if (error) reject(error);

      if (!results || !Array.isArray(results[0])) {
        resolve([]);
        return;
      }

      resolve(results[0]);
    });
  });
};

const addPrice = async (productId, price, date) => {
  try {
    // Utiliza con.promise().query() en lugar de con.query()
    await pool.promise().query('INSERT INTO product_prices (product_id, price, date) VALUES (?, ?, ?)', [productId, price, date]);
  } catch (error) {
    console.error(error);
    throw new Error('Error adding product price');
  }
};

module.exports = {
  getPrices,
  addPrice,
};

