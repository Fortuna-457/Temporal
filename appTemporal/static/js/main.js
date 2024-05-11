$(document).ready(function() {
    console.log("hola pedro 1 ç");

    // Define the parallax effect for each image
    let parallaxEffects = {
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
        let mouseX = event.pageX;
        let mouseY = event.pageY;

        // Update position for each image based on mouse movement
        $.each(parallaxEffects, function(selector, speed) {
            let $img = $(selector);
            let offsetX = ($img.offset().left + $img.width() / 2) - mouseX;
            let offsetY = ($img.offset().top + $img.height() / 2) - mouseY;
            let transformX = offsetX * speed;
            let transformY = offsetY * speed;
            $img.css("transform", "translate(" + transformX + "px, " + transformY + "px)");
        });
    });


    $('#togglePassword').click(function(){
        let passwordField = $('#user');
        let passwordFieldType = passwordField.attr('type');
        if(passwordFieldType == 'password'){
            passwordField.attr('type', 'text');
            $(this).removeClass('bx-lock-alt').addClass('bxs-lock-alt');
        } else {
            passwordField.attr('type', 'password');
            $(this).removeClass('bxs-lock-alt').addClass('bx-lock-alt');
        }
    });

});


