// Initialize the map, marker, and circle representing the radius
let map = L.map('mapid').setView([37.174782319895975, -3.5914930701801504], 15);
let marker;
let circle;
let radius = 15; // Define the radius in meters
let elements = []; // Initialize the array

// Load the OpenStreetMap map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 9,
}).addTo(map);

// Function to handle geolocation errors
function handleGeolocationError(error) {
    alert('Error getting location: ' + error.message);
}

// Adding geolocation using JS
$("#geolocateBtn").on('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let latlng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setView([latlng.lat, latlng.lng], 15);

            // Trigger the click event on the map with the new latlng
            map.fire('click', { latlng: latlng });
        }, handleGeolocationError);
    } else {
        alert('Browser does not support geolocation.');
    }
});

map.on('click', function(e) {
    let latlng = e.latlng;

    // Place the marker
    if (marker) {
        marker.setLatLng(latlng);
    } else {
        marker = L.marker([latlng.lat, latlng.lng]).addTo(map);
    }

    // Draw the circle
    if (circle) {
        circle.setLatLng(latlng);
    } else {
        circle = L.circle([latlng.lat, latlng.lng], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: radius // Use the previously defined radius variable
        }).addTo(map);
    }

    // Function to display elements
    function displayElements(elements) {
        // Clear previous response
        $("#respuesta").empty();

        let aux_array = [];

        elements.forEach(element => { // Loop through filtered elements
            if (!aux_array.includes(element.id)) {
                // Get the first letter of type
                let type = element.type.charAt(0); 
            
                // Form the new id for the paragraph
                let newId = type + element.id;
            
                // Show the name to the user with the new id in the paragraph
                $("#respuesta").append("<p id='" + newId + "'>" + element.name + "</p>"); 
            
                // Add the id to the auxiliary array
                aux_array.push(element.id);
            }
        });
    }

    // Make a request to the Overpass API of OpenStreetMap to get the elements within the radius
    let query = `[out:json];
    (
        node(around:${radius}, ${latlng.lat}, ${latlng.lng});
        way(around:${radius}, ${latlng.lat}, ${latlng.lng});
        relation(around:${radius}, ${latlng.lat}, ${latlng.lng});
    );
    out body;
    >;
    out skel qt;`;

    fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
    })
    .then(response => response.json())
    .then(data => {
        // Filter and process the data to get only the elements with defined names
        elements = data.elements.filter(element => {
            return (element.tags && element.tags.name);
        }).map(element => {
            return {
                name: element.tags.name,
                type: element.type,
                id: element.id
            };
        });

        if(elements.length === 0){
            // Make a request to Nominatim API to get location details
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`)
            .then(response => response.json())
            .then(data => {
                // Add the Nominatim data as a new element to the elements array
                elements.push({
                    name: data.display_name, 
                    type: data.osm_type, 
                    id: data.osm_id
                });
    
                // Display elements
                displayElements(elements);
    
            })
            .catch(error => {
                console.error('Error getting elements:', error);
                alert('Error getting elements. Please try again.');
            });
        }else{
            // Display elements
            displayElements(elements);
        }

    })
    .catch(error => {
        console.error('Error getting elements:', error);
        alert('Error getting elements. Please try again.');
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

/* if (data.display_name) {
    alert("Lugar: " + data.display_name);

    // Obtiene el valor del token CSRF de la etiqueta meta
    const csrfToken = $('meta[name="csrf-token"]').attr('content');

    const datos = {
        lugar: data.display_name,
        coordenadas: lat + ", " + lng
    };

    // Convertir el objeto de datos a JSON
    const jsonData = JSON.stringify(datos);

    $.ajax({
        url: '/maps/',
        method: 'POST',
        contentType: 'application/json',
        headers: {
            'X-CSRFToken': csrfToken // Agrega el token CSRF como encabezado
        },
        data: jsonData
    })
    .done(function(response) {
        $("#respuesta").text(response.lugar);
    })
    .fail(function(error) {
        console.error('Error:', error);
    });

} else {
    alert("No se encontró información sobre el lugar.");
} */