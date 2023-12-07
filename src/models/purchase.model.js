class Purchase {
  constructor({ id, purchase_date, total_amount, supplier_id }) {
    this.id = id;
    this.purchase_date = purchase_date;
    this.total_amount = total_amount;
    this.supplier_id = supplier_id;
  }
}

module.exports = Purchase;
  