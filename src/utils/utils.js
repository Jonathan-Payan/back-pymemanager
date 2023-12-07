const Article = require('../models/article');

class Utils {
    static async formattedResults(results) {
        console.log(results);
      if (!results || !Array.isArray(results[0])) {
        return [];
      }
  console.log({data:results})
      const formattedResults = results[0].map((article) => {
    
        return new Article(article);
      });
      return formattedResults;
    }
  }

  module.exports = {
    Utils,
  };
  