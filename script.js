const capitals = [
    "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Cúcuta", "Bucaramanga", "Pereira",
    "Manizales", "Ibagué", "Santa Marta", "Villavicencio", "Pasto", "Montería", "Armenia", "Neiva",
    "Sincelejo", "Valledupar", "Quibdó", "Riohacha", "Florencia", "San Andrés", "Mocoa", "Yopal",
    "Popayán", "Tunja", "Leticia", "Arauca", "Inírida"
];

const busNames = [
    "Expreso Bolivariano", "Copetran", "Expreso Brasilia", "Rápido Ochoa", "Flota Magdalena", "Coomotor", "Cootranshuila", "Berlinas del Fonce",
    "Omega", "Expreso Palmira", "Flota La Macarena", "Flota Occidental", "Expreso Palmira", "Expreso San Gil", "Cootransbol", "Expreso Paz del Río",
    "Expreso Sideral", "Expreso Gaviota", "Expreso Palmira", "Expreso Palmira"
];


function bus() {
    // Genera un bus aleatorio que no se repita en llamadas sucesivas
    const usedBuses = bus.usedBuses || new Set();

    let availableBuses = busNames.filter(name => !usedBuses.has(name));
    if (availableBuses.length === 0) {
        usedBuses.clear();
        availableBuses = [...busNames];
    }
    const randomBus = availableBuses.sort(() => 0.5 - Math.random())[0];
    usedBuses.add(randomBus);
    bus.usedBuses = usedBuses;
    return randomBus;
}

function ciudad() {
    // Mantener un conjunto de ciudades ya usadas
    const usedCities = ciudad.usedCities || new Set();

    // Filtrar las ciudades que no han sido usadas
    let availableCities = capitals.filter(name => !usedCities.has(name));
    if (availableCities.length === 0) {
        usedCities.clear();
        availableCities = [...capitals];
    }
    // Seleccionar una ciudad aleatoria disponible
    const randomCity = availableCities[Math.floor(Math.random() * availableCities.length)];
    usedCities.add(randomCity);
    ciudad.usedCities = usedCities;
    return randomCity;
}

function actualizarBuses(cantidad){
    busesValue.innerText = cantidad;
    busesInputs.innerHTML = '';

    for (let i=1; i<=cantidad; i++){
        const div = document.createElement('div');
        div.className = 'mb-2';

        div.innerHTML = `
            <input type="text" id="nombreBus${i}" placeholder="Nombre del Bus ${i}" class="form-control d-inline-block  mx-0" style="width: 90%;" value="${bus()}" disabled/>
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
            <input type="text" id="nombreDestino${i}" placeholder="Nombre del Destino ${i}" class="form-control d-inline-block mx-0" value="${ciudad()}" disabled/>
        `;

        destinosInputs.appendChild(div);
    }
}


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

    if (isNaN(totalBuses) || isNaN(totalDestinos) || totalBuses <= 0 || totalDestinos <= 0) {
        alert("Por favor, ingrese un número válido de buses y destinos.");
        return;
    }

    // Leer nombres de buses desde inputs generados
    for (let i = 1; i <= totalBuses; i++) {
        let nombreBus = document.getElementById(`nombreBus${i}`).value;
        buses.push({ nombre: nombreBus });
    }

    // Leer nombres de destinos desde inputs generados
    for (let i = 1; i <= totalDestinos; i++) {
        let nombreDestino = document.getElementById(`nombreDestino${i}`).value;
        destinos.push({ nombre: nombreDestino });
    }

    console.log("Buses:", buses);
    console.log("Destinos:", destinos);

    generarTablas();
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

// Funciones de Daniel

