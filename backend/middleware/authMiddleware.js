const jwt = require("jsonwebtoken");
const db = require("../db");

module.exports = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ mensaje: "No autorizado, falta token" });
    }

    try {
        const decoded = jwt.verify(token, "secreto");
        
        const [user] = await db.promise().query("SELECT id, rol FROM usuarios WHERE id = ?", [decoded.id]);

        if (user.length === 0) {
            return res.status(401).json({ mensaje: "Token inválido, usuario no encontrado" });
        }

        req.user = user[0]; // Guardar datos del usuario en la request
        next();
    } catch (error) {
        res.status(401).json({ mensaje: "Token inválido" });
    }
};
