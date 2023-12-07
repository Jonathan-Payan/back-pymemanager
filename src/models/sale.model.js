class Sale {
  constructor({ id, sale_date, total_amount, customer_id }) {
    this.id = id;
    this.sale_date = sale_date;
    this.total_amount = total_amount;
    this.customer_id = customer_id;
  }
}

module.exports = Sale;
  