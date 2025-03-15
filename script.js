const API_URL = "https://empleado-crud-production.up.railway.app"; // ✅ URL del backend en Railway
const form = document.getElementById("auth-form");
const toggleForm = document.getElementById("toggle-form");
const formTitle = document.getElementById("form-title");
const nombreInput = document.getElementById("nombre");
const passwordRequirements = document.querySelector(".form-text"); // Requisitos de la contraseña
const submitButton = document.querySelector("#auth-form button"); // Botón de enviar

let isRegister = false;


// 🔄 Alternar entre Login y Registro
if (toggleForm) {
    toggleForm.addEventListener("click", (e) => {
        e.preventDefault(); // Evitar recarga de la página

        isRegister = !isRegister;
        formTitle.textContent = isRegister ? "Registro" : "Iniciar Sesión";
        nombreInput.style.display = isRegister ? "block" : "none";
        passwordRequirements.style.display = isRegister ? "block" : "none";

        // Cambiar texto del botón
        submitButton.textContent = isRegister ? "Registrar" : "Ingresar";

        // Cambiar texto del enlace
        toggleForm.innerHTML = isRegister
            ? '¿Ya tienes cuenta? <a href="#">Inicia sesión aquí</a>'
            : '¿No tienes cuenta? <a href="#">Regístrate aquí</a>';
    });
}

// 🏆 Manejar Login y Registro
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = nombreInput.value.trim();
        const correo = document.getElementById("correo").value.trim();
        const password = document.getElementById("password").value.trim();

        const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
        const data = isRegister ? { nombre, correo, password } : { correo, password };

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok) {
                mostrarAlerta(result.mensaje, "success");
                if (!isRegister) {
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("rol", result.rol); // Asegurar que el rol se guarda
                    setTimeout(() => window.location.href = "dashboard.html", 2000);
                }
            } else {
                mostrarAlerta(result.mensaje, "danger");
            }
        } catch (error) {
            mostrarAlerta("Error de conexión", "danger");
            console.error("Error:", error);
        }
    });
}

// 🔐 Obtener el token de autenticación
const token = localStorage.getItem("token");

// 🔒 Redirigir si no hay token (protección de la página)
if (!token && window.location.pathname.includes("dashboard.html")) {
    window.location.href = "index.html";
}

let editando = false;
let empleadoId = null;

// 📌 Cargar empleados en la tabla
async function cargarEmpleados() {
    try {
        const res = await fetch(`${API_URL}/api/empleados`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            throw new Error("Error al obtener empleados");
        }

        const empleados = await res.json();
        const tbody = document.getElementById("empleados-list");
        tbody.innerHTML = "";

        empleados.forEach(emp => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${emp.nombre}</td>
                <td>${emp.correo}</td>
                <td>${emp.cargo}</td>
                <td>${emp.salario}</td>
                <td class="text-center">
                    ${userRole === "admin" ? `
                        <button class="btn btn-warning btn-sm w-auto" onclick="editarEmpleado(${emp.id}, '${emp.nombre}', '${emp.correo}', '${emp.cargo}', ${emp.salario})">✏️ Editar</button>
                        <button class="btn btn-danger btn-sm w-auto" onclick="eliminarEmpleado(${emp.id})">🗑 Eliminar</button>
                    ` : ""}
                </td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Error cargando empleados:", error);
    }
}

// 📌 Agregar o Editar empleado
async function agregarEmpleado(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const cargo = document.getElementById("cargo").value.trim();
    const salario = document.getElementById("salario").value.trim();

    const url = editando
    ? `${API_URL}/api/empleados/${empleadoId}`
    : `${API_URL}/api/empleados`;
    const method = editando ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ nombre, correo, cargo, salario }),
        });

        const result = await res.json();

        if (res.ok) {
            mostrarAlerta(editando ? "Empleado actualizado con éxito" : "Empleado agregado con éxito", "success");
            document.getElementById("empleado-form").reset();
            cargarEmpleados();

            // Restablecer el estado de edición
            editando = false;
            empleadoId = null;
        } else {
            mostrarAlerta(result.mensaje, "danger");
        }
    } catch (error) {
        mostrarAlerta(editando ? "Error al actualizar empleado" : "Error al agregar empleado", "danger");
    }
}

// ✏️ Editar empleado
function editarEmpleado(id, nombre, correo, cargo, salario) {
    document.getElementById("nombre").value = nombre;
    document.getElementById("correo").value = correo;
    document.getElementById("cargo").value = cargo;
    document.getElementById("salario").value = salario;

    editando = true;
    empleadoId = id;
}

