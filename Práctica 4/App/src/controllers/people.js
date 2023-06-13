import fs from 'fs';

function calcularIMC(peso, altura) {
    return peso / Math.pow(altura / 100, 2);
};

function calcularEdad(fechaNacimiento) {
    let hoy = new Date();
    fechaNacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    let mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }
    return edad;
};

const personas = JSON.parse(fs.readFileSync('src/data/people.json', 'utf8'));

const jsonPersonas = (req, res) => {
    res.json(personas);
};

const overweight = (req, res) => {
    res.json(personas.filter(x => calcularIMC(x.weight, x.height) > 25));
};

const byAge = (req, res) => {
    res.json(
        personas.map(element => {
            return { [element.name]: calcularEdad(element.dob) }
        })
    );
};

const imcOver40 = (req, res) => {
    res.json(
        personas.filter(element => calcularEdad(element.dob) > 40)
            .map(element => { return Number(calcularIMC(element.weight, element.height).toFixed(2)) })
    );
};

const averageIMC = (req, res) => {
    res.json({
        avg: Number(((personas.map(x => calcularIMC(x.weight, x.height)).reduce((a, b) => a + b, 0)) / personas.length).toFixed(2)) // suma todos los IMC y divide por la cantidad de personas
    });
}

const youngest = (req, res) => {
    res.json(
        personas.sort((a,b) => {
            return calcularEdad(a.dob) - calcularEdad(b.dob);
        })[0]
    );
}

const byHeight = (req, res) => {
    res.json(
        personas.sort((a, b) => {
            return a.height - b.height;
        })
    );
}

export { jsonPersonas, overweight, byAge, imcOver40, averageIMC, youngest, byHeight, calcularEdad };