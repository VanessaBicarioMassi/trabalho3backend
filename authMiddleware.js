const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secreto');
    req.userData = decoded;

    // Verifica a função do usuário no banco de dados
    User.findById(req.userData.userId, (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      req.userData.role = user ? user.role : 'user';
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: 'Falha na autenticação' });
  }
};