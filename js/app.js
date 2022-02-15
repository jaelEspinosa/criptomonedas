const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const divResultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''

}

// crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolver => {
    resolver(criptomonedas);
})

document.addEventListener('DOMContentLoaded', ()=>{
    consultarCriptomonedas();
    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

function consultarCriptomonedas(){
    
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

    fetch(url)
       .then (respuesta => respuesta.json())
       .then (resultado => obtenerCriptomonedas(resultado.Data) )
       .then (criptomonedas => selectCriptomonedas(criptomonedas))

}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const{CoinInfo:{FullName, Name}}=cripto;
        const option = document.createElement('option')
        option.textContent = FullName;
        option.value=Name;
        criptomonedasSelect.appendChild(option)
    });
}
function leerValor(e){
    objBusqueda[e.target.name]= e.target.value;
    console.log(objBusqueda)

}

function submitFormulario(e){
    e.preventDefault();

    // validar formulario

    const {moneda, criptomoneda}= objBusqueda;
    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta ('Debes seleccionar ambos campos');
        return;
    }
// consultar API
    consultarAPI();

}

function mostrarAlerta(mensaje){
    const alerta = document.querySelector('.error');
    if(!alerta){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
    
        //mensaje error
        divMensaje.textContent = mensaje;
        formulario.appendChild(divMensaje);
        setTimeout(() => {
            divMensaje.remove();
        }, 2000);
    }  
}
function consultarAPI(){
    const{ moneda, criptomoneda}= objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    mostrarSpinner()
    fetch(url)

            .then (respuesta => respuesta.json())
            .then (cotizacion => mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]))
}

function mostrarCotizacionHTML(cotizacion){
    limpiarHtml()
    divResultado.classList.remove('ver');
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE}=cotizacion;
    const precio = document.createElement('p');
    
    precio.classList.add('precio');
    precio.innerHTML=`El Precio es: <span>${PRICE}</span>`;
    
    const precioAlto = document.createElement('p');
    precioAlto.innerHTML=`El Precio mas alto del dia: <span>${HIGHDAY}</span>`;

    const update = document.createElement('p');
    update.innerHTML=`Actualizado : ${LASTUPDATE}` 

    const preciobajo = document.createElement('p');
    preciobajo.innerHTML=`Precio más bajo de hoy : ${LOWDAY}` 

    const cambio24H = document.createElement('p');
    cambio24H.innerHTML=`Variaciones en las ultimas 24H : ${CHANGEPCT24HOUR} %` 
    

    divResultado.appendChild(precio);
    divResultado.appendChild(precioAlto);
    divResultado.appendChild(preciobajo);
    divResultado.appendChild(cambio24H);
    divResultado.appendChild(update);
    

}

function limpiarHtml(){
    while(divResultado.firstChild){
        divResultado.removeChild(divResultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHtml();
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    
    spinner.innerHTML = `
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
`;
   divResultado.classList.remove('ver')
   divResultado.appendChild(spinner);
}