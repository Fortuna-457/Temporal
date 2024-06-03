$(document).ready(function () {
    $('#myModal').on('hidden.bs.modal', function () {
        $('#search').focus();
    });
});


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

// Función para disparar un evento personalizado 'click' en el contenedor del mapa
function simulateMapClick() {
    let offcanvasElement = document.getElementById('offcanvasExample');
    let offcanvas = new bootstrap.Offcanvas(offcanvasElement);
    offcanvas.show();
}

// Function to display elements
function displayElements(elements, newBubble) {
    // Ensure elements is an array
    if (!Array.isArray(elements)) {
        return;
    }

    // If newBubble is not provided, create a new one
    if (!newBubble) {
        newBubble = $("<div class='bubbleComic'><div class='imgBubble'></div><div class='bubble right'><div class='greeting'></div><div class='respuesta'><div class='loading'><div class='circle'></div><div class='circle'></div><div class='circle'></div></div></div></div>");
        $(".answer-container").append(newBubble); // Add the new bubble to the existing ones
        newBubble.find('.bubble').show(); // Show the bubble
        newBubble.find('.bubble').addClass("slideInFromRight");
    }
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
        // Select a random message from the array
        let message = messages[Math.floor(Math.random() * messages.length)];

        // Remove the loading animation
        newBubble.find(".loading").remove();

        // Add the error message to the bubble
        newBubble.find(".respuesta").append("<p>" + message + "</p>");

        // Adjust the CSS classes for the bubble
        newBubble.find('.bubble').removeClass("bubble right slideInFromRight").addClass("middle-div");

        // Scroll to the top of the new bubble
        newBubble[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    } else {
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

                let newResponse = $('<p id="' + newId + '" class="single-answer" data-lat="' + element.lat + '" data-lon="' + element.lon + '" >' + element.name + '.</p>'); // Change span to a tag

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
    setTimeout(function () {
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
            if (!aux_array.includes(element.name) && elements[0].id !== null) {

                // Get the first letter of type
                let type = element.type.charAt(0);

                // Form the new id for the paragraph
                let newId = type + element.id;

                // Change span to a tag
                let newResponse = $('<a id="' + newId + '" class="single-answer" href="#" data-lat="' + element.lat + '" data-lon="' + element.lon + '">' + element.name + '.</a>');

                // Create a new <a> for each element
                newBubbleAnswerBack.find(".respuesta").append(newResponse); // Add the new response to the current bubble

                aux_array.push(element.name);
            }
        });
        newBubbleAnswerBack[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 750); // Delay of 0.75s

    $('.bubble.right:last')[0].scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    newBubbleAnswerBack.find('.bubble').append('<i class="volume-icon bx bxs-volume-full"></i>');
}
let isBubbleGenerating = false;

map.on('click', function (e) {

    // if (isBubbleGenerating) return; // If a bubble is already being generated, do not proceed

    // isBubbleGenerating = true; // Set the flag to true since a bubble is being generated

    let newBubble = $("<div class='bubbleComic'><div class='imgBubble'></div><div class='bubble right'><div class='greeting'></div><div class='respuesta'><div class='loading'><div class='circle'></div><div class='circle'></div><div class='circle'></div></div></div></div>");
    $(".answer-container").append(newBubble);
    newBubble.find('.bubble').show();
    newBubble.find('.bubble').addClass("slideInFromRight");

    let latlng = e.latlng;

    // Por si acaso, reseteamos el array elements
    elements = [];

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
                    lat: element.lat || latlng.lat,
                    lon: element.lon || latlng.lng,
                    type: element.type || null,
                    id: element.id || null
                };
            });

            if (elements.length === 0) {
                // Make a request to Nominatim API to get location details
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`)
                    .then(response => response.json())
                    .then(data => {
                        // Add the Nominatim data as a new element to the elements array
                        elements.push({
                            name: data.display_name || null,
                            lat: data.lat || latlng.lat,
                            lon: data.lon || latlng.lng,
                            type: data.osm_type || null,
                            id: data.osm_id || null
                        });

                        // Display elements
                        displayElements(elements, newBubble);
                        // isBubbleGenerating = false;

                    })
                    .catch(error => {
                        alert('Error getting elements. Please try again.');
                        // isBubbleGenerating = false;
                    });
            } else {
                // Display elements
                displayElements(elements, newBubble);
                // isBubbleGenerating = false;
            }

        })
        .catch(error => {
            alert('Error getting elements. Please try again.');
            // isBubbleGenerating = false;
        });
});


$(".searchForm form").on('keydown', function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) { 
        e.preventDefault();
    }
});



$(".searchForm form").on('keydown', function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) { 
        e.preventDefault();
    }
});


$(".searchForm form").submit(function (event) {
    event.preventDefault();

    // Por si acaso, reseteamos el array elements
    elements = [];

    let searchData = $(this).find('#search').val();

    // Make a request to Nominatim API to get location details
    fetch(`https://nominatim.openstreetmap.org/search?q=${searchData}&format=json`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                data.forEach(element => {
                    // Add the Nominatim data as a new element to the elements array
                    elements.push({
                        name: element.display_name || null,
                        lat: element.lat || null,
                        lon: element.lon || null,
                        type: element.osm_type || null,
                        id: element.osm_id || null
                    });
                });
            }

            // Activate the events that show the answers
            map.fire('mousedown');
            simulateMapClick();

            // Display elements
            displayElements(elements);
        })
        .catch(error => {
            alert('Error getting elements. Please try again.');
        });

});

