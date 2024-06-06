$(document).ready(function() {
    var $errorModal = $('#errorModal');

    // Check if errorModal exists and define event listeners
    if ($errorModal.length) {
        // Display the error modal when the login form is submitted
        var $loginForm = $('form');
        if ($loginForm.length) {
            $loginForm.on("submit", function(event) {
                $errorModal.show();
                event.preventDefault(); // Prevent the default form submission
            });
        }

        // Close the modal when the close button is clicked
        var $closeBtn = $(".close").first();
        if ($closeBtn.length) {
            $closeBtn.on("click", function() {
                $errorModal.hide();
            });
        }

        // Close the modal when clicking outside of it
        $(window).on("click", function(event) {
            if ($(event.target).is($errorModal)) {
                $errorModal.hide();
            }
        });
    }
});