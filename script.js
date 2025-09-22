let listadoFerias = document.getElementById('listadoFerias');

function loadList() {
    for (const municipio of municipiosObj.municipios) {
        
        
        listadoFerias.innerHTML += `
        <div class="inactive" id="">
            <h3>Municipio ${municipio.nombre}</h3>
            ${returnBarrios(municipio)}
        </div>
    `
        
        
    }
}

function returnBarrios(municipio) {
    let listado = '';
    for (const ccz of municipio.ccz) {
        ccz.barrios.forEach((barrio, i) => {
            listado += `
                <li class="inactive" id="${barrio.id}">${barrio.nombre}</li>
            `
        }); 
    }
    return listado;
}