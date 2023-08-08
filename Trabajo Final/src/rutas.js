import express from 'express';
import { preguntaRandom, cargar, numeroRandom, join, joinExisting, joining, update, save, verificar } from './controllers/principal.js';
var routerServer = express.Router();

//LOBBY:

routerServer.get('/', cargar);
routerServer.post('/', cargar);

//TABLERO:

routerServer.post('/partida', join);
routerServer.get('/partida/:tableroId', joining);
routerServer.post('/join/:tableroId', joinExisting);
routerServer.post('/update', update);
routerServer.post('/save', save);
routerServer.post('/verify', verificar);
routerServer.get('/numeroFinal', numeroRandom);
routerServer.get('/preguntaFinal', preguntaRandom);

export default routerServer;