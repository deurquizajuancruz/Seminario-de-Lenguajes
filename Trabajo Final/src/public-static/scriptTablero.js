//VARIABLES:

let idJugador;
let numeroFinal;
let parametro = '/partida/';
let pos = window.location.pathname.indexOf(parametro);
let id = window.location.pathname.substring(pos + parametro.length);
const boton1 = document.getElementById('botonTirarJugador1');
const boton2 = document.getElementById('botonTirarJugador2');
let estadoPartida = {
    tableroId: null,
    jugador1Id: null,
    jugador2Id: null,
    color1Id: null,
    color2Id: null,
    turno: null,
    lleno: false,
    posicion1: 0,
    posicion2: 0,
    nombrePregunta: null,
    valorRespuesta: null,
    ganador: null,
    indicesPreguntas: []
};

//AGREGAR FUNCIONALIDADES:

boton1.setAttribute('disabled', '');
boton2.setAttribute('disabled', '');
document.getElementById('copiarId').addEventListener('click', () => copiarId());

//FUNCIONES:

const numeroAleatorio = () => { // animacion del dado
    return Math.floor(Math.random() * 6) + 1;
}

const copiarId = () => { // copiar ID de la partida
    navigator.clipboard.writeText(id);
}

const mostrarImagen = () => { // mostrar la imagen del dado con animacion
    const imagen = document.getElementById('dado' + estadoPartida.turno);
    setTimeout(function () {
        imagen.style.transition = 'opacity 1s ease-in';
        imagen.style.opacity = 1;
    }, 100);
}

const cambiarBotones = () => { // habilitar / deshabilitar los botones de tirar dado
    const botonTirar = document.getElementById('botonTirarJugador' + idJugador);
    botonTirar.hasAttribute('disabled') ? botonTirar.removeAttribute('disabled') : botonTirar.setAttribute('disabled', '');
}

function mostrarNumerosRapidos() { // animacion de tirar el dado
    if (estadoPartida.turno == idJugador) {
        fetch('/numeroFinal')
            .then(response => response.json()) // se trae el numero que le tocó al jugador desde el backend
            .then(data => {
                numeroFinal = data.numero;
            });
        let botonActual = estadoPartida.turno === 1 ? document.getElementById('botonTirarJugador1') : document.getElementById('botonTirarJugador2');
        botonActual.setAttribute('disabled', '');
        const numerosContainer = document.getElementById('container-numeros-jugador' + estadoPartida.turno);
        let contador = 0;
        let id;
        function mostrarSiguienteNumero() {
            if (contador < 18 || !numeroFinal) {
                numerosContainer.innerHTML = numeroAleatorio();
                contador++;
                id = setTimeout(mostrarSiguienteNumero, 100);
            } else {
                clearTimeout(id);
                if (document.getElementById('dado' + estadoPartida.turno) !== null)
                    document.getElementById('dado' + estadoPartida.turno).remove();
                let imagen = document.createElement('img');
                estadoPartida.turno == 1 ? imagen.id = 'dado1' : imagen.id = 'dado2';
                imagen.style.opacity = 0;
                imagen.src = '/s/media/cara' + numeroFinal + '.png';
                const player = estadoPartida.turno === 1 ? document.getElementById('jugador1') : document.getElementById('jugador2');
                player.append(imagen);
                mostrarImagen();
                numerosContainer.innerHTML = '';
                let texto = document.createElement('p');
                texto.style.margin = '0';
                texto.innerHTML = "El número que te tocó es: " + numeroFinal;
                numerosContainer.append(texto);
                estadoPartida.turno == 1 ? marcarDestino(1) : marcarDestino(2);
            }
        }
        mostrarSiguienteNumero();
    }
}

const eliminarAnterior = () => { // se elimina la pregunta anterior junto con sus opciones y el valor de la respuesta
    const nombrePregunta = document.getElementById('nombrePregunta');
    if (nombrePregunta)
        nombrePregunta.remove();
    const opciones = document.querySelectorAll('.opcionPregunta');
    if (opciones) {
        opciones.forEach(element => {
            element.remove()
        });
    }
    const valorRespuesta = document.getElementById('valorRespuesta');
    if (valorRespuesta)
        valorRespuesta.remove();
}

