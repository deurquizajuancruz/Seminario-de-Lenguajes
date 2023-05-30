import fs from 'fs';

const names = (req, res) => {
    const data = JSON.parse(fs.readFileSync('src/data/usuarios.json', 'utf8'));
    const usernameInfo = req.query.username;
    let existe = false;
    let pos;
    for (let i = 0; i < data.length && !existe; i++) {
        if (usernameInfo == data[i].username) {
            existe = true;
            pos = i;
        }
    }
    if (existe) {
        const respuesta = {
            "name": data[pos].name
        }
        res.send(respuesta);
    }
    else
        res.send('No existe ese usuario.');

};

export default names;