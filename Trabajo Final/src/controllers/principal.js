import fs from 'fs';
import { creandoPartida, leerEstado, uniendoPartida, guardarCambios } from "../oca.js";

const preguntasJuego = JSON.parse(fs.readFileSync('src/data/preguntas.json', 'utf8'));

const preguntaRandom = (req, res) => { // se devuelve una pregunta al azar
    let partida = leerEstado(req.query.id);
    let randomQuestion = Math.floor(Math.random() * partida.indicesPreguntas.length); // devuelve un numero entre 0 y la cantidad de preguntas restantes
    res.json(preguntasJuego[partida.indicesPreguntas[randomQuestion]]);
}

const cargar = (req, res) => { // se carga el lobby
    res.render('lobby', {
        nombres: req.body.jugador || undefined
    });
};

const numeroRandom = (req, res) => { // se devuelve un numero al azar
    res.json({
        numero: Math.floor(Math.random() * 6) + 1
    });
}

const join = (req, res) => { // se une un jugador a la partida
    let partida = creandoPartida(req.body);
    res.redirect('/partida/' + partida.tableroId);
}

const joining = (req, res) => { // funcion que se ejecuta al entrar en el tablero, se carga
    let partida = leerEstado(req.params.tableroId);
    if (partida) {
        res.render('tablero', {
            nombre1: partida.jugador1Id,
            nombre2: partida.jugador2Id,
            color1: partida.color1Id,
            color2: partida.color2Id
        })
    }
}

const joinExisting = (req, res) => { // se verifica si se puede unir a la partida o no
    let partida = uniendoPartida(req.body);
    if (!partida) {
        res.send('Unknown board');
        return;
    }
    if (partida.lleno) {
        res.send('Partida llena');
        return;
    }
    res.redirect('/partida/' + partida.tableroId);
}


const update = (req, res) => { // se actualiza el estado de la partida
    let estado = leerEstado(req.body.tableroId);
    res.send(estado);
}

const save = (req, res) => { // se guardan los cambios del estado de la partida
    guardarCambios(req.body);
    res.send('ok');
}

const verificar = (req, res) => { // verifica si la pregunta fue contestada bien
    let namePregunta = req.body.nombrePregunta; // nos quedamos con el nombre de la pregunta
    let encontrada = preguntasJuego.find(data => data.pregunta == namePregunta);
    if (encontrada.correcta == req.body.seleccionada) { // pregunta contestada bien
        let partida = leerEstado(req.body.id);
        partida.indicesPreguntas.splice(partida.indicesPreguntas.findIndex(x => x === (encontrada.id - 1)), 1); // elimino esa pregunta para que no se repita
        guardarCambios(partida);
        res.json('Correcta');
    }
    else
        res.json('Incorrecta');
}



export { cargar, numeroRandom, join, joinExisting, update, save, joining, preguntaRandom, verificar };