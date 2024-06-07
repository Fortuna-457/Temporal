// $(document).ready(function() {
//     var $errorModal = $('#errorModal');

//     // Check if errorModal exists and define event listeners
//     if ($errorModal.length) {
//         // Display the error modal when the login form is submitted
//         var $loginForm = $('form');
//         if ($loginForm.length) {
//             $loginForm.on("submit", function(event) {
//                 $errorModal.show();
//                 event.preventDefault(); // Prevent the default form submission
//             });
//         }

//         // Close the modal when the close button is clicked
//         var $closeBtn = $(".close").first();
//         if ($closeBtn.length) {
//             $closeBtn.on("click", function() {
//                 $errorModal.hide();
//             });
//         }

//         // Close the modal when clicking outside of it
//         $(window).on("click", function(event) {
//             if ($(event.target).is($errorModal)) {
//                 $errorModal.hide();
//             }
//         });
//     }
// });

$(document).ready(function() {
    // Add an eye icon at the end of the password field
    $('.input_box').append('<i class="bx bx-show icon toggle-password"></i>');
            
    // Initially hide the eye icon and set its right property
    $('.toggle-password').css({
        'display': 'none',
        'right': '50px'
    });

    // Show the eye icon when the user starts typing in the password field
    $('.input-field[type="password"]').on('input', function() {
        $(this).siblings('.toggle-password').show();
    });

    // Hide the eye icon when the user stops typing
    $('.input-field[type="password"]').on('keyup', function() {
        if($(this).val() === '') {
            $(this).siblings('.toggle-password').hide();
        }
    });
    // Toggle the type attribute of the password field between 'text' and 'password'
    $('.toggle-password').click(function() {
        var input = $(this).siblings('input');
        if (input.attr("type") == "password") {
            input.attr("type", "text");
            $(this).attr("class", "bx bx-hide icon toggle-password"); // change the eye icon to 'hide'
        } else {
            input.attr("type", "password");
            $(this).attr("class", "bx bx-show icon toggle-password"); // change the eye icon back to 'show'
        }
    });
});