const marcarDestino = turno => { // se marca la casilla destino: a donde avanzaría si contesta bien
    let destino1 = estadoPartida.posicion1 + numeroFinal;
    let destino2 = estadoPartida.posicion2 + numeroFinal;
    let destino = turno == 1 ? destino1 : destino2;
    if (destino == estadoPartida.posicion1 || destino == estadoPartida.posicion2) {
        mostrarNumerosRapidos();
        return;
    }
    let colorJugador = turno == 1 ? estadoPartida.color1Id : estadoPartida.color2Id;
    let casillero = destino >= 21 ? document.getElementById('salida') : document.getElementById(destino);
    casillero.style.border = '3px dotted';
    casillero.style.borderColor = colorJugador;
    hacerPregunta();
}

function hacerPregunta() { // se muestra la pregunta que le tocó al jugador
    const containerPreguntas = document.getElementById('container-preguntas');
    const name = document.getElementById('nombrePregunta') ?? document.createElement('p');
    const valorRespuesta = document.getElementById('valorRespuesta');
    if (valorRespuesta)
        valorRespuesta.remove();
    const botonEnviar = document.getElementById('enviarPregunta');
    if (botonEnviar.hasAttribute('disabled'))
        botonEnviar.removeAttribute('disabled');
    document.getElementById('enviarPregunta').style.display = 'inline-block';
    fetch('/preguntaFinal?id=' + estadoPartida.tableroId) // se trae la pregunta desde el backend
        .then(response => response.json())
        .then(data => {
            let nombreJugador = estadoPartida.turno == 1 ? estadoPartida.jugador1Id : estadoPartida.jugador2Id;
            name.innerHTML = 'Pregunta para ' + nombreJugador + ': ' + data.pregunta;
            name.id = 'nombrePregunta';
            containerPreguntas.append(name);
            let vectorOpciones = ['correcta', 'incorrecta1', 'incorrecta2'];
            for (let i = 0; i < 3; i++) {
                let opcion = Math.floor(Math.random() * (vectorOpciones.length - 1));
                const div = document.createElement('div');
                div.className = 'opcionPregunta'
                const input = document.createElement('input');
                input.type = 'radio';
                input.className = 'opcion';
                input.name = 'respuesta';
                const label = document.createElement('label');
                label.innerHTML = data[vectorOpciones[opcion]];
                label.id = 'opcion' + i;
                div.append(input, label)
                containerPreguntas.append(div);
                vectorOpciones.splice(opcion, 1);
            }
            guardarCambios();
        });
}

function guardarEstado() { // se guarda el estado de la partida
    const data = {
        tableroId: estadoPartida.tableroId,
        jugador1Id: estadoPartida.jugador1Id,
        jugador2Id: estadoPartida.jugador2Id,
        color1Id: estadoPartida.color1Id,
        color2Id: estadoPartida.color2Id,
        turno: estadoPartida.turno,
        lleno: estadoPartida.lleno,
        posicion1: estadoPartida.posicion1,
        posicion2: estadoPartida.posicion2,
        indicesPreguntas: estadoPartida.indicesPreguntas
    };
    fetch('/save', { // se manda el estado de la partida al backend
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (estadoPartida.turno != idJugador) // si no es el turno del jugador, se debe estar actualizando el tablero
        downloadBoard();
}

function guardarCambios() { // se guardan los cambios
    const data = {
        tableroId: estadoPartida.tableroId,
        turno: estadoPartida.turno,
        posicion1: estadoPartida.posicion1,
        posicion2: estadoPartida.posicion2,
        nombrePregunta: document.getElementById('nombrePregunta').innerHTML,
        ganador: estadoPartida.ganador,
    };
    if (document.getElementById('valorRespuesta') != null)
        data.valorRespuesta = document.getElementById('valorRespuesta').innerHTML;
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (estadoPartida.turno != idJugador && !estadoPartida.ganador)
        downloadBoard();
}

function actualizarJugador() { // se ejecuta cuando se une el jugador 2 a la partida
    fetch('/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tableroId: estadoPartida.tableroId
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.jugador2Id !== null) {
                Object.assign(estadoPartida, data);
                document.getElementById('jugador2').style.borderColor = estadoPartida.color2Id;
                document.getElementById('jugador2').style.boxShadow = `0 15px 15px -15px ${estadoPartida.color2Id}`;
                document.getElementById('nombre2').innerHTML = 'JUGADOR 2: ' + data.jugador2Id;
                document.getElementById('botonTirarJugador1').removeAttribute('disabled');
                document.getElementById('botonTirarJugador' + idJugador).removeAttribute('disabled');
            }
        })
}

