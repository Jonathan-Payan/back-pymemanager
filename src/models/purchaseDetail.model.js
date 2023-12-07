class PurchaseDetail {
    constructor({ id, purchase_id, product_code, quantity, unit_price, sub_total }) {
      this.id = id;
      this.purchase_id = purchase_id;
      this.product_code = product_code;
      this.quantity = quantity;
      this.unit_price = unit_price;
      this.sub_total = sub_total;
    }
}

module.exports = PurchaseDetail;
  