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


//     // Add an eye icon at the end of the password field
//  $('.input_box').append('<i class="bx bx-show icon toggle-password"></i>');

//  // Initially hide the eye icon and set its right property
//  $('.toggle-password').css({
// 	 'display': 'none',
// 	 'right': '50px'
//  });

// // Show the eye icon when the user starts typing in the password field
// $('.input-field[type="password"]').on('input', function() {
// 	$(this).siblings('.toggle-password').show();
// });

// // Hide the eye icon when the user stops typing
// $('.input-field[type="password"]').on('keyup', function() {
// 	if($(this).val() === '') {
// 		$(this).siblings('.toggle-password').hide();
// 	}
// });
//  // Toggle the type attribute of the password field between 'text' and 'password'
//  $('.toggle-password').click(function() {
// 	 var input = $(this).siblings('input');
// 	 if (input.attr("type") == "password") {
// 		 input.attr("type", "text");
// 		 $(this).attr("class", "bx bx-hide icon toggle-password"); // change the eye icon to 'hide'
// 	 } else {
// 		 input.attr("type", "password");
// 		 $(this).attr("class", "bx bx-show icon toggle-password"); // change the eye icon back to 'show'
// 	 }
//  });

});


