class User {
    constructor({  id,username, email, roles,permissions }) {
      this.id=id;
      this.username = username;
      this.email = email;
      this.roles = roles || []; 
      this.permissions = permissions || []; 
    
    }
  }
  
  module.exports = User;
  


  