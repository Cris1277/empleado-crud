const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10, // Máximo de conexiones activas
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log("✅ Conexión a MySQL establecida correctamente.");
        connection.release(); //  Importante: liberar la conexión de prueba
    })
    .catch(err => {
        console.error("❌ Error conectando a la base de datos:", err);
    });

module.exports = pool;
