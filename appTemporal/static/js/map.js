// Initialize the map, marker, and circle representing the radius
let map = L.map('mapid', {
    center: [37.174782319895975, -3.5914930701801504],
    zoom: 15,
    maxBounds: L.latLngBounds(
        L.latLng(-90, -180),  // Suroeste (límite inferior)
        L.latLng(90, 180)     // Noreste (límite superior, en este caso, 180 grados de longitud)
    ),
    worldCopyJump: true           // Para evitar que el mapa se duplique
});
let marker;
let circle;
let radius = 15; // Define the radius in meters
let elements = []; // Initialize the array

// Get the CSRF token
const csrfToken = $('meta[name="csrf-token"]').attr('content');

// Load the OpenStreetMap map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 5,
}).addTo(map);

// Personalizar el control de zoom (ubicación, estilo, etc.)
map.zoomControl.setPosition('bottomright'); // Cambia la posición del control de zoom

// Añadir el botón de geolocalización
L.control.locate({
    position: 'bottomright',  // Posición del botón de geolocalización
    strings: {
        title: "Show my ubication"  // Texto alternativo del botón
    },
    keepCurrentZoomLevel: true, // Mantener el nivel de zoom actual al geolocalizar
    drawCircle: false,          // Dibujar un círculo de precisión alrededor de la ubicación
    drawMarker: false,          // Dibujar un marcador de precisión en la ubicación
    showPopup: true,            // No mostrar un popup al geolocalizar
    flyTo: true,                // Realizar un efecto de vuelo al centrar el mapa
    radius: 15  
}).addTo(map);

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

    // Create a new bubble for each click event (right bubble)
    let newBubble = $("<div class='bubbleComic'><div class='imgBubble'></div><div class='bubble right'><div class='greeting'></div><div class='respuesta'><div class='loading'><div class='circle'></div><div class='circle'></div><div class='circle'></div></div></div></div>");

    $(".answer-container").append(newBubble); // Add the new bubble to the existing ones
    newBubble.find('.bubble').show(); // Show the bubble
    newBubble.find('.bubble').addClass("slideInFromRight");

    // Function to display elements
    function displayElements(elements) {
        
        // Clear previous response
        $("#respuesta").empty();

        if (elements.length === 0 || elements[0].id === null) { // Check if the elements array is empty or if id is null
            let messages = [
                "Oops! Something went wrong, click again somewhere else!",
                "Jax is a genius, but his knowledge has its limits!",
                "Jax is a bit confused and cannot find that specific point...",
                "Our time-leapers don't know what you mean, click somewhere else...",
                "Jax fell off a cliff and cannot answer right now! Click somewhere else..",
                "Looks like Jax took a break, click somewhere else!",
                "Jax is pondering, click elsewhere!",
                "Jax needs a coffee break, try another click!",
                "Jax is stumped! Try a different location.",
                "Jax is meditating, click again later!",
                "Jax's memory banks need a refill! Try another location.",
                "Jax's circuits are overloaded! Click elsewhere.",
                "Jax is off exploring, try clicking somewhere else.",
                "Jax is recalibrating, try again soon!",
                "Jax needs a moment to process! Click somewhere else.",
                "Jax is searching the archives! Try another click.",
                "Jax is on vacation, try another click!",
                "Jax is on a lunch break! Click somewhere else.",
                "Jax's sensors are offline! Try another location."
            ];
            let message = messages[Math.floor(Math.random() * messages.length)]; // Select a random message
            newBubble.find(".loading").remove(); // Remove the loading animation
            newBubble.find(".respuesta").append("<p>" + message + "</p>"); // Add the message to the current bubble
        }else{
            let messages = [
                "Jax, tell me something about",
                "Hey Jax, tell me about",
                "How are you doing?, Tell me information about",
                "Can you tell me about",
                "I'm interested in",
                "Give me information about",
                "I'd like to know about",
                "Hey bud, tell me about",
                "What's the story behind",
                "Enlighten me about",
                "I'm curious, share some knowledge about",
                "Jax, could you elaborate on",
                "Tell me more about",
                "Let's explore",
                "Inform me about",
                "How about some facts on",
                "Educate me on",
                "I'm seeking details on",
                "Jax, I'd appreciate insight on"
            ];
            
            let greeting = messages[Math.floor(Math.random() * messages.length)]; // Select a random greeting
            newBubble.find('.greeting').text(greeting); // Set the random greeting

            let aux_array = [];

            elements.forEach((element) => {
                if (!aux_array.includes(element.name)) {

                    // Get the first letter of type
                    let type = element.type.charAt(0); 
                
                    // Form the new id for the paragraph
                    let newId = type + element.id;
        
                    let newResponse = $('<p id="'+ newId +'" class="single-answer">' + element.name + '.</p>'); // Change span to a tag
                
                    // Create a new <a> for each element
                    newBubble.find(".respuesta").append(newResponse); // Add the new response to the current bubble
                    
                    aux_array.push(element.name);
                }
            });

            newBubble.find(".loading").remove(); // Remove the loading animation
        }

        // Scroll to the top of the new bubble
        // $(".offcanvas-body").animate({ scrollTop: newBubble.offset().top }, "slow");

        // Create a new bubble underneath the existing one (second bubble)
        let newBubbleAnswerBack = $("<div class='bubbleComic'><div class='imgBubble'></div><div class='bubble left'><div class='greeting'></div><div class='respuesta'></div></div></div>");
        setTimeout(function() {
            $(".answer-container").append(newBubbleAnswerBack); // Add the new bubble to the existing ones
            newBubbleAnswerBack.find('.bubble').show(); // Show the bubble
            newBubbleAnswerBack.find('.bubble').addClass("slideInFromLeft");

            let messagesAnswerBack = [
                "Hey, sure, what would you like to know about?",
                "Sure, what about specifically?",
                "Select a place so I know what you're talking about!",
                "Good taste! Select what you'd like to know more about",
                "Want a random fact?, sure! Select something of the list first!",
                "Jax is here to assist! Click and ask away.",
                "Ready for more info? Click and let me know.",
                "Curious? Click and I'll provide answers!",
                "Intrigued? Click and I'll share some knowledge.",
                "Let's explore! Click and discover something new.",
                "Jax is standing by for your click! Ask away.",
                "Seeking information? Click and I'll provide.",
                "Need help? Click and I'll guide you.",
                "Ready for a journey? Click and let's explore.",
                "Jax is at your service! Click and inquire.",
                "Ready for adventure? Click and let's begin.",
                "Jax is here to enlighten! Click and discover.",
                "Jax is waiting for your question! Click and ask.",
                "Time for knowledge! Click and learn more.",
                "Jax is eager to assist you! Click and inquire."
            ];
            let messageAnswerBack = messagesAnswerBack[Math.floor(Math.random() * messagesAnswerBack.length)]; // Select a random message for the answer back bubble
            newBubbleAnswerBack.find('.greeting').text(messageAnswerBack); // Set the random message

            let aux_array = [];

            // Add <a> tags for each response
            elements.forEach((element) => {
                if (!aux_array.includes(element.name) && elements[0].id !== null ) {

                    // Get the first letter of type
                    let type = element.type.charAt(0); 
                
                    // Form the new id for the paragraph
                    let newId = type + element.id;

                    // Change span to a tag
                    let newResponse = $('<a id="'+ newId +'" class="single-answer" href="#">' + element.name + '.</a>');

                    // Create a new <a> for each element
                    newBubbleAnswerBack.find(".respuesta").append(newResponse); // Add the new response to the current bubble
                    
                    aux_array.push(element.name);
                }
            });
            newBubbleAnswerBack[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 750); // Delay of 0.75s

        $('.bubble.right:last')[0].scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
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
                name: element.tags.name || null,
                type: element.type || null,
                id: element.id || null
            };
        });

        if(elements.length === 0){
            // Make a request to Nominatim API to get location details
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`)
            .then(response => response.json())
            .then(data => {
                // Add the Nominatim data as a new element to the elements array
                elements.push({
                    name: data.display_name || null, 
                    type: data.osm_type || null, 
                    id: data.osm_id || null
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

$(".answer-container").on("click", "a.single-answer", function (e) {
    
    // Obtenemos el id de la respuesta
    let id_answer = $(this).attr("id").toUpperCase();

    if(id_answer){
        $.ajax({
            url: '/get-info-place/',
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrfToken // Agrega el token CSRF como encabezado
            },
            data: JSON.stringify({"relation_id": id_answer}), // Stringify the data object
        })
        .done(function(response) { // Sacamos la respuesta del server
            if (response){ // Si no es nulo, lo mostramos.
                console.log(response);
            }
        })
        .fail(function(error) {
            console.error('Error:', error);
        });
    } else {
        alert("Not info found about this place."); // En vez de un alert, lo mostramos como una burbuja de texto
    }
});

$('.button-off-canvas').on('click', function() {
    // Add animation to fade out the bubbles
    $('.bubbleComic').addClass('fadeOut').delay(500).queue(function(next) {
        $(this).remove();
        next();
    });
});

// Flag to track dragging
let isDragging = false;

// Detect when the user is not dragging the map
map.addEventListener('mousedown', function() {
    isDragging = false;
});

// Detect when the user is dragging the map
map.addEventListener('mousemove', function() {
    isDragging = true;
});

// Handle the map click event
map.getContainer().addEventListener('click', function(event) {
    // Evitar el evento click si proviene de un control específico
    if (event.target.closest('.leaflet-control-zoom') || event.target.closest('.leaflet-control-locate')) {
        return;
    }

    let wasDragging = isDragging;
    isDragging = false;
    if (!wasDragging) {
        let offcanvasElement = document.getElementById('offcanvasExample');
        let offcanvas = new bootstrap.Offcanvas(offcanvasElement);
        offcanvas.show();
    }
});