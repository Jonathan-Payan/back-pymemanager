const authService = require('../services/auth.service');

const authController = {
  async login(req, res) {
    const { username, password } = req.body;

    try {
      const result = await authService.authenticateUser(username, password);

      if (!result) {
        return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
      }

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },
};

module.exports = authController;
