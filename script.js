const busesValue = document.getElementById('busesValue');
const busesInputs = document.getElementById('busesInputs');

const destinosValue = document.getElementById('destinosValue');
const destinosInputs = document.getElementById('destinosInputs');

let buses = [];
let destinos = [];

function almacenarDatos() {
    let totalBuses = parseInt(document.getElementById("buses").value);
    let totalDestinos = parseInt(document.getElementById("destinos").value);

    buses = [];
    destinos = [];
    let datosIncompletos = false;

    // Validar que se hayan ingresado los datos
    if (isNaN(totalBuses) || isNaN(totalDestinos) || totalBuses <= 0 || totalDestinos <= 0) {
        alert("Por favor, ingrese un número válido de buses y destinos.");
        return;
    }

    // Capturar datos de buses
    for (let i = 1; i <= totalBuses; i++) {
        let nombre = document.getElementById(`nombreBus${i}`).value.trim();
        let capacidad = parseInt(document.getElementById(`capacidadBus${i}`).value) || 0;

        if (!nombre || capacidad <= 0) {
            datosIncompletos = true;
            break;
        }

        buses.push({ nombre, capacidad });
    }

    // Capturar datos de destinos
    if (!datosIncompletos) {
        for (let i = 1; i <= totalDestinos; i++) {
            let nombre = document.getElementById(`nombreDestino${i}`).value.trim();
            if (!nombre) {
                datosIncompletos = true;
                break;
            }
            destinos.push({ nombre });
        }
    }

    if (datosIncompletos) {
        alert("Por favor, complete todos los campos de buses y destinos antes de guardar.");
        return;
    }

    console.log("Buses:", buses);
    console.log("Destinos:", destinos);

    generarTablas()
}


function actualizarBuses(cantidad){
    busesValue.innerText = cantidad;
    busesInputs.innerHTML = '';

    for (let i=1; i<=cantidad; i++){
        const div = document.createElement('div');
        div.className = 'mb-2';

        div.innerHTML = `
            <input type="text" id="nombreBus${i}" placeholder="Nombre del Bus ${i}" class="form-control d-inline-block  mx-0" style="width: 58%;"/>
            <input type="number" id="capacidadBus${i}" placeholder="Capacidad" class="form-control d-inline-block  mx-0" max="40" style="width: 40%;"/>
        `;

        busesInputs.appendChild(div);
    }
}


function actualizarDestinos(cantidad){
    destinosValue.innerText = cantidad;
    destinosInputs.innerHTML = '';

    for (let i=1; i<=cantidad; i++){
        const div = document.createElement('div');
        div.className = 'mb-2';

        div.innerHTML = `
            <input type="text" id="nombreDestino${i}" placeholder="Nombre del Destino ${i}" class="form-control d-inline-block mx-0" />
        `;

        destinosInputs.appendChild(div);
    }
}


function generarTablas() {
    document.getElementById("generateTable").disabled = true;
    let totalBuses = buses.length;
    let totalDestinos = destinos.length;

    let tablaHTML = `<table class="table table-bordered align-middle text-center">`;

    // Cabecera
    tablaHTML += `<thead><tr><th></th>`;
    for (let j = 0; j < totalDestinos; j++) {
        tablaHTML += `<th>${destinos[j].nombre}</th>`;
    }
    tablaHTML += `<th>Oferta</th></tr></thead><tbody>`;

    // Filas de origen (buses)
    for (let i = 0; i < totalBuses; i++) {
        tablaHTML += `<tr><th>${buses[i].nombre}</th>`;
        for (let j = 0; j < totalDestinos; j++) {
            tablaHTML += `<td><input type="number" class="form-control form-control-sm" value="0"/></td>`;
        }
        tablaHTML += `<td>${buses[i].capacidad}</td></tr>`;
    }

    // Fila de demanda
    tablaHTML += `<tr><th>Demanda</th>`;
    for (let j = 0; j < totalDestinos; j++) {
        tablaHTML += `<td><input type="number" class="form-control form-control-sm" value="0"/></td>`;
    }
    tablaHTML += `<td></td></tr>`;

    tablaHTML += `</tbody></table>`;

    document.getElementById("tablaGenerada").innerHTML = tablaHTML;
}


