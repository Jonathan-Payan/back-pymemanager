const reportsService = require('../services/reports.service');

const getSalesByClientController = async (req, res, next) => {
    try {
        const result = await reportsService.getSalesByClient();
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const getSalesByPeriodController = async (req, res, next) => {
    try {
        const { start_date, end_date } = req.query;
        const result = await reportsService.getSalesByPeriod(start_date, end_date);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const getProductDistributionController = async (req, res, next) => {
    try {
        const result = await reportsService.getProductDistribution();
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const getSalesByCategoryController = async (req, res, next) => {
    try {
        const result = await reportsService.getSalesByCategory();
        res.json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getSalesByClientController,
    getSalesByPeriodController,
    getProductDistributionController,
    getSalesByCategoryController,
};

