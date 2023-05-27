import directoryTree from 'directory-tree';
import fs from 'fs';

const showDashboard =  (req, res) => {
    // cargo informacion para los links
    let links = JSON.parse(fs.readFileSync('src/data/links.json', 'utf8'));

    // genero tree con los archivos de dentro de PRACTICAS
    let tree = directoryTree("./practicas", {
                extensions: /\.(md|js|html|css|jpg|png)$/
            }, 
            (element) => {
                element.path=element.path.replace('practicas', '/p');
                return element;
            }
    );
    
    res.render('index', {
        year: (new Date()).getFullYear(),
        data: tree.children,
        links: links
    });
};

const helloWord = (req, res) => {
    res.send('hello word!');
}


export {showDashboard as default, helloWord};