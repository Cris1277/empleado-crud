const express = require("express");
const cors = require("cors");
require("dotenv").config();
const empleadosRoutes = require("./routes/empleados");
const authRoutes = require("./routes/auth");
const eliminarUsuarioRoutes = require("./routes/eliminar-usuario");
const pool = require("./db");

const app = express();

// ✅ Configurar CORS para permitir acceso desde GitHub Pages
const corsOptions = {
  origin: "https://cris1277.github.io",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

// ✅ Rutas
app.use("/api/empleados", empleadosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", eliminarUsuarioRoutes);

// ✅ Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando!");
});

// ✅ Ruta de salud
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Backend activo" });
});

// ✅ Mantener base de datos viva en Railway (ping cada 4.5 minutos)
setInterval(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Ping de keep-alive a la base de datos");
  } catch (error) {
    console.error("❌ Error en ping keep-alive:", error);
  }
},270000); // 4.5 minutos

// ✅ Escuchar en el puerto correcto
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
