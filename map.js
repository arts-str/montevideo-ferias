var map = L.map('map', { zoomControl: false }).setView([-34.894208201285736, -56.165005617911504], 13);
let markers = [];
let userMarker, userPosition;
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
                    marker.bindPopup(`${feria.calles}<br><b>${feria.dia}</b> <br> <a target="_blank" href="https://www.google.com/maps/dir//${feria.long},${feria.lat}/@${feria.long},${feria.lat},17z">Cómo ir</a>`)
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
    map.setView([-34.894208201285736, -56.165005617911504], 11);
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

getLocation();
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
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
    returnClosestMarker(getDistanceArray(userPosition, markers)).setIcon(redIcon);
    userMarker = L.marker(userPosition, {icon: greenIcon}).addTo(map).bindPopup(`Estas aquí`);
    setInterval(() => {
        updateLocation();
    }, 5000);
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