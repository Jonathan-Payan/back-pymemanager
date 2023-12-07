const { getSuppliers } = require('../services/suppliers.service');

const getSuppliersController = async (req, res, next) => {
  try {
    const Suppliers = await getSuppliers(req.query);
    res.json(Suppliers);
  } catch (err) {
    next(err);
  }
};


module.exports = {
    getSuppliersController,
  };