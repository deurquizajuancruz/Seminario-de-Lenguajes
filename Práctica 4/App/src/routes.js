import express from 'express';
import showDashboard, { helloWord } from './controllers/dashboard.js'
import login from './controllers/login.js';
import names from './controllers/names.js';
import { jsonPersonas, overweight, byAge, imcOver40, averageIMC, youngest, byHeight } from './controllers/people.js';
import { vista_height, vista_menu, vista_youngest } from './controllers/vista.js';
var routerServer = express.Router();

// ruta homepage 
routerServer.get('/', showDashboard);
routerServer.get('/hello', helloWord);
routerServer.post('/login', login);
routerServer.get('/names', names);

routerServer.get('/peoples', jsonPersonas);
routerServer.get('/peoples/overweight', overweight);
routerServer.get('/peoples/by_age', byAge);
routerServer.get('/peoples/imc_over_40', imcOver40);
routerServer.get('/peoples/average_imc', averageIMC);
routerServer.get('/peoples/youngest', youngest);
routerServer.get('/peoples/by_height', byHeight);

routerServer.get('/vistas',vista_menu);
routerServer.get('/vistas/by_height', vista_height);
routerServer.get('/vistas/youngest', vista_youngest);
export default routerServer;