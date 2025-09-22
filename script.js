let listadoFerias = document.getElementById('listadoFerias');

function loadList() {
    for (const municipio of municipiosObj.municipios) {
        
        
        listadoFerias.innerHTML += `
        <li class="inactive"><h3>Municipio ${municipio.nombre}</h3></li>
    `
        
        for (const ccz of municipio.ccz) {
            ccz.barrios.forEach((barrio, i) => {
                listadoFerias.innerHTML += `
                    <li class="inactive" id="${i}">${barrio.nombre}</li>
                `
            }); 
        }
    }
}

