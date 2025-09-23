document.addEventListener("touchmove", function(e) {
    if (e.touches.length > 1 || e.touches[0].clientY > 0) {
      e.preventDefault();
    }
  }, { passive: false });

const listadoFerias = document.getElementById('listadoFerias');
const menu = document.getElementById('menu');

function addMunicipio() {
    for (const municipio of municipiosObj.municipios) {
        listadoFerias.innerHTML += `
        <div class="inactive" id="">
            <h3 class="municipio inactive" onclick="showMunicipioMarkers(${municipio.id}, this)">Municipio ${municipio.nombre}</h3>
            ${addBarrios(municipio)}
        </div>
    `
    }
}

function addBarrios(municipio) {
    let listado = '';
    for (const ccz of municipio.ccz) {
        ccz.barrios.forEach((barrio) => {
            listado += `
                <li onclick="selectOnMap(${barrio.id}, this)" class="barrio inactive" id="${barrio.id}">${barrio.nombre}</li>
            `
        }); 
    }
    return listado;
}

function showMenu() {
    console.log('touch');
    menu.classList.toggle('show');
}