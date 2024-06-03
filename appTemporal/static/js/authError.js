document.addEventListener("DOMContentLoaded", function() {
    var errorModal = document.getElementById('errorModal');

    // Check if errorModal exists and define event listeners
    if (errorModal) {
        // Display the error modal when the login form is submitted
        var loginForm = document.querySelector('form');
        if (loginForm) {
            loginForm.addEventListener("submit", function(event) {
                errorModal.style.display = "block";
                event.preventDefault(); // Prevent the default form submission
            });
        }

        // Close the modal when the close button is clicked
        var closeBtn = document.getElementsByClassName("close")[0];
        if (closeBtn) {
            closeBtn.addEventListener("click", function() {
                errorModal.style.display = "none";
            });
        }

        // Close the modal when clicking outside of it
        window.addEventListener("click", function(event) {
            if (event.target == errorModal) {
                errorModal.style.display = "none";
            }
        });
    }
});
