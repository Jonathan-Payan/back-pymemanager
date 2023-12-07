const jwt = require('jsonwebtoken');
const config = require('../config/config');





function getUserRolesAndPermissions(userId) {
  // Implementa lógica para obtener roles y permisos del usuario desde la base de datos
  // ...

  return { roles: ['Admin'], permissions: ['READ_PRODUCT'] }; // Devuelve roles y permisos de ejemplo
}

function authenticate(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const rolesAndPermissions = getUserRolesAndPermissions(decoded.userId);
    req.user = { ...decoded, ...rolesAndPermissions };
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token de autenticación inválido' });
  }
}

function authorize(roles, permissions) {
  return (req, res, next) => {
    const userRoles = req.user.roles || [];
    const userPermissions = req.user.permissions || [];

    const hasRequiredRoles = roles.every(role => userRoles.includes(role));
    const hasRequiredPermissions = permissions.every(permission => userPermissions.includes(permission));

    if (hasRequiredRoles && hasRequiredPermissions) {
      next();
    } else {
      res.status(403).json({ message: 'Acceso no autorizado' });
    }
  };
}

module.exports = { authenticate, authorize };





module.exports = authenticate;
