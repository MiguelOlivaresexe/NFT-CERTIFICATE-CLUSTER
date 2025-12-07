const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Importar el modelo User

module.exports = async function (req, res, next) {
  // Obtener el token del header
  const token = req.header("x-auth-token");

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({ msg: "No hay token, autorización denegada" });
  }

  // Verificar token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    // Buscar el usuario en la base de datos para obtener su rol
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ msg: "Token no válido: Usuario no encontrado" });
    }
    req.user.isAdmin = user.role === 'admin';

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token no válido" });
  }
};
