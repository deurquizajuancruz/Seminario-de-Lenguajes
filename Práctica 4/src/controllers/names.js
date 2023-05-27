const names = (req, res) => {
    fetch('http://localhost:3000/j/usuarios.json')
        .then(r => r.json())
        .then(data => {
            const usernameInfo = req.query.username;
            let existe = false;
            let pos;
            for (let i = 0; i < data.length && !existe; i++) {
                if (usernameInfo == data[i].username) {
                    existe = true;
                    pos=i;
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
        });
};

export default names;