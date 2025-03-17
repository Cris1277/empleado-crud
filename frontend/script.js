document.addEventListener("DOMContentLoaded",(()=>{console.log("✅ script.js se está ejecutando correctamente"),setInterval((()=>{console.log("⏳ Ejecutando intervalo..."),fetch("https://empleado-crud-production.up.railway.app/api/health").then((e=>e.json())).then((e=>console.log("✅ Ping al backend realizado con éxito:",e))).catch((e=>console.error("❌ Error en el ping al backend",e)))}),3e5)}));const API_URL="https://empleado-crud-production.up.railway.app",form=document.getElementById("auth-form"),toggleForm=document.getElementById("toggle-form"),formTitle=document.getElementById("form-title"),nombreInput=document.getElementById("nombre"),passwordRequirements=document.querySelector(".form-text"),submitButton=document.querySelector("#auth-form button");let isRegister=!1;toggleForm&&toggleForm.addEventListener("click",(e=>{e.preventDefault(),isRegister=!isRegister,formTitle.textContent=isRegister?"Registro":"Iniciar Sesión",nombreInput.style.display=isRegister?"block":"none",passwordRequirements.style.display=isRegister?"block":"none",submitButton.textContent=isRegister?"Registrar":"Ingresar",toggleForm.innerHTML=isRegister?'¿Ya tienes cuenta? <a href="#">Inicia sesión aquí</a>':'¿No tienes cuenta? <a href="#">Regístrate aquí</a>'})),form&&form.addEventListener("submit",(async e=>{e.preventDefault();const t=nombreInput.value.trim(),o=document.getElementById("correo").value.trim(),a=document.getElementById("password").value.trim(),r=isRegister?"/api/auth/register":"/api/auth/login",n=isRegister?{nombre:t,correo:o,password:a}:{correo:o,password:a};try{const e=await fetch(`${API_URL}${r}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}),t=await e.json();e.ok?(mostrarAlerta(t.mensaje,"success"),isRegister||(localStorage.setItem("token",t.token),localStorage.setItem("rol",t.rol),setTimeout((()=>window.location.href="dashboard.html"),2e3))):mostrarAlerta(t.mensaje,"danger")}catch(e){mostrarAlerta("Error de conexión","danger"),console.error("Error:",e)}}));const token=localStorage.getItem("token");!token&&window.location.pathname.includes("dashboard.html")&&(window.location.href="index.html");let editando=!1,empleadoId=null;async function cargarEmpleados(){try{const e=await fetch(`${API_URL}/api/empleados`,{headers:{Authorization:`Bearer ${token}`}});if(!e.ok)throw new Error("Error al obtener empleados");const t=await e.json(),o=document.getElementById("empleados-list");o.innerHTML="",t.forEach((e=>{const t=document.createElement("tr");t.innerHTML=`\n                <td>${e.nombre}</td>\n                <td>${e.correo}</td>\n                <td>${e.cargo}</td>\n                <td>${e.salario}</td>\n                <td class="text-center">\n                    ${"admin"===userRole?`\n                        <button class="btn btn-warning btn-sm w-auto" onclick="editarEmpleado(${e.id}, '${e.nombre}', '${e.correo}', '${e.cargo}', ${e.salario})">✏️ Editar</button>\n                        <button class="btn btn-danger btn-sm w-auto" onclick="eliminarEmpleado(${e.id})">🗑 Eliminar</button>\n                    `:""}\n                </td>\n            `,o.appendChild(t)}))}catch(e){console.error("Error cargando empleados:",e)}}async function agregarEmpleado(e){e.preventDefault();const t=document.getElementById("nombre").value.trim(),o=document.getElementById("correo").value.trim(),a=document.getElementById("cargo").value.trim(),r=document.getElementById("salario").value.trim(),n=editando?`${API_URL}/api/empleados/${empleadoId}`:`${API_URL}/api/empleados`,i=editando?"PUT":"POST";try{const e=await fetch(n,{method:i,headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({nombre:t,correo:o,cargo:a,salario:r})}),s=await e.json();e.ok?(mostrarAlerta(editando?"Empleado actualizado con éxito":"Empleado agregado con éxito","success"),document.getElementById("empleado-form").reset(),cargarEmpleados(),editando=!1,empleadoId=null):mostrarAlerta(s.mensaje,"danger")}catch(e){mostrarAlerta(editando?"Error al actualizar empleado":"Error al agregar empleado","danger")}}function editarEmpleado(e,t,o,a,r){document.getElementById("nombre").value=t,document.getElementById("correo").value=o,document.getElementById("cargo").value=a,document.getElementById("salario").value=r,editando=!0,empleadoId=e}async function eliminarEmpleado(e){if(confirm("¿Estás seguro de eliminar este empleado?"))try{const t=await fetch(`${API_URL}/api/empleados/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${token}`}}),o=await t.json();t.ok?(mostrarAlerta("Empleado eliminado con éxito","warning"),cargarEmpleados()):mostrarAlerta(o.mensaje,"danger")}catch(e){mostrarAlerta("Error al eliminar empleado","danger")}}function cerrarSesion(){localStorage.removeItem("token"),window.location.href="index.html"}const formEmpleado=document.getElementById("empleado-form");function mostrarAlerta(e,t="success"){const o=document.getElementById("alerta");o.textContent=e,o.className=`alert alert-${t} text-center`,o.classList.remove("d-none"),setTimeout((()=>{o.classList.add("d-none")}),3e3)}formEmpleado&&formEmpleado.addEventListener("submit",agregarEmpleado),window.location.pathname.includes("dashboard.html")&&cargarEmpleados();let userRole=localStorage.getItem("rol");async function cargarUsuarios(){const e=localStorage.getItem("token");try{const t=await fetch(`${API_URL}/api/auth/usuarios`,{headers:{Authorization:`Bearer ${e}`}});if(!t.ok)throw new Error("Error al obtener usuarios");const o=await t.json(),a=document.getElementById("usuarios-list");a.innerHTML="",o.forEach((e=>{const t=document.createElement("tr");t.innerHTML=`\n                <td>${e.nombre}</td>\n                <td>${e.correo}</td>\n                <td>\n                    <select id="rol-${e.id}">\n                        <option value="usuario" ${"usuario"===e.rol?"selected":""}>Usuario</option>\n                        <option value="admin" ${"admin"===e.rol?"selected":""}>Admin</option>\n                    </select>\n                </td>\n                <td>\n                    <button class="btn btn-success btn-sm w-auto" onclick="cambiarRol(${e.id})">Actualizar</button>\n                    <button class="btn btn-danger btn-sm w-auto" onclick="eliminarUsuario(${e.id})">Eliminar</button>\n                </td>\n            `,a.appendChild(t)}))}catch(e){console.error("Error cargando usuarios:",e)}}async function cambiarRol(e){const t=localStorage.getItem("token"),o=document.getElementById(`rol-${e}`).value;try{const a=await fetch(`${API_URL}/api/auth/cambiar-rol/${e}`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({nuevoRol:o})}),r=await a.json();a.ok?(mostrarAlerta("Rol actualizado con éxito","success"),cargarUsuarios()):mostrarAlerta(r.mensaje,"danger")}catch(e){mostrarAlerta("Error al actualizar rol","danger")}}async function eliminarUsuario(e){if(!confirm("¿Estás seguro de eliminar este usuario?"))return;const t=localStorage.getItem("token");try{const o=await fetch(`${API_URL}/api/usuarios/eliminar-usuario/${e}`,{method:"DELETE",headers:{Authorization:`Bearer ${t}`}}),a=await o.json();o.ok?(mostrarAlerta("Usuario eliminado con éxito","success"),cargarUsuarios()):mostrarAlerta(a.mensaje,"danger")}catch(e){mostrarAlerta("Error al eliminar usuario","danger")}}"admin"===userRole&&(document.getElementById("admin-panel").style.display="block"),document.addEventListener("DOMContentLoaded",(()=>{let e=localStorage.getItem("rol")||"",t=document.getElementById("admin-panel"),o=document.getElementById("empleado-form");console.log("Rol del usuario:",e),o&&(o.style.display="admin"!==e?"none":"block"),t&&("admin"!==e?t.remove():(t.style.display="block",cargarUsuarios()))}));
