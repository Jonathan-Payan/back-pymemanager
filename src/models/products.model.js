class Product {
  constructor({ code, name, supplier_id, category_id, weight, expiration_date, description, image_path }) {
    this.code = code;
    this.name = name;
    this.supplier_id = supplier_id;
    this.category_id = category_id;
    this.weight = weight;
    this.expiration_date = expiration_date ? new Date(expiration_date).toISOString().substring(0, 10) : null;
    this.description = description;
    this.image_path = image_path; // Agregando la propiedad image_path
  }
}

module.exports = Product;


