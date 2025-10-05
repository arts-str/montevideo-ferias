let FERIAS_ONLINE_URL = 'https://arts-str.github.io/montevideo-ferias/ferias.json';
let FERIAS_LOCAL_URL = 'ferias.json';

let municipiosObj;

let promise = fetch(FERIAS_LOCAL_URL).then(promise => promise.json()).then(response => {
    return response;
});

window.onload = async () => {
    municipiosObj = await promise
    addMarkers();
    addMunicipio();
};