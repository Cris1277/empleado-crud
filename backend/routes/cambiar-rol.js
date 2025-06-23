const express = require("express");
const pool = require("../db");
//const db = require("../db");
const authMiddleware = require("./authMiddleware");
const adminMiddleware = require("./adminMiddleware");

const router = express.Router();

// Cambiar rol de usuario (solo admin)


router.put("/cambiar-rol/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevoRol } = req.body;

        if (!["admin", "usuario"].includes(nuevoRol)) {
            return res.status(400).json({ mensaje: "Rol inválido" });
        }

        const connection = await pool.getConnection();
        const [result] = await connection.query("UPDATE usuarios SET rol = ? WHERE id = ?", [nuevoRol, id]);
        connection.release(); // Liberar conexión

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.json({ mensaje: "Rol actualizado con éxito" });

    } catch (error) {
        console.error("Error al cambiar el rol:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});


module.exports = router;