// 🗑 Eliminar empleado
async function eliminarEmpleado(id) {
    if (!confirm("¿Estás seguro de eliminar este empleado?")) return;

    try {
        const res = await fetch(`${API_URL}/api/empleados/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();

        if (res.ok) {
            mostrarAlerta("Empleado eliminado con éxito", "warning");
            cargarEmpleados();
        } else {
            mostrarAlerta(result.mensaje, "danger");
        }
    } catch (error) {
        mostrarAlerta("Error al eliminar empleado", "danger");
    }
}

// 🔒 Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// 📝 Escuchar el envío del formulario de empleados
const formEmpleado = document.getElementById("empleado-form");
if (formEmpleado) {
    formEmpleado.addEventListener("submit", agregarEmpleado);
}

// 📥 Cargar empleados al abrir la página
if (window.location.pathname.includes("dashboard.html")) {
    cargarEmpleados();
}

// 🔔 Mostrar alertas
function mostrarAlerta(mensaje, tipo = "success") {
    const alerta = document.getElementById("alerta");
    alerta.textContent = mensaje;
    alerta.className = `alert alert-${tipo} text-center`;
    alerta.classList.remove("d-none");

    setTimeout(() => {
        alerta.classList.add("d-none");
    }, 3000);
}

// 🔓 Manejo de roles
let userRole = localStorage.getItem("rol");

if (userRole === "admin") {
    document.getElementById("admin-panel").style.display = "block";
}



// 🔄 Cargar usuarios en el panel de administración
async function cargarUsuarios() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`${API_URL}/api/auth/usuarios`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            throw new Error("Error al obtener usuarios");
        }

        const usuarios = await res.json();
        const tbody = document.getElementById("usuarios-list");
        tbody.innerHTML = "";

        usuarios.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.nombre}</td>
                <td>${user.correo}</td>
                <td>
                    <select id="rol-${user.id}">
                        <option value="usuario" ${user.rol === "usuario" ? "selected" : ""}>Usuario</option>
                        <option value="admin" ${user.rol === "admin" ? "selected" : ""}>Admin</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-success btn-sm w-auto" onclick="cambiarRol(${user.id})">Actualizar</button>
                    <button class="btn btn-danger btn-sm w-auto" onclick="eliminarUsuario(${user.id})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Error cargando usuarios:", error);
    }
}


// 🔄 Cambiar rol de un usuario
async function cambiarRol(id) {
    const token = localStorage.getItem("token");
    const nuevoRol = document.getElementById(`rol-${id}`).value;

    try {
        const res = await fetch(`${API_URL}/api/auth/cambiar-rol/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ nuevoRol }),
        });

        const data = await res.json();

        if (res.ok) {
            mostrarAlerta("Rol actualizado con éxito", "success");
            cargarUsuarios(); // Recargar la lista
        } else {
            mostrarAlerta(data.mensaje, "danger");
        }

    } catch (error) {
        mostrarAlerta("Error al actualizar rol", "danger");
    }
}

async function eliminarUsuario(id) {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`${API_URL}/api/auth/eliminar-usuario/${id}`, {

            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();

        if (res.ok) {
            mostrarAlerta("Usuario eliminado con éxito", "success");
            cargarUsuarios(); // Recargar la lista
        } else {
            mostrarAlerta(result.mensaje, "danger");
        }

    } catch (error) {
        mostrarAlerta("Error al eliminar usuario", "danger");
    }
}

// 🔐 Mostrar panel solo si es admin
document.addEventListener("DOMContentLoaded", () => {
    let userRole = localStorage.getItem("rol") || ""; // Obtener el rol del usuario

    let adminPanel = document.getElementById("admin-panel");
    let empleadoForm = document.getElementById("empleado-form");

    console.log("Rol del usuario:", userRole); // 🔍 Depuración

    // Ocultar formulario de empleados si no es admin
    if (empleadoForm) {
        if (userRole !== "admin") {
            empleadoForm.style.display = "none";
        } else {
            empleadoForm.style.display = "block"; 
        }
    }

    // Ocultar panel de administración si no es admin
    if (adminPanel) {
        if (userRole !== "admin") {
            adminPanel.remove(); // Borra el panel si no es admin
        } else {
            adminPanel.style.display = "block";
            cargarUsuarios(); // Cargar usuarios si es admin
        }
    }
});

// Mantener el backend activo con un ping cada 5 minutos
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ script.js se está ejecutando correctamente");

    setInterval(() => {
        console.log("⏳ Ejecutando intervalo..."); // Para verificar si realmente se está ejecutando
        fetch("https://empleado-crud-production.up.railway.app/api/health")
            .then(res => res.json())
            .then(data => console.log("✅ Ping al backend realizado con éxito:", data))
            .catch(err => console.error("❌ Error en el ping al backend", err));
    }, 5000);
});
 
