
class SaleDetail {
  constructor({ id, sale_id, product_code, quantity, sub_total }) {
    this.id = id;
    this.sale_id = sale_id;
    this.product_code = product_code;
    this.quantity = quantity;
    this.sub_total = sub_total;
  }
}

module.exports = SaleDetail;