$(document).ready(function() {
    // Password Modal
    var modal = $('#passwordModal');

    $('#changePassword').click(function(event) {
        event.preventDefault();
        modal.show();
    });

    $('.close').click(function() {
        modal.hide();
    });

    $(window).click(function(event) {
        if ($(event.target).is(modal)) {
            modal.hide();
        }
    });

    $('#passwordForm').submit(function(event) {
        event.preventDefault();
        var newPassword = $('#newPassword').val();
        var repeatPassword = $('#repeatPassword').val();

        if (newPassword === repeatPassword) {
            alert('Password changed successfully.');
            modal.hide();
        } else {
            alert('Passwords do not match. Please try again.');
        }
    });

    // Inline Text Editing
    var $editableText = $('#editableText');
    var $saveButton = $('#saveBioButton');

    $('#editIcon').click(function() {
        $editableText.attr('contenteditable', 'true').focus();
        $saveButton.show();

        // Ensure the content does not exceed 122 characters
        $editableText.on('input', function() {
            if ($editableText.text().length > 122) {
                $editableText.addClass('red').removeClass('white');
                $saveButton.prop('disabled', true);
            } else {
                $editableText.addClass('white').removeClass('red');
                $saveButton.prop('disabled', false);
            }
        });
        

        // Save button click event
        $saveButton.click(function() {
            $editableText.attr('contenteditable', 'false');
            $saveButton.hide();
            $editableText.off('input');
        });
    });

    $(document).click(function(event) {
        // Check if the click was outside the #editableText, #editIcon, or #saveBioButton elements
        if (!$(event.target).closest('#editableText, #editIcon, #saveBioButton').length) {
            // Stop the editing
            $editableText.attr('contenteditable', 'false');
            // Hide the save button
            $saveButton.hide();
            // Remove the input event handler
            $editableText.off('input');
        }
    });

    // $(function () {
    //     $('[data-toggle="tooltip"]').tooltip()
    //   })

    //   $('#tooltipEdit').tooltip(options)

});

function showImageSelection() {
    document.getElementById("image-selection").style.display = "block";
}

function replaceImage(src, id) {
    var profilePicture = document.getElementById("profile-picture");
    profilePicture.src = src;

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