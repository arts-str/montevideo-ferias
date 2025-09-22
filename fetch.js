let FERIAS_URL = 'https://arts-str.github.io/montevideo-ferias/ferias.json';
let municipiosObj;

fetch(FERIAS_URL).then(promise => promise.json()).then(response => {
    municipiosObj = response;
    addMarkers();
    loadList();
});