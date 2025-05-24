const capitals = [
    "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Cúcuta", "Bucaramanga", "Pereira",
    "Manizales", "Ibagué", "Santa Marta", "Villavicencio", "Pasto", "Montería", "Armenia", "Neiva",
    "Sincelejo", "Valledupar", "Quibdó", "Riohacha", "Florencia", "San Andrés", "Mocoa", "Yopal",
    "Popayán", "Tunja", "Leticia", "Arauca", "Inírida", "Aguachica", "Tumaco",
    "Barrancabermeja", "Bello", "Soledad", "Palmira", "Tuluá", "Cartago", "Sogamoso"
];

const busNames = [
    "Bolivariano", "Copetran", "Brasilia", "Rápido Ochoa", "Flota Magdalena", "Coomotor", "Cootranshuila",
    "Omega", "Palmira", "Flota La Macarena", "Flota Occidental", "San Gil", "Cootransbol", "Paz del Río",
    "Sideral", "Gaviota"
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

function generateDiagram() {

    //traer oferta y demanda para validar que no sean 0 y sumen lo mismo
    // Obtener datos de la tabla
    const datos = obtenerDatosTabla();
    if (!datos) {
        alert("Por favor, completa la tabla antes de continuar.");
        return;
    }

    // Validar que ninguna oferta o demanda sea 0 o negativa
    if (datos.oferta.some(o => o <= 0) || datos.demanda.some(d => d <= 0)) {
        alert("Todas las ofertas y demandas deben ser mayores que 0.");
        return;
    }

    // Validar que la suma de oferta y demanda sea igual
    const sumaOferta = datos.oferta.reduce((a, b) => a + b, 0);
    const sumaDemanda = datos.demanda.reduce((a, b) => a + b, 0);
    if (sumaOferta !== sumaDemanda) {
        alert("La suma de la oferta debe ser igual a la suma de la demanda.");
        return;
    }
    

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

    const tabla = document.querySelector("#tablaGenerada table");
    if (!tabla) {
        alert("Debes generar la tabla primero");
        return;
    }

    document.getElementById("generarDiagrama").disabled = true;

    const svg = document.getElementById('diagram-svg');
    svg.innerHTML = '';

    // Ajustes clave -------------------------------------------------
    const element_spacing = 300; // Más espacio entre elementos
    const horizontalMargin = 80; // Margen lateral aumentado
    const baseHeight = 200; // Altura base adicional
    
    // Calcular dimensiones dinámicas
    const maxElements = Math.max(numSources, numDest);
    //console.log("elementos del diagrama"+ maxElements);
    const diagramWidth = 1200; // Ancho aumentado
    //console.log("ancho del diagrama "+diagramWidth);
    const diagramHeight = (maxElements * element_spacing) + baseHeight - 300;
    //console.log("alto del diagrama "+diagramHeight);
    
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
        text.setAttribute('x', pos.x - 20);
        text.setAttribute('y', pos.y - 40);
        text.textContent = `${buses[i].nombre}`; // Mostrar el nombre del bus
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
        text.textContent = `${destinos[i].nombre}`; // Mostrar el nombre de la ciudad
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

function FOyRestricciones() {
    const datos = obtenerDatosTabla();

    if (!datos) {
        alert("Por favor, completa la tabla antes de continuar.");
        return;
    }

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

// Reemplaza la función EsquinaNoroeste() existente con esta implementación completa:

function EsquinaNoroeste() {
    // Obtener datos de la tabla
    const datos = obtenerDatosTabla();
    if (!datos) {
        alert("Por favor, completa la tabla antes de continuar.");
        return;
    }

    // Validar que ninguna oferta o demanda sea 0 o negativa
    if (datos.oferta.some(o => o <= 0) || datos.demanda.some(d => d <= 0)) {
        alert("Todas las ofertas y demandas deben ser mayores que 0.");
        return;
    }

    // Validar que la suma de oferta y demanda sea igual
    const sumaOferta = datos.oferta.reduce((a, b) => a + b, 0);
    const sumaDemanda = datos.demanda.reduce((a, b) => a + b, 0);
    if (sumaOferta !== sumaDemanda) {
        alert("La suma de la oferta debe ser igual a la suma de la demanda.");
        return;
    }

    // Inicializar matrices y variables
    const m = datos.origenes.length;  // número de filas (buses)
    const n = datos.destinos.length; // número de columnas (destinos)
    
    // Matriz de solución
    let solucion = Array(m).fill().map(() => Array(n).fill(0));
    
    // Copias de oferta y demanda para modificar
    let ofertaRestante = [...datos.oferta];
    let demandaRestante = [...datos.demanda];
    
    // Variables para el algoritmo
    let i = 0, j = 0;
    let pasos = [];
    let pasoNumero = 1;

    // Algoritmo de Esquina Noroeste
    while (i < m && j < n) {
        // Calcular la asignación (mínimo entre oferta y demanda)
        let asignacion = Math.min(ofertaRestante[i], demandaRestante[j]);
        
        // Realizar la asignación
        solucion[i][j] = asignacion;
        
        // Registrar el paso
        let accion = "";
        if (ofertaRestante[i] - asignacion === 0 && demandaRestante[j] - asignacion === 0) {
            accion = "Oferta y demanda satisfechas - Mover diagonal";
        } else if (ofertaRestante[i] - asignacion === 0) {
            accion = "Oferta satisfecha - Mover abajo";
        } else {
            accion = "Demanda satisfecha - Mover derecha";
        }
        
        pasos.push({
            paso: pasoNumero,
            posicion: `(${i + 1}, ${j + 1})`,
            origen: datos.origenes[i],
            destino: datos.destinos[j],
            asignacion: asignacion,
            ofertaAntes: ofertaRestante[i],
            demandaAntes: demandaRestante[j],
            ofertaDespues: ofertaRestante[i] - asignacion,
            demandaDespues: demandaRestante[j] - asignacion,
            accion: accion
        });
        
        // Actualizar oferta y demanda
        ofertaRestante[i] -= asignacion;
        demandaRestante[j] -= asignacion;
        
        // Determinar siguiente movimiento
        if (ofertaRestante[i] === 0 && demandaRestante[j] === 0) {
            // Ambos son cero - mover diagonalmente
            i++;
            j++;
        } else if (ofertaRestante[i] === 0) {
            // Oferta agotada - mover a la siguiente fila
            i++;
        } else {
            // Demanda satisfecha - mover a la siguiente columna
            j++;
        }
        
        pasoNumero++;
    }

    // Calcular costo total
    let costoTotal = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            costoTotal += solucion[i][j] * datos.costos[i][j];
        }
    }

    // Mostrar resultados
    mostrarResultadosEsquinaNoroeste(solucion, pasos, costoTotal, datos);
}
// ... (mantener todas las funciones anteriores hasta EsquinaNoroeste)

function mostrarResultadosEsquinaNoroeste(solucion, pasos, costoTotal, datos) {
    let resultadoHTML = `
        <div class="card mt-4">
            <div class="card-header">
            </div>
            <div class="card-body">
                <!-- Matriz Visual Estilo Imagen -->
                
                <div class="table-responsive mb-4">
                    <table class="table table-bordered text-center" style="border: 2px solid #000;">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th style="border: 2px solid #000; padding: 15px;"></th>`;

    // Encabezados de destinos
    datos.destinos.forEach(destino => {
        resultadoHTML += `<th style="border: 2px solid #000; padding: 15px; font-weight: bold;">${destino}</th>`;
    });
    resultadoHTML += `<th style="border: 2px solid #000; padding: 15px; font-weight: bold;">OFERTA</th></tr></thead><tbody>`;

    // Filas de la matriz con el diseño especial
    for (let i = 0; i < datos.origenes.length; i++) {
        resultadoHTML += `<tr><th style="border: 2px solid #000; padding: 15px; background-color: #f8f9fa; font-weight: bold;">${datos.origenes[i]}</th>`;
        
        for (let j = 0; j < datos.destinos.length; j++) {
            const costo = datos.costos[i][j];
            const asignacion = solucion[i][j];
            
            resultadoHTML += `<td style="border: 2px solid #000; padding: 0; position: relative; width: 100px; height: 80px;">`;
            
            if (asignacion > 0) {
                // Celda con asignación (verde)
                resultadoHTML += `
                    <div style="position: relative; width: 100%; height: 100%; background-color: #d4edda;">
                        <div style="position: absolute; top: 5px; left: 5px; font-size: 14px; font-weight: bold;">${costo}</div>
                        <div style="position: absolute; bottom: 5px; right: 5px; font-size: 16px; font-weight: bold; color: #000;">${asignacion}</div>
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                             background: linear-gradient(135deg, transparent 40%, #000 40%, #000 42%, transparent 42%);">
                        </div>
                    </div>`;
            } else {
                // Celda sin asignación
                resultadoHTML += `
                    <div style="position: relative; width: 100%; height: 100%;">
                        <div style="position: absolute; top: 5px; left: 5px; font-size: 14px;">${costo}</div>
                        <div style="position: absolute; bottom: 5px; right: 5px; font-size: 16px; color: red; font-weight: bold;">X</div>
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                             background: linear-gradient(135deg, transparent 40%, #000 40%, #000 42%, transparent 42%);">
                        </div>
                    </div>`;
            }
            
            resultadoHTML += `</td>`;
        }
        
        resultadoHTML += `<td style="border: 2px solid #000; padding: 15px; font-weight: bold; background-color: #fff3cd;">${datos.oferta[i]}</td></tr>`;
    }

    // Fila de demanda
    resultadoHTML += `<tr><th style="border: 2px solid #000; padding: 15px; background-color: #f8f9fa; font-weight: bold;">DEMANDAS</th>`;
    datos.demanda.forEach(demanda => {
        resultadoHTML += `<td style="border: 2px solid #000; padding: 15px; font-weight: bold; background-color: #fff3cd;">${demanda}</td>`;
    });
    
    // Calcular totales
    const totalOferta = datos.oferta.reduce((a, b) => a + b, 0);
    const totalDemanda = datos.demanda.reduce((a, b) => a + b, 0);
    
    resultadoHTML += `<td style="border: 2px solid #000; padding: 15px;">
                        <div style="position: relative; height: 40px;">
                            <div style="position: absolute; top: 0; right: 5px; font-weight: bold;">${totalOferta}</div>
                            <div style="position: absolute; bottom: 0; right: 5px; font-weight: bold;">${totalDemanda}</div>
                            <div style="position: absolute; top: 50%; left: 0; width: 100%; height: 1px; background: #000; transform: translateY(-50%);"></div>
                        </div>
                      </td></tr>`;

    resultadoHTML += `</tbody></table></div>`;

    // Restricciones
    resultadoHTML += generarRestricciones(datos);

    // Cálculo del Costo Total
    resultadoHTML += `
                <h5>Cálculo del Costo Total</h5>
                <div class="row">
                    <div class="col-md-8">
                        
                        <div class="border p-3 bg-light">`;

    let calculoDetallado = [];
    let calculoTerminos = [];
    for (let i = 0; i < datos.origenes.length; i++) {
        for (let j = 0; j < datos.destinos.length; j++) {
            if (solucion[i][j] > 0) {
                calculoDetallado.push(`(${solucion[i][j]} × ${datos.costos[i][j]})`);
                calculoTerminos.push(`${solucion[i][j] * datos.costos[i][j]}`);
            }
        }
    }

    resultadoHTML += `
                            <p><strong>Desarrollo:</strong><br>
                            Z = ${calculoDetallado.join(' + ')}<br>
                            Z = ${calculoTerminos.join(' + ')}</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="alert alert-success text-center">
                            <h4>Costo Total Mínimo</h4>
                            <h2 class="text-success">$${costoTotal.toLocaleString()}</h2>
                        </div>
                    </div>
                </div>`;

    // Generar diagrama actualizado
    resultadoHTML += `
                <h5> Diagrama con unicas rutas posibles.</h5>
                <div id="diagram-solucion" style="text-align: center; margin: 20px 0;">
                    <svg id="diagram-solucion-svg" style="border: 1px solid #ccc; border-radius: 8px;"></svg>
                </div>`;

    // Botón para reiniciar
    resultadoHTML += `
                <div class="text-center mt-4">
                    <button class="btn btn-primary" onclick="reiniciarProblema()">
                        🔄 Resolver Nuevo Problema
                    </button>
                </div>
            </div>
        </div>`;

    // Insertar en el DOM
    const contenedorResultados = document.getElementById("resultadosEsquinaNoroeste");
    if (contenedorResultados) {
        contenedorResultados.innerHTML = resultadoHTML;
    } else {
        const diagramContainer = document.getElementById("diagram-container2");
        if (diagramContainer) {
            const nuevoDiv = document.createElement('div');
            nuevoDiv.id = "resultadosEsquinaNoroeste";
            nuevoDiv.innerHTML = resultadoHTML;
            diagramContainer.parentNode.insertBefore(nuevoDiv, diagramContainer.nextSibling);
        }
    }

    // Generar el diagrama actualizado después de insertar el HTML
    setTimeout(() => {
        generarDiagramaSolucion(solucion, datos);
    }, 100);

    // Scroll hacia los resultados
    document.getElementById("resultadosEsquinaNoroeste").scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function generarRestricciones(datos) {
    let restriccionesHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>Función Objetivo:</h6>
                <div class="border p-3 bg-light mb-3">`;
    
    // Función Objetivo
    let terminosFO = [];
    for (let i = 0; i < datos.origenes.length; i++) {
        for (let j = 0; j < datos.destinos.length; j++) {
            const cij = datos.costos[i][j];
            terminosFO.push(`${cij}X<sub>${i + 1}${j + 1}</sub>`);
        }
    }
    restriccionesHTML += `<strong>Min Z = ${terminosFO.join(' + ')}</strong>`;
    
    restriccionesHTML += `</div>
                <h6>Restricciones de Oferta:</h6>
                <div class="border p-3 bg-light">`;
    
    // Restricciones de oferta
    for (let i = 0; i < datos.origenes.length; i++) {
        let restr = "";
        for (let j = 0; j < datos.destinos.length; j++) {
            restr += `X<sub>${i + 1}${j + 1}</sub>`;
            if (j < datos.destinos.length - 1) restr += " + ";
        }
        restr += ` ≤ ${datos.oferta[i]}`;
        restriccionesHTML += restr + "<br>";
    }
    
    restriccionesHTML += `</div>
            </div>
            <div class="col-md-6">
                <h6>Restricciones de Demanda:</h6>
                <div class="border p-3 bg-light">`;
    
    // Restricciones de demanda
    for (let j = 0; j < datos.destinos.length; j++) {
        let restr = "";
        for (let i = 0; i < datos.origenes.length; i++) {
            restr += `X<sub>${i + 1}${j + 1}</sub>`;
            if (i < datos.origenes.length - 1) restr += " + ";
        }
        restr += ` = ${datos.demanda[j]}`;
        restriccionesHTML += restr + "<br>";
    }
    
    restriccionesHTML += `</div>
                
                <div class="border p-3 bg-light">
                    <strong>X<sub>ij</sub> ≥ 0</strong>
                </div>
            </div>
        </div>`;
    
    return restriccionesHTML;
}

function generarDiagramaSolucion(solucion, datos) {
    const busColors = ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#B10DC9", "#FFDC00"];
    
    const numSources = datos.origenes.length;
    const numDest = datos.destinos.length;
    
    const svg = document.getElementById('diagram-solucion-svg');
    if (!svg) return;
    
    svg.innerHTML = '';

    // Ajustes del diagrama
    const element_spacing = 300;
    const horizontalMargin = 120;
    const baseHeight = 200;
    
    const maxElements = Math.max(numSources, numDest);
    const diagramWidth = 1100;
    const diagramHeight = (maxElements * element_spacing) + baseHeight - 300;
    
    svg.style.minHeight = `${diagramHeight}px`;
    svg.setAttribute('viewBox', `0 0 ${diagramWidth} ${diagramHeight}`);

    // Definir marcador de flecha
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrow-solucion');
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
    
    const cityPositions = Array.from({length: numDest}, (_, i) => ({
        x: diagramWidth - horizontalMargin,
        y: baseHeight/2 + i * element_spacing
    }));

    // Dibujar buses
    busPositions.forEach((pos, i) => {
        // Círculo para bus
        const busCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        busCircle.setAttribute('cx', pos.x);
        busCircle.setAttribute('cy', pos.y);
        busCircle.setAttribute('r', '40');
        busCircle.setAttribute('fill', '#87CEEB');
        busCircle.setAttribute('stroke', '#000');
        busCircle.setAttribute('stroke-width', '2');
        svg.appendChild(busCircle);
        
        // Texto del bus
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', pos.x);
        text.setAttribute('y', pos.y + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.textContent = datos.origenes[i];
        svg.appendChild(text);
        
        // Oferta
        const ofertaText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        ofertaText.setAttribute('x', pos.x);
        ofertaText.setAttribute('y', pos.y + 60);
        ofertaText.setAttribute('text-anchor', 'middle');
        ofertaText.setAttribute('font-size', '14');
        ofertaText.setAttribute('font-weight', 'bold');
        ofertaText.setAttribute('fill', 'blue');
        ofertaText.textContent = `Oferta: ${datos.oferta[i]}`;
        svg.appendChild(ofertaText);
    });

    // Dibujar ciudades
    cityPositions.forEach((pos, i) => {
        // Círculo para ciudad
        const cityCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        cityCircle.setAttribute('cx', pos.x);
        cityCircle.setAttribute('cy', pos.y);
        cityCircle.setAttribute('r', '40');
        cityCircle.setAttribute('fill', '#FFB6C1');
        cityCircle.setAttribute('stroke', '#000');
        cityCircle.setAttribute('stroke-width', '2');
        svg.appendChild(cityCircle);

        // Texto de la ciudad
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', pos.x);
        text.setAttribute('y', pos.y + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.textContent = datos.destinos[i];
        svg.appendChild(text);
        
        // Demanda
        const demandaText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        demandaText.setAttribute('x', pos.x);
        demandaText.setAttribute('y', pos.y + 60);
        demandaText.setAttribute('text-anchor', 'middle');
        demandaText.setAttribute('font-size', '14');
        demandaText.setAttribute('font-weight', 'bold');
        demandaText.setAttribute('fill', 'red');
        demandaText.textContent = `Demanda: ${datos.demanda[i]}`;
        svg.appendChild(demandaText);
    });

    // Dibujar conexiones con valores
    busPositions.forEach((busPos, busIdx) => {
        cityPositions.forEach((cityPos, cityIdx) => {
            const xij = solucion[busIdx][cityIdx];
            const cij = datos.costos[busIdx][cityIdx];
            
            // Línea
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', busPos.x + 40);
            line.setAttribute('y1', busPos.y);
            line.setAttribute('x2', cityPos.x - 40);
            line.setAttribute('y2', cityPos.y);
            line.setAttribute('stroke', xij > 0 ? '#000' : '#ccc');
            line.setAttribute('stroke-width', xij > 0 ? '3' : '1');
            line.setAttribute('stroke-dasharray', xij > 0 ? 'none' : '5,5');
            if (xij > 0) {
                line.setAttribute('marker-end', 'url(#arrow-solucion)');
            }
            svg.appendChild(line);

            // Calcular posiciones para las etiquetas
            const midX = busPos.x + (cityPos.x - busPos.x) * 0.5;
            const midY = busPos.y + (cityPos.y - busPos.y) * 0.5;
            
            // Offset para evitar solapamiento
            const offsetY = (busIdx - cityIdx) * 15;

            // Valor Xij (cantidad transportada)
            if (xij > 0) {
                const xijRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                xijRect.setAttribute('x', midX - 15);
                xijRect.setAttribute('y', midY - 25 + offsetY);
                xijRect.setAttribute('width', '30');
                xijRect.setAttribute('height', '20');
                xijRect.setAttribute('fill', '#90EE90');
                xijRect.setAttribute('stroke', '#000');
                xijRect.setAttribute('stroke-width', '1');
                svg.appendChild(xijRect);
                
                const xijText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                xijText.setAttribute('x', midX);
                xijText.setAttribute('y', midY - 10 + offsetY);
                xijText.setAttribute('text-anchor', 'middle');
                xijText.setAttribute('font-size', '12');
                xijText.setAttribute('font-weight', 'bold');
                xijText.textContent = `${xij}`;
                svg.appendChild(xijText);
            }

            // Valor Cij (costo)
            const cijRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            cijRect.setAttribute('x', midX - 15);
            cijRect.setAttribute('y', midY + 5 + offsetY);
            cijRect.setAttribute('width', '30');
            cijRect.setAttribute('height', '20');
            cijRect.setAttribute('fill', '#FFE4B5');
            cijRect.setAttribute('stroke', '#000');
            cijRect.setAttribute('stroke-width', '1');
            svg.appendChild(cijRect);
            
            const cijText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            cijText.setAttribute('x', midX);
            cijText.setAttribute('y', midY + 20 + offsetY);
            cijText.setAttribute('text-anchor', 'middle');
            cijText.setAttribute('font-size', '10');
            cijText.textContent = `$${cij}`;
            svg.appendChild(cijText);
        });
    });
}

// ... (mantener todas las demás funciones sin cambios)

// Función para reiniciar el problema y permitir un nuevo cálculo
function reiniciarProblema() {
    // Recarga la página para limpiar todos los datos y la interfaz
    location.reload();
}