const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// 🔹 Obtener todos los empleados (permitido a todos los usuarios autenticados)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const [empleados] = await db.promise().query("SELECT * FROM empleados");
        res.json(empleados);
    } catch (err) {
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

    try {
        await db.promise().query("INSERT INTO empleados (nombre, correo, cargo, salario) VALUES (?, ?, ?, ?)", [nombre, correo, cargo, salario]);
        res.json({ mensaje: "Empleado agregado con éxito" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al agregar empleado" });
    }
});

// 🔹 Actualizar un empleado (SOLO ADMIN)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    const { nombre, correo, cargo, salario } = req.body;
    const { id } = req.params;

    try {
        await db.promise().query("UPDATE empleados SET nombre = ?, correo = ?, cargo = ?, salario = ? WHERE id = ?", [nombre, correo, cargo, salario, id]);
        res.json({ mensaje: "Empleado actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar empleado" });
    }
});

// 🔹 Eliminar un empleado (SOLO ADMIN)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        await db.promise().query("DELETE FROM empleados WHERE id = ?", [id]);
        res.json({ mensaje: "Empleado eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar empleado" });
    }
});

module.exports = router;
