const pool = require('../config/db');
const User = require('../models/users.model');
const passwordUtils = require('../utils/password-utils');



const getUsers = async (params) => {
  try {
    const { username, email } = params;
    const queryParams = {
      inUsername: username || null,
      inEmail: email || null,
    };
    const [results] = await pool.promise().query('CALL get_users(?, ?)', [queryParams.inUsername, queryParams.inEmail]);
    
    if (!results || !Array.isArray(results[0])) {
      return [];
    }

    // Agrupar resultados por usuario
    const users = {};
    results[0].forEach((result) => {
      const userId = result.id;
      if (!users[userId]) {
        users[userId] = {
          id: result.id,
          username: result.username,
          email: result.email,
          password_hash: result.password_hash,
          roles: [], // Inicializar una lista de roles
          permissions: [], // Inicializar una lista de permisos
        };
      }

      // Agregar roles y permisos a las listas correspondientes
      if (result.role) {
        users[userId].roles.push(result.role);
      }
      if (result.permission) {
        users[userId].permissions.push(result.permission);
      }
    });

    // Convertir el objeto a un array para devolver
    return Object.values(users);
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const createUser = async ({ username, email, password }) => {
  try {
    const hashedPassword = await passwordUtils.hashPassword(password);
    const [result] = await pool.promise().query('CALL register_users(?, ?, ?, @p_result_code)', [username, email, hashedPassword]);
    const [getResult] = await pool.promise().query('SELECT @p_result_code as result_code');
    const resultCode = getResult[0].result_code;
    return resultCode;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating user");
  }
};





  

  module.exports = {
    getUsers,
    createUser,
  };