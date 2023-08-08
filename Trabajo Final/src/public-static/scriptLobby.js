// VARIABLES:

let colorSeleccionado;
let jugadorSeleccionado = null;
const botonConfirmar = document.getElementById('botonConfirmar');
const botonCrear = document.getElementById('botonCrear');
const botonPegar = document.getElementById('botonPegar');
const botonUnirse = document.getElementById('botonUnirse');
const elementosJugador = document.querySelectorAll("#jugador .color-item");

//AGREGAR FUNCIONALIDADES:

botonCrear.addEventListener('click', crearPartida);
botonConfirmar.addEventListener('click', unirseAPartida);
botonPegar.addEventListener('click', () => pegarID());
botonUnirse.addEventListener('click', () => mostrarInput());

for (let i = 0; i < elementosJugador.length; i++)
    elementosJugador[i].addEventListener("click", crearColor());

//FUNCIONES: 

const mostrarInput = () => { // funcion para que se muestre el input de ID de partida
    document.getElementById("campoInput").style.display = "block";
}

const botonConfirmacion = () => { // funcion para mostrar las opciones cuando se elige un color
    if (jugadorSeleccionado) {
        botonCrear.style.display = 'inline-block';
        botonUnirse.style.display = 'inline-block';
    }
}

const cambiarBordes = () => { // se cambia el estilo de la pagina al color seleccionado
    const contenedor = document.getElementById('jugador');
    contenedor.style.border = '3px solid #000';
    colorSeleccionado = jugadorSeleccionado.getAttribute('value');
    contenedor.style.borderColor = colorSeleccionado;
    contenedor.style.boxShadow = "0 30px 30px -15px " + colorSeleccionado;
    botonConfirmar.style.borderColor = colorSeleccionado;
    botonCrear.style.borderColor = colorSeleccionado;
    botonPegar.style.borderColor = colorSeleccionado;
    botonUnirse.style.borderColor = colorSeleccionado;
}

const pegarID = () => { // pegar el ID de la partida
    navigator.clipboard.readText().then(texto => {
        document.getElementById('joinID').value = texto;
    });
}

function crearColor() { // se elige un color
    return (event) => {
        if (jugadorSeleccionado)
            jugadorSeleccionado.classList.remove('active');
        jugadorSeleccionado = event.target;
        jugadorSeleccionado.classList.add("active");
        botonConfirmacion();
        cambiarBordes();
    }
}

function crearPartida() { // mandamos el color y el nombre
    let nombre = document.getElementById('nombre').innerHTML.trim();
    const datos = {
        color: colorSeleccionado,
        nombre: nombre
    };
    fetch('/partida', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
        .then(data => {
            window.location.href = data.url;
        });
}

function unirseAPartida() { //mandamos nombre, color e id de partida ingresado. Manejo de errores con ID
    let id = document.getElementById('joinID').value;
    const errorID = document.getElementById('error');
    if (id === '') {
        errorID.innerHTML = 'Ingrese un ID de partida.';
        return;
    }
    let nombre = document.getElementById('nombre').innerHTML.trim();
    const datos = {
        color: colorSeleccionado,
        nombre: nombre,
        id: id
    };
    fetch('/join/' + id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
        .then(response => {
            if (response.redirected)
                window.location.href = response.url;
            else {
                response.text()
                .then(data => {
                    if (data === 'Unknown board')
                        errorID.innerHTML = 'ID inválido.';
                    else if (data === 'Partida llena')
                        errorID.innerHTML = 'Partida llena.'
                })
            }
        });
}