require("dotenv").config();

const PORT = process.env.PORT || 4000;
const DB_HOST =
  process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "jpp--278";
const DB_DATABASE = process.env.DB_DATABASE || "pymeManager";
const DB_PORT = process.env.DB_PORT || 3306;

module.exports = {
  PORT,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT,
  jwtSecret: 'tuClaveSecretaJWT',
  jwtExpiration: '1h', // Tiempo de expiración del token
};


