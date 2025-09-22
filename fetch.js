let FERIAS_URL = '../ferias.json';
let municipiosObj;

fetch(FERIAS_URL).then(promise => promise.json()).then(response => {
    municipiosObj = response;
    addMarkers();
    loadList();
});