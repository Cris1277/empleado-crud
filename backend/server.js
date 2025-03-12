const express = require("express");
const cors = require("cors");
require("dotenv").config();
const empleadosRoutes = require("./routes/empleados");
const authRoutes = require("./routes/auth");
const eliminarUsuarioRoutes = require("./routes/eliminar-usuario");


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/empleados", empleadosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", eliminarUsuarioRoutes);  

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("¡Servidor funcionando!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
