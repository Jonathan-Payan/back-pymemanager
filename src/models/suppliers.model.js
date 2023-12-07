class Supplier {
  constructor({
    id,
    name,
    address,
    phone,
    email,
    website,
    contact_name,
    contact_phone,
    contact_email
  }) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.website = website;
    this.contact_name = contact_name;
    this.contact_phone = contact_phone;
    this.contact_email = contact_email;
  }
}

module.exports = Supplier;
