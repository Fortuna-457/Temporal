// Inicializa el mapa, el marcador, y el círculo que representa el radio
var map = L.map('mapid').setView([37.174782319895975, -3.5914930701801504], 15);
var marker;
var circle;

// Carga el mapa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 9,
}).addTo(map);

map.on('click', function(e) {
    var radius = 15; // Define el radio en metros
    var latlng = e.latlng;

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
    var query = `[out:json];
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
    out skel qt;`;

    fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
    })
    .then(response => response.json())
    .then(data => {
        // Filtra y procesa los datos para obtener solo los elementos con nombres definidos
        var elements = data.elements.filter(element => {
            return element.tags && element.tags.name; // Verifica si el elemento tiene el tag "name"
        }).map(element => {
            return {
                name: element.tags.name,
                type: element.type,
                id: element.id
            };
        });

        console.log(elements);

        if($("#respuesta").children().length > 0){
            $("#respuesta").empty();
        }

        elements.forEach( element => { // Recorremos los elementos filtrados
            $("#respuesta").append("<p>"+ element.name +"</p>"); // Los mostramos al usuario
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