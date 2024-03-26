$(document).ready(function() {
    console.log("hola pedro 1 ç");

    // Define the parallax effect for each image
    var parallaxEffects = {
        ".parallax__bg": 0.01,
        ".parallax__dust": 0.03,
        ".parallax__luna": 0.02,
        ".parallax__jax": 0.02,
        ".parallax__manny": 0.02, 
    };

    console.log(parallaxEffects);

    //Mousemove event handler
    $(document).on("mousemove", function(event) {
        // Calculate mouse movement
        var mouseX = event.pageX;
        var mouseY = event.pageY;

        // Update position for each image based on mouse movement
        $.each(parallaxEffects, function(selector, speed) {
            var $img = $(selector);
            var offsetX = ($img.offset().left + $img.width() / 2) - mouseX;
            var offsetY = ($img.offset().top + $img.height() / 2) - mouseY;
            var transformX = offsetX * speed;
            var transformY = offsetY * speed;
            $img.css("transform", "translate(" + transformX + "px, " + transformY + "px)");
        });
    });
});
