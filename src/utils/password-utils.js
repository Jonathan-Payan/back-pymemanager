const bcrypt = require('bcrypt');

// Generar un hash para una contraseña
async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
  
}

// Verificar una contraseña con el hash almacenado
async function comparePasswords(providedPassword, storedHash) {
  return bcrypt.compare(providedPassword, storedHash);
}

module.exports = { hashPassword, comparePasswords };

