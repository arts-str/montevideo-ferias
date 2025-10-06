var map = L.map('map', { zoomControl: false }).setView([-34.894208201285736, -56.165005617911504], 13);
let markers = [];
let userMarker, userPosition;
let newTabSvg = '<svg width=".7rem" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#0078A8"><g id="Output-svg" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="out" transform="translate(-838.000000, -29.000000)" fill="#0078A8"> <path d="M855,46 L841,46 L841,32 L848,32 L848,30 L841,30 C839.89,30 839,30.9 839,32 L839,46 C839,47.1 839.89,48 841,48 L855,48 C856.1,48 857,47.1 857,46 L857,39 L855,39 L855,46 L855,46 Z M850,30 L850,32 L853.59,32 L843.76,41.83 L845.17,43.24 L855,33.41 L855,37 L857,37 L857,30 L850,30 L850,30 Z" id="path"> </path> </g> </g> </g></svg>'
var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});



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
                    marker.bindPopup(`${feria.calles}<br><b>${feria.dia}</b> <br> <a class="popup-anchor" target="_blank" href="https://www.google.com/maps/dir//${feria.long},${feria.lat}/@${feria.long},${feria.lat},17z">Cómo ir ${newTabSvg}</a>`)
                    marker.addEventListener('click', () => {
                        for (const item of document.querySelectorAll('.active')) {
                            item.classList.replace('active', 'inactive');
                        }
                        var listItem = document.getElementById(barrio.id);
                        desplegar(listItem.parentNode.parentNode.children[0]);
                        listItem.classList.replace('inactive', 'active');
                    });
                }
            })
        }
    }
    
    getLocation();
}

function selectOnMap(id, element) {
    for (const item of document.querySelectorAll('.active')) {
        item.classList.replace('active', 'inactive');
    }
    element.classList.replace('inactive', 'active');

    //for (const marker of markers) {
    //    if(marker[1] !== id){
    //        marker[0].setOpacity(0);
    //    }else{
    //        marker[0].setOpacity(1);
    //    }
    //}

    for (const municipio of municipiosObj.municipios) {
        for (const ccz of municipio.ccz) {
            ccz.barrios.forEach((barrio) => {
                if (id === barrio.id) {
                    const group = L.featureGroup(returnMarkers(barrio.id));
                    map.fitBounds(group.getBounds(), {maxZoom: 15.49, animate: true, animate:true, noMoveStart: true});
                }
            })
        }
    }

    
    menu.classList.remove('show');
}

function returnMarkers(barrioID) {
    let output = [];
    for (const marker of markers) {
        if(marker[1] === barrioID){
            output.push(marker[0]);
        }
    }
    return output;
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
    map.flyTo([-34.894208201285736, -56.165005617911504], 11, {animate: true, animate: true, duration: 1, noMoveStart: true});
    menu.classList.remove('show');
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

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, error, options);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
} 

function updateLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(updateUserPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
} 


  
function showPosition(position) {
    userPosition = L.latLng(position.coords.latitude, position.coords.longitude);
    //let userPosition = L.latLng(-34.907174333039514, -56.17920902148484);
    console.log(userPosition, markers);
    returnClosestMarker(getDistanceArray(userPosition, markers)).setIcon(redIcon);
    userMarker = L.marker(userPosition, {icon: greenIcon}).addTo(map).bindPopup(`Estas aquí`);
    setInterval(() => {
        updateLocation();
    }, );
}

function findDistance(point1, point2) {
    return map.distance(point1, point2);
}

function getDistanceArray(position, markers) {
    let output = [];
    for (const marker of markers) {
        output.push([findDistance(position, marker[0].getLatLng()), marker[0]]);
    }
    return output
}

function returnClosestMarker(distanceArray) {
    let smallest = distanceArray[0][0];
    let smallestMarker;
    for (let i = 0; i < distanceArray.length; i++) {
        if(distanceArray[i][0] < smallest){
            smallest = distanceArray[i][0];
            smallestMarker = distanceArray[i][1];
        }
    }
    return smallestMarker;
}

function updateUserPosition(position) {
    userPosition = L.latLng(position.coords.latitude, position.coords.longitude);
    returnRedMarker(markers).setIcon(blueIcon);
    userMarker.setLatLng(userPosition);
    returnClosestMarker(getDistanceArray(userPosition, markers)).setIcon(redIcon);
}

function returnRedMarker(markers) {
    for (const marker of markers) {
        if (marker[0].getIcon() === redIcon) {
            return marker[0];
        }
    }
}

function showUser() {
    if (userPosition !== undefined) {
        map.flyTo([userPosition.lat, userPosition.lng], 16, {animate: true, animate: true, duration: 1, noMoveStart: true});
    }
}