// =====================
//  Carga inicial
// =====================

/**
 * Evento que se ejecuta cuando el DOM está completamente cargado.
 * Se utiliza para inicializar scripts y configurar tareas repetitivas.
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ script.js se está ejecutando correctamente");

    // Realiza un ping al backend cada 5 minutos para mantenerlo activo (Railway free-tier)
    setInterval(() => {
        console.log("⏳ Ejecutando intervalo...");
        fetch("https://empleado-crud-production.up.railway.app/api/health")
            .then(res => res.json())
            .then(data => console.log("✅ Ping al backend realizado con éxito:", data))
            .catch(err => console.error("❌ Error en el ping al backend", err));
    }, 300000); // 300,000 ms = 5 minutos
});

// =====================
//  Variables globales
// =====================

/**
 * Variables reutilizables a lo largo del script, incluyendo referencias al DOM
 * y configuraciones relacionadas con el usuario y el estado de sesión.
 */
const API_URL = "https://empleado-crud-production.up.railway.app";
const form = document.getElementById("auth-form");
const toggleForm = document.getElementById("toggle-form");
const formTitle = document.getElementById("form-title");
const nombreInput = document.getElementById("nombre");
const passwordRequirements = document.querySelector(".form-text");
const submitButton = document.querySelector("#auth-form button");

let isRegister = false;
let editando = false;
let empleadoId = null;
const token = localStorage.getItem("token");
let userRole = localStorage.getItem("rol");

// =====================
//  Autenticación
// =====================

/**
 * Alternancia entre el formulario de registro e inicio de sesión.
 */
if (toggleForm) {
    toggleForm.addEventListener("click", (e) => {
        e.preventDefault();
        isRegister = !isRegister;

        formTitle.textContent = isRegister ? "Registro" : "Iniciar Sesión";
        nombreInput.style.display = isRegister ? "block" : "none";
        passwordRequirements.style.display = isRegister ? "block" : "none";
        submitButton.textContent = isRegister ? "Registrar" : "Ingresar";

        toggleForm.innerHTML = isRegister
            ? '¿Ya tienes cuenta? <a href="#">Inicia sesión aquí</a>'
            : '¿No tienes cuenta? <a href="#">Regístrate aquí</a>';
    });
}

/**
 * Manejo del formulario de autenticación (login o registro).
 */
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = nombreInput.value.trim();
        const correo = document.getElementById("correo").value.trim();
        const password = document.getElementById("password").value.trim();
        const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

        const data = isRegister
            ? { nombre, correo, password }
            : { correo, password };

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok) {
                mostrarAlerta(result.mensaje, "success");

                if (!isRegister) {
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("rol", result.rol);
                    setTimeout(() => window.location.href = "dashboard.html", 2000);
                }
            } else {
                mostrarAlerta(result.mensaje, "danger");
            }
        } catch (err) {
            mostrarAlerta("Error de conexión", "danger");
            console.error("Error:", err);
        }
    });
}

// =====================
//  Seguridad
// =====================

/**
 * Si no hay token y se intenta acceder al dashboard, redirigir al inicio de sesión.
 */
if (!token && window.location.pathname.includes("dashboard.html")) {
    window.location.href = "index.html";
}

// =====================
//  Empleados
// =====================

/**
 * Obtiene y renderiza la lista de empleados.
 */
async function cargarEmpleados() {
    try {
        const res = await fetch(`${API_URL}/api/empleados`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Error al obtener empleados");

        const empleados = await res.json();
        const lista = document.getElementById("empleados-list");
        lista.innerHTML = "";

        empleados.forEach(emp => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${emp.nombre}</td>
                <td>${emp.correo}</td>
                <td>${emp.cargo}</td>
                <td>${emp.salario}</td>
                <td class="text-center">
                    ${userRole === "admin"
                        ? `<button class="btn btn-warning btn-sm w-auto" onclick="editarEmpleado(${emp.id}, '${emp.nombre}', '${emp.correo}', '${emp.cargo}', ${emp.salario})">✏️ Editar</button>
                           <button class="btn btn-danger btn-sm w-auto" onclick="eliminarEmpleado(${emp.id})">🗑 Eliminar</button>`
                        : ""}
                </td>
            `;
            lista.appendChild(tr);
        });
    } catch (err) {
        console.error("Error cargando empleados:", err);
    }
}

/**
 * Carga los datos de un empleado en el formulario para edición.
 */
function editarEmpleado(id, nombre, correo, cargo, salario) {
    document.getElementById("nombre").value = nombre;
    document.getElementById("correo").value = correo;
    document.getElementById("cargo").value = cargo;
    document.getElementById("salario").value = salario;
    editando = true;
    empleadoId = id;
}

/**
 * Elimina un empleado tras confirmación.
 */
async function eliminarEmpleado(id) {
    if (confirm("¿Estás seguro de eliminar este empleado?")) {
        try {
            const res = await fetch(`${API_URL}/api/empleados/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();

            if (res.ok) {
                mostrarAlerta("Empleado eliminado con éxito", "warning");
                cargarEmpleados();
            } else {
                mostrarAlerta(result.mensaje, "danger");
            }
        } catch (err) {
            mostrarAlerta("Error al eliminar empleado", "danger");
        }
    }
}

/**
 * Crea o actualiza un empleado según el modo actual.
 */
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
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ nombre, correo, cargo, salario })
        });

        const result = await res.json();

        if (res.ok) {
            mostrarAlerta(editando ? "Empleado actualizado con éxito" : "Empleado agregado con éxito", "success");
            document.getElementById("empleado-form").reset();
            cargarEmpleados();
            editando = false;
            empleadoId = null;
        } else {
            mostrarAlerta(result.mensaje, "danger");
        }
    } catch (err) {
        mostrarAlerta(editando ? "Error al actualizar empleado" : "Error al agregar empleado", "danger");
    }
}

