// $(document).ready(function() {
//     // Password Modal
//     var modal = $('#passwordModal');

//     $('#changePassword').click(function(event) {
//         event.preventDefault();
//         modal.show();
//     });

//     $('.close').click(function() {
//         modal.hide();
//     });

//     $(window).click(function(event) {
//         if ($(event.target).is(modal)) {
//             modal.hide();
//         }
//     });

//     $('#passwordForm').submit(function(event) {
//         event.preventDefault();
//         var newPassword = $('#newPassword').val();
//         var repeatPassword = $('#repeatPassword').val();

//         if (newPassword === repeatPassword) {
//             alert('Password changed successfully.');
//             modal.hide();
//         } else {
//             alert('Passwords do not match. Please try again.');
//         }
//     });

//     // Inline Text Editing
//     var $editableText = $('#editableText');
//     var $saveButton = $('#saveBioButton');

//     $('#editIcon').click(function() {
//         $editableText.attr('contenteditable', 'true').focus();
//         $saveButton.show();

//         // Ensure the content does not exceed 122 characters
//         $editableText.on('input', function() {
//             if ($editableText.text().length > 122) {
//                 $editableText.addClass('red').removeClass('white');
//                 $saveButton.prop('disabled', true);
//             } else {
//                 $editableText.addClass('white').removeClass('red');
//                 $saveButton.prop('disabled', false);
//             }
//         });
        

//         // Save button click event
//         $saveButton.click(function() {
//             $editableText.attr('contenteditable', 'false');
//             $saveButton.hide();
//             $editableText.off('input');
//         });
//     });

//     $(document).click(function(event) {
//         // Check if the click was outside the #editableText, #editIcon, or #saveBioButton elements
//         if (!$(event.target).closest('#editableText, #editIcon, #saveBioButton').length) {
//             // Stop the editing
//             $editableText.attr('contenteditable', 'false');
//             // Hide the save button
//             $saveButton.hide();
//             // Remove the input event handler
//             $editableText.off('input');
//         }
//     });

//     // $(function () {
//     //     $('[data-toggle="tooltip"]').tooltip()
//     //   })

//     //   $('#tooltipEdit').tooltip(options)

// });

/** Hover effect*/

// Get the CSRF token
const csrfToken = $('meta[name="csrf-token"]').attr('content');
// Default Profile Picture
const DEFAULT = 'http://127.0.0.1:8000/static/img/profilePictures/def.jpg';

$.ajax({
    url: '/get-profile-picture/',
    method: 'POST',
    contentType: 'application/json',
    headers: {
        'X-CSRFToken': csrfToken // Add the CSRF token as a header
    },
})
    .done(function (response) { // Get the server response
        if (response) { // If it's not null, display it.
            $("#profile-picture").attr("src", response.profile_picture);
        }
    })
    .fail(function (error) {
        console.error('Error:', error);
    });

function showImageSelection() {
    document.getElementById("image-selection").style.display = "block";
    document.getElementById('profile-picture').style.opacity = '0.7'; // Reduce opacity when container is opened
    document.getElementById('profile-picture').classList.add('pencil-effect'); // Add pencil effect
}

function hideImageSelection() {
    document.getElementById("image-selection").style.display = "none";
    document.getElementById('profile-picture').style.opacity = '1'; // Restore opacity to normal (1)
    document.getElementById('profile-picture').classList.remove('pencil-effect'); // Remove pencil effect
}

function handleMouseEnter() {
    var profilePicture = document.getElementById('profile-picture');
    profilePicture.style.opacity = '0.7'; // Reduce opacity when hovered
    profilePicture.classList.add('pencil-effect'); // Add pencil effect
}

function handleHover(event) {
    var profilePicture = document.getElementById('profile-picture');
    // Check if the image selection container is open
    if (document.getElementById("image-selection").style.display === "block") {
        profilePicture.style.opacity = '0.7'; // Reduce opacity when hovered outside while container is open
        profilePicture.classList.add('pencil-effect');
    } else {
        // Only restore opacity and remove pencil effect when mouse leaves the profile picture if image-selection is not displayed
        if (event.type === 'mouseleave') {
            profilePicture.style.opacity = '1'; // Restore opacity to normal when container is closed
            profilePicture.classList.remove('pencil-effect'); // Remove pencil effect
        }
    }
}

function handleMouseLeave() {
    var profilePicture = document.getElementById('profile-picture');
    // Check if the image selection container is open
    if (document.getElementById("image-selection").style.display !== "block") {
        profilePicture.style.opacity = '1'; // Restore opacity to normal when container is closed
        profilePicture.classList.remove('pencil-effect'); // Remove pencil effect
    }
}

document.getElementById('profile-picture').addEventListener('mouseenter', handleMouseEnter);
document.getElementById('profile-picture').addEventListener('mouseleave', handleMouseLeave);

document.getElementById('profile-picture').addEventListener('mouseenter', handleHover);
document.getElementById('profile-picture').addEventListener('mouseleave', handleHover);

document.addEventListener('click', function(event) {
    var target = event.target;
    var container = document.getElementById('image-selection');
    var profilePicture = document.getElementById('profile-picture');
    
    // Check if the click is outside the image selection container and its children
    if (!container.contains(target)) {
        // Reset opacity of profile picture
        profilePicture.style.opacity = '1';
        // Remove pencil effect class
        profilePicture.classList.remove('pencil-effect');
    }
});

/**rest */
function replaceImage(src, id) {
    var profilePicture = document.getElementById("profile-picture");
    let prevSrc = profilePicture.src;

    if(prevSrc != src){
        profilePicture.src = src;
    }else{
        profilePicture.src = DEFAULT;
    }

    // Remove border from previously selected picture
    var previouslySelected = document.querySelector(".selected-picture");
    if (previouslySelected) {
        previouslySelected.classList.remove("selected-picture");
    }

    // Add border to the newly selected picture
    var selectedPicture = document.getElementById(id);
    selectedPicture.classList.add("selected-picture");
}

function closeImageSelection(event) {
    var container = document.getElementById("image-selection");
    if (!container.contains(event.target) && event.target !== document.getElementById("profile-picture")) {
        container.style.display = "none";

        let img_src = $("#profile-picture").attr("src");

        // Guardamos la nueva highscore en el server
        $.ajax({
            url: '/set-profile-picture/',
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrfToken // Add the CSRF token as a header
            },
            data: JSON.stringify({
                "img_src": img_src,
            }), // Stringify the data object
        })
        .fail(function (error) {
            console.error('Error:', error);
        });

    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Attach event listener to the profile picture image
    var profilePicture = document.getElementById("profile-picture");
    if (profilePicture) {
        profilePicture.addEventListener("click", showImageSelection);
    }

    // Attach event listener to close image selection when clicking outside
    document.addEventListener("click", closeImageSelection);
});