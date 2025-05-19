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

    if (isNaN(totalBuses) || isNaN(totalDestinos) || totalBuses <= 0 || totalDestinos <= 0) {
        alert("Por favor, ingrese un número válido de buses y destinos.");
        return;
    }

    for (let i = 1; i <= totalBuses; i++) {
        let nombre = document.getElementById(`nombreBus${i}`).value.trim();
        let capacidad = parseInt(document.getElementById(`capacidadBus${i}`).value) || 0;

        if (!nombre || capacidad <= 0) {
            datosIncompletos = true;
            break;
        }

        buses.push({ nombre, capacidad });
    }

    
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
    document.getElementById("buses").disabled = true;
    document.getElementById("destinos").disabled = true;
    document.getElementById("generateTable").disabled = true;

    let totalBuses = buses.length;
    let totalDestinos = destinos.length;

    let tablaHTML = `<table class="table table-bordered align-middle text-center">`;

    
    tablaHTML += `<thead><tr><th></th>`;
    for (let j = 0; j < totalDestinos; j++) {
        tablaHTML += `<th>${destinos[j].nombre}</th>`;
    }
    tablaHTML += `<th>Oferta</th></tr></thead><tbody>`;

    for (let i = 0; i < totalBuses; i++) {
        tablaHTML += `<tr><th>${buses[i].nombre}</th>`;
        for (let j = 0; j < totalDestinos; j++) {
            tablaHTML += `<td><input type="number" class="form-control form-control-sm" value=""/></td>`;
        }
        tablaHTML += `<td><input type="number" class="form-control form-control-sm" value=""/></td></tr>`;
    }

    tablaHTML += `<tr><th>Demanda</th>`;
    for (let j = 0; j < totalDestinos; j++) {
        tablaHTML += `<td><input type="number" class="form-control form-control-sm" value=""/></td>`;
    }
    tablaHTML += `<td></td></tr>`;

    tablaHTML += `</tbody></table>`;

    document.getElementById("tablaGenerada").innerHTML = tablaHTML;
    
}

function obtenerDatosTabla() {
    let tabla = document.querySelector("#tablaGenerada table");
    let filas = tabla.querySelectorAll("tbody tr");
    let datos = {
        origenes: [],
        destinos: [],
        costos: [],
        oferta: [],
        demanda: []
    };

    let headers = tabla.querySelectorAll("thead th");
    for (let j = 1; j < headers.length - 1; j++) {
        datos.destinos.push(headers[j].innerText);
    }

    for (let i = 0; i < filas.length - 1; i++) {
        let celdas = filas[i].querySelectorAll("td");
        let nombreOrigen = filas[i].querySelector("th").innerText;
        datos.origenes.push(nombreOrigen);
        let filaCostos = [];

        // Costos a cada destino
        for (let j = 0; j < datos.destinos.length; j++) {
            let valor = celdas[j].querySelector("input").value;
            filaCostos.push(Number(valor));
        }

        datos.costos.push(filaCostos);

        // Oferta de origen
        let oferta = celdas[celdas.length - 1].querySelector("input").value;
        datos.oferta.push(Number(oferta));
    }

    // Demanda de cada destino
    let ultimaFila = filas[filas.length - 1].querySelectorAll("td");
    for (let j = 0; j < datos.destinos.length; j++) {
        let demanda = ultimaFila[j].querySelector("input").value;
        datos.demanda.push(Number(demanda));
    }

    console.log(datos);
    return datos;
}

