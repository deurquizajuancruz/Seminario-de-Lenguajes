import { calcularEdad } from '../controllers/people.js';

const vista_height = (req, res ) => {
    fetch('http://localhost:3000/peoples/by_height')
    .then(response => response.json())
    .then(data => { 
        res.render('vistaH', {data:data});
    })
}

const vista_youngest = (req,res) => {
    fetch('http://localhost:3000/peoples/youngest')
    .then(response => response.json())
    .then(data => {
        res.render('vistaY',{
            data:data,
            edad:calcularEdad(data.dob)
        })
    })
}

const vista_menu = (req,res) => {
    res.render('vistaM');
}

export {vista_height,vista_youngest, vista_menu };