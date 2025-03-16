const express = require("express");
const router = express.Router();
const pool = require("../db");
//const db = require("../db");  

// Ruta para eliminar un usuario por ID

router.delete("/eliminar-usuario/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute("DELETE FROM usuarios WHERE id = ?", [id]);
        connection.release(); // Liberar conexión

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.json({ mensaje: "Usuario eliminado correctamente" });

    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ mensaje: "Error al eliminar usuario" });
    }
});


module.exports = router;
