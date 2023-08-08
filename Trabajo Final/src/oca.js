import fs from 'fs';
import crypto from 'crypto';

let estadoInicial = {
    tableroId: null,
    jugador1Id: null,
    jugador2Id: null,
    color1Id: null,
    color2Id: null,
    turno: 2,
    lleno: false,
    posicion1: 0,
    posicion2: 0,
    nombrePregunta: null,
    valorRespuesta: null,
    ganador: null,
    indicesPreguntas: []
}
const oca_DB = './oca.json'; // base de datos

for (let i = 0; i < 50; i++) // array que sirve para que no se repitan preguntas
    estadoInicial.indicesPreguntas[i] = i;

const generateId = () => { // genera el indice de la partida
    return crypto.randomBytes(8).toString('hex');
}

const guardarCambios = tablero => { // se guardan los cambios en la base de datos
    let partidas = JSON.parse(fs.readFileSync(oca_DB));
    let i = partidas.findIndex(p => p.tableroId == tablero.tableroId); // se busca la partida en la base de datos
    if (i == -1)
        partidas.push(tablero);
    else {
        partidas[i].tableroId = tablero.tableroId ?? partidas[i].tableroId
        partidas[i].jugador1Id = tablero.jugador1Id ?? partidas[i].jugador1Id;
        partidas[i].jugador2Id = tablero.jugador2Id ?? partidas[i].jugador2Id;
        partidas[i].color1Id = tablero.color1Id ?? partidas[i].color1Id;
        partidas[i].color2Id = tablero.color2Id ?? partidas[i].color2Id;
        partidas[i].turno = tablero.turno ?? partidas[i].turno;
        partidas[i].lleno = tablero.lleno ?? partidas[i].lleno;
        partidas[i].posicion1 = tablero.posicion1 ?? partidas[i].posicion1;
        partidas[i].posicion2 = tablero.posicion2 ?? partidas[i].posicion2;
        partidas[i].nombrePregunta = tablero.nombrePregunta ?? partidas[i].nombrePregunta;
        partidas[i].valorRespuesta = tablero.valorRespuesta ?? partidas[i].valorRespuesta;
        partidas[i].ganador = tablero.ganador ?? partidas[i].ganador;
        partidas[i].indicesPreguntas = tablero.indicesPreguntas ?? partidas[i].indicesPreguntas;
    }
    fs.writeFileSync(oca_DB, JSON.stringify(partidas, null, 2)); // se escribe en la base de datos el estado de la partida
}

const creandoPartida = datos => { // se crea la partida
    if (!fs.existsSync(oca_DB)) // si no existe el archivo de la base de datos, se crea
        fs.writeFileSync(oca_DB, JSON.stringify([]));
    let partida = {}; // se crea un objeto partida
    Object.assign(partida, estadoInicial); // se le asigna el estado inicial de la partida
    partida.tableroId = generateId(); // se asigna ID
    partida.color1Id = datos.color; // se asigna color del jugador 1
    partida.jugador1Id = datos.nombre; // se asigna nombre del jugador 1
    guardarCambios(partida);
    return partida;
}

const uniendoPartida = datos => { // funcion que se ejecuta al unirse a la partida
    let partida = JSON.parse(fs.readFileSync(oca_DB)).find(p => p.tableroId == datos.id); // se busca la partida por id
    if (partida) { // si se encuentra una partida
        if (!partida.jugador2Id) {
            partida.jugador2Id = datos.nombre;
            if (partida.color1Id == datos.color) // si los colores son iguales, se cambia a uno diferente
                partida.color2Id = 'purple';
            else
                partida.color2Id = datos.color;
            guardarCambios(partida);
        }
        return partida;
    }
    return undefined;
}

const leerEstado = id => { // se lee el estado de la partida
    let estado = JSON.parse(fs.readFileSync(oca_DB)).find(p => p.tableroId == id);
    if (estado) // si se encuentra, se devuelve
        return {
            tableroId: estado.tableroId,
            jugador1Id: estado.jugador1Id,
            jugador2Id: estado.jugador2Id,
            color1Id: estado.color1Id,
            color2Id: estado.color2Id,
            turno: estado.turno,
            lleno: estado.lleno,
            posicion1: estado.posicion1,
            posicion2: estado.posicion2,
            nombrePregunta: estado.nombrePregunta,
            valorRespuesta: estado.valorRespuesta,
            ganador: estado.ganador,
            indicesPreguntas: estado.indicesPreguntas
        };
    return undefined;
}

export { creandoPartida, uniendoPartida, leerEstado, guardarCambios }