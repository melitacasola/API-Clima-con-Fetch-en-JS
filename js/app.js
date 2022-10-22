const container = document.querySelector('.container'),
    resultado = document.querySelector('#resultado'),
    formulario = document.querySelector('#formulario');

window.addEventListener('load', () =>{
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e){
    e.preventDefault();

    //validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad ==='' || pais === '') {
        //Hubo un error
        mostrarError('Ambos campos son obligatorios');
        return;
    }

    //consultar API
    consultarApi(ciudad, pais);
};

function mostrarError(mensaje){
    const alerta = document.querySelector('.bg-red-100');

    if(!alerta){
            // Crear Alerta
        const alerta = document.createElement('div');

        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block"> ${mensaje}</span>
        `
        container.appendChild(alerta);

        //se elimine alerta después de 3seg
        setTimeout(() =>{
            alerta.remove();
        }, 3000)
    }


};

function consultarApi(ciudad, pais){

    const appId = '99b9ed88b2b4a41e37807fcf73c80df0';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`
    
    spinner(); //muestra un spinner de carga - ACA comienza a consultar el servidor
    
    fetch(url)
        .then( respuesta => respuesta.json())
        .then(datos => {
            //antes de tener la respuesta, limpiamos HTML
            limpiarHTML();

            console.log(datos);
            if(datos.cod ==="404"){
                mostrarError('Ciudad no encontrada')
                return;
            }

            // Imprime respuesta en el HTML
            mostrarClima(datos);
        })
}

function mostrarClima(datos) {
    const {name, main: {temp, temp_max, temp_min}} = datos;

    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl')


    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMax = document.createElement('p');
    tempMax.innerHTML = `Max: ${max} &#8451;`;
    tempMax.classList.add('text-xl');

    const tempMin = document.createElement('p');
    tempMin.innerHTML = `Min: ${min} &#8451;`;
    tempMin.classList.add('text-xl')

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(tempMin);
    resultado.appendChild(resultadoDiv);

}
//funcion global para reutilizar
const kelvinACentigrados = grados => parseInt(grados - 273.15);

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
};

function spinner(){
    limpiarHTML();
    
    const divSpinner = document.createElement('div');

    divSpinner.classList.add('.sk-chase');
    divSpinner.innerHTML = `
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    `;

    resultado.appendChild(divSpinner);
}