const esperandoJugador = () => { // se ejecuta mientras se este esperando al jugador 2
    if (estadoPartida.turno != idJugador) {
        actualizarJugador()
        setTimeout(esperandoJugador, 1000);
    }
    else {
        document.getElementById('turnoJugador').innerHTML = 'Turno del jugador: 1';
        document.getElementById('entrada').style.background = `linear-gradient(90deg,${estadoPartida.color1Id} 50%,${estadoPartida.color2Id} 50%)`;
    }
}

const declararGanador = ganador => { // se ejecuta cuando hay un ganador de la partida
    const botonEnviar = document.getElementById('enviarPregunta');
    botonEnviar.setAttribute('disabled', '');
    const nombreGanador = ganador == 1 ? estadoPartida.jugador1Id : estadoPartida.jugador2Id;
    const colorGanador = ganador == 1 ? estadoPartida.color1Id : estadoPartida.color2Id;
    const texto = document.getElementById('turnoJugador');
    texto.innerHTML = 'El jugador ' + ganador + ': ' + nombreGanador + ' ha ganado la partida!';
    texto.style.webkitTextStroke = '0.5px black';
    texto.style.color = colorGanador;
    const link = document.createElement('a');
    link.href = 'http://localhost:3000';
    link.textContent = 'Volver al lobby';
    const txt = document.getElementById('turnoActual');
    txt.appendChild(link);
}

const marcarCasillero = (posicionA, posicionB, salida, colorA, colorB) => { // se marca el casillero para el otro jugador
    if (posicionA === 0) {
        let entrada = document.getElementById('entrada');
        entrada.removeAttribute('style');
        entrada.style.backgroundColor = posicionB === 0 ? colorB : 'white';
    } else
        document.getElementById(posicionA).style.backgroundColor = 'white';
    let marcar = salida >= 21 ? 'salida' : salida;
    document.getElementById(marcar).style.backgroundColor = colorA;
}

function actualizarTablero() { // funcion que actualiza el tablero constantemente para el jugador del cual no es el turno
    fetch('/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tableroId: estadoPartida.tableroId
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.ganador)
                declararGanador(data.ganador);
            const containerPreguntas = document.getElementById('container-preguntas');
            let namePreg = document.getElementById('nombrePregunta');
            document.getElementById('enviarPregunta').setAttribute('disabled', '');
            if (namePreg === null) { // si no hay ninguna pregunta
                namePreg = document.createElement('p');
                namePreg.id = 'nombrePregunta';
                containerPreguntas.append(namePreg);
            }
            namePreg.innerHTML = data.nombrePregunta;
            let valorR = document.getElementById('valorRespuesta');
            if (valorR === null) { // si no hay ninguna respuesta
                valorR = document.createElement('p');
                valorR.id = 'valorRespuesta';
                containerPreguntas.append(valorR);
            }
            valorR.innerHTML = data.valorRespuesta;
            if (valorR.innerHTML !== '') {
                let contenido = valorR.innerHTML;
                let partes = contenido.split(':');
                let texto = partes[1].trim();
                valorR.className = texto === 'Incorrecta' ? 'incorrecta' : 'correcta';
            }
            if (data.posicion1 != estadoPartida.posicion1)
                marcarCasillero(estadoPartida.posicion1, estadoPartida.posicion2, data.posicion1, data.color1Id, estadoPartida.color2Id);
            else if (data.posicion2 != estadoPartida.posicion2)
                marcarCasillero(estadoPartida.posicion2, estadoPartida.posicion1, data.posicion2, data.color2Id, estadoPartida.color1Id);
            Object.assign(estadoPartida, data);
        })
}

const downloadBoard = () => { // funcion que se encarga de manejar la actualizacion del tablero constantemente
    if (estadoPartida.ganador)
        return;
    if (estadoPartida.turno != idJugador) {
        actualizarTablero();
        setTimeout(downloadBoard, 3000);
    }
    else {
        cambiarBotones();
        document.getElementById('turnoJugador').innerHTML = 'Turno del jugador: ' + estadoPartida.turno;
    }
}

