const { get_categories } = require('../services/categories.service');



const get_categories_controller = async (req, res, next) => {
  try {
    const result = await get_categories();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  get_categories_controller
};