function generateDiagram() {

    // Definir colores para las lineas
    const busColors = ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#B10DC9", "#FFDC00"];

    const numSourcesInput = document.getElementById('buses');
    const numDestInput = document.getElementById('destinos');
    if (!numSourcesInput || !numDestInput) {
        alert("Faltan los campos de número de buses o ciudades en el HTML (IDs: 'num-sources', 'num-dest').");
        return;
    }
    
    const numSources = parseInt(numSourcesInput.value);
    const numDest = parseInt(numDestInput.value);
    const cities = capitals.sort(() => 0.5 - Math.random()).slice(0, numDest);
    currentCities = cities;

    if (numSources > 4 || numDest > 4) {
        alert("como máximo 4 buses y 4 ciudades");
        clearInput('num-sources', 'num-dest');
        return;
    }
    if (numSources < 1 || numDest < 1) {
        alert("debe haber al menos 1 bus y 1 ciudad");
        clearInput('num-sources', 'num-dest');
        return;
    }

    const svg = document.getElementById('diagram-svg');
    svg.innerHTML = '';

    // Ajustes clave -------------------------------------------------
    const element_spacing = 300; // Más espacio entre elementos
    const horizontalMargin = 80; // Margen lateral aumentado
    const baseHeight = 200; // Altura base adicional
    
    // Calcular dimensiones dinámicas
    const maxElements = Math.max(numSources, numDest);
    const diagramWidth = 1200; // Ancho aumentado
    const diagramHeight = (maxElements * element_spacing) + baseHeight;
    
    svg.style.minHeight = `${diagramHeight}px`;
    svg.setAttribute('viewBox', `0 0 ${diagramWidth} ${diagramHeight}`);

    // Definir marcador de flecha
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrow');
    marker.setAttribute('viewBox', '0 0 10 10');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '5');
    marker.setAttribute('markerWidth', '6');
    marker.setAttribute('markerHeight', '6');
    marker.setAttribute('orient', 'auto');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M0,0 L10,5 L0,10 Z');
    path.setAttribute('fill', 'black');
    marker.appendChild(path);
    defs.appendChild(marker);
    svg.appendChild(defs);

    // Posicionar elementos
    const busPositions = Array.from({length: numSources}, (_, i) => ({
        x: horizontalMargin,
        y: baseHeight/2 + i * element_spacing
    }));
    
    const cityPositions = cities.map((_, i) => ({
        x: diagramWidth - horizontalMargin,
        y: baseHeight/2 + i * element_spacing
    }));

    // Dibujar buses
    busPositions.forEach((pos, i) => {
        const bus = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        bus.setAttribute('href', 'img/bus.png'); //imagen 
        bus.setAttribute('x', pos.x - 35); // Centrar icono
        bus.setAttribute('y', pos.y - 60);
        bus.setAttribute('width', '100');
        bus.setAttribute('height', '100');
        svg.appendChild(bus);
        
        // Texto
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        // Mostrar el mismo nombre de bus que aparece en la tabla generada
        text.setAttribute('x', pos.x - 0);
        text.setAttribute('y', pos.y - 40);
        text.textContent = `Bus ${i + 1}`;
        svg.appendChild(text);
    });

    // Dibujar ciudades
    cityPositions.forEach((pos, i) => {
        // Ícono de ciudad
        const city = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        city.setAttribute('href', 'img/ciudad.png'); // Asegurar que esta imagen existe
        city.setAttribute('x', pos.x - 30); // Centrar icono
        city.setAttribute('y', pos.y - 60);
        city.setAttribute('width', '100');
        city.setAttribute('height', '100');
        svg.appendChild(city);

        // Nombre de la ciudad
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', pos.x - 0);
        text.setAttribute('y', pos.y - 55);
        text.textContent = cities[i];
        svg.appendChild(text);
    });

    const labelOffset = 40; // Distancia desde la línea
    const angleOffset = 25; // Ángulo para evitar colisiones

    // Dibujar conexiones
    busPositions.forEach((busPos, busIdx) => {
        cityPositions.forEach((cityPos, cityIdx) => {
            // Línea
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', busPos.x + 50);
            line.setAttribute('y1', busPos.y);
            line.setAttribute('x2', cityPos.x);
            line.setAttribute('y2', cityPos.y);
            line.setAttribute('class', 'line');
            line.setAttribute('stroke', busColors[busIdx % busColors.length]);
            svg.appendChild(line);

            // calcular dirección de la línea
            const dx = cityPos.x - busPos.x;
            const dy = cityPos.y - busPos.y;
            const angle = Math.atan2(dy, dx);

            // Posicionamiento inteligente de etiquetas
            const xijPosition = {
                x: busPos.x + dx * 0.25 + Math.cos(angle + angleOffset) * labelOffset,
                y: busPos.y + dy * 0.25 + Math.sin(angle + angleOffset) * labelOffset
            };

            const cijPosition = {
                x: busPos.x + dx * 0.75 + Math.cos(angle - angleOffset) * labelOffset,
                y: busPos.y + dy * 0.75 + Math.sin(angle - angleOffset) * labelOffset
            };

            // Crear etiquetas con posición calculada
            const xId = `x${busIdx+1}${cityIdx+1}`;
            const cId = `c${busIdx+1}${cityIdx+1}`;

            // Modificar las llamadas a createLabel para incluir los valores iniciales
            createLabel(svg, `${xId}`, xijPosition, busColors[busIdx % busColors.length]);
            createLabel(svg, `${cId}`, cijPosition, busColors[busIdx % busColors.length]);

            // Si necesitas almacenar valores para esta ruta, puedes hacerlo aquí si es necesario
        });
    });
    
    function createLabel(svg, text, position, color) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', position.x);
        label.setAttribute('y', position.y);
        label.textContent = text;
        label.setAttribute('fill', color);
        label.setAttribute('class', 'diagram-label');
        svg.appendChild(label);
    }
}

// fin funciones de daniel

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






