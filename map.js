var map = L.map('map').setView([-34.894208201285736, -56.165005617911504], 13);
let markers = [];

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function addMarkers() {
    for (const municipio of municipiosObj.municipios) {
        
        for (const ccz of municipio.ccz) {
            ccz.barrios.forEach((barrio) => {
                for (const feria of barrio.ferias) {
                    const marker = L.marker([feria.long, feria.lat]).addTo(map);
                    markers.push([marker, barrio.id, municipio.id]);
                    marker.bindPopup(`${feria.calles}<br><b>${feria.dia}</b> <br> <a target="_blank" href="https://www.google.com/maps/dir//${feria.long},${feria.lat}/@${feria.long},${feria.lat},17z">Cómo ir</a>`)
                    marker.addEventListener('click', () => {
                        for (const item of document.querySelectorAll('.active')) {
                            item.classList.replace('active', 'inactive');
                        }
                        var listItem = document.getElementById(barrio.id);
                        listItem.classList.replace('inactive', 'active');
                    });
                }
            })
        }
    }
    
}

function selectOnMap(id, element) {
    for (const item of document.querySelectorAll('.active')) {
        item.classList.replace('active', 'inactive');
    }
    element.classList.replace('inactive', 'active');
    for (const marker of markers) {
        if(marker[1] !== id){
            marker[0].setOpacity(0);
        }else{
            marker[0].setOpacity(1);
        }
    }
}

function showAllMarkers(element) {
    if (element) {
        for (const item of document.querySelectorAll('.active')) {
            item.classList.replace('active', 'inactive');
        }
        element.classList.replace('inactive', 'active');
    }
    for (const marker of markers) {
        marker[0].setOpacity(1);
    }
}

function showMunicipioMarkers(id, element) {
    for (const item of document.querySelectorAll('.active')) {
        item.classList.replace('active', 'inactive');
    }
    element.classList.replace('inactive', 'active');
    for (const marker of markers) {
        if(marker[2] !== id){
            marker[0].setOpacity(0);
        }else{
            marker[0].setOpacity(1);
        }
    }
    
}