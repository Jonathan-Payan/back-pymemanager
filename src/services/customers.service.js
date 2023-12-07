const pool = require('../config/db');
const Customer = require('../models/customers.model');


const getCustomers = async () => {

    return new Promise((resolve, reject) => {
        pool.query('CALL get_customers()',[], (error, results, fields)  => {
          if (error) reject(error);
    
          if (!results || !Array.isArray(results[0])) {
            resolve([]);
            return;
          }
    
          const formattedResults = results[0].map((customer) => {
            return new Customer(customer);
          });
    
          resolve(formattedResults);
        });
      });
    };

  



module.exports = {
  getCustomers
};