$(".answer-container").on("click", "a.single-answer", function (e) {
    // Prevent default link behavior
    e.preventDefault();

    // Get the id of the answer
    let id_answer = $(this).attr("id").toUpperCase();
    // Get the text of the clicked anchor tag
    let clicked_text = $(this).text().trim();

    // Utilize flyTo for smooth transition
    let lat = $(this).data("lat");
    let lon = $(this).data("lon");
    map.flyTo([lat, lon], 18);

    if (marker) {
        marker.setLatLng([lat, lon]);
    } else {
        marker = L.marker([lat, lon]).addTo(map);
    }

    // Draw the circle
    if (circle) {
        circle.setLatLng([lat, lon]);
    } else {
        circle = L.circle([lat, lon], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: radius // Use the previously defined radius variable
        }).addTo(map);
    }

    if (id_answer) {
        // Show loading animation for the right answer bubble
        let rightBubble = $("<div class='bubbleComic'><div class='imgBubble'></div><div class='bubble right'><div class='greeting'></div><div class='respuesta'>" + clicked_text + "</div></div></div>");
        $(".answer-container").append(rightBubble);
        rightBubble.find('.bubble').show();
        rightBubble.find('.bubble').addClass("slideInFromRight");

        // Move to top of the right bubble
        rightBubble[0].scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });

        // Delay the appearance of the left bubble
        setTimeout(function () {
            // Show loading animation for the left bubble
            let leftBubble = $("<div class='bubbleComic'><div class='imgBubble'></div><div class='bubble left'><div class='greeting'></div><div class='respuesta'><div class='loading'><div class='circle'></div><div class='circle'></div><div class='circle'></div></div></div></div></div>");
            $(".answer-container").append(leftBubble);
            leftBubble.find('.bubble').show();
            leftBubble.find('.bubble').addClass("slideInFromLeft");
            leftBubble.find('.bubble').append('<i class="volume-icon bx bxs-volume-full"></i>');
            $.ajax({
                url: '/get-info-place/',
                method: 'POST',
                contentType: 'application/json',
                headers: {
                    'X-CSRFToken': csrfToken // Add the CSRF token as a header
                },
                data: JSON.stringify({ "relation_id": id_answer }), // Stringify the data object
            })
                .done(function (response) { // Get the server response
                    if (response) { // If it's not null, display it.

                        setTimeout(function () {
                            // Fill left bubble with response
                            leftBubble.find('.respuesta').empty().text(response.place);
                            // Remove loading animation from left bubble
                            leftBubble.find('.loading').remove();
                            leftBubble[0].scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
                        }, 1000); // Delay of 1 second
                    }
                })
                // .fail(function (error) {
                //     console.error('Error:', error);
                // });
        }, 750); // Delay of 0.75 seconds
    }
});


$('#refreshBubbles').on('click', function () {
    // Add animation to fade out the bubbles
    $('.bubbleComic').addClass('fadeOut').delay(500).queue(function (next) {
        $(this).remove();
        next();
    });
});

// Flag to track dragging
let isDragging = false;

// Detect when the user is not dragging the map
map.addEventListener('mousedown', function () {
    isDragging = false;
});

// Detect when the user is dragging the map
map.addEventListener('mousemove', function () {
    isDragging = true;
});


// Handle the map click event
map.getContainer().addEventListener('click', function (event) {
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


//GO TO TOP BUTTON

// Get the offcanvas body and the "Go to top" button
let offcanvasBody = document.querySelector('.offcanvas-body');
let goToTopButton = document.getElementById('goToTop');

// Add a scroll event listener to the offcanvas body
offcanvasBody.addEventListener('scroll', function () {
    // If the offcanvas body is scrolled more than 100px, display the "Go to top" button
    if (offcanvasBody.scrollTop > 100) {
        goToTopButton.style.display = 'block';
    } else {
        goToTopButton.style.display = 'none';
    }
});

// Define the topFunction to scroll the offcanvas body back to the top
function topFunction() {
    offcanvasBody.scrollTop = 0;
}


// Search form

const searchMini = document.querySelector('#searchMini')
const form = document.querySelector('.searchForm form');
const searchIcon = document.querySelector('.searchIcon');
const input = document.querySelector('#search');

searchIcon.addEventListener('click', function(event) {
    if (form.classList.contains('expanded')) {
      // If the form is already expanded, submit the form when the search icon is clicked
      $(".searchForm form").submit();
    } else {
      // If the form is not expanded, just expand the form
      form.classList.add('expanded');
    }
  });

  
input.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    form.submit();
  }
});

document.addEventListener('click', function(event) {
  const isInsideForm = form.contains(event.target);
  const isInsideSearchIcon = searchIcon.contains(event.target);
  if (!isInsideForm && !isInsideSearchIcon) {
    form.classList.remove('expanded');
  }
});