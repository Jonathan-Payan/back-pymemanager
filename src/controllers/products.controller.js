const {  getAllProducts,getProductByCode,createProduct, updateProduct, deleteProduct } = require('../services/products.service');

// Controlador para obtener todos los productos
const getAllProductsController = async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// Controlador para obtener un producto por Code
const getProductByCodeController = async (req, res, next) => {
  try {
    const { productCode } = req.params;
    const product = await getProductByCode(productCode);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    next(err);
  }
};


const createProductController = async (req, res, next) => {
  try {
    const { code, name, supplier_id, category_id, weight, expiration_date, description, image_path } = req.body;

    const resultCode = await createProduct({ code, name, supplier_id, category_id, weight, expiration_date, description, image_path });
    
    if (resultCode === 1) {
      return res.sendStatus(201);
    } else if (resultCode === 0) {
      return res.status(400).json({ message: "Error creating product. Product already exists." });
    } else {
      return res.status(400).json({ message: "Error creating product" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updateProductController = async (req, res, next) => {
  try {
    const { code } = req.params;
    const newData = req.body;

    const success = await updateProduct(code, newData);

    if (success) {
      res.sendStatus(204); // 204 indica éxito sin contenido
    } else {
      res.status(404).json({ message: 'Product not found or error updating product' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const deleteProductController = async (req, res, next) => {
  try {
    const { productId } = req.params; // Ajusta el nombre del parámetro
    console.log(`Intentando eliminar producto con código ${productId}`);

    const resultCode = await deleteProduct(productId); // Ajusta el nombre del parámetro
    console.log(`Resultado del procedimiento almacenado: ${resultCode}`);

    if (resultCode === 1) {
      return res.sendStatus(204); // 204 indica éxito sin contenido
    } else if (resultCode === 0) {
      return res.status(404).json({ message: "Error deleting product. Product not found." });
    } else {
      return res.status(400).json({ message: "Error deleting product" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};







module.exports = {
  createProductController,
  updateProductController,
  deleteProductController,
  getProductByCodeController,
  getAllProductsController,
};


