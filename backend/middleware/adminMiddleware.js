const jwt = require("jsonwebtoken");
const db = require("../db");

module.exports = async (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ mensaje: "Acceso denegado, usuario no autenticado" });
    }

    if (req.user.rol !== "admin") {
        return res.status(403).json({ mensaje: "Acceso denegado: Se requiere rol de administrador" });
    }

    next();
};
