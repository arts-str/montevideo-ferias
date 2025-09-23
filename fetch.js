let FERIAS_ONLINE_URL = 'https://arts-str.github.io/montevideo-ferias/ferias.json';
let FERIAS_LOCAL_URL = 'ferias.json';

let municipiosObj;

fetch(FERIAS_LOCAL_URL).then(promise => promise.json()).then(response => {
    municipiosObj = response;
    addMarkers();
    addMunicipio();
});