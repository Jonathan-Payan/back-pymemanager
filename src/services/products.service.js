const pool = require('../config/db');
const Product = require('../models/products.model');



// Obtener todos los productos
const getAllProducts = async () => {
  return new Promise((resolve, reject) => {
    pool.query('CALL get_products()', async (error, results, fields) => {
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


const getProductByCode = async (productCode) => {
  return new Promise((resolve, reject) => {
    pool.query('CALL get_product(?)', [productCode], async (error, results, fields) => {
      if (error) {
        reject(error);
        return;
      }

      if (!results || !Array.isArray(results[0]) || results[0].length === 0) {
        resolve(null);
        return;
      }

      // Obtener precios para el producto
      const prices = await getProductPrices(results[0][0].code);
      results[0][0].prices = prices;

      resolve(results[0][0]);
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



const updateProduct = async (code, newData) => {
  const formattedExpirationDate = newData.expiration_date ? new Date(newData.expiration_date).toISOString().slice(0, 10) : null;

  return new Promise((resolve, reject) => {
    pool.query(
      'CALL update_product(?, ?, ?, ?, ?, ?, ?, ?, @p_result_code)',
      [
        code,
        newData.name,
        newData.supplier_id,
        newData.category_id,
        newData.weight,
        formattedExpirationDate,
        newData.description,
        newData.image_path,
      ],
      async (error, results) => {
        if (error) {
          reject(error);
          return;
        }
  
        // Realiza una segunda consulta para obtener el valor de p_result_code
        pool.query('SELECT @p_result_code as result_code', (selectError, selectResults) => {
          if (selectError) {
            reject(selectError);
            return;
          }
  
          const resultCode = selectResults[0].result_code;
  
          if (resultCode === 1) {
            resolve(true); // Éxito en la actualización
          } else {
            resolve(false); // Producto no encontrado o error en la actualización
          }
        });
      }
    );
  });
  
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
  deleteProduct,
  createProduct,
  updateProduct,
  getAllProducts,
  getProductByCode,
};
