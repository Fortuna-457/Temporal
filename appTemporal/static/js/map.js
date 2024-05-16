// Inicializa el mapa, el marcador, y el círculo que representa el radio
let map = L.map('mapid').setView([37.174782319895975, -3.5914930701801504], 15);
let marker;
let circle;

// Carga el mapa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 9,
}).addTo(map);

map.on('click', function(e) {
    let radius = 15; // Define el radio en metros
    let latlng = e.latlng;
    const limit_admin_level = 6; // Definimos el límite de admin_level

    // Coloca el marcador
    if (marker) {
        marker.setLatLng(e.latlng);
    } else {
        marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    }

    // Dibuja el radio
    if (circle) {
        circle.setLatLng(e.latlng);
    } else {
        circle = L.circle([e.latlng.lat, e.latlng.lng], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 15 // Cambia el radio según lo necesites
        }).addTo(map);
    }

    // Realiza una solicitud a la API Overpass de OpenStreetMap para obtener los elementos dentro del radio
    let query = `[out:json];
    (
        node(around:`+radius+`, `+latlng.lat+`, `+latlng.lng+`);
        way(around:`+radius+`, `+latlng.lat+`, `+latlng.lng+`);
        relation(around:`+radius+`, `+latlng.lat+`, `+latlng.lng+`);
    );
    out body;
    >;
    (
        node(around:`+radius+`, `+latlng.lat+`, `+latlng.lng+`);
        way(around:`+radius+`, `+latlng.lat+`, `+latlng.lng+`);
        relation(around:`+radius+`, `+latlng.lat+`, `+latlng.lng+`);
    );
    is_in;
    out body;
    >;
    out skel qt;`

    fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
    })
    .then(response => response.json())
    .then(data => {
        // Filtra y procesa los datos para obtener solo los elementos con nombres definidos
        let elements = data.elements.filter(element => {
            return (element.tags && element.tags.name) && 
                (
                    !(element.tags && element.tags.boundary) 
                        || 
                    (element.tags && element.tags.admin_level && element.tags.admin_level > limit_admin_level)
                );
        }).map(element => {
            return {
                name: element.tags.name,
                admin_level: element.tags.admin_level,
                type: element.type,
                id: element.id
            };
        });
        
        console.log(elements);

        if($("#respuesta").children().length > 0){
            $("#respuesta").empty();
        }

        let aux_array = [];

        elements.forEach(element => { // Recorremos los elementos filtrados
            if (!aux_array.includes(element.id)) {
                $("#respuesta").append("<p>" + element.name +", "+ element.admin_level +"</p>"); // Los mostramos al usuario
                aux_array.push(element.id);
            }
        });
       
    })
    .catch(error => {
        console.error('Error al obtener los elementos:', error);
    });
});

let isDragging = false;

let mapElement = document.getElementById('mapid');
mapElement.addEventListener('mousedown', function() {
    isDragging = false;
});

mapElement.addEventListener('mousemove', function() {
    isDragging = true;
});

mapElement.addEventListener('mouseup', function(event) {
    let wasDragging = isDragging;
    isDragging = false;
    if (!wasDragging) {
        let offcanvasElement = document.getElementById('offcanvasExample');
        let offcanvas = new bootstrap.Offcanvas(offcanvasElement);
        offcanvas.show();
    }
});