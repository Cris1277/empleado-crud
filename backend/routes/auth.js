const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db"); //  Usar pool en lugar de db
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || "secreto"; //  Usar variable de entorno

// Middleware para verificar token y obtener usuario
const verificarToken = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ mensaje: "No autorizado" });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        const connection = await pool.getConnection(); //  Obtener conexión
        const [user] = await connection.query("SELECT * FROM usuarios WHERE id = ?", [decoded.id]);
        connection.release(); //  Liberar conexión

        if (user.length === 0) return res.status(401).json({ mensaje: "Token inválido" });

        req.user = user[0];
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: "Token inválido" });
    }
};

// Validación de contraseña
const validarContraseña = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

// Registro de usuario
router.post("/register", async (req, res) => {
    try {
        const { nombre, correo, password, rol } = req.body;

        if (!nombre || !correo || !password) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        if (!validarContraseña(password)) {
            return res.status(400).json({
                mensaje: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
            });
        }

        const connection = await pool.getConnection(); //  Obtener conexión
        const [results] = await connection.query("SELECT id FROM usuarios WHERE correo = ?", [correo]);

        if (results.length > 0) {
            connection.release();
            return res.status(400).json({ mensaje: "El correo ya está registrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let rolAsignado = "usuario";

        if (req.user && req.user.rol === "admin" && rol === "admin") {
            rolAsignado = "admin";
        }

        await connection.query("INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)", 
            [nombre, correo, hashedPassword, rolAsignado]);

        connection.release();
        return res.status(201).json({ mensaje: "Usuario registrado con éxito" });

    } catch (error) {
        console.error("Error en el registro:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

// Login de usuario
router.post("/login", async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios" });
        }

        const connection = await pool.getConnection(); //  Obtener conexión
        const [results] = await connection.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);
        connection.release(); //  Liberar conexión

        if (results.length === 0) {
            return res.status(400).json({ mensaje: "Usuario no encontrado" });
        }

        const usuario = results[0];
        const validPassword = await bcrypt.compare(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({ mensaje: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, SECRET_KEY, { expiresIn: "2h" });

        return res.json({ mensaje: "Login exitoso", token, rol: usuario.rol });

    } catch (error) {
        console.error("Error en el login:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

// Obtener todos los usuarios (solo para administradores)
router.get("/usuarios", verificarToken, async (req, res) => {
    if (req.user.rol !== "admin") {
        return res.status(403).json({ mensaje: "Acceso denegado" });
    }

    try {
        const connection = await pool.getConnection(); //  Obtener conexión
        const [usuarios] = await connection.query("SELECT id, nombre, correo, rol FROM usuarios");
        connection.release(); //  Liberar conexión

        res.json(usuarios);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

// Cambiar rol de usuario (solo admin)
router.put("/cambiar-rol/:id", verificarToken, async (req, res) => {
    if (req.user.rol !== "admin") {
        return res.status(403).json({ mensaje: "Acceso denegado" });
    }

    try {
        const { id } = req.params;
        const { nuevoRol } = req.body;

        if (!["admin", "usuario"].includes(nuevoRol)) {
            return res.status(400).json({ mensaje: "Rol inválido" });
        }

        const connection = await pool.getConnection(); //  Obtener conexión
        await connection.query("UPDATE usuarios SET rol = ? WHERE id = ?", [nuevoRol, id]);
        connection.release(); //  Liberar conexión

        res.json({ mensaje: "Rol actualizado con éxito" });

    } catch (error) {
        console.error("Error al cambiar rol:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

module.exports = router;
