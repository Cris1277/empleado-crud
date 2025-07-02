# 🧑‍💼 Sistema de Gestión de Empleados (Fullstack)

Aplicación web fullstack para la gestión de empleados y usuarios con roles diferenciados (`admin` y `usuario`). Permite el **registro, autenticación, CRUD de empleados, cambio de roles y eliminación de usuarios**, todo en una interfaz clara y protegida.

Desarrollada con **Node.js + Express** en el backend y **HTML + CSS + JavaScript + Bootstrap** en el frontend.

---
## 🔗 Demo en vivo

👉 [Ver aplicación desplegada](https://cris1277.github.io/empleado-crud/)

---
## 🎯 Funcionalidades

### 🟢 Usuario registrado
- Registro/Login con validación de contraseña segura.
- Visualización de lista de empleados.
- Logout y persistencia de sesión con localStorage.

### 🔵 Usuario admin
- Todas las anteriores, más:
  - Agregar/editar/eliminar empleados.
  - Ver lista de usuarios registrados.
  - Cambiar roles (`admin` o `usuario`) a otros usuarios.
  - Eliminar cuentas de usuario.

---

## 🧩 Tecnologías utilizadas

### 🔧 Backend
- Node.js + Express
- MySQL (mysql2/promise)
- JWT para autenticación
- Bcryptjs para hashing de contraseñas
- Dotenv, CORS, Railway (deploy)

### 🎨 Frontend
- HTML5 + CSS3
- JavaScript (vanilla)
- Bootstrap 5
- Fetch API
- GitHub Pages (deploy)

---

## 📁 Estructura del proyecto

```
📦 empleado-crud/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── empleados.js
│   │   ├── eliminar-usuario.js
│   │   ├── cambiar-rol.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── script.js
│   ├── style.css
```

---

## 🔐 Seguridad

- Autenticación basada en **JWT**.
- Protección de rutas con middlewares.
- Permisos por rol.
- Validación de contraseñas con requisitos de seguridad.
- Keep-alive para Railway para mantener activa la base de datos.

---

## 🧪 Variables de entorno `.env` (backend)

```env
PORT=5000
DB_HOST=tu_host
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_base_de_datos
DB_PORT=3306
JWT_SECRET=clave_secreta
```

---

## ▶️ Cómo ejecutar localmente

### 🔧 Backend

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu_usuario/empleado-crud.git
   cd empleado-crud/backend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear archivo `.env` con tus credenciales MySQL.

4. Iniciar el servidor:
   ```bash
   npm start
   ```

---

### 🎨 Frontend

1. Ir al directorio del frontend:
   ```bash
   cd empleado-crud/frontend
   ```

2. Abrir `index.html` en tu navegador o subir a Netlify.

3. Asegúrate de que la constante `API_URL` en `script.js` apunte al backend correcto:
   ```js
   const API_URL = "https://empleado-crud-production.up.railway.app";
   ```
## 👨‍💻 Autor

**Cristian [cris1277]**   
🔗 [GitHub](https://github.com/cris1277)  

---

## 📝 Licencia

Este proyecto está licenciado bajo la [MIT License](LICENSE).
