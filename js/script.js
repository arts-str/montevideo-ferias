document.addEventListener('touchmove', function (e) {
    if (e.scale !== 1) {
      e.preventDefault(); // 👈 prevent pinch zoom
    }
}, { passive: false });
['gesturestart', 'gesturechange', 'gestureend'].forEach(event => {
    document.addEventListener(event, e => e.preventDefault());
  });
  
const searchInput = document.querySelector('nav input');

searchInput.addEventListener('focus', () => {
  // Lock the page width to prevent iOS from expanding layout
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
});

searchInput.addEventListener('blur', () => {
  // Restore after keyboard closes
  document.body.style.position = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
});

const listadoFerias = document.getElementById('listadoFerias');
const menu = document.getElementById('menu');

function addMunicipio() {
    for (const municipio of municipiosObj.municipios) {
        listadoFerias.insertAdjacentHTML('beforeend', `
            <div class="municipio-container">
                <div onclick="desplegar(this, true)" class="municipio inactive municipio-head color-mode-transition">
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
                <li onclick="selectOnMap(${barrio.id}, this)" class="barrio inactive color-mode-transition" id="${barrio.id}">${barrio.nombre}</li>
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
      navigator.serviceWorker.register('./js/service-worker.js')
        .then(reg => console.log('Service Worker registered:', reg))
        .catch(err => console.log('SW registration failed:', err));
    });
  }

let busqueda = document.getElementById('busqueda'); 
busqueda.addEventListener('input', () =>{
    console.log(buscar(allFerias(), busqueda.value));
});

let allFerias = () =>{
    let ferias = [];
    for (const municipio of municipiosObj.municipios) {
        for (const ccz of municipio.ccz) {
            ccz.barrios.forEach((barrio) => {
                for (const feria of barrio.ferias) {
                    ferias.push([feria, barrio]);
                }
            })
        }
    }
    return ferias;
}

function buscar(allFerias, query) {
    let result = [];
    allFerias.forEach(feria => {
        if (feria[0].calles.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || feria[0].dia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || feria[1].nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) {
            result.push(feria);
        }
    });
    return result;
}


function updateColors() {
    let r = document.querySelector(':root');
    let rs = getComputedStyle(r);
    let currentColor = rs.getPropertyValue('--bg');
    
    let currentColorL = rs.getPropertyValue('--light-bg');
    let currentColorHoverL = rs.getPropertyValue('--light-bg-hover');
    let currentColorActiveL = rs.getPropertyValue('--light-bg-active');

    
    let currentColorD = rs.getPropertyValue('--dark-bg');
    let currentColorHoverD = rs.getPropertyValue('--dark-bg-hover');
    let currentColorActiveD = rs.getPropertyValue('--dark-bg-active');
    
    let elements = document.querySelectorAll('.color-mode-transition');
    elements.forEach(element => {
        element.style.transition = 'background-color 200ms ease-in-out, outline 200ms ease-in-out';
        setTimeout(() => {
            
            element.style.transition = 'none';
        }, 200);
    });
    if (currentColor === currentColorL) {
        r.style.setProperty('--bg', currentColorD);
        r.style.setProperty('--bg-hover', currentColorHoverD);
        r.style.setProperty('--bg-active', currentColorActiveD);
    }else{
        r.style.setProperty('--bg', currentColorL);
        r.style.setProperty('--bg-hover', currentColorHoverL);
        r.style.setProperty('--bg-active', currentColorActiveL);
    }
}
updateColors()