function borrar(id) {
    let listado = document.getElementById(id);
    while (listado.firstChild) {
        listado.removeChild(listado.firstChild);
    }
}

function incrementar() {
    let numero = localStorage.getItem("pagina");
    if (numero < 9) {
        numero++;
        localStorage.setItem("pagina", numero);
        borrar('personajes');
        personajes(numero);
    }
}

function decrementar() {
    let numero = localStorage.getItem('pagina');
    if (numero > 1) {
        numero--;
        localStorage.setItem("pagina", numero);
        borrar('personajes');
        personajes(numero);
    }
}

function personajes(numeroPagina) {
    fetch("https://swapi.dev/api/people/?page=" + numeroPagina)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.results.length; i++) {
                let pj = document.createElement('li');
                let texto = document.createElement('span');
                pj.id = 'personaje' + i;
                pj.value = i + 1;
                texto.addEventListener('click', function () { mostrarInfo(i); });
                texto.innerHTML = data.results[i].name.toLowerCase();
                pj.appendChild(texto);
                document.getElementById('personajes').appendChild(pj);
            }
        });
}
let existe = false;
function crearBorde() {
    document.getElementById('infoPersonaje').style.borderWidth = 'medium';
    document.getElementById('infoPersonaje').style.borderStyle = 'dotted';
    document.getElementById('infoPersonaje').style.borderColor = 'rgb(97, 205, 255)';
    existe = true;
}

function solicitarPeli(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let peli = document.createElement('li');
            peli.innerHTML = data.title;
            document.getElementById('listaPelis').appendChild(peli);

        });
}

function solicitarPlaneta(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let planeta = document.createElement('p');
            if (data.name.toLowerCase() == 'unknown') {
                planeta.innerHTML = 'Desconocido';
            }
            else planeta.innerHTML = data.name;;

            document.getElementById('infoPersonaje').appendChild(planeta);
        });
}

function mostrarInfo(numero) {
    borrar('infoPersonaje');
    const valuePersonaje = document.getElementById('personaje' + numero).value - 1;
    let numeroPagina = localStorage.getItem('pagina');
    if (!existe) {
        crearBorde();
    }
    fetch("https://swapi.dev/api/people/?page=" + numeroPagina)
        .then(response => response.json())
        .then(data => {
            let txtTitulo = document.createElement('span');
            txtTitulo.className='titulos';
            txtTitulo.innerHTML = 'información del personaje: ' + data.results[valuePersonaje].name.toLowerCase();
            let titulo = document.createElement('h2');
            titulo.id="tituloPersonaje";
            document.getElementById('infoPersonaje').appendChild(titulo);
            document.getElementById("tituloPersonaje").appendChild(txtTitulo);
            document.getElementById('infoPersonaje').style.paddingLeft = '2%';

            let nacimiento = document.createElement('h3');
            nacimiento.innerHTML = 'Año de nacimiento:';
            document.getElementById('infoPersonaje').appendChild(nacimiento);


            let anio = document.createElement('p');
            if (data.results[valuePersonaje].birth_year.toLowerCase() == 'unknown') {
                anio.innerHTML = 'Desconocido';
            } else anio.innerHTML = data.results[valuePersonaje].birth_year;
            document.getElementById('infoPersonaje').appendChild(anio);

            let genero = document.createElement('h3');
            genero.innerHTML = 'Género:';
            document.getElementById('infoPersonaje').appendChild(genero);

            let gender = document.createElement('p');
            if (data.results[valuePersonaje].gender.toLowerCase() === 'male') {
                gender.innerHTML = 'Masculino';
            } else if (data.results[valuePersonaje].gender.toLowerCase() === 'female') {
                gender.innerHTML = 'Femenino';
            } else gender.innerHTML = 'N/A';

            document.getElementById('infoPersonaje').appendChild(gender);

            let peliculas = document.createElement('h3');
            peliculas.innerHTML = 'Películas:';
            let listado = document.createElement('ul');
            listado.id = 'listaPelis';
            listado.style.listStyle = 'none';
            listado.style.padding = '0%';
            document.getElementById('infoPersonaje').appendChild(peliculas);
            document.getElementById('infoPersonaje').appendChild(listado);

            for (let i = 0; i < data.results[valuePersonaje].films.length; i++) {
                solicitarPeli(data.results[valuePersonaje].films[i]);
            }

            let planeta = document.createElement('h3');
            planeta.innerHTML = 'Planeta de nacimiento:';
            document.getElementById('infoPersonaje').appendChild(planeta);
            solicitarPlaneta(data.results[valuePersonaje].homeworld);
        });
}

localStorage.setItem('pagina', '1');
personajes(1);