// =====================
//  Usuarios
// =====================

/**
 * Carga la lista de usuarios y permite gestión de roles.
 */
async function cargarUsuarios() {
    try {
        const res = await fetch(`${API_URL}/api/auth/usuarios`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Error al obtener usuarios");

        const usuarios = await res.json();
        const lista = document.getElementById("usuarios-list");
        lista.innerHTML = "";

        usuarios.forEach(u => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${u.nombre}</td>
                <td>${u.correo}</td>
                <td>
                    <select id="rol-${u.id}">
                        <option value="usuario" ${u.rol === "usuario" ? "selected" : ""}>Usuario</option>
                        <option value="admin" ${u.rol === "admin" ? "selected" : ""}>Admin</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-success btn-sm w-auto" onclick="cambiarRol(${u.id})">Actualizar</button>
                    <button class="btn btn-danger btn-sm w-auto" onclick="eliminarUsuario(${u.id})">Eliminar</button>
                </td>
            `;
            lista.appendChild(tr);
        });
    } catch (err) {
        console.error("Error cargando usuarios:", err);
    }
}

/**
 * Actualiza el rol de un usuario.
 */
async function cambiarRol(id) {
    const nuevoRol = document.getElementById(`rol-${id}`).value;

    try {
        const res = await fetch(`${API_URL}/api/auth/cambiar-rol/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ nuevoRol })
        });

        const result = await res.json();

        if (res.ok) {
            mostrarAlerta("Rol actualizado con éxito", "success");
            cargarUsuarios();
        } else {
            mostrarAlerta(result.mensaje, "danger");
        }
    } catch (err) {
        mostrarAlerta("Error al actualizar rol", "danger");
    }
}

/**
 * Elimina un usuario tras confirmación.
 */
async function eliminarUsuario(id) {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
        const res = await fetch(`${API_URL}/api/usuarios/eliminar-usuario/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        const result = await res.json();

        if (res.ok) {
            mostrarAlerta("Usuario eliminado con éxito", "success");
            cargarUsuarios();
        } else {
            mostrarAlerta(result.mensaje, "danger");
        }
    } catch (err) {
        mostrarAlerta("Error al eliminar usuario", "danger");
    }
}

// =====================
//  Utilidades
// =====================

/**
 * Muestra una alerta dinámica en pantalla.
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de alerta (success, danger, warning)
 */
function mostrarAlerta(mensaje, tipo = "success") {
    const alerta = document.getElementById("alerta");
    alerta.textContent = mensaje;
    alerta.className = `alert alert-${tipo} text-center`;
    alerta.classList.remove("d-none");

    setTimeout(() => {
        alerta.classList.add("d-none");
    }, 3000);
}

/**
 * Cierra sesión limpiando el token y redirigiendo al login.
 */
function cerrarSesion() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// =====================
//  Inicialización de dashboard
// =====================

const formEmpleado = document.getElementById("empleado-form");
if (formEmpleado) {
    formEmpleado.addEventListener("submit", agregarEmpleado);
}

// Carga inicial si se encuentra en el dashboard
if (window.location.pathname.includes("dashboard.html")) {
    cargarEmpleados();
}

/**
 * Configura elementos del DOM según el rol del usuario.
 */
document.addEventListener("DOMContentLoaded", () => {
    const rol = localStorage.getItem("rol") || "";
    const adminPanel = document.getElementById("admin-panel");
    const empleadoForm = document.getElementById("empleado-form");

    console.log("Rol del usuario:", rol);

    if (empleadoForm) {
        empleadoForm.style.display = rol !== "admin" ? "none" : "block";
    }

    if (adminPanel) {
        if (rol !== "admin") {
            adminPanel.remove();
        } else {
            adminPanel.style.display = "block";
            cargarUsuarios();
        }
    }
});
