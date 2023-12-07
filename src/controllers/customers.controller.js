const { getCustomers } = require('../services/customers.service');



const getCustomerController = async (req, res, next) => {
  try {
    const result = await getCustomers();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCustomerController
};
