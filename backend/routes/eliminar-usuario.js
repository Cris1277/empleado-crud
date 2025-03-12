const express = require("express");
const router = express.Router();
const db = require("../db");  // Asegúrate de que este es tu archivo de conexión a MySQL

// Ruta para eliminar un usuario por ID
router.delete("/eliminar-usuario/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Ejecutar la consulta DELETE en MySQL
        const [result] = await db.promise().execute("DELETE FROM usuarios WHERE id = ?", [id]);


        // Verificar si se eliminó algún usuario
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
