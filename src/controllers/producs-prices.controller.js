// En el archivo controllers/prices.controller.js
const { getPrices, addPrice } = require('../services/producs-prices.service');

const getPricesController = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const result = await getPrices(productId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const addPriceController = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { price, date } = req.body;
  
      await addPrice(productId, price, date);
  
      res.sendStatus(201);
    } catch (err) {
      console.error(err);
  
      if (err.code === 'ER_SIGNAL_EXCEPTION') {
        res.status(400).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

module.exports = {
  getPricesController,
  addPriceController,
};

