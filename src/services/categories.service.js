const pool = require('../config/db');
const Category = require('../models/categories.model');



const get_categories = async () => {
    
    return new Promise((resolve, reject) => {
        pool.query('CALL get_categories()',[], (error, results, fields)  => {
          if (error) reject(error);
    
          if (!results || !Array.isArray(results[0])) {
            resolve([]);
            return;
          }
    
          const formattedResults = results[0].map((category) => {
            return new Category(category);
          });
    
          resolve(formattedResults);
        });
      });
    };

  



module.exports = {
  get_categories
};
