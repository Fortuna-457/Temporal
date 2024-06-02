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

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })

      $('#tooltipEdit').tooltip(options)

});