function generarDiagrama(datos) {
    let contenedor = document.getElementById("diagrama");
    contenedor.innerHTML = "";

    let ancho = 100;
    let alto = 100;

    // buses
    datos.origenes.forEach((origen, i) => {
        let div = document.createElement("div");
        div.style.position = "absolute";
        div.style.left = "20px";
        div.style.top = (50 + i * 150) + "px";
        div.style.textAlign = "center";

        let img = document.createElement("img");
        img.src = "img/bus.png";
        img.id = "origen" + i;
        img.style.width = ancho + "px";
        img.style.height = alto + "px";

        let label = document.createElement("div");
        label.innerText = origen;
        label.style.fontWeight = "bold";
        label.style.marginTop = "5px";

        div.appendChild(img);
        div.appendChild(label);
        contenedor.appendChild(div);
    });

    // ciudades
    datos.destinos.forEach((destino, j) => {
        let div = document.createElement("div");
        div.style.position = "absolute";
        div.style.right = "20px";
        div.style.top = (50 + j * 150) + "px";
        div.style.textAlign = "center";

        let img = document.createElement("img");
        img.src = "img/ciudad.png";
        img.id = "destino" + j;
        img.style.width = ancho + "px";
        img.style.height = alto + "px";

        let label = document.createElement("div");
        label.innerText = destino;
        label.style.fontWeight = "bold";
        label.style.marginTop = "5px";

        div.appendChild(img);
        div.appendChild(label);
        contenedor.appendChild(div);
    });

    setTimeout(() => {
        datos.origenes.forEach((origen, i) => {
            datos.destinos.forEach((destino, j) => {
                const origenEl = document.getElementById("origen" + i);
                const destinoEl = document.getElementById("destino" + j);

                if (!origenEl || !destinoEl) return;

                let line = new LeaderLine(origenEl, destinoEl, {
                    color: 'blue',
                    size: 4,
                    startPlug: 'behind',
                    endPlug: 'arrow'
                });

                let xij = `X${i + 1}${j + 1}`;
                let labelX = LeaderLine.captionLabel(xij, { color: 'black' });
                line.setOptions({ middleLabel: labelX });

                let cij = datos.costos[i][j];
                let labelC = LeaderLine.captionLabel(`C${i + 1}${j + 1}=${cij}`, {
                    color: 'red',
                    outlineColor: 'white',
                    fontSize: '12px'
                });

                line.addLabel(labelC, { position: 'middle', offset: [0, 20] });
            });
        });
    }, 500);
}


function realizarDiagrama() {
    let datos = obtenerDatosTabla();
    generarDiagrama(datos);
}

function FOyRestricciones() {
    const datos = obtenerDatosTabla();

    if (!datos) return;

    let FO = "Min Z = ";
    let restricciones = "";
    let restricciones2 = "";

    let terminosFO = [];
    for (let i = 0; i < datos.origenes.length; i++) {
        for (let j = 0; j < datos.destinos.length; j++) {
            const xij = `X${i + 1}${j + 1}`;
            const cij = datos.costos[i][j];
            terminosFO.push(`${cij}(${xij})`);
        }
    }
    FO += terminosFO.join(" + ");

    // Restricciones de oferta
    for (let i = 0; i < datos.origenes.length; i++) {
        let restr = "";
        for (let j = 0; j < datos.destinos.length; j++) {
            restr += `X${i + 1}${j + 1}`;
            if (j < datos.destinos.length - 1) restr += " + ";
        }
        restr += ` ≤ ${datos.oferta[i]}`;
        restricciones += restr + "<br>";
    }

    // Restricciones de demanda
    for (let j = 0; j < datos.destinos.length; j++) {
        let restr = "";
        for (let i = 0; i < datos.origenes.length; i++) {
            restr += `X${i + 1}${j + 1}`;
            if (i < datos.origenes.length - 1) restr += " + ";
        }
        restr += ` = ${datos.demanda[j]}`;
        restricciones2 += restr + "<br>";
    }

    document.getElementById("datosGuardados2").innerHTML = `
        <h5>Función Objetivo</h5>
        <p>${FO}</p>
        <h5>Restricciones de Oferta</h5>
        <p>${restricciones}</p>
        <h5>Restricciones de Demanda</h5>
        <p>${restricciones2}</p>
    `;
}






