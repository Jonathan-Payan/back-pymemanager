const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const User = require('../models/users.model');
const pool = require('../config/db');
const userService=require('../services/users.service');
const authService = {
  authenticateUser: async (username, password) => {
    try {
      const users = await userService.getUsers({ username });

      if (users.length === 0) {
        return null; // Usuario no encontrado
      }

      const userFromDB = users[0];
      const userPassword = password || 'null';
      const hashedPasswordFromDB = userFromDB.password_hash;

      const isPasswordValid = await bcrypt.compare(userPassword, hashedPasswordFromDB);

      if (!isPasswordValid) {
        return null; // Contraseña incorrecta
      }

      // Recuperar roles asociados al usuario mediante el procedimiento almacenado
      const [rolesResult] = await pool.promise().query('CALL get_user_roles(?)', [userFromDB.id]);
      const userRoles = rolesResult[0].map(role => role.name);

      // Crear una instancia del modelo User sin incluir el password_hash y con los roles asociados
      const user = new User({
        id: userFromDB.id,
        username: userFromDB.username,
        email: userFromDB.email,
        roles: userRoles,
        permissions: userFromDB.permissions, 
      });

      const token = jwt.sign(
        { userId: user.id, 
          username: user.username,
          roles: user.roles,
          permissions: user.permissions, }, 
        config.jwtSecret,
        { expiresIn: config.jwtExpiration }
      );

      return { user, token };
    } catch (error) {
      console.error(error);
      throw new Error('Error during authentication');
    }
  },
};




module.exports = authService;
