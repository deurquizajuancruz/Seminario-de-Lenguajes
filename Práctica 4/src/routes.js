import express from 'express';
import showDashboard, { helloWord } from './controllers/dashboard.js'
import login from './controllers/login.js';
import names from './controllers/names.js';
var routerServer = express.Router();

// ruta homepage 
routerServer.get('/', showDashboard);
routerServer.get('/hello', helloWord);
routerServer.post('/login', login);
routerServer.get('/names',names);
export default routerServer;