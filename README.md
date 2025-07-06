# 🧑‍💼 Employee Management System (Fullstack)

Fullstack web application for managing employees and users with differentiated roles (`admin` and `user`). It allows **registration, authentication, CRUD of employees, role switching, and user deletion**, all through a clean and protected interface.

Built with **Node.js + Express** on the backend and **HTML + CSS + JavaScript + Bootstrap** on the frontend.

---
## 🔗 Live Demo

👉 [View Deployed App](https://cris1277.github.io/empleado-crud/)

---
## 🎯 Features

### 🟢 Registered User
- Register/Login with secure password validation.
- View employee list.
- Logout and session persistence with localStorage.

### 🔵 Admin User
- All of the above, plus:
  - Add/edit/delete employees.
  - View list of registered users.
  - Change user roles (`admin` or `user`).
  - Delete user accounts.

---

## 🧩 Tech Stack

### 🔧 Backend
- Node.js + Express
- MySQL (mysql2/promise)
- JWT for authentication
- Bcryptjs for password hashing
- Dotenv, CORS, Railway (deployment)

### 🎨 Frontend
- HTML5 + CSS3
- JavaScript (vanilla)
- Bootstrap 5
- Fetch API
- GitHub Pages (deployment)

---

## 📁 Project Structure

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

## 🔐 Security

- JWT-based authentication.
- Route protection with middlewares.
- Role-based permissions.
- Password validation with security requirements.
- Keep-alive setting on Railway to keep the database active.

---

## 🧪 Environment Variables `.env` (backend)

```env
PORT=5000
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database_name
DB_PORT=3306
JWT_SECRET=your_secret_key
```

---

## ▶️ How to Run Locally

### 🔧 Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/your_user/empleado-crud.git
   cd empleado-crud/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your MySQL credentials.

4. Start the server:
   ```bash
   npm start
   ```

---

### 🎨 Frontend

1. Navigate to the frontend directory:
   ```bash
   cd empleado-crud/frontend
   ```

2. Open `index.html` in your browser or deploy to Netlify.

3. Make sure the `API_URL` constant in `script.js` points to the correct backend:
   ```js
   const API_URL = "https://empleado-crud-production.up.railway.app";
   ```

---

## 👨‍💻 Author

**Cristian [cris1277]**   
🔗 [GitHub](https://github.com/cris1277)  

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
