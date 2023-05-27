/* EJERCICIO 2

const login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    res.send('Username: ' + username + ' Password: ' + password);
}

export default login;*/

//const { response } = require("express");

/* EJERCICIO 4

const username = 'admin@mail.com';
const password = '1234';

const login = (req, res) => {
    const usernameInfo = req.body.username;
    const passwordInfo = req.body.password;

    if (username === usernameInfo && password === passwordInfo) {
        res.send('Username: ' + username + ' Password: ' + password);
    } else {
        res.redirect('/p/practica4/ejercicio2.html'); // Redireccionar al formulario en caso de datos no válidos
    }
};

export default login;
*/

// EJERCICIO 5

const login = (req, res) => {
    fetch('http://localhost:3000/j/usuarios.json')
        .then(r => r.json())
        .then(data => {
            if (data.username === req.body.username && data.password === req.body.password) {
                res.send('Los datos coinciden. Username: ' + username + ' Password: ' + password);
            } else {
                res.redirect('/p/practica4/ejercicio2.html'); // Redireccionar al formulario en caso de datos no válidos
            }
        });
}

export default login;