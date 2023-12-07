const pool = require('../config/db');
const Product = require('../models/products.model');


/*


const getProducts = async (params) => {
  const { code, name, category_id, supplier_id, weight, expiration_date, description } = params;
  const queryParams = {
    inCode: code || null,
    inName: name || null,
    inCategoryId: category_id || null,
    inSupplierId: supplier_id || null,
    inWeight: weight || null,
    inExpirationDate: expiration_date || null,
    inDescription: description || null,
  };

  return new Promise((resolve, reject) => {
    pool.query('CALL get_products(?, ?, ?, ?, ?, ?, ?)', Object.values(queryParams), (error, results, fields) => {
      if (error) {
        reject(error);
        return;
      }

      if (!results || !Array.isArray(results[0])) {
        resolve([]);
        return;
      }

      resolve(results[0]);
    });
  });
};
*/
const getProducts = async (params) => {
  const { code, name, category_id, supplier_id, weight, expiration_date, description } = params;
  const queryParams = {
    inCode: code || null,
    inName: name || null,
    inCategoryId: category_id || null,
    inSupplierId: supplier_id || null,
    inWeight: weight || null,
    inExpirationDate: expiration_date || null,
    inDescription: description || null,
  };

  return new Promise((resolve, reject) => {
    pool.query('CALL get_products(?, ?, ?, ?, ?, ?, ?)', Object.values(queryParams), async (error, results, fields) => {
      if (error) {
        reject(error);
        return;
      }

      if (!results || !Array.isArray(results[0])) {
        resolve([]);
        return;
      }


      // Obtener precios para cada producto
      for (const product of results[0]) {
        const prices = await getProductPrices(product.code);
        product.prices = prices;
      }

      resolve(results[0]);
    });
  });
};

const getProductPrices = (productId) => {
  return new Promise((resolve, reject) => {
    pool.query('CALL get_prices(?)', [productId], (error, results, fields) => {
      if (error) {
        reject(error);
        return;
      }

      if (!results || !Array.isArray(results[0])) {
        resolve([]);
        return;
      }

      resolve(results[0]);
    });
  });
};





const createProduct = async ({ code, name, supplier_id, category_id, weight, expiration_date, description, image_path }) => {
  try {
    // Formatear la fecha utilizando el modelo Product
    const formattedDate = expiration_date ? new Product({ expiration_date }).expiration_date : null;

    const [result] = await pool.promise().query('CALL create_product(?, ?, ?, ?, ?, ?, ?, ?, @p_result_code)', [code, name, supplier_id, category_id, weight, formattedDate, description, image_path]);
    
    const [getResult] = await pool.promise().query('SELECT @p_result_code as result_code');
    const resultCode = getResult[0].result_code;
    return resultCode;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating product");
  }
};



const updateProduct = async ({ code, name, supplier_id, category_id, weight, expiration_date, description, image_path }) => {
  try {
    const [result] = await pool.promise().query('CALL update_product(?, ?, ?, ?, ?, ?, ?, ?, @p_result_code)', [code, name, supplier_id, category_id, weight, expiration_date, description, image_path]);
    const [getResult] = await pool.promise().query('SELECT @p_result_code as result_code');
    const resultCode = getResult[0].result_code;
    return resultCode;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating product");
  }
};


const deleteProduct = async (code) => {
  try {
    const [result] = await pool.promise().query('CALL delete_product(?, @p_result_code)', [code]);
    const [getResult] = await pool.promise().query('SELECT @p_result_code as result_code');
    const resultCode = getResult[0].result_code;
    return resultCode;
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting product");
  }
};


module.exports = {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
};
