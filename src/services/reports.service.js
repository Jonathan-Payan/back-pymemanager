const pool = require('../config/db');

const getSalesByClient = async () => {
    console.log("----------------------------in")
    return new Promise((resolve, reject) => {
        pool.query('CALL get_sales_by_client()', [], (error, results, fields) => {
            if (error) reject(error);

            if (!results || !Array.isArray(results[0])) {
                resolve([]);
                return;
            }

            const formattedResults = results[0];
            resolve(formattedResults);
        });
    });
};

const getSalesByPeriod = async (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        pool.query('CALL get_sales_by_period(?, ?)', [startDate, endDate], (error, results, fields) => {
            if (error) reject(error);

            if (!results || !Array.isArray(results[0])) {
                resolve([]);
                return;
            }

            const formattedResults = results[0];
            resolve(formattedResults);
        });
    });
};

const getProductDistribution = async () => {
    return new Promise((resolve, reject) => {
        pool.query('CALL get_product_distribution()', [], (error, results, fields) => {
            if (error) reject(error);

            if (!results || !Array.isArray(results[0])) {
                resolve([]);
                return;
            }

            const formattedResults = results[0];
            resolve(formattedResults);
        });
    });
};

const getSalesByCategory = async () => {
    return new Promise((resolve, reject) => {
        pool.query('CALL get_sales_by_category()', [], (error, results, fields) => {
            if (error) reject(error);

            if (!results || !Array.isArray(results[0])) {
                resolve([]);
                return;
            }

            const formattedResults = results[0];
            resolve(formattedResults);
        });
    });
};

module.exports = {
    getSalesByClient,
    getSalesByPeriod,
    getProductDistribution,
    getSalesByCategory,
};
