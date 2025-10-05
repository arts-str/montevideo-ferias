document.addEventListener("touchmove", function(e) {
    if (e.touches.length > 1 || e.touches[0].clientY > 0) {
      e.preventDefault();
    }
  }, { passive: false });

const listadoFerias = document.getElementById('listadoFerias');
const menu = document.getElementById('menu');

function addMunicipio() {
    for (const municipio of municipiosObj.municipios) {
        listadoFerias.insertAdjacentHTML('beforeend', `
            <div class="municipio-container">
                <div onclick="desplegar(this, true)" class="municipio inactive municipio-head">
                    <h3>Municipio ${municipio.nombre}</h3>
                    <svg width="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z" fill="#0F0F0F"></path> </g></svg>    
                </div>
                <div class="contents" id="contenido">
                    ${addBarrios(municipio)}

                </div>
            </div>
    `);
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
    menu.classList.toggle('show');
}


function desplegar(element, keepOpen = false) {
    if (keepOpen) {
        element.parentNode.children[1].classList.toggle('desplegado');
        element.children[1].classList.toggle('rotated');
    }else{
        element.parentNode.children[1].classList.add('desplegado');
        element.children[1].classList.add('rotated');
    }
}

let userLocate = document.getElementById('userLocate');
userLocate.addEventListener('mousedown', ()=>{
    userLocate.style.backgroundColor = 'var(--light-bg-active)';
});
userLocate.addEventListener('mouseup', () => {
    userLocate.style.backgroundColor = '';
});
userLocate.addEventListener('click', () => {
    showUser();
});
let hambMenu = document.getElementById('hambMenu');
hambMenu.addEventListener('touchstart', ()=>{
    hambMenu.style.backgroundColor = 'var(--light-bg-active)';
});
hambMenu.addEventListener('touchend', () => {
    hambMenu.style.backgroundColor = '';
});
hambMenu.addEventListener('click', () => {
    showMenu();
});
let showAllMarkersBttn = document.getElementById('showAllMarkersBttn');
showAllMarkersBttn.addEventListener('click', () => {
    showAllMarkers(showAllMarkersBttn);
});


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker registered:', reg))
        .catch(err => console.log('SW registration failed:', err));
    });
  }