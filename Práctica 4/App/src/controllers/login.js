/* EJERCICIO 2

const login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log('Username: ' + username + ' Password: ' + password);
}

export default login;*/

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
    const data = JSON.parse(fs.readFileSync('src/data/usuarios.json', 'utf8'));

    if (data[0].username === req.body.username && data[0].password === req.body.password) {
        res.send('Los datos coinciden. Username: ' + username + ' Password: ' + password);
    } else {
        res.redirect('/p/practica4/ejercicio2.html'); // Redireccionar al formulario en caso de datos no válidos
    }
}

export default login;