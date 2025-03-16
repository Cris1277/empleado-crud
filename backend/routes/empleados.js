const express = require("express");
const router = express.Router();
const pool = require("../db"); // Cambiar `db` por `pool`
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// 🔹 Obtener todos los empleados (permitido a todos los usuarios autenticados)
router.get("/", authMiddleware, async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection(); //  Obtener una conexión del pool
        const [empleados] = await connection.query("SELECT * FROM empleados");
        connection.release(); //  Liberar conexión
        res.json(empleados);
    } catch (err) {
        if (connection) connection.release(); //  Liberar en caso de error
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

// 🔹 Crear un empleado (SOLO ADMIN)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    const { nombre, correo, cargo, salario } = req.body;

    if (!nombre || !correo || !cargo || !salario) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ mensaje: "Correo no válido" });
    }

    if (isNaN(salario) || salario <= 0) {
        return res.status(400).json({ mensaje: "El salario debe ser un número mayor que 0" });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query("INSERT INTO empleados (nombre, correo, cargo, salario) VALUES (?, ?, ?, ?)", [nombre, correo, cargo, salario]);
        connection.release();
        res.json({ mensaje: "Empleado agregado con éxito" });
    } catch (error) {
        if (connection) connection.release();
        res.status(500).json({ mensaje: "Error al agregar empleado" });
    }
});

// 🔹 Actualizar un empleado (SOLO ADMIN)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    const { nombre, correo, cargo, salario } = req.body;
    const { id } = req.params;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query("UPDATE empleados SET nombre = ?, correo = ?, cargo = ?, salario = ? WHERE id = ?", [nombre, correo, cargo, salario, id]);
        connection.release();
        res.json({ mensaje: "Empleado actualizado con éxito" });
    } catch (error) {
        if (connection) connection.release();
        res.status(500).json({ mensaje: "Error al actualizar empleado" });
    }
});

// 🔹 Eliminar un empleado (SOLO ADMIN)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query("DELETE FROM empleados WHERE id = ?", [id]);
        connection.release();
        res.json({ mensaje: "Empleado eliminado con éxito" });
    } catch (error) {
        if (connection) connection.release();
        res.status(500).json({ mensaje: "Error al eliminar empleado" });
    }
});

module.exports = router;
