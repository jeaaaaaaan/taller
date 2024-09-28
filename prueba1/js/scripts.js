document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios().then(() => {
        const rol = localStorage.getItem('rol');
        
        if (rol === 'admin') {
            cargarTablaAdmin(); 
        } else if (rol === 'usuario') {
            cargarTablaUsuario(); 
        }

        mostrarBienvenida();
    });

    const formularioTrabajador = document.getElementById('formularioTrabajador');
    if (formularioTrabajador) {
        formularioTrabajador.addEventListener('submit', manejarFormularioTrabajador);
    }
});

let usuarios = [];
const trabajadoresAceptados = [];

const mostrarBienvenida = () => {
    const nombreUsuario = localStorage.getItem('nombreUsuario');

    if (nombreUsuario) {
        document.getElementById('mensajeBienvenida').textContent = 'Bienvenido ' + nombreUsuario;
    } else {
        document.getElementById('mensajeBienvenida').textContent = 'Bienvenido Usuario';
    }
};

const cargarUsuarios = async () => {
    try {
        const response = await fetch('/prueba1/json/users.json');
        usuarios = await response.json();
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
};

const manejarLogin = (e) => {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;

    const user = usuarios.find(u => u.usuario === usuario && u.contrasena === contrasena);
    if (user) {
        localStorage.setItem('rol', user.rol);
        localStorage.setItem('nombreUsuario', user.usuario); 

        if (user.rol === 'admin') {
            window.location.href = 'html/adminindex.html';
        } else if (user.rol === 'trabajador') {
            window.location.href = 'html/trabajadorindex.html';
        } else if (user.rol === 'usuario') {
            window.location.href = 'html/usuarioindex.html';
        }
    } else {
        alert('Usuario o contraseña incorrectos');
    }
};

const cerrarSesion = () => {
    localStorage.removeItem('rol');
    localStorage.removeItem('nombreUsuario');
    window.location.href = '/prueba1/index.html'; 
};

const validarAcceso = () => {
    const rol = localStorage.getItem('rol');
    if (!rol) {
        window.location.href = '/prueba1/index.html'; 
    }
};

const manejarFormularioTrabajador = (e) => {
    e.preventDefault();

    const edad = document.getElementById('edad').value;
    
    if (edad <= 0) {
        alert('La edad debe ser un número positivo.');
        return;
    }

    const trabajadorData = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        correo: document.getElementById('correo').value,
        titulo: document.getElementById('titulo').value,
        ubicacion: document.getElementById('ubicacion').value,
        edad: edad,
        telefono: document.getElementById('telefono').value,
        genero: document.querySelector('input[name="genero"]:checked').value,
        nivelEducativo: document.getElementById('nivelEducativo').value
    };

    if (!trabajadorData.nombre || !trabajadorData.apellido || !trabajadorData.correo ||
        !trabajadorData.titulo || !trabajadorData.ubicacion || !trabajadorData.edad || 
        !trabajadorData.telefono || !trabajadorData.genero || !trabajadorData.nivelEducativo) {
        alert('Por favor completa todos los campos.');
        return;
    }

    let trabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];
    trabajadores.push(trabajadorData);
    localStorage.setItem('trabajadores', JSON.stringify(trabajadores));

    alert('Solicitud enviada al administrador.');
    document.getElementById('formularioTrabajador').reset();

    if (localStorage.getItem('rol') === 'admin') {
        cargarTablaAdmin();
    }
};

const cargarTablaAdmin = () => {
    const cuerpoTabla = document.querySelector('#tablaTrabajadores tbody');
    const trabajadoresGuardados = JSON.parse(localStorage.getItem('trabajadores')) || [];
    
    cuerpoTabla.innerHTML = '';

    trabajadoresGuardados.forEach((trabajador, index) => {
        const fila = cuerpoTabla.insertRow();
        fila.insertCell(0).textContent = trabajador.nombre;
        fila.insertCell(1).textContent = trabajador.apellido;
        fila.insertCell(2).textContent = trabajador.correo;
        fila.insertCell(3).textContent = trabajador.titulo;
        fila.insertCell(4).textContent = trabajador.ubicacion;
        fila.insertCell(5).textContent = trabajador.edad;
        fila.insertCell(6).textContent = trabajador.telefono; 
        fila.insertCell(7).textContent = trabajador.genero; 
        fila.insertCell(8).textContent = trabajador.nivelEducativo; 

        const celdaAcciones = fila.insertCell(9);

        const botonAceptar = document.createElement('button');
        botonAceptar.textContent = 'Aceptar';
        botonAceptar.onclick = async () => {
            alert(`Trabajador ${trabajador.nombre} aceptado.`);
            
            let trabajadoresAceptados = JSON.parse(localStorage.getItem('trabajadoresAceptados')) || [];
            trabajadoresAceptados.push(trabajador);
            localStorage.setItem('trabajadoresAceptados', JSON.stringify(trabajadoresAceptados));

            trabajadoresGuardados.splice(index, 1);
            localStorage.setItem('trabajadores', JSON.stringify(trabajadoresGuardados));
            cargarTablaAdmin();
        };

        const botonRechazar = document.createElement('button');
        botonRechazar.textContent = 'Rechazar';
        botonRechazar.onclick = () => {
            alert(`Trabajador ${trabajador.nombre} rechazado.`);
            trabajadoresGuardados.splice(index, 1);
            localStorage.setItem('trabajadores', JSON.stringify(trabajadoresGuardados));
            cargarTablaAdmin();
        };

        celdaAcciones.appendChild(botonAceptar);
        celdaAcciones.appendChild(botonRechazar);
    });
};

const cargarTablaUsuario = () => {
    const cuerpoTabla = document.querySelector('#tablaTrabajadoresAceptados tbody');
    const trabajadoresAceptados = JSON.parse(localStorage.getItem('trabajadoresAceptados')) || [];

    cuerpoTabla.innerHTML = '';

    trabajadoresAceptados.forEach(trabajador => {
        const fila = cuerpoTabla.insertRow();
        fila.insertCell(0).textContent = trabajador.nombre;
        fila.insertCell(1).textContent = trabajador.apellido;
        fila.insertCell(2).textContent = trabajador.correo;
        fila.insertCell(3).textContent = trabajador.titulo;
        fila.insertCell(4).textContent = trabajador.ubicacion;
        fila.insertCell(5).textContent = trabajador.edad;
        fila.insertCell(6).textContent = trabajador.telefono; 
        fila.insertCell(7).textContent = trabajador.genero; 
        fila.insertCell(8).textContent = trabajador.nivelEducativo; 
    });
};

const retractil = () => {
    const nav = document.getElementById('HD');
    const button = document.getElementById('Bretractil');

    if (nav.style.display === 'none') {
        nav.style.display = 'block'; 
        button.textContent = 'Ocultar'; 
    } else {
        nav.style.display = 'none'; 
        button.textContent = 'Mostrar'; 
    }
};


document.getElementById('formularioLogin')?.addEventListener('submit', manejarLogin);