function verificarRespuesta(seleccionado) { // se verifica si la opcion seleccionada es correcta
    let p = document.createElement('p');
    p.id = 'valorRespuesta';
    let contenido = document.getElementById('nombrePregunta').innerHTML;
    let pregunta = contenido.substring(contenido.indexOf('¿'));
    const data = {
        nombrePregunta: pregunta,
        seleccionada: seleccionado,
        id: estadoPartida.tableroId
    }
    fetch('/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            let destino1 = estadoPartida.posicion1 + numeroFinal;
            let destino2 = estadoPartida.posicion2 + numeroFinal;
            let posicion = estadoPartida.turno == 1 ? estadoPartida.posicion1 : estadoPartida.posicion2;
            let destino = estadoPartida.turno == 1 ? destino1 : destino2;
            let colorJugador = estadoPartida.turno == 1 ? estadoPartida.color1Id : estadoPartida.color2Id;
            let casillero = destino >= 21 ? document.getElementById('salida') : document.getElementById(destino);
            if (data == 'Correcta') {
                p.innerHTML = 'Respuesta jugador ' + estadoPartida.turno + ': Correcta';
                p.className = 'correcta';
                casillero.style.border = '1px solid';
                casillero.style.backgroundColor = colorJugador;
                if (posicion === 0) {
                    let inicio = document.getElementById('entrada');
                    inicio.removeAttribute('style');
                    if (estadoPartida.turno === 1)
                        estadoPartida.posicion2 === 0 ? inicio.style.backgroundColor = estadoPartida.color2Id : inicio.style.backgroundColor = 'white';
                    else
                        estadoPartida.posicion1 === 0 ? inicio.style.backgroundColor = estadoPartida.color1Id : inicio.style.backgroundColor = 'white';
                }
                else
                    document.getElementById(posicion).removeAttribute('style');
                estadoPartida.turno == 1 ? estadoPartida.posicion1 = destino : estadoPartida.posicion2 = destino;
                posicion = destino;
            }
            else {
                p.innerHTML = 'Respuesta jugador ' + estadoPartida.turno + ': Incorrecta';
                p.className = 'incorrecta';
                casillero.removeAttribute('style');
            }
            document.getElementById('container-preguntas').append(p);
            estadoPartida.turno == 1 ? estadoPartida.turno++ : estadoPartida.turno--; // se cambia el turno 
            if (posicion >= 21) {
                estadoPartida.ganador = idJugador;
                declararGanador(estadoPartida.ganador);
            }
            else {
                document.getElementById('turnoJugador').innerHTML = 'Turno del jugador: ' + estadoPartida.turno;
                setTimeout(eliminarAnterior, 3500);
            }
            guardarCambios();
        })
}

const opcionElegida = () => { // se selecciona la opcion elegida por el jugador y se verifica
    const opciones = document.querySelectorAll('.opcion');
    let seleccionado;
    for (let i = 0; i < 3; i++) {
        if (opciones[i].checked) {
            seleccionado = document.getElementById('opcion' + i).innerHTML;
            break;
        }
    }
    verificarRespuesta(seleccionado);
}

function iniciar() { // funcion que se ejecuta al cargar la pagina
    document.getElementById('idPartida').innerHTML = 'ID de la partida: ' + id;
    document.getElementById('enviarPregunta').addEventListener('click', () => opcionElegida());
    fetch('/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tableroId: id })
    })
        .then(response => response.json())
        .then(data => {
            Object.assign(estadoPartida, data);
            if (data.jugador1Id && !data.jugador2Id) { // si se genero un id para el jugador 1 y no para el jugador 2 -> soy jugador 1
                idJugador = 1;
                boton1.addEventListener('click', mostrarNumerosRapidos);
                esperandoJugador();
            }
            else if (data.jugador2Id) { // si se genero un id para el jugador 2 -> soy jugador 2
                idJugador = 2;
                boton2.addEventListener('click', mostrarNumerosRapidos);
                estadoPartida.lleno = true;
                estadoPartida.turno = 1;
                document.getElementById('turnoJugador').innerHTML = 'Turno del jugador: ' + estadoPartida.turno;
                document.getElementById('entrada').style.background = `linear-gradient(90deg,${estadoPartida.color1Id} 50%,${estadoPartida.color2Id} 50%)`;
                guardarEstado();
            }
